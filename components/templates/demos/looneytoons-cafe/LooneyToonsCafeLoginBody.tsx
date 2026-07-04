"use client";

import Link from "next/link";
import { useState } from "react";
import type { LooneyTunesAuthUserDTO } from "@/lib/templates/db/looney-tunes";
import {
  LOONEY_TUNES_MIN_PASSWORD_LENGTH,
  consumeLooneyTunesApiError,
} from "@/lib/templates/api/looney-tunes";
import {
  loginLooneyTunesAccount,
  registerLooneyTunesAccount,
} from "@/lib/templates/api/looney-tunes-auth";
import { LT_DEMO_ADMIN, LT_PATHS } from "./looneytoonsCafeConfig";
import { useLooneyToonsCafeAuth } from "./LooneyToonsCafeAuthContext";
import { LooneyToonsCafeForgotPasswordFlow } from "./LooneyToonsCafeForgotPasswordFlow";
import { LooneyToonsCafeRegisterSuccessModal } from "./LooneyToonsCafeRegisterSuccessModal";

export function LooneyToonsCafeLoginBody() {
  const { establishSession } = useLooneyToonsCafeAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerDrink, setRegisterDrink] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);

  const [registeredUser, setRegisteredUser] = useState<LooneyTunesAuthUserDTO | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const { session } = await loginLooneyTunesAccount({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      establishSession(session.token, session.user);
      window.location.assign(LT_PATHS.account);
    } catch (error) {
      const message = consumeLooneyTunesApiError(error, "Could not sign in");
      if (message) setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleRegisterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (registerPassword.length < LOONEY_TUNES_MIN_PASSWORD_LENGTH) {
      setRegisterError(`Password must be at least ${LOONEY_TUNES_MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    setRegisterLoading(true);
    setRegisterError(null);

    try {
      const { session } = await registerLooneyTunesAccount({
        name: registerName.trim(),
        favorite_drink: registerDrink.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
      });
      establishSession(session.token, session.user);
      setRegisteredUser(session.user);
      setShowRegisterModal(true);
    } catch (error) {
      const message = consumeLooneyTunesApiError(error, "Could not create account");
      if (message) setRegisterError(message);
    } finally {
      setRegisterLoading(false);
    }
  }

  return (
    <>
      <main className="min-h-[calc(100vh-12rem)] bg-[#f9f9ff] px-4 py-12 text-[#151c28] md:px-16 md:py-16">
        <div className="mx-auto max-w-[1280px] overflow-hidden border-4 border-[#151c28] bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-4 border-[#151c28] bg-[#e9edff] px-8 py-6 md:px-12">
            <Link
              href={LT_PATHS.home}
              className="mb-2 inline-block font-black uppercase [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-2xl hover:opacity-80"
            >
              Comet Cup Co.
            </Link>
            <p className="max-w-2xl text-sm text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
              Order as a guest anytime. Create an account to track Comet Streak stars and unlock rewards.
            </p>
          </div>

          <div className="flex flex-col md:flex-row">
            <section
              id="register"
              className="relative flex w-full flex-col justify-center border-b-4 border-[#151c28] bg-[#e9edff] p-8 md:w-1/2 md:border-b-0 md:border-r-4 md:p-12"
            >
              <div className="lt-halftone pointer-events-none absolute inset-0 opacity-15" aria-hidden />
              <div className="relative z-10 mx-auto w-full max-w-sm">
                <h2 className="mb-2 font-extrabold uppercase italic [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-2xl md:text-3xl">
                  Join the streak
                </h2>
                <p className="mb-6 text-sm text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                  Register for rewards — guest checkout still works without an account.
                </p>
                <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                  <input
                    className="w-full rounded-xl border-2 border-[#151c28] bg-[#f9f9ff] px-4 py-3 text-sm [font-family:var(--font-lt-space),system-ui,sans-serif] focus:outline-none"
                    placeholder="Full name"
                    autoComplete="name"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                  <input
                    className="w-full rounded-xl border-2 border-[#151c28] bg-[#f9f9ff] px-4 py-3 text-sm [font-family:var(--font-lt-space),system-ui,sans-serif] focus:outline-none"
                    placeholder="Favorite drink (e.g. Latte)"
                    value={registerDrink}
                    onChange={(e) => setRegisterDrink(e.target.value)}
                    required
                  />
                  <input
                    className="w-full rounded-xl border-2 border-[#151c28] bg-[#f9f9ff] px-4 py-3 text-sm [font-family:var(--font-lt-space),system-ui,sans-serif] focus:outline-none"
                    placeholder="Email"
                    type="email"
                    autoComplete="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                  <input
                    className="w-full rounded-xl border-2 border-[#151c28] bg-[#f9f9ff] px-4 py-3 text-sm [font-family:var(--font-lt-space),system-ui,sans-serif] focus:outline-none"
                    placeholder={`Password (min ${LOONEY_TUNES_MIN_PASSWORD_LENGTH} chars)`}
                    type="password"
                    autoComplete="new-password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                  {registerError ? (
                    <p className="rounded-xl bg-[#fde8e8] px-4 py-3 text-sm text-[#ba1a1a]" role="alert">
                      {registerError}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={registerLoading}
                    className="w-full rounded-full border-2 border-[#151c28] bg-[#151c28] py-4 text-sm font-bold text-white shadow-[4px_4px_0px_0px_rgba(212,218,236,1)] [font-family:var(--font-lt-space),system-ui,sans-serif] disabled:opacity-60"
                  >
                    {registerLoading ? "Creating account…" : "Create account"}
                  </button>
                </form>
              </div>
            </section>

            <section className="flex w-full flex-col items-center justify-center p-8 md:w-1/2 md:p-12">
              {showForgotPassword ? (
                <LooneyToonsCafeForgotPasswordFlow
                  onBackToSignIn={() => {
                    setShowForgotPassword(false);
                    setLoginError(null);
                  }}
                  onResetComplete={() => {
                    setShowForgotPassword(false);
                    setLoginError(null);
                  }}
                />
              ) : (
                <div className="w-full max-w-sm">
                  <h2 className="mb-6 font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-2xl">
                    Sign in
                  </h2>
                  <form className="space-y-4" onSubmit={handleLoginSubmit}>
                    <div className="rounded-xl border-2 border-[#151c28] bg-[#e9edff] p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#495E84] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                        Demo admin
                      </p>
                      <p className="mt-1 text-sm text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                        {LT_DEMO_ADMIN.email} · password{" "}
                        <strong className="text-[#151c28]">{LT_DEMO_ADMIN.password}</strong>
                      </p>
                    </div>
                    <div>
                      <label
                        className="mb-1 block text-sm font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]"
                        htmlFor="lt-login-email"
                      >
                        Email
                      </label>
                      <input
                        id="lt-login-email"
                        className="w-full rounded-xl border-2 border-[#151c28] bg-[#f9f9ff] px-4 py-3 text-sm [font-family:var(--font-lt-space),system-ui,sans-serif] focus:outline-none"
                        type="email"
                        autoComplete="email"
                        placeholder={LT_DEMO_ADMIN.email}
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          if (loginError) setLoginError(null);
                        }}
                        required
                      />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label
                          className="text-sm font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]"
                          htmlFor="lt-login-password"
                        >
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-xs font-bold text-[#495E84] hover:underline [font-family:var(--font-lt-space),system-ui,sans-serif]"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <input
                        id="lt-login-password"
                        className="w-full rounded-xl border-2 border-[#151c28] bg-[#f9f9ff] px-4 py-3 text-sm [font-family:var(--font-lt-space),system-ui,sans-serif] focus:outline-none"
                        type="password"
                        autoComplete="current-password"
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          if (loginError) setLoginError(null);
                        }}
                        required
                      />
                    </div>
                    {loginError ? (
                      <p className="rounded-xl bg-[#fde8e8] px-4 py-3 text-sm text-[#ba1a1a]" role="alert">
                        {loginError}
                      </p>
                    ) : null}
                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full rounded-full border-2 border-[#151c28] bg-[#495E84] py-4 text-sm font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] [font-family:var(--font-lt-space),system-ui,sans-serif] disabled:opacity-60"
                    >
                      {loginLoading ? "Signing in…" : "Sign in"}
                    </button>
                  </form>
                </div>
              )}
            </section>
          </div>

          <div className="border-t-4 border-[#151c28] bg-[#f9f9ff] px-8 py-4 text-center md:px-12">
            <p className="text-xs text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
              Prefer to skip?{" "}
              <Link href={LT_PATHS.menu} className="font-bold text-[#495E84] underline">
                Order as guest
              </Link>
            </p>
          </div>
        </div>
      </main>

      {registeredUser ? (
        <LooneyToonsCafeRegisterSuccessModal
          open={showRegisterModal}
          user={registeredUser}
          onClose={() => setShowRegisterModal(false)}
        />
      ) : null}
    </>
  );
}
