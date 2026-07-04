"use client";

import { useState } from "react";
import {
  PET_MARKET_MIN_PASSWORD_LENGTH,
  consumePetMarketApiError,
} from "@/lib/templates/api/pet-market";
import { pmrPetMarketAuth } from "@/lib/templates/api/pet-market-auth-client";
import { PmrButton } from "./PawsMatchShared";

type PawsMatchForgotPasswordFlowProps = {
  onBackToSignIn: () => void;
  onResetComplete: () => void;
};

type ForgotStep = "request" | "verify" | "done";

export function PawsMatchForgotPasswordFlow({
  onBackToSignIn,
  onResetComplete,
}: PawsMatchForgotPasswordFlowProps) {
  const [step, setStep] = useState<ForgotStep>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [devHint, setDevHint] = useState<string | null>(null);

  const inputClass = "pmr-input pmr-focus-ring w-full px-4 py-3 text-sm";

  async function handleRequestSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setDevHint(null);
    try {
      const result = await pmrPetMarketAuth.startPetMarketForgotPassword(email.trim());
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

  async function handleResetSubmit(event: React.FormEvent) {
    event.preventDefault();
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
      const result = await pmrPetMarketAuth.resetPetMarketPassword({
        email: email.trim(),
        code: code.trim(),
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
      <div className="text-center">
        <p className="text-lg font-semibold text-[var(--pmr-brown)]">Password updated</p>
        <p className="mt-2 text-sm text-[var(--pmr-brown-muted)]">{message}</p>
        <PmrButton className="mt-6 w-full" onClick={onResetComplete}>
          Back to sign in
        </PmrButton>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <form className="space-y-4" onSubmit={handleResetSubmit}>
        <h2 className="text-xl font-bold text-[var(--pmr-brown)]">Enter your reset code</h2>
        <p className="text-sm text-[var(--pmr-brown-muted)]">{message}</p>
        {devHint ? <p className="text-xs font-mono text-[var(--pmr-sage-muted)]">{devHint}</p> : null}
        <div>
          <label htmlFor="pmr-reset-code" className="mb-1 block text-sm font-semibold">
            Code
          </label>
          <input
            id="pmr-reset-code"
            required
            className={inputClass}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="pmr-reset-password" className="mb-1 block text-sm font-semibold">
            New password
          </label>
          <input
            id="pmr-reset-password"
            type="password"
            required
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="pmr-reset-confirm" className="mb-1 block text-sm font-semibold">
            Confirm password
          </label>
          <input
            id="pmr-reset-confirm"
            type="password"
            required
            className={inputClass}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error ? (
          <p className="text-sm text-rose-700" role="alert">
            {error}
          </p>
        ) : null}
        <PmrButton type="submit" className="w-full">
          {loading ? "Updating…" : "Update password"}
        </PmrButton>
        <button type="button" className="text-sm font-semibold text-[var(--pmr-terracotta)]" onClick={onBackToSignIn}>
          Back to sign in
        </button>
      </form>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleRequestSubmit}>
      <h2 className="text-xl font-bold text-[var(--pmr-brown)]">Reset your password</h2>
      <p className="text-sm text-[var(--pmr-brown-muted)]">
        We&apos;ll email a one-time code. No stress — take your time.
      </p>
      <div>
        <label htmlFor="pmr-forgot-email" className="mb-1 block text-sm font-semibold">
          Email
        </label>
        <input
          id="pmr-forgot-email"
          type="email"
          required
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {error ? (
        <p className="text-sm text-rose-700" role="alert">
          {error}
        </p>
      ) : null}
      <PmrButton type="submit" className="w-full">
        {loading ? "Sending…" : "Send reset code"}
      </PmrButton>
      <button type="button" className="text-sm font-semibold text-[var(--pmr-terracotta)]" onClick={onBackToSignIn}>
        Back to sign in
      </button>
    </form>
  );
}
