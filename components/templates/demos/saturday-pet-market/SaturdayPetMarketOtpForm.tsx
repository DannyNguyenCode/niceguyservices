"use client";

import { useEffect, useRef, useState } from "react";
import { SpmIcon } from "./SaturdayPetMarketShared";

type SaturdayPetMarketOtpFormProps = {
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

export function SaturdayPetMarketOtpForm({
  email,
  label = "Verification code",
  submitLabel = "Verify Code",
  loading = false,
  error = null,
  hint = null,
  onSubmit,
  onResend,
  resendLoading = false,
}: SaturdayPetMarketOtpFormProps) {
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
    const focusIndex = Math.min(pasted.length, 5);
    inputsRef.current[focusIndex]?.focus();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const code = digits.join("");
    if (code.length !== 6) return;
    onSubmit(code);
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <p className="spm-body-md text-center text-[var(--spm-on-surface-variant)]">
        We emailed a 6-digit code to <strong className="text-[var(--spm-on-surface)]">{email}</strong>
      </p>
      {hint ? (
        <p className="spm-label-sm rounded-lg border border-dashed border-[var(--spm-tertiary)] bg-[var(--spm-tertiary-fixed)]/40 px-4 py-3 text-center text-[var(--spm-on-tertiary-fixed-variant)]">
          {hint}
        </p>
      ) : null}
      <div>
        <label className="spm-headline-md mb-3 block text-center text-[var(--spm-on-surface)]">{label}</label>
        <div className="flex justify-center gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                inputsRef.current[index] = node;
              }}
              className="h-14 w-11 rounded-lg border-2 border-[var(--spm-outline)] bg-white text-center text-xl font-bold outline-none transition-all focus:border-[var(--spm-tertiary)] focus:ring-4 focus:ring-[var(--spm-tertiary-fixed)]"
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
        <p className="spm-body-md rounded-lg bg-[var(--spm-error-container)] px-4 py-3 text-[var(--spm-on-error-container)]" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading || digits.join("").length !== 6}
        className="spm-coupon-border flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--spm-primary)] py-6 font-headline-md text-white shadow-[4px_4px_0px_0px_#003636] transition-colors hover:bg-[var(--spm-primary-container)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <SpmIcon name="progress_activity" className="animate-spin" /> : null}
        {submitLabel}
      </button>
      {onResend ? (
        <button
          type="button"
          onClick={onResend}
          disabled={resendLoading}
          className="spm-body-md w-full text-center text-[var(--spm-primary)] underline decoration-dotted underline-offset-4 disabled:opacity-60"
        >
          {resendLoading ? "Sending…" : "Resend code"}
        </button>
      ) : null}
    </form>
  );
}
