"use client";

import { useCallback, useEffect, useState } from "react";
import type { PetMarketProductSearchQuery, PetMarketProductSearchResult } from "@/lib/templates/db/pet-market";
import {
  consumePetMarketApiError,
  fetchPetMarketProducts,
} from "@/lib/templates/api/pet-market";
import { mapPetMarketProductsToSpmProducts } from "./mapPetMarketToSpmProduct";
import type { SpmProduct } from "./saturdayPetMarketData";

export function usePetMarketProducts(query: PetMarketProductSearchQuery) {
  const [result, setResult] = useState<PetMarketProductSearchResult | null>(null);
  const [products, setProducts] = useState<SpmProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [refreshToken, setRefreshToken] = useState(0);
  const queryKey = JSON.stringify({ ...query, refreshToken });

  useEffect(() => {
    let cancelled = false;
    const parsedQuery = JSON.parse(queryKey) as PetMarketProductSearchQuery;

    if (parsedQuery.pageSize !== undefined && parsedQuery.pageSize <= 0) {
      setLoading(false);
      setResult(null);
      setProducts([]);
      return;
    }

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPetMarketProducts(parsedQuery);
        if (cancelled) return;
        setResult(data);
        setProducts(mapPetMarketProductsToSpmProducts(data.items));
      } catch (err) {
        if (cancelled) return;
        const message = consumePetMarketApiError(err, "Failed to load products");
        if (message === null) return;
        setError(message);
        setResult(null);
        setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [queryKey]);

  const refetch = useCallback(() => {
    setRefreshToken((token) => token + 1);
  }, []);

  return { result, products, loading, error, refetch };
}
