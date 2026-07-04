"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PetMarketAuthUserDTO } from "@/lib/templates/db/pet-market";
import { PET_MARKET_MIN_PASSWORD_LENGTH } from "@/lib/templates/api/pet-market";
import { consumePetMarketApiError } from "@/lib/templates/api/pet-market";
import {
  loginPetMarketAccount,
  registerPetMarketAccount,
} from "@/lib/templates/api/pet-market-auth";
import { SPM_DEMO_ADMIN, SPM_PATHS, SPM_SITE } from "./saturdayPetMarketConfig";
import { SPM_REWARDS_PERKS } from "./saturdayPetMarketData";
import { useSpmAuth } from "./SaturdayPetMarketAuthContext";
import { SaturdayPetMarketForgotPasswordFlow } from "./SaturdayPetMarketForgotPasswordFlow";
// import { SaturdayPetMarketOtpForm } from "./SaturdayPetMarketOtpForm";
import { SaturdayPetMarketRegisterSuccessModal } from "./SaturdayPetMarketRegisterSuccessModal";
import { SpmIcon } from "./SaturdayPetMarketShared";

const MEMBERSHIP_PERKS = SPM_REWARDS_PERKS.slice(0, 3);

const SPM_VIEW_TOGGLE_CLASS =
  "spm-handwritten cursor-pointer text-[var(--spm-primary)] underline decoration-4 decoration-[var(--spm-tertiary)] underline-offset-4 transition-colors hover:text-[var(--spm-secondary)]";

type AuthView = "sign-in" | "register" | "forgot-password";
// | "verify-login"; // 2FA login step — restore when re-enabling email verification

