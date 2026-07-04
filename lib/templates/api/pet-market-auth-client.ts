import type {
  PetMarketAuthSessionDTO,
  PetMarketLoginInput,
  PetMarketRegisterInput,
  PetMarketResetPasswordInput,
} from "@/lib/templates/db/pet-market";
import {
  consumePetMarketApiError,
  PET_MARKET_API,
  PetMarketApiRequestError,
  petMarketFetch,
  readJson,
} from "./pet-market";

export type AuthChallengeResponse = {
  email: string;
  message: string;
  devCode?: string;
};

export type PetMarketAuthClient = {
  getAuthToken: () => string | null;
  setAuthToken: (token: string) => void;
  clearAuthToken: () => void;
  registerPetMarketAccount: (
    input: PetMarketRegisterInput,
  ) => Promise<{ session: PetMarketAuthSessionDTO; message: string }>;
  loginPetMarketAccount: (input: PetMarketLoginInput) => Promise<{ session: PetMarketAuthSessionDTO }>;
  startPetMarketForgotPassword: (email: string) => Promise<AuthChallengeResponse>;
  resetPetMarketPassword: (input: PetMarketResetPasswordInput) => Promise<{ message: string }>;
  fetchPetMarketAuthSession: (token?: string | null) => Promise<PetMarketAuthSessionDTO | null>;
  logoutPetMarketAccount: () => Promise<void>;
};

function authHeaders(token?: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function createPetMarketAuthClient(tokenKey: string): PetMarketAuthClient {
  function getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(tokenKey);
  }

  function setAuthToken(token: string) {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(tokenKey, token);
  }

  function clearAuthToken() {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(tokenKey);
  }

  async function authMutate<T>(url: string, body: unknown, token?: string | null): Promise<T> {
    const response = await petMarketFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(token ?? getAuthToken()),
      },
      body: JSON.stringify(body),
    });
    return readJson<T>(response);
  }

  return {
    getAuthToken,
    setAuthToken,
    clearAuthToken,
    registerPetMarketAccount: (input) => authMutate(PET_MARKET_API.authRegister, input),
    loginPetMarketAccount: (input) => authMutate(PET_MARKET_API.authLogin, input),
    startPetMarketForgotPassword: (email) => authMutate(PET_MARKET_API.authForgotPassword, { email }),
    resetPetMarketPassword: (input) => authMutate(PET_MARKET_API.authResetPassword, input),
    fetchPetMarketAuthSession: async (token) => {
      const bearer = token ?? getAuthToken();
      if (!bearer) return null;

      try {
        const response = await petMarketFetch(PET_MARKET_API.authMe, {
          headers: authHeaders(bearer),
        });
        const data = await readJson<{ session: PetMarketAuthSessionDTO }>(response);
        return data.session;
      } catch (error) {
        if (error instanceof PetMarketApiRequestError && error.status === 401) {
          return null;
        }
        throw error;
      }
    },
    logoutPetMarketAccount: async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        await authMutate(PET_MARKET_API.authLogout, {}, token);
      } catch (error) {
        consumePetMarketApiError(error);
      } finally {
        clearAuthToken();
      }
    },
  };
}

export const cpPetMarketAuth = createPetMarketAuthClient("cp-auth-token");
export const psPetMarketAuth = createPetMarketAuthClient("ps-auth-token");
export const pmrPetMarketAuth = createPetMarketAuthClient("pmr-auth-token");
