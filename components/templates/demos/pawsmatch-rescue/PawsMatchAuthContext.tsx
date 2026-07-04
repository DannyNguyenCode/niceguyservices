"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PetMarketAuthUserDTO } from "@/lib/templates/db/pet-market";
import { consumePetMarketApiError } from "@/lib/templates/api/pet-market";
import { pmrPetMarketAuth } from "@/lib/templates/api/pet-market-auth-client";
import { PMR_PATHS } from "./pawsMatchRescueConfig";

type PawsMatchAuthContextValue = {
  isLoggedIn: boolean;
  user: PetMarketAuthUserDTO | null;
  hydrated: boolean;
  establishSession: (token: string, user: PetMarketAuthUserDTO) => void;
  logout: () => Promise<void>;
};

const PawsMatchAuthContext = createContext<PawsMatchAuthContextValue | null>(null);

export function PawsMatchAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PetMarketAuthUserDTO | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const session = await pmrPetMarketAuth.fetchPetMarketAuthSession();
        if (cancelled) return;
        if (session) {
          pmrPetMarketAuth.setAuthToken(session.token);
          setUser(session.user);
        } else {
          pmrPetMarketAuth.clearAuthToken();
          setUser(null);
        }
      } catch (error) {
        if (cancelled) return;
        consumePetMarketApiError(error, undefined, PMR_PATHS.databaseError);
        pmrPetMarketAuth.clearAuthToken();
        setUser(null);
      } finally {
        if (!cancelled) setHydrated(true);
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const establishSession = useCallback((token: string, nextUser: PetMarketAuthUserDTO) => {
    pmrPetMarketAuth.setAuthToken(token);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    await pmrPetMarketAuth.logoutPetMarketAccount();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      isLoggedIn: Boolean(user),
      user,
      hydrated,
      establishSession,
      logout,
    }),
    [user, hydrated, establishSession, logout],
  );

  return <PawsMatchAuthContext.Provider value={value}>{children}</PawsMatchAuthContext.Provider>;
}

export function usePawsMatchAuth() {
  const ctx = useContext(PawsMatchAuthContext);
  if (!ctx) throw new Error("usePawsMatchAuth must be used within PawsMatchAuthProvider");
  return ctx;
}

export function usePawsMatchRequireAuth(redirectPath: string = PMR_PATHS.login) {
  const { isLoggedIn, hydrated } = usePawsMatchAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !isLoggedIn) {
      router.replace(redirectPath);
    }
  }, [hydrated, isLoggedIn, router, redirectPath]);

  return { isLoggedIn, hydrated };
}

export function usePawsMatchAuthToken(): string | null {
  const { isLoggedIn, hydrated } = usePawsMatchAuth();
  if (!hydrated || !isLoggedIn) return null;
  return pmrPetMarketAuth.getAuthToken();
}
