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
import {
  clearSpmAuthToken,
  fetchPetMarketAuthSession,
  logoutPetMarketAccount,
  setSpmAuthToken,
} from "@/lib/templates/api/pet-market-auth";
import { consumePetMarketApiError } from "@/lib/templates/api/pet-market";
import { SPM_PATHS } from "./saturdayPetMarketConfig";

type SpmAuthContextValue = {
  isLoggedIn: boolean;
  user: PetMarketAuthUserDTO | null;
  /** @deprecated Use `user.email` or `user.name` */
  username: string | null;
  hydrated: boolean;
  establishSession: (token: string, user: PetMarketAuthUserDTO) => void;
  logout: () => Promise<void>;
};

const SpmAuthContext = createContext<SpmAuthContextValue | null>(null);

export function SpmAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PetMarketAuthUserDTO | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const session = await fetchPetMarketAuthSession();
        if (cancelled) return;
        if (session) {
          setSpmAuthToken(session.token);
          setUser(session.user);
        } else {
          clearSpmAuthToken();
          setUser(null);
        }
      } catch (error) {
        if (cancelled) return;
        consumePetMarketApiError(error);
        clearSpmAuthToken();
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
    setSpmAuthToken(token);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    await logoutPetMarketAccount();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      isLoggedIn: Boolean(user),
      user,
      username: user?.email ?? null,
      hydrated,
      establishSession,
      logout,
    }),
    [user, hydrated, establishSession, logout],
  );

  return <SpmAuthContext.Provider value={value}>{children}</SpmAuthContext.Provider>;
}

export function useSpmAuth() {
  const ctx = useContext(SpmAuthContext);
  if (!ctx) throw new Error("useSpmAuth must be used within SpmAuthProvider");
  return ctx;
}

export function useSpmRequireAuth() {
  const { isLoggedIn, hydrated } = useSpmAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !isLoggedIn) {
      router.replace(SPM_PATHS.login);
    }
  }, [hydrated, isLoggedIn, router]);

  return { isLoggedIn, hydrated };
}

export function isSpmAdminUser(user: PetMarketAuthUserDTO | null | undefined): boolean {
  return user?.role === "admin";
}
