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
import type { LooneyTunesAuthUserDTO } from "@/lib/templates/db/looney-tunes";
import {
  clearLtAuthToken,
  fetchLooneyTunesAuthSession,
  logoutLooneyTunesAccount,
  setLtAuthToken,
} from "@/lib/templates/api/looney-tunes-auth";
import { consumeLooneyTunesApiError } from "@/lib/templates/api/looney-tunes";
import { LT_PATHS } from "./looneytoonsCafeConfig";

type LooneyToonsCafeAuthContextValue = {
  isLoggedIn: boolean;
  user: LooneyTunesAuthUserDTO | null;
  hydrated: boolean;
  establishSession: (token: string, user: LooneyTunesAuthUserDTO) => void;
  logout: () => Promise<void>;
};

const LooneyToonsCafeAuthContext = createContext<LooneyToonsCafeAuthContextValue | null>(null);

export function LooneyToonsCafeAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LooneyTunesAuthUserDTO | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const session = await fetchLooneyTunesAuthSession();
        if (cancelled) return;
        if (session) {
          setLtAuthToken(session.token);
          setUser(session.user);
        } else {
          clearLtAuthToken();
          setUser(null);
        }
      } catch (error) {
        if (cancelled) return;
        consumeLooneyTunesApiError(error, "Could not restore session");
        clearLtAuthToken();
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

  const establishSession = useCallback((token: string, nextUser: LooneyTunesAuthUserDTO) => {
    setLtAuthToken(token);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    await logoutLooneyTunesAccount();
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
    <LooneyToonsCafeAuthContext.Provider value={value}>{children}</LooneyToonsCafeAuthContext.Provider>
  );
}

export function useLooneyToonsCafeAuth() {
  const ctx = useContext(LooneyToonsCafeAuthContext);
  if (!ctx) {
    throw new Error("useLooneyToonsCafeAuth must be used within LooneyToonsCafeAuthProvider");
  }
  return ctx;
}

export function useLooneyToonsCafeRequireAuth() {
  const { isLoggedIn, hydrated } = useLooneyToonsCafeAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !isLoggedIn) {
      router.replace(LT_PATHS.login);
    }
  }, [hydrated, isLoggedIn, router]);

  return { isLoggedIn, hydrated };
}

export function isLooneyToonsCafeAdmin(user: LooneyTunesAuthUserDTO | null | undefined): boolean {
  return user?.role === "admin";
}
