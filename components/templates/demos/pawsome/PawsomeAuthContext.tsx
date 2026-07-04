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
import { psPetMarketAuth } from "@/lib/templates/api/pet-market-auth-client";
import { PS_PATHS } from "./pawsomeConfig";

type PawsomeAuthContextValue = {
  isLoggedIn: boolean;
  user: PetMarketAuthUserDTO | null;
  hydrated: boolean;
  establishSession: (token: string, user: PetMarketAuthUserDTO) => void;
  logout: () => Promise<void>;
};

const PawsomeAuthContext = createContext<PawsomeAuthContextValue | null>(null);

export function PawsomeAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PetMarketAuthUserDTO | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const session = await psPetMarketAuth.fetchPetMarketAuthSession();
        if (cancelled) return;
        if (session) {
          psPetMarketAuth.setAuthToken(session.token);
          setUser(session.user);
        } else {
          psPetMarketAuth.clearAuthToken();
          setUser(null);
        }
      } catch (error) {
        if (cancelled) return;
        consumePetMarketApiError(error, undefined, PS_PATHS.databaseError);
        psPetMarketAuth.clearAuthToken();
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
    psPetMarketAuth.setAuthToken(token);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    await psPetMarketAuth.logoutPetMarketAccount();
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

  return <PawsomeAuthContext.Provider value={value}>{children}</PawsomeAuthContext.Provider>;
}

export function usePawsomeAuth() {
  const ctx = useContext(PawsomeAuthContext);
  if (!ctx) throw new Error("usePawsomeAuth must be used within PawsomeAuthProvider");
  return ctx;
}

export function usePawsomeRequireAuth(redirectPath = PS_PATHS.login) {
  const { isLoggedIn, hydrated } = usePawsomeAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !isLoggedIn) {
      router.replace(redirectPath);
    }
  }, [hydrated, isLoggedIn, router, redirectPath]);

  return { isLoggedIn, hydrated };
}
