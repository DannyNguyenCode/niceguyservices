"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { PetMarketAuthUserDTO } from "@/lib/templates/db/pet-market";
import { PET_MARKET_MIN_PASSWORD_LENGTH, consumePetMarketApiError } from "@/lib/templates/api/pet-market";
import { pmrPetMarketAuth } from "@/lib/templates/api/pet-market-auth-client";
import { usePawsMatchAuth } from "./PawsMatchAuthContext";
import { PawsMatchForgotPasswordFlow } from "./PawsMatchForgotPasswordFlow";
import { PMR_DEMO_ADMIN, PMR_PATHS, PMR_SITE, isPmrAdminUser } from "./pawsMatchRescueConfig";
import { PmrButton, PmrContainer, PmrIcon, PmrSectionHeading } from "./PawsMatchShared";

type AuthView = "sign-in" | "register" | "forgot-password";

export function PawsMatchLoginBody() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || PMR_PATHS.account;
  const { establishSession, isLoggedIn, hydrated, user } = usePawsMatchAuth();
  const [view, setView] = useState<AuthView>("sign-in");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#register") setView("register");
  }, []);

  useEffect(() => {
    if (hydrated && isLoggedIn && user) {
      router.replace(isPmrAdminUser(user) ? PMR_PATHS.admin : returnTo);
    }
  }, [hydrated, isLoggedIn, user, router, returnTo]);

  function postLoginDestination(user: PetMarketAuthUserDTO): string {
    if (isPmrAdminUser(user)) return PMR_PATHS.admin;
    return returnTo;
  }

  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setLoginError(null);
    try {
      const { session } = await pmrPetMarketAuth.loginPetMarketAccount({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      establishSession(session.token, session.user);
      router.push(postLoginDestination(session.user));
    } catch (error) {
      const message = consumePetMarketApiError(error, "Could not sign in");
      if (message) setLoginError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (registerPassword.length < PET_MARKET_MIN_PASSWORD_LENGTH) {
      setRegisterError(`Password must be at least ${PET_MARKET_MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    setLoading(true);
    setRegisterError(null);
    try {
      const { session } = await pmrPetMarketAuth.registerPetMarketAccount({
        name: registerName.trim(),
        pet_name: "Future adopter",
        email: registerEmail.trim(),
        password: registerPassword,
      });
      establishSession(session.token, session.user as PetMarketAuthUserDTO);
      router.push(postLoginDestination(session.user));
    } catch (error) {
      const message = consumePetMarketApiError(error, "Could not create account");
      if (message) setRegisterError(message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "pmr-input pmr-focus-ring w-full px-4 py-3 text-sm";

  return (
    <main className="py-12 md:py-16">
      <PmrContainer className="max-w-lg">
        <Link
          href={PMR_PATHS.home}
          className="pmr-focus-ring inline-flex items-center gap-2 text-sm font-semibold text-[var(--pmr-brown-muted)]"
        >
          <PmrIcon name="arrow_back" className="text-lg" />
          Back to {PMR_SITE}
        </Link>

        <div className="pmr-card mt-6 p-6 md:p-8">
          {view === "forgot-password" ? (
            <PawsMatchForgotPasswordFlow
              onBackToSignIn={() => setView("sign-in")}
              onResetComplete={() => setView("sign-in")}
            />
          ) : (
            <>
              <PmrSectionHeading as="h1" className="text-2xl md:text-3xl">
                {view === "register" ? "Create your adopter account" : "Sign in to continue"}
              </PmrSectionHeading>
              <p className="mt-2 text-sm leading-relaxed text-[var(--pmr-brown-muted)]">
                {view === "register"
                  ? "One account keeps your application and adoption status in one calm, organized place."
                  : "Sign in to apply, track your application, and see updates from our team."}
              </p>

              {view === "register" ? (
                <form className="mt-6 space-y-4" onSubmit={handleRegisterSubmit}>
                  <div>
                    <label htmlFor="pmr-reg-name" className="mb-1 block text-sm font-semibold">
                      Full name
                    </label>
                    <input
                      id="pmr-reg-name"
                      required
                      className={inputClass}
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="pmr-reg-email" className="mb-1 block text-sm font-semibold">
                      Email
                    </label>
                    <input
                      id="pmr-reg-email"
                      type="email"
                      required
                      autoComplete="email"
                      className={inputClass}
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="pmr-reg-password" className="mb-1 block text-sm font-semibold">
                      Password
                    </label>
                    <input
                      id="pmr-reg-password"
                      type="password"
                      required
                      autoComplete="new-password"
                      className={inputClass}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </div>
                  {registerError ? (
                    <p className="text-sm text-rose-700" role="alert">
                      {registerError}
                    </p>
                  ) : null}
                  <PmrButton type="submit" className="w-full" ariaLabel="Create account">
                    {loading ? "Creating account…" : "Create account"}
                  </PmrButton>
                  <button
                    type="button"
                    className="w-full text-sm font-semibold text-[var(--pmr-terracotta)]"
                    onClick={() => setView("sign-in")}
                  >
                    Already have an account? Sign in
                  </button>
                </form>
              ) : (
                <form className="mt-6 space-y-4" onSubmit={handleLoginSubmit}>
                  <div className="rounded-xl border border-[var(--pmr-line)] bg-[var(--pmr-bg-warm)] px-4 py-3 text-xs leading-relaxed text-[var(--pmr-brown-muted)]">
                    <p className="font-semibold text-[var(--pmr-brown)]">Demo admin</p>
                    <p className="mt-1">
                      Email: <strong>{PMR_DEMO_ADMIN.email}</strong>
                      <br />
                      Password: <strong>{PMR_DEMO_ADMIN.password}</strong>
                    </p>
                    <button
                      type="button"
                      className="mt-2 text-xs font-semibold text-[var(--pmr-terracotta)]"
                      onClick={() => {
                        setLoginEmail(PMR_DEMO_ADMIN.email);
                        setLoginPassword(PMR_DEMO_ADMIN.password);
                      }}
                    >
                      Fill admin credentials
                    </button>
                  </div>
                  <div>
                    <label htmlFor="pmr-login-email" className="mb-1 block text-sm font-semibold">
                      Email
                    </label>
                    <input
                      id="pmr-login-email"
                      type="email"
                      required
                      autoComplete="email"
                      className={inputClass}
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="pmr-login-password" className="mb-1 block text-sm font-semibold">
                      Password
                    </label>
                    <input
                      id="pmr-login-password"
                      type="password"
                      required
                      autoComplete="current-password"
                      className={inputClass}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm font-semibold text-[var(--pmr-terracotta)]"
                      onClick={() => setView("forgot-password")}
                    >
                      Forgot password?
                    </button>
                  </div>
                  {loginError ? (
                    <p className="text-sm text-rose-700" role="alert">
                      {loginError}
                    </p>
                  ) : null}
                  <PmrButton type="submit" className="w-full" ariaLabel="Sign in">
                    {loading ? "Signing in…" : "Sign in"}
                  </PmrButton>
                  <button
                    type="button"
                    className="w-full text-sm font-semibold text-[var(--pmr-terracotta)]"
                    onClick={() => setView("register")}
                  >
                    New here? Create an account
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </PmrContainer>
    </main>
  );
}
