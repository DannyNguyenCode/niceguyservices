"use client";

import { useEffect, useState } from "react";
import {
  consumePetMarketApiError,
  fetchPetMarketFeaturedProducts,
} from "@/lib/templates/api/pet-market";
import { mapPetMarketProductsToSpmProducts } from "./mapPetMarketToSpmProduct";
import { toSpmHomeFeaturedCards, type SpmHomeFeaturedCard } from "./spmHomeFeatured";

export function useSpmHomeFeatured() {
  const [items, setItems] = useState<SpmHomeFeaturedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const products = await fetchPetMarketFeaturedProducts();
        if (cancelled) return;
        setItems(toSpmHomeFeaturedCards(mapPetMarketProductsToSpmProducts(products)));
      } catch (err) {
        if (cancelled) return;
        const message = consumePetMarketApiError(err, "Could not load Saturday specials");
        if (message === null) return;
        setError(message);
        setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading, error };
}
