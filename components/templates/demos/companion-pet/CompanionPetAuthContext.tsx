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
import { cpPetMarketAuth } from "@/lib/templates/api/pet-market-auth-client";
import { CP_PATHS } from "./companionPetConfig";

type CompanionPetAuthContextValue = {
  isLoggedIn: boolean;
  user: PetMarketAuthUserDTO | null;
  hydrated: boolean;
  establishSession: (token: string, user: PetMarketAuthUserDTO) => void;
  logout: () => Promise<void>;
};

const CompanionPetAuthContext = createContext<CompanionPetAuthContextValue | null>(null);

export function CompanionPetAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PetMarketAuthUserDTO | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const session = await cpPetMarketAuth.fetchPetMarketAuthSession();
        if (cancelled) return;
        if (session) {
          cpPetMarketAuth.setAuthToken(session.token);
          setUser(session.user);
        } else {
          cpPetMarketAuth.clearAuthToken();
          setUser(null);
        }
      } catch (error) {
        if (cancelled) return;
        consumePetMarketApiError(error, undefined, CP_PATHS.databaseError);
        cpPetMarketAuth.clearAuthToken();
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
    cpPetMarketAuth.setAuthToken(token);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    await cpPetMarketAuth.logoutPetMarketAccount();
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

  return (
    <CompanionPetAuthContext.Provider value={value}>{children}</CompanionPetAuthContext.Provider>
  );
}

export function useCompanionPetAuth() {
  const ctx = useContext(CompanionPetAuthContext);
  if (!ctx) throw new Error("useCompanionPetAuth must be used within CompanionPetAuthProvider");
  return ctx;
}

export function useCompanionPetRequireAuth(redirectPath = CP_PATHS.login) {
  const { isLoggedIn, hydrated } = useCompanionPetAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !isLoggedIn) {
      router.replace(redirectPath);
    }
  }, [hydrated, isLoggedIn, router, redirectPath]);

  return { isLoggedIn, hydrated };
}
