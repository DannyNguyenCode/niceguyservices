"use client";

import { useState } from "react";
import { LOONEY_TUNES_MIN_PASSWORD_LENGTH, consumeLooneyTunesApiError } from "@/lib/templates/api/looney-tunes";
import {
  resetLooneyTunesPassword,
  startLooneyTunesForgotPassword,
} from "@/lib/templates/api/looney-tunes-auth";

type LooneyToonsCafeForgotPasswordFlowProps = {
  onBackToSignIn: () => void;
  onResetComplete: () => void;
};

type ForgotStep = "request" | "verify" | "done";

export function LooneyToonsCafeForgotPasswordFlow({
  onBackToSignIn,
  onResetComplete,
}: LooneyToonsCafeForgotPasswordFlowProps) {
  const [step, setStep] = useState<ForgotStep>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
      const result = await startLooneyTunesForgotPassword(email.trim());
      setMessage(result.message);
      if (result.devCode) setDevHint(`Dev mode code: ${result.devCode}`);
      setStep("verify");
    } catch (err) {
      const msg = consumeLooneyTunesApiError(err, "Could not send reset code");
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < LOONEY_TUNES_MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${LOONEY_TUNES_MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await resetLooneyTunesPassword({
        email: email.trim(),
        code: code.trim(),
        password,
      });
      setMessage(result.message);
      setStep("done");
    } catch (err) {
      const msg = consumeLooneyTunesApiError(err, "Could not reset password");
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (step === "done") {
    return (
      <div className="w-full max-w-sm text-center">
        <h3 className="mb-4 font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-2xl">
          Password updated
        </h3>
        <p className="mb-8 text-sm text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
          {message}
        </p>
        <button
          type="button"
          onClick={onResetComplete}
          className="w-full rounded-full border-2 border-[#151c28] bg-[#495E84] py-4 text-sm font-bold text-white [font-family:var(--font-lt-space),system-ui,sans-serif]"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div className="w-full max-w-sm">
        <h3 className="mb-2 text-center font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-2xl">
          Enter reset code
        </h3>
        <p className="mb-6 text-center text-sm text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
          {message}
        </p>
        {devHint ? (
          <p className="mb-4 rounded-xl border-2 border-[#151c28] bg-[#e9edff] p-3 text-xs font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]">
            {devHint}
          </p>
        ) : null}
        <form className="space-y-4" onSubmit={handleResetSubmit}>
          <input
            className="w-full rounded-xl border-2 border-[#151c28] bg-white px-4 py-3 text-sm [font-family:var(--font-lt-space),system-ui,sans-serif] focus:outline-none"
            placeholder="6-digit code"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <input
            className="w-full rounded-xl border-2 border-[#151c28] bg-white px-4 py-3 text-sm [font-family:var(--font-lt-space),system-ui,sans-serif] focus:outline-none"
            placeholder="New password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="w-full rounded-xl border-2 border-[#151c28] bg-white px-4 py-3 text-sm [font-family:var(--font-lt-space),system-ui,sans-serif] focus:outline-none"
            placeholder="Confirm password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error ? (
            <p className="rounded-xl bg-[#fde8e8] px-4 py-3 text-sm text-[#ba1a1a]" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full border-2 border-[#151c28] bg-[#151c28] py-4 text-sm font-bold text-white [font-family:var(--font-lt-space),system-ui,sans-serif] disabled:opacity-60"
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
        <button
          type="button"
          onClick={onBackToSignIn}
          className="mt-4 w-full text-sm font-bold text-[#495E84] [font-family:var(--font-lt-space),system-ui,sans-serif] hover:underline"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h3 className="mb-6 text-center font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-2xl">
        Forgot password
      </h3>
      <form className="space-y-4" onSubmit={handleRequestSubmit}>
        <input
          className="w-full rounded-xl border-2 border-[#151c28] bg-white px-4 py-3 text-sm [font-family:var(--font-lt-space),system-ui,sans-serif] focus:outline-none"
          placeholder="Email address"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error ? (
          <p className="rounded-xl bg-[#fde8e8] px-4 py-3 text-sm text-[#ba1a1a]" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full border-2 border-[#151c28] bg-[#495E84] py-4 text-sm font-bold text-white [font-family:var(--font-lt-space),system-ui,sans-serif] disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send reset code"}
        </button>
      </form>
      <button
        type="button"
        onClick={onBackToSignIn}
        className="mt-4 w-full text-sm font-bold text-[#495E84] [font-family:var(--font-lt-space),system-ui,sans-serif] hover:underline"
      >
        Back to sign in
      </button>
    </div>
  );
}
