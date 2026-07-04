"use client";

import { useCallback, useEffect, useState } from "react";
import type { LooneyTunesProductSearchQuery } from "@/lib/templates/db/looney-tunes";
import {
  fetchLooneyTunesProducts,
  getLooneyTunesErrorMessage,
} from "@/lib/templates/api/looney-tunes";
import { mapLooneyTunesProductsToLtMenuProducts } from "./mapLooneyTunesToLtMenuProduct";
import type { LtMenuProduct } from "./looneytoonsCafeData";

export function useLooneyTunesMenuProducts(query: LooneyTunesProductSearchQuery = { pageSize: 200 }) {
  const [products, setProducts] = useState<LtMenuProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const queryKey = JSON.stringify({ ...query, refreshToken });

  useEffect(() => {
    let cancelled = false;
    const parsedQuery = JSON.parse(queryKey) as LooneyTunesProductSearchQuery;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchLooneyTunesProducts(parsedQuery);
        if (cancelled) return;
        setProducts(mapLooneyTunesProductsToLtMenuProducts(data.items));
      } catch (err) {
        if (cancelled) return;
        setError(getLooneyTunesErrorMessage(err, "Failed to load menu items"));
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

  return { products, loading, error, refetch };
}
