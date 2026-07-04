"use client";

import { useState } from "react";
import { consumePetMarketApiError, PET_MARKET_MIN_PASSWORD_LENGTH } from "@/lib/templates/api/pet-market";
import {
  resetPetMarketPassword,
  startPetMarketForgotPassword,
} from "@/lib/templates/api/pet-market-auth";
import { SaturdayPetMarketOtpForm } from "./SaturdayPetMarketOtpForm";
import { SpmIcon } from "./SaturdayPetMarketShared";

type SaturdayPetMarketForgotPasswordFlowProps = {
  onBackToSignIn: () => void;
  onResetComplete: () => void;
};

type ForgotStep = "request" | "verify" | "done";

export function SaturdayPetMarketForgotPasswordFlow({
  onBackToSignIn,
  onResetComplete,
}: SaturdayPetMarketForgotPasswordFlowProps) {
  const [step, setStep] = useState<ForgotStep>("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [devHint, setDevHint] = useState<string | null>(null);

  async function handleRequestSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setDevHint(null);

    try {
      const result = await startPetMarketForgotPassword(email.trim());
      setMessage(result.message);
      if (result.devCode) {
        setDevHint(`Dev mode code: ${result.devCode}`);
      }
      setStep("verify");
    } catch (err) {
      const msg = consumePetMarketApiError(err, "Could not send reset code");
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendLoading(true);
    setError(null);
    try {
      const result = await startPetMarketForgotPassword(email.trim());
      setMessage(result.message);
      if (result.devCode) setDevHint(`Dev mode code: ${result.devCode}`);
    } catch (err) {
      const msg = consumePetMarketApiError(err, "Could not resend code");
      if (msg) setError(msg);
    } finally {
      setResendLoading(false);
    }
  }

  async function handleVerifyCode(code: string) {
    if (password.length < PET_MARKET_MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${PET_MARKET_MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await resetPetMarketPassword({
        email: email.trim(),
        code,
        password,
      });
      setMessage(result.message);
      setStep("done");
    } catch (err) {
      const msg = consumePetMarketApiError(err, "Could not reset password");
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (step === "done") {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <SpmIcon name="check_circle" className="mb-4 text-5xl text-[var(--spm-primary)]" />
          <h3 className="spm-headline-lg mb-2 text-[var(--spm-on-surface)]">Password updated</h3>
          <p className="spm-body-md text-[var(--spm-on-surface-variant)]">{message}</p>
        </div>
        <button
          type="button"
          onClick={onResetComplete}
          className="spm-coupon-border w-full rounded-lg bg-[var(--spm-primary)] py-6 font-headline-md text-white"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h3 className="spm-headline-lg mb-1 text-[var(--spm-on-surface)]">Choose a new password</h3>
          <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
            Enter the code from your email, then set a new password.
          </p>
        </div>
        <div className="mb-6 space-y-3">
          <div>
            <label className="spm-headline-md mb-1 block px-1 text-[var(--spm-on-surface)]" htmlFor="spm-reset-password">
              New password
            </label>
            <input
              id="spm-reset-password"
              className="w-full rounded-lg border-2 border-[var(--spm-outline)] bg-white p-4 font-body-md outline-none focus:border-[var(--spm-tertiary)]"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={PET_MARKET_MIN_PASSWORD_LENGTH}
              required
            />
          </div>
          <div>
            <label className="spm-headline-md mb-1 block px-1 text-[var(--spm-on-surface)]" htmlFor="spm-reset-confirm">
              Confirm password
            </label>
            <input
              id="spm-reset-confirm"
              className="w-full rounded-lg border-2 border-[var(--spm-outline)] bg-white p-4 font-body-md outline-none focus:border-[var(--spm-tertiary)]"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={PET_MARKET_MIN_PASSWORD_LENGTH}
              required
            />
          </div>
        </div>
        <SaturdayPetMarketOtpForm
          email={email}
          label="Reset code"
          submitLabel="Update Password"
          loading={loading}
          error={error}
          hint={devHint ?? message}
          onSubmit={handleVerifyCode}
          onResend={handleResend}
          resendLoading={resendLoading}
        />
        <button
          type="button"
          onClick={onBackToSignIn}
          className="spm-body-md mt-8 w-full text-center text-[var(--spm-on-surface-variant)] underline decoration-dotted underline-offset-4"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h3 className="spm-headline-lg mb-1 text-[var(--spm-on-surface)]">Forgot your password?</h3>
        <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
          We&apos;ll email you a code to reset it.
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleRequestSubmit}>
        <div>
          <label className="spm-headline-md mb-1 block px-1 text-[var(--spm-on-surface)]" htmlFor="spm-forgot-email">
            Email address
          </label>
          <input
            id="spm-forgot-email"
            className="w-full rounded-lg border-2 border-[var(--spm-outline)] bg-white p-6 font-body-md outline-none transition-all focus:border-[var(--spm-tertiary)] focus:ring-4 focus:ring-[var(--spm-tertiary-fixed)]"
            placeholder="hello@world.com"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        {error ? (
          <p className="spm-body-md rounded-lg bg-[var(--spm-error-container)] px-4 py-3 text-[var(--spm-on-error-container)]" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="spm-coupon-border w-full rounded-lg bg-[var(--spm-primary)] py-6 font-headline-md text-white shadow-[4px_4px_0px_0px_#003636] disabled:opacity-60"
        >
          {loading ? "Sending code…" : "Send Reset Code"}
        </button>
      </form>
      <button
        type="button"
        onClick={onBackToSignIn}
        className="spm-body-md mt-8 w-full text-center text-[var(--spm-on-surface-variant)] underline decoration-dotted underline-offset-4"
      >
        Back to sign in
      </button>
    </div>
  );
}
