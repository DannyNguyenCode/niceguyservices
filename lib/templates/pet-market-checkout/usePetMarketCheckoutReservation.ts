"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { PetMarketValidateReservationResult } from "@/lib/templates/db/pet-market";
import {
  consumePetMarketApiError,
  validatePetMarketCheckoutReservation,
} from "@/lib/templates/api/pet-market";
import type { PetMarketCheckoutSessionHelpers } from "./session";

export function usePetMarketCheckoutReservation(
  session: PetMarketCheckoutSessionHelpers,
  databaseErrorPath?: string,
) {
  const searchParams = useSearchParams();
  const holdFromUrl = searchParams.get("hold");
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
  const [reservation, setReservation] = useState<PetMarketValidateReservationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(
    async (holdId: string) => {
      try {
        const result = await validatePetMarketCheckoutReservation(holdId);
        setReservation(result);
        setExpired(!result.valid || result.expired);
        setError(null);
        return result;
      } catch (err) {
        const message = consumePetMarketApiError(
          err,
          "Could not load your reservation",
          databaseErrorPath,
        );
        if (message === null) return null;
        setError(message);
        setExpired(true);
        setReservation(null);
        return null;
      }
    },
    [databaseErrorPath],
  );

  useEffect(() => {
    const holdId = holdFromUrl ?? session.getCheckoutHoldId();
    if (!holdId) {
      setLoading(false);
      setCheckoutSessionId(null);
      return;
    }

    setCheckoutSessionId(holdId);
    session.setCheckoutHoldId(holdId);

    const activeHoldId = holdId;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      const result = await refresh(activeHoldId);
      if (!cancelled) setLoading(false);
      if (!cancelled && !result?.valid) setExpired(true);
    }

    void load();
    const poll = window.setInterval(() => {
      void refresh(activeHoldId);
    }, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(poll);
    };
  }, [holdFromUrl, refresh, session]);

  const clearHold = useCallback(() => {
    session.clearCheckoutHoldId();
    setCheckoutSessionId(null);
    setReservation(null);
    setError(null);
  }, [session]);

  return {
    checkoutSessionId,
    reservation,
    loading,
    expired,
    error,
    expiresAt: reservation?.expires_at ?? null,
    setExpired,
    refresh,
    clearHold,
  };
}
