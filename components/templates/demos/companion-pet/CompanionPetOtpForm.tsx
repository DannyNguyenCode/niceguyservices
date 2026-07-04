"use client";

import { useEffect, useRef, useState } from "react";

type CompanionPetOtpFormProps = {
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

export function CompanionPetOtpForm({
  email,
  label = "Verification code",
  submitLabel = "Verify code",
  loading = false,
  error = null,
  hint = null,
  onSubmit,
  onResend,
  resendLoading = false,
}: CompanionPetOtpFormProps) {
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
      <p className="text-center text-sm text-[var(--cp-slate)]">
        We emailed a 6-digit code to <strong className="text-[var(--cp-charcoal)]">{email}</strong>
      </p>
      {hint ? (
        <p className="rounded-xl border border-dashed border-[var(--cp-blue)] bg-[var(--cp-blue-muted)] px-4 py-3 text-center text-xs text-[var(--cp-blue)]">
          {hint}
        </p>
      ) : null}
      <div>
        <label className="mb-3 block text-center text-sm font-semibold text-[var(--cp-charcoal)]">
          {label}
        </label>
        <div className="flex justify-center gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                inputsRef.current[index] = node;
              }}
              className="h-12 w-10 rounded-xl border border-[var(--cp-border)] bg-white text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-[var(--cp-blue)]"
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
        <p className="rounded-xl bg-[var(--cp-orange-muted)] px-4 py-3 text-sm text-[var(--cp-orange)]" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading || digits.join("").length !== 6}
        className="w-full rounded-2xl bg-[var(--cp-charcoal)] py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Verifying…" : submitLabel}
      </button>
      {onResend ? (
        <button
          type="button"
          onClick={onResend}
          disabled={resendLoading}
          className="w-full text-center text-sm text-[var(--cp-blue)] hover:underline disabled:opacity-50"
        >
          {resendLoading ? "Sending…" : "Resend code"}
        </button>
      ) : null}
    </form>
  );
}
