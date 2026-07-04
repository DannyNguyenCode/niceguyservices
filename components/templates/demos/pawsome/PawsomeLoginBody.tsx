"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PetMarketAuthUserDTO } from "@/lib/templates/db/pet-market";
import { PET_MARKET_MIN_PASSWORD_LENGTH } from "@/lib/templates/api/pet-market";
import { consumePetMarketApiError } from "@/lib/templates/api/pet-market";
import { psPetMarketAuth } from "@/lib/templates/api/pet-market-auth-client";
import { usePawsomeAuth } from "./PawsomeAuthContext";
import { PawsomeForgotPasswordFlow } from "./PawsomeForgotPasswordFlow";
import { PawsomeRegisterSuccessModal } from "./PawsomeRegisterSuccessModal";
import { PS_DEMO_ADMIN, PS_PATHS, PS_SITE, PS_TAGLINE } from "./pawsomeConfig";
import { PsIcon, PsPageWrap } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

type AuthView = "sign-in" | "register" | "forgot-password";

export function PawsomeLoginBody() {
  const router = useRouter();
  const { establishSession, isLoggedIn, hydrated } = usePawsomeAuth();
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
      router.replace(PS_PATHS.account);
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
      const { session } = await psPetMarketAuth.loginPetMarketAccount({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      establishSession(session.token, session.user);
      router.push(PS_PATHS.account);
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
      const { session } = await psPetMarketAuth.registerPetMarketAccount({
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
      <main className="py-10 md:py-14">
        <PsPageWrap className="max-w-5xl">
          <div className="overflow-hidden rounded-xl bg-[var(--ps-surface-container-lowest)] shadow-[var(--ps-shadow)]">
            <div className="grid md:grid-cols-2">
              <div className="bg-[color-mix(in_srgb,var(--ps-secondary-container)_12%,transparent)] p-8 md:p-10">
                <Link href={PS_PATHS.home} className="inline-flex items-center gap-2">
                  <PsIcon name="pets" className="text-2xl text-[var(--ps-primary)]" />
                  <span className="text-lg font-bold text-[var(--ps-primary)]" style={headline}>
                    {PS_SITE}
                  </span>
                </Link>
                <h1 className="mt-8 text-2xl font-bold text-[var(--ps-primary)]" style={headline}>
                  {isRegister ? "Join Pawsome Rewards" : "Sign in for rewards"}
                </h1>
                <p className="mt-3 text-sm text-[var(--ps-on-surface-variant)]">{PS_TAGLINE}</p>
                <div className="mt-8 rounded-xl bg-[var(--ps-surface-container-lowest)] p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ps-secondary)]">
                    Member perks
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-[var(--ps-primary)]">
                    <li>· Earn Pawsome Points on orders</li>
                    <li>· Redeem points at checkout</li>
                    <li>· Personalized pet recommendations</li>
                    <li>· Guest checkout always available</li>
                  </ul>
                </div>
                {!isForgot ? (
                  <p className="mt-8 text-sm text-[var(--ps-on-surface-variant)]">
                    {isRegister ? "Already have an account?" : "New here?"}{" "}
                    <button
                      type="button"
                      onClick={() => (isRegister ? showSignIn() : setView("register"))}
                      className="font-semibold text-[var(--ps-secondary)] hover:underline"
                    >
                      {isRegister ? "Sign in" : "Create account"}
                    </button>
                  </p>
                ) : null}
              </div>

              <div className="p-8 md:p-10">
                {isForgot ? (
                  <PawsomeForgotPasswordFlow onBackToSignIn={showSignIn} onResetComplete={showSignIn} />
                ) : !isRegister ? (
                  <div className="mx-auto max-w-sm">
                    <h2 className="text-xl font-bold text-[var(--ps-primary)]" style={headline}>
                      Welcome back
                    </h2>
                    <p className="mt-1 text-sm text-[var(--ps-on-surface-variant)]">
                      Sign in to unlock rewards — shop as a guest anytime.
                    </p>
                    <form className="mt-6 space-y-4" onSubmit={handleLoginSubmit}>
                      <div className="rounded-xl bg-[var(--ps-surface-container-low)] px-4 py-3 text-xs text-[var(--ps-on-surface-variant)]">
                        Demo: <strong>{PS_DEMO_ADMIN.email}</strong> / <strong>{PS_DEMO_ADMIN.password}</strong>
                      </div>
                      <input
                        className="w-full rounded-xl border border-[var(--ps-outline-variant)] px-4 py-3 text-sm"
                        placeholder="Email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                      <div>
                        <div className="mb-1 flex justify-between">
                          <label className="text-sm text-[var(--ps-on-surface-variant)]">Password</label>
                          <button
                            type="button"
                            onClick={() => setView("forgot-password")}
                            className="text-xs font-semibold text-[var(--ps-secondary)] hover:underline"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <input
                          className="w-full rounded-xl border border-[var(--ps-outline-variant)] px-4 py-3 text-sm"
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                      </div>
                      {loginError ? (
                        <p className="rounded-xl bg-[var(--ps-error-container)] px-4 py-3 text-sm text-[var(--ps-on-error-container)]">
                          {loginError}
                        </p>
                      ) : null}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[var(--ps-primary)] py-4 text-sm font-semibold text-[var(--ps-on-primary)] disabled:opacity-50"
                      >
                        {loading ? "Signing in…" : "Sign in"}
                      </button>
                    </form>
                    <Link
                      href={PS_PATHS.shop}
                      className="mt-4 block text-center text-sm font-semibold text-[var(--ps-secondary)] hover:underline"
                    >
                      Continue as guest →
                    </Link>
                  </div>
                ) : (
                  <div className="mx-auto max-w-sm">
                    <h2 className="text-xl font-bold text-[var(--ps-primary)]" style={headline}>
                      Create your account
                    </h2>
                    <form className="mt-6 space-y-3" onSubmit={handleRegisterSubmit}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          className="rounded-xl border border-[var(--ps-outline-variant)] px-4 py-3 text-sm"
                          placeholder="Your name"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          required
                        />
                        <input
                          className="rounded-xl border border-[var(--ps-outline-variant)] px-4 py-3 text-sm"
                          placeholder="Pet's name"
                          value={registerPetName}
                          onChange={(e) => setRegisterPetName(e.target.value)}
                          required
                        />
                      </div>
                      <input
                        className="w-full rounded-xl border border-[var(--ps-outline-variant)] px-4 py-3 text-sm"
                        placeholder="Email"
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                      />
                      <input
                        className="w-full rounded-xl border border-[var(--ps-outline-variant)] px-4 py-3 text-sm"
                        placeholder="Password"
                        type="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        minLength={PET_MARKET_MIN_PASSWORD_LENGTH}
                        required
                      />
                      {registerError ? (
                        <p className="rounded-xl bg-[var(--ps-error-container)] px-4 py-3 text-sm text-[var(--ps-on-error-container)]">
                          {registerError}
                        </p>
                      ) : null}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[var(--ps-secondary)] py-4 text-sm font-semibold text-[var(--ps-on-secondary)] disabled:opacity-50"
                      >
                        {loading ? "Creating account…" : "Create account"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </PsPageWrap>
      </main>

      {registeredUser ? (
        <PawsomeRegisterSuccessModal
          open={showRegisterModal}
          user={registeredUser}
          onClose={() => setShowRegisterModal(false)}
        />
      ) : null}
    </>
  );
}
