"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PetMarketAuthUserDTO } from "@/lib/templates/db/pet-market";
import { PET_MARKET_MIN_PASSWORD_LENGTH } from "@/lib/templates/api/pet-market";
import { consumePetMarketApiError } from "@/lib/templates/api/pet-market";
import { cpPetMarketAuth } from "@/lib/templates/api/pet-market-auth-client";
import { useCompanionPetAuth } from "./CompanionPetAuthContext";
import { CompanionPetForgotPasswordFlow } from "./CompanionPetForgotPasswordFlow";
import { CompanionPetRegisterSuccessModal } from "./CompanionPetRegisterSuccessModal";
import { CP_DEMO_ADMIN, CP_PATHS, CP_SITE, CP_TAGLINE } from "./companionPetConfig";

type AuthView = "sign-in" | "register" | "forgot-password";

export function CompanionPetLoginBody() {
  const router = useRouter();
  const { establishSession, isLoggedIn, hydrated } = useCompanionPetAuth();
  const [view, setView] = useState<AuthView>("sign-in");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerPetName, setRegisterPetName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState<string | null>(null);

  const [registeredUser, setRegisteredUser] = useState<PetMarketAuthUserDTO | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#register") setView("register");
  }, []);

  useEffect(() => {
    if (hydrated && isLoggedIn) {
      router.replace(CP_PATHS.account);
    }
  }, [hydrated, isLoggedIn, router]);

  function showSignIn() {
    setView("sign-in");
    setLoginError(null);
  }

  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setLoginError(null);

    try {
      const { session } = await cpPetMarketAuth.loginPetMarketAccount({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      establishSession(session.token, session.user);
      router.push(CP_PATHS.account);
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
      const { session } = await cpPetMarketAuth.registerPetMarketAccount({
        name: registerName.trim(),
        pet_name: registerPetName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
      });
      establishSession(session.token, session.user);
      setRegisteredUser(session.user);
      setShowRegisterModal(true);
    } catch (error) {
      const message = consumePetMarketApiError(error, "Could not create account");
      if (message) setRegisterError(message);
    } finally {
      setLoading(false);
    }
  }

  const isRegister = view === "register";
  const isForgot = view === "forgot-password";

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <div className="cp-card overflow-hidden rounded-2xl">
          <div className="grid md:grid-cols-2">
            <div className="bg-[var(--cp-warm-gray)]/40 p-8 md:p-10">
              <Link href={CP_PATHS.home} className="inline-flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--cp-charcoal)] text-white">
                  <span className="material-symbols-outlined text-lg" aria-hidden>
                    pets
                  </span>
                </span>
                <span className="text-lg font-semibold">{CP_SITE}</span>
              </Link>
              <h1 className="mt-8 text-2xl font-semibold text-[var(--cp-charcoal)]">
                {isRegister ? "Join Companion Rewards" : "Sign in for rewards"}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[var(--cp-slate)]">{CP_TAGLINE}</p>
              <div className="mt-8 rounded-2xl bg-[var(--cp-orange-muted)] p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--cp-orange)]">
                  Member perks
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--cp-charcoal)]">
                  <li>· Earn points on every order</li>
                  <li>· Redeem points at checkout</li>
                  <li>· Unlock achievements & streaks</li>
                  <li>· Guest checkout still available anytime</li>
                </ul>
              </div>
              {!isForgot ? (
                <p className="mt-8 text-sm text-[var(--cp-slate)]">
                  {isRegister ? "Already have an account?" : "New here?"}{" "}
                  <button
                    type="button"
                    onClick={() => (isRegister ? showSignIn() : setView("register"))}
                    className="font-semibold text-[var(--cp-blue)] hover:underline"
                  >
                    {isRegister ? "Sign in" : "Create account"}
                  </button>
                </p>
              ) : null}
            </div>

            <div className="p-8 md:p-10">
              {isForgot ? (
                <CompanionPetForgotPasswordFlow
                  onBackToSignIn={showSignIn}
                  onResetComplete={showSignIn}
                />
              ) : !isRegister ? (
                <div className="mx-auto max-w-sm">
                  <h2 className="text-xl font-semibold">Welcome back</h2>
                  <p className="mt-1 text-sm text-[var(--cp-slate)]">
                    Sign in to access rewards — checkout works without an account.
                  </p>
                  <form className="mt-6 space-y-4" onSubmit={handleLoginSubmit}>
                    <div className="rounded-xl border border-[var(--cp-border)] bg-[var(--cp-warm-gray)]/30 px-4 py-3 text-xs text-[var(--cp-slate)]">
                      Demo: <strong>{CP_DEMO_ADMIN.email}</strong> / <strong>{CP_DEMO_ADMIN.password}</strong>
                    </div>
                    <input
                      className="w-full rounded-xl border border-[var(--cp-border)] px-4 py-3 text-sm"
                      placeholder="Email"
                      type="email"
                      autoComplete="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                    <div>
                      <div className="mb-1 flex justify-between">
                        <label className="text-sm text-[var(--cp-slate)]">Password</label>
                        <button
                          type="button"
                          onClick={() => setView("forgot-password")}
                          className="text-xs text-[var(--cp-blue)] hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <input
                        className="w-full rounded-xl border border-[var(--cp-border)] px-4 py-3 text-sm"
                        type="password"
                        autoComplete="current-password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    {loginError ? (
                      <p className="rounded-xl bg-[var(--cp-orange-muted)] px-4 py-3 text-sm text-[var(--cp-orange)]">
                        {loginError}
                      </p>
                    ) : null}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-2xl bg-[var(--cp-charcoal)] py-3.5 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {loading ? "Signing in…" : "Sign in"}
                    </button>
                  </form>
                  <Link
                    href={CP_PATHS.shop}
                    className="mt-4 block text-center text-sm text-[var(--cp-slate)] hover:text-[var(--cp-charcoal)]"
                  >
                    Continue as guest →
                  </Link>
                </div>
              ) : (
                <div className="mx-auto max-w-sm">
                  <h2 className="text-xl font-semibold">Create your account</h2>
                  <p className="mt-1 text-sm text-[var(--cp-slate)]">Start earning loyalty points today.</p>
                  <form className="mt-6 space-y-3" onSubmit={handleRegisterSubmit}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className="rounded-xl border border-[var(--cp-border)] px-4 py-3 text-sm"
                        placeholder="Your name"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                      />
                      <input
                        className="rounded-xl border border-[var(--cp-border)] px-4 py-3 text-sm"
                        placeholder="Pet's name"
                        value={registerPetName}
                        onChange={(e) => setRegisterPetName(e.target.value)}
                        required
                      />
                    </div>
                    <input
                      className="w-full rounded-xl border border-[var(--cp-border)] px-4 py-3 text-sm"
                      placeholder="Email"
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                    <input
                      className="w-full rounded-xl border border-[var(--cp-border)] px-4 py-3 text-sm"
                      placeholder="Password"
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      minLength={PET_MARKET_MIN_PASSWORD_LENGTH}
                      required
                    />
                    {registerError ? (
                      <p className="rounded-xl bg-[var(--cp-orange-muted)] px-4 py-3 text-sm text-[var(--cp-orange)]">
                        {registerError}
                      </p>
                    ) : null}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-2xl bg-[var(--cp-green)] py-3.5 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {loading ? "Creating account…" : "Create account"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {registeredUser ? (
        <CompanionPetRegisterSuccessModal
          open={showRegisterModal}
          user={registeredUser}
          onClose={() => setShowRegisterModal(false)}
        />
      ) : null}
    </>
  );
}
