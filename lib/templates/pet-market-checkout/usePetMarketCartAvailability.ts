"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  consumePetMarketApiError,
  fetchPetMarketAvailabilityBatch,
} from "@/lib/templates/api/pet-market";

export type PetMarketCartAvailabilityItem = {
  product: { id: string; name: string };
  qty: number;
};

export type PetMarketCartAvailabilityIssue = {
  productId: string;
  name: string;
  requested: number;
  available: number;
};

export function usePetMarketCartAvailability(
  items: PetMarketCartAvailabilityItem[],
  databaseErrorPath?: string,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<PetMarketCartAvailabilityIssue[]>([]);
  const [availabilityById, setAvailabilityById] = useState<Record<string, number>>({});

  const productIds = useMemo(() => items.map((item) => item.product.id), [items]);
  const productKey = productIds.join("|");
  const qtyKey = items.map((item) => item.qty).join("|");

  const refresh = useCallback(async () => {
    if (productIds.length === 0) {
      setIssues([]);
      setAvailabilityById({});
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const snapshots = await fetchPetMarketAvailabilityBatch(productIds);
      const byId = Object.fromEntries(
        snapshots.map((item) => [item.product_id, item.available_quantity]),
      );
      setAvailabilityById(byId);

      const nextIssues: PetMarketCartAvailabilityIssue[] = [];
      items.forEach((item) => {
        const available = byId[item.product.id] ?? 0;
        if (item.qty > available) {
          nextIssues.push({
            productId: item.product.id,
            name: item.product.name,
            requested: item.qty,
            available,
          });
        }
      });

      setIssues(nextIssues);
    } catch (err) {
      const message = consumePetMarketApiError(
        err,
        "Could not check item availability",
        databaseErrorPath,
      );
      if (message === null) return;
      setError(message);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, [items, productIds, databaseErrorPath]);

  useEffect(() => {
    void refresh();
  }, [refresh, productKey, qtyKey]);

  const checkoutBlocked = issues.length > 0;

  return { loading, error, issues, checkoutBlocked, availabilityById, refresh };
}
