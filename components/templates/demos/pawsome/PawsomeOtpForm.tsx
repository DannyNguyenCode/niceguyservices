"use client";

import { useEffect, useRef, useState } from "react";
import { PsIcon } from "./PawsomeShared";

type PawsomeOtpFormProps = {
  email: string;
  label?: string;
  submitLabel?: string;
  loading?: boolean;
  error?: string | null;
  hint?: string | null;
  onSubmit: (code: string) => void;
  onResend?: () => void;
  resendLoading?: boolean;
};

export function PawsomeOtpForm({
  email,
  label = "Verification code",
  submitLabel = "Verify code",
  loading = false,
  error = null,
  hint = null,
  onSubmit,
  onResend,
  resendLoading = false,
}: PawsomeOtpFormProps) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  function updateDigit(index: number, value: string) {
    const next = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const copy = [...prev];
      copy[index] = next;
      return copy;
    });
    if (next && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, key: string) {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] ?? "");
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const code = digits.join("");
    if (code.length !== 6) return;
    onSubmit(code);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <p className="text-center text-sm text-[var(--ps-on-surface-variant)]">
        We emailed a 6-digit code to <strong className="text-[var(--ps-primary)]">{email}</strong>
      </p>
      {hint ? (
        <p className="rounded-xl border border-dashed border-[var(--ps-secondary)] bg-[color-mix(in_srgb,var(--ps-secondary-container)_15%,transparent)] px-4 py-3 text-center text-xs text-[var(--ps-secondary)]">
          {hint}
        </p>
      ) : null}
      <div>
        <label className="mb-3 block text-center text-sm font-semibold text-[var(--ps-primary)]">
          {label}
        </label>
        <div className="flex justify-center gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                inputsRef.current[index] = node;
              }}
              className="h-12 w-10 rounded-xl border border-[var(--ps-outline-variant)] bg-white text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-[var(--ps-secondary)]"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              onChange={(event) => updateDigit(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event.key)}
              onPaste={index === 0 ? handlePaste : undefined}
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>
      </div>
      {error ? (
        <p className="rounded-xl bg-[var(--ps-error-container)] px-4 py-3 text-sm text-[var(--ps-on-error-container)]" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading || digits.join("").length !== 6}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--ps-primary)] py-4 text-sm font-semibold text-[var(--ps-on-primary)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? <PsIcon name="progress_activity" className="animate-spin" /> : null}
        {submitLabel}
      </button>
      {onResend ? (
        <button
          type="button"
          onClick={onResend}
          disabled={resendLoading}
          className="w-full text-center text-sm font-semibold text-[var(--ps-secondary)] hover:underline disabled:opacity-50"
        >
          {resendLoading ? "Sending…" : "Resend code"}
        </button>
      ) : null}
    </form>
  );
}
