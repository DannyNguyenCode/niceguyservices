import type {
  PetMarketAuthSessionDTO,
  PetMarketLoginInput,
  PetMarketRegisterInput,
  PetMarketResetPasswordInput,
} from "@/lib/templates/db/pet-market";
import { createPetMarketAuthClient } from "./pet-market-auth-client";

const spmPetMarketAuth = createPetMarketAuthClient("spm-auth-token");

export function getSpmAuthToken(): string | null {
  return spmPetMarketAuth.getAuthToken();
}

export function setSpmAuthToken(token: string) {
  spmPetMarketAuth.setAuthToken(token);
}

export function clearSpmAuthToken() {
  spmPetMarketAuth.clearAuthToken();
}

export type AuthChallengeResponse = {
  email: string;
  message: string;
  devCode?: string;
};

export async function registerPetMarketAccount(
  input: PetMarketRegisterInput,
): Promise<{ session: PetMarketAuthSessionDTO; message: string }> {
  return spmPetMarketAuth.registerPetMarketAccount(input);
}

export async function loginPetMarketAccount(
  input: PetMarketLoginInput,
): Promise<{ session: PetMarketAuthSessionDTO }> {
  return spmPetMarketAuth.loginPetMarketAccount(input);
}

export async function startPetMarketForgotPassword(email: string): Promise<AuthChallengeResponse> {
  return spmPetMarketAuth.startPetMarketForgotPassword(email);
}

export async function resetPetMarketPassword(
  input: PetMarketResetPasswordInput,
): Promise<{ message: string }> {
  return spmPetMarketAuth.resetPetMarketPassword(input);
}

export async function fetchPetMarketAuthSession(
  token?: string | null,
): Promise<PetMarketAuthSessionDTO | null> {
  return spmPetMarketAuth.fetchPetMarketAuthSession(token);
}

export async function logoutPetMarketAccount(): Promise<void> {
  return spmPetMarketAuth.logoutPetMarketAccount();
}
