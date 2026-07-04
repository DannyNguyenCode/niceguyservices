"use client";

import { useEffect, useState } from "react";
import type { PetMarketProductDTO } from "@/lib/templates/db/pet-market";
import {
  classifyPetMarketApiError,
  fetchPetMarketProductById,
} from "@/lib/templates/api/pet-market";
import { mapPetMarketProductToSpmProduct } from "./mapPetMarketToSpmProduct";
import type { SpmProduct } from "./saturdayPetMarketData";

export function usePetMarketProduct(id: string) {
  const [dto, setDto] = useState<PetMarketProductDTO | null>(null);
  const [product, setProduct] = useState<SpmProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setNotFound(false);
      setError(null);
      setDto(null);
      setProduct(null);

      try {
        const data = await fetchPetMarketProductById(id);
        if (cancelled) return;
        setDto(data);
        setProduct(mapPetMarketProductToSpmProduct(data));
      } catch (err) {
        if (cancelled) return;
        const outcome = classifyPetMarketApiError(err, "Failed to load product");
        if (outcome.type === "redirect-database") return;
        if (outcome.type === "product-not-found") {
          setNotFound(true);
          return;
        }
        setError(outcome.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { dto, product, loading, notFound, error };
}