export function SaturdayPetMarketLoginBody() {
  const { establishSession } = useSpmAuth();
  const [view, setView] = useState<AuthView>("sign-in");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // 2FA login state — restore when re-enabling email verification
  // const [pendingEmail, setPendingEmail] = useState("");
  // const [loginMessage, setLoginMessage] = useState<string | null>(null);
  // const [devHint, setDevHint] = useState<string | null>(null);
  // const [resendLoading, setResendLoading] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerPetName, setRegisterPetName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState<string | null>(null);

  const [registeredUser, setRegisteredUser] = useState<PetMarketAuthUserDTO | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#register") {
      setView("register");
    }
  }, []);

  function showSignIn() {
    setView("sign-in");
    setLoginError(null);
  }

  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setLoginError(null);

    try {
      const { session } = await loginPetMarketAccount({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      establishSession(session.token, session.user);
      window.location.assign(SPM_PATHS.account);
    } catch (error) {
      const message = consumePetMarketApiError(error, "Could not sign in");
      if (message) setLoginError(message);
    } finally {
      setLoading(false);
    }
  }

  /* 2FA login — restore when startPetMarketLogin returns a challenge instead of a session
  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setLoginError(null);
    setLoginMessage(null);
    setDevHint(null);

    try {
      const result = await startPetMarketLoginChallenge({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      setPendingEmail(result.email);
      setLoginMessage(result.message);
      if (result.devCode) setDevHint(`Dev mode code: ${result.devCode}`);
      setView("verify-login");
    } catch (error) {
      const message = consumePetMarketApiError(error, "Could not sign in");
      if (message) setLoginError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyLogin(code: string) {
    setLoading(true);
    setLoginError(null);
    try {
      const { session } = await verifyPetMarketLoginCode(pendingEmail, code);
      establishSession(session.token, session.user);
      window.location.assign(SPM_PATHS.account);
    } catch (error) {
      const message = consumePetMarketApiError(error, "Invalid verification code");
      if (message) setLoginError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendLoginCode() {
    setResendLoading(true);
    setLoginError(null);
    try {
      const result = await startPetMarketLoginChallenge({
        email: pendingEmail,
        password: loginPassword,
      });
      setLoginMessage(result.message);
      if (result.devCode) setDevHint(`Dev mode code: ${result.devCode}`);
    } catch (error) {
      const message = consumePetMarketApiError(error, "Could not resend code");
      if (message) setLoginError(message);
    } finally {
      setResendLoading(false);
    }
  }
  */

  async function handleRegisterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (registerPassword.length < PET_MARKET_MIN_PASSWORD_LENGTH) {
      setRegisterError(`Password must be at least ${PET_MARKET_MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    setLoading(true);
    setRegisterError(null);

    try {
      const { session } = await registerPetMarketAccount({
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
  // const isVerify = view === "verify-login";

  return (
    <>
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center bg-[var(--spm-background)] p-6 text-[var(--spm-on-background)]">
        <div className="relative flex w-full max-w-[1280px] flex-col overflow-hidden rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-lowest)] shadow-xl md:flex-row">
          <div className="spm-checkered-pattern pointer-events-none absolute inset-0" />

          <div className="relative flex min-h-[500px] w-full flex-col justify-between p-[var(--spm-margin)] transition-all duration-500 md:w-1/2">
            <div className="z-10">
              <Link href={SPM_PATHS.home} className="mb-12 flex w-fit items-center gap-3 transition-opacity hover:opacity-80">
                <SpmIcon name="pets" className="text-[40px] text-[var(--spm-secondary)]" fill />
                <span className="spm-headline-lg tracking-tight text-[var(--spm-secondary)]">{SPM_SITE}</span>
              </Link>
              <button
                type="button"
                onClick={() => (isRegister || isForgot ? showSignIn() : setView("register"))}
                className={`spm-headline-xl mb-6 text-left ${SPM_VIEW_TOGGLE_CLASS}`}
              >
                {isRegister ? "Welcome Back!" : "Join the Pack!"}
              </button>
              <p className="spm-body-lg mb-12 max-w-md text-[var(--spm-on-surface-variant)]">
                Become a member of the Saturday Morning Rewards Club and get exclusive access to fresh treats, local
                events, and tail-wagging discounts.
              </p>

              <div className="spm-membership-card spm-float-animation mb-12 rounded-lg border-2 border-white/20 p-6 shadow-lg">
                <div className="relative z-10">
                  <div className="mb-12 flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="spm-label-sm uppercase tracking-widest text-white/80">Official Member</span>
                      <span className="spm-headline-md text-white">REWARDS CLUB</span>
                    </div>
                    <SpmIcon name="stars" className="text-[48px] text-white opacity-40" />
                  </div>
                  <div className="space-y-3">
                    {MEMBERSHIP_PERKS.map((perk) => (
                      <div key={perk} className="flex items-center gap-2">
                        <SpmIcon name="check_circle" className="text-sm text-[var(--spm-tertiary-fixed)]" />
                        <span className="spm-label-sm text-white">{perk}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-16 flex items-end justify-between border-t border-white/20 pt-6">
                    <span className="spm-handwritten text-xl text-white opacity-70">est. 1989</span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-white/30">
                      <SpmIcon name="qr_code_2" className="text-white/40" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!isForgot ? (
              <div className="z-10 mt-6">
                <p className="spm-body-md mb-2 text-[var(--spm-on-surface-variant)]">
                  {isRegister ? "Already have an account?" : "New to the neighborhood?"}
                </p>
                <button
                  type="button"
                  onClick={() => (isRegister ? showSignIn() : setView("register"))}
                  className={`spm-headline-md ${SPM_VIEW_TOGGLE_CLASS}`}
                >
                  {isRegister ? "Welcome Back!" : "Join the Pack!"}
                </button>
              </div>
            ) : null}
          </div>

          <div className="relative flex w-full flex-col items-center justify-center border-l border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] p-[var(--spm-margin)] md:w-1/2">
            {isForgot ? (
              <SaturdayPetMarketForgotPasswordFlow
                onBackToSignIn={showSignIn}
                onResetComplete={showSignIn}
              />
            ) : !isRegister ? (
              <div className="w-full max-w-sm">
                <div className="mb-12 text-center">
                  <h3 className="spm-headline-lg mb-1 text-[var(--spm-on-surface)]">Welcome Back</h3>
                  <div className="mx-auto h-1 w-12 rounded-full bg-[var(--spm-tertiary-container)]" />
                </div>
                <form className="space-y-6" onSubmit={handleLoginSubmit}>
                  <div className="spm-coupon-border rounded-lg border-[var(--spm-primary-container)]/40 bg-[var(--spm-primary-fixed)]/30 p-4 text-center">
                    <p className="spm-label-sm font-bold uppercase tracking-wide text-[var(--spm-on-primary-fixed-variant)]">
                      Demo admin
                    </p>
                    <p className="spm-body-md mt-1 text-[var(--spm-on-surface-variant)]">
                      Email: <strong className="text-[var(--spm-primary)]">{SPM_DEMO_ADMIN.email}</strong>
                      {" · "}
                      Password: <strong className="text-[var(--spm-primary)]">{SPM_DEMO_ADMIN.password}</strong>
                    </p>
                  </div>
                  <div>
                    <label className="spm-headline-md mb-1 block px-1 text-[var(--spm-on-surface)]" htmlFor="spm-login-email">
                      Email
                    </label>
                    <input
                      id="spm-login-email"
                      className="w-full rounded-lg border-2 border-[var(--spm-outline)] bg-white p-6 font-body-md outline-none transition-all focus:border-[var(--spm-tertiary)] focus:ring-4 focus:ring-[var(--spm-tertiary-fixed)]"
                      placeholder={SPM_DEMO_ADMIN.email}
                      type="email"
                      autoComplete="email"
                      value={loginEmail}
                      onChange={(event) => {
                        setLoginEmail(event.target.value);
                        if (loginError) setLoginError(null);
                      }}
                      required
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between px-1">
                      <label className="spm-headline-md mb-1 block text-[var(--spm-on-surface)]" htmlFor="spm-login-password">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setView("forgot-password")}
                        className="spm-handwritten -rotate-3 text-sm text-[var(--spm-secondary)] transition-transform hover:rotate-0"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <input
                      id="spm-login-password"
                      className="w-full rounded-lg border-2 border-[var(--spm-outline)] bg-white p-6 font-body-md outline-none transition-all focus:border-[var(--spm-tertiary)] focus:ring-4 focus:ring-[var(--spm-tertiary-fixed)]"
                      placeholder="••••••••"
                      type="password"
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(event) => {
                        setLoginPassword(event.target.value);
                        if (loginError) setLoginError(null);
                      }}
                      required
                    />
                  </div>
                  {loginError ? (
                    <p className="spm-body-md rounded-lg bg-[var(--spm-error-container)] px-4 py-3 text-[var(--spm-on-error-container)]" role="alert">
                      {loginError}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={loading}
                    className="spm-coupon-border w-full rounded-lg bg-[var(--spm-primary)] py-6 font-headline-md text-white shadow-[4px_4px_0px_0px_#003636] transition-colors hover:bg-[var(--spm-primary-container)] disabled:opacity-60"
                  >
                    {loading ? "Signing in…" : "Sign In"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="w-full max-w-sm">
                <div className="mb-12 text-center">
                  <h3 className="spm-headline-lg mb-1 text-[var(--spm-on-surface)]">Join the Pack</h3>
                  <p className="spm-label-sm font-bold uppercase text-[var(--spm-tertiary)]">Rewards Club Enrollment</p>
                </div>
                <form className="space-y-3" onSubmit={handleRegisterSubmit}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="spm-headline-md mb-1 block px-1 text-[var(--spm-on-surface)]">Full Name</label>
                      <input
                        className="w-full rounded-lg border-2 border-[var(--spm-outline)] bg-white p-6 font-body-md outline-none transition-all focus:border-[var(--spm-tertiary)]"
                        placeholder="Pet Parent"
                        type="text"
                        value={registerName}
                        onChange={(event) => setRegisterName(event.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="spm-headline-md mb-1 block px-1 text-[var(--spm-on-surface)]">Pet&apos;s Name</label>
                      <input
                        className="w-full rounded-lg border-2 border-[var(--spm-outline)] bg-white p-6 font-body-md outline-none transition-all focus:border-[var(--spm-tertiary)]"
                        placeholder="Fluffy"
                        type="text"
                        value={registerPetName}
                        onChange={(event) => setRegisterPetName(event.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="spm-headline-md mb-1 block px-1 text-[var(--spm-on-surface)]">Email Address</label>
                    <input
                      className="w-full rounded-lg border-2 border-[var(--spm-outline)] bg-white p-6 font-body-md outline-none transition-all focus:border-[var(--spm-tertiary)]"
                      placeholder="hello@world.com"
                      type="email"
                      autoComplete="email"
                      value={registerEmail}
                      onChange={(event) => setRegisterEmail(event.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="spm-headline-md mb-1 block px-1 text-[var(--spm-on-surface)]">Create Password</label>
                    <input
                      className="w-full rounded-lg border-2 border-[var(--spm-outline)] bg-white p-6 font-body-md outline-none transition-all focus:border-[var(--spm-tertiary)]"
                      placeholder="••••••••"
                      type="password"
                      autoComplete="new-password"
                      value={registerPassword}
                      onChange={(event) => setRegisterPassword(event.target.value)}
                      minLength={PET_MARKET_MIN_PASSWORD_LENGTH}
                      required
                    />
                  </div>
                  {registerError ? (
                    <p className="spm-body-md rounded-lg bg-[var(--spm-error-container)] px-4 py-3 text-[var(--spm-on-error-container)]" role="alert">
                      {registerError}
                    </p>
                  ) : null}
                  <div className="spm-coupon-border mb-6 rounded-lg border-[var(--spm-tertiary)]/30 bg-[var(--spm-tertiary-fixed)] p-3">
                    <div className="flex gap-2">
                      <SpmIcon name="celebration" className="text-[var(--spm-tertiary)]" />
                      <p className="spm-label-sm text-[var(--spm-on-tertiary-fixed-variant)]">
                        By joining, you&apos;ll earn 50 &quot;Paws&quot; points instantly!
                      </p>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="spm-coupon-border w-full rounded-lg bg-[var(--spm-tertiary)] py-6 font-headline-md text-white shadow-[4px_4px_0px_0px_#3e001f] transition-colors hover:bg-[var(--spm-tertiary-container)] disabled:opacity-60"
                  >
                    {loading ? "Creating account…" : "Activate Membership"}
                  </button>
                </form>
                <div className="mt-12 text-center">
                  <button
                    type="button"
                    onClick={showSignIn}
                    className="spm-body-md text-[var(--spm-on-surface-variant)] underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--spm-primary)]"
                  >
                    I&apos;m already a member
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pointer-events-none fixed right-0 top-0 p-12 opacity-20">
          <SpmIcon name="shopping_basket" className="text-[120px] text-[var(--spm-primary)]" />
        </div>
        <div className="pointer-events-none fixed bottom-0 left-0 p-12 opacity-20">
          <SpmIcon name="potted_plant" className="text-[120px] text-[var(--spm-secondary)]" />
        </div>
      </div>

      {registeredUser ? (
        <SaturdayPetMarketRegisterSuccessModal
          open={showRegisterModal}
          user={registeredUser}
          onClose={() => setShowRegisterModal(false)}
        />
      ) : null}
    </>
  );
}
