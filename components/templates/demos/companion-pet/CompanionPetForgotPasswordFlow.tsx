"use client";

import { useState } from "react";
import { consumePetMarketApiError, PET_MARKET_MIN_PASSWORD_LENGTH } from "@/lib/templates/api/pet-market";
import { cpPetMarketAuth } from "@/lib/templates/api/pet-market-auth-client";
import { CompanionPetOtpForm } from "./CompanionPetOtpForm";

type CompanionPetForgotPasswordFlowProps = {
  onBackToSignIn: () => void;
  onResetComplete: () => void;
};

type ForgotStep = "request" | "verify" | "done";

export function CompanionPetForgotPasswordFlow({
  onBackToSignIn,
  onResetComplete,
}: CompanionPetForgotPasswordFlowProps) {
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
      const result = await cpPetMarketAuth.startPetMarketForgotPassword(email.trim());
      setMessage(result.message);
      if (result.devCode) setDevHint(`Dev mode code: ${result.devCode}`);
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
      const result = await cpPetMarketAuth.startPetMarketForgotPassword(email.trim());
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
      const result = await cpPetMarketAuth.resetPetMarketPassword({
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
        <span className="material-symbols-outlined text-5xl text-[var(--cp-green)]" aria-hidden>
          check_circle
        </span>
        <h3 className="mt-4 text-xl font-semibold">Password updated</h3>
        <p className="mt-2 text-sm text-[var(--cp-slate)]">{message}</p>
        <button
          type="button"
          onClick={onResetComplete}
          className="mt-6 w-full rounded-2xl bg-[var(--cp-charcoal)] py-3.5 text-sm font-semibold text-white"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h3 className="text-xl font-semibold">Choose a new password</h3>
          <p className="mt-1 text-sm text-[var(--cp-slate)]">
            Enter the code from your email, then set a new password.
          </p>
        </div>
        <div className="mb-5 space-y-3">
          <input
            className="w-full rounded-xl border border-[var(--cp-border)] px-4 py-3 text-sm"
            type="password"
            autoComplete="new-password"
            placeholder="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={PET_MARKET_MIN_PASSWORD_LENGTH}
            required
          />
          <input
            className="w-full rounded-xl border border-[var(--cp-border)] px-4 py-3 text-sm"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={PET_MARKET_MIN_PASSWORD_LENGTH}
            required
          />
        </div>
        <CompanionPetOtpForm
          email={email}
          label="Reset code"
          submitLabel="Update password"
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
          className="mt-6 w-full text-center text-sm text-[var(--cp-slate)] hover:text-[var(--cp-charcoal)]"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-semibold">Forgot your password?</h3>
        <p className="mt-1 text-sm text-[var(--cp-slate)]">We&apos;ll email you a code to reset it.</p>
      </div>
      <form className="space-y-4" onSubmit={handleRequestSubmit}>
        <input
          className="w-full rounded-xl border border-[var(--cp-border)] px-4 py-3 text-sm"
          placeholder="Email address"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        {error ? (
          <p className="rounded-xl bg-[var(--cp-orange-muted)] px-4 py-3 text-sm text-[var(--cp-orange)]" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[var(--cp-charcoal)] py-3.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Sending code…" : "Send reset code"}
        </button>
      </form>
      <button
        type="button"
        onClick={onBackToSignIn}
        className="mt-6 w-full text-center text-sm text-[var(--cp-slate)] hover:text-[var(--cp-charcoal)]"
      >
        Back to sign in
      </button>
    </div>
  );
}
