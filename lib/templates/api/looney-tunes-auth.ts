import type {
  LooneyTunesAuthSessionDTO,
  LooneyTunesLoginInput,
  LooneyTunesRegisterInput,
  LooneyTunesResetPasswordInput,
} from "@/lib/templates/db/looney-tunes";
import {
  consumeLooneyTunesApiError,
  LOONEY_TUNES_API,
  LooneyTunesApiRequestError,
  looneyTunesFetch,
  readLooneyTunesJson,
} from "./looney-tunes";

const LT_AUTH_TOKEN_KEY = "lt-auth-token";

export function getLtAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(LT_AUTH_TOKEN_KEY);
}

export function setLtAuthToken(token: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LT_AUTH_TOKEN_KEY, token);
}

export function clearLtAuthToken() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(LT_AUTH_TOKEN_KEY);
}

function authHeaders(token?: string | null): HeadersInit {
  const bearer = token ?? getLtAuthToken();
  return bearer ? { Authorization: `Bearer ${bearer}` } : {};
}

type AuthChallengeResponse = {
  email: string;
  message: string;
  devCode?: string;
};

async function authMutate<T>(url: string, body: unknown, token?: string | null): Promise<T> {
  const response = await looneyTunesFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(body),
  });
  return readLooneyTunesJson<T>(response);
}

export async function registerLooneyTunesAccount(
  input: LooneyTunesRegisterInput,
): Promise<{ session: LooneyTunesAuthSessionDTO; message: string }> {
  return authMutate(LOONEY_TUNES_API.authRegister, input);
}

export async function loginLooneyTunesAccount(
  input: LooneyTunesLoginInput,
): Promise<{ session: LooneyTunesAuthSessionDTO }> {
  return authMutate(LOONEY_TUNES_API.authLogin, input);
}

export async function startLooneyTunesForgotPassword(email: string): Promise<AuthChallengeResponse> {
  return authMutate(LOONEY_TUNES_API.authForgotPassword, { email });
}

export async function resetLooneyTunesPassword(
  input: LooneyTunesResetPasswordInput,
): Promise<{ message: string }> {
  return authMutate(LOONEY_TUNES_API.authResetPassword, input);
}

export async function fetchLooneyTunesAuthSession(
  token?: string | null,
): Promise<LooneyTunesAuthSessionDTO | null> {
  const bearer = token ?? getLtAuthToken();
  if (!bearer) return null;

  try {
    const response = await looneyTunesFetch(LOONEY_TUNES_API.authMe, {
      headers: authHeaders(bearer),
    });
    const data = await readLooneyTunesJson<{ session: LooneyTunesAuthSessionDTO }>(response);
    return data.session;
  } catch (error) {
    if (error instanceof LooneyTunesApiRequestError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

export async function logoutLooneyTunesAccount(): Promise<void> {
  const token = getLtAuthToken();
  if (!token) return;

  try {
    await authMutate(LOONEY_TUNES_API.authLogout, {}, token);
  } catch (error) {
    consumeLooneyTunesApiError(error, "Could not sign out");
  } finally {
    clearLtAuthToken();
  }
}

export type { AuthChallengeResponse };
