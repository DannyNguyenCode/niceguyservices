"use client";

import { useCallback, useEffect, useState } from "react";
import type { PetMarketProductSearchQuery, PetMarketProductSearchResult } from "@/lib/templates/db/pet-market";
import {
  consumePetMarketApiError,
  fetchPetMarketProducts,
} from "@/lib/templates/api/pet-market";
import { PS_PATHS } from "./pawsomeConfig";
import { mapPetMarketProductsToPsProducts } from "./mapPetMarketToPsProduct";
import type { PsProduct } from "./pawsomeData";

export function usePsPetMarketProducts(query: PetMarketProductSearchQuery = {}) {
  const [result, setResult] = useState<PetMarketProductSearchResult | null>(null);
  const [products, setProducts] = useState<PsProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const queryKey = JSON.stringify({ ...query, refreshToken });

  useEffect(() => {
    let cancelled = false;
    const parsedQuery = JSON.parse(queryKey) as PetMarketProductSearchQuery;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPetMarketProducts(parsedQuery);
        if (cancelled) return;
        setResult(data);
        setProducts(mapPetMarketProductsToPsProducts(data.items));
      } catch (err) {
        if (cancelled) return;
        const message = consumePetMarketApiError(
          err,
          "Failed to load products",
          PS_PATHS.databaseError,
        );
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
