"use client";

import { useId, useState, type FormEvent } from "react";
import { submitViContactInquiry } from "@/lib/templates/api/valley-interlocking-inquiries";
import type { ViContactInquiryInput } from "@/lib/templates/valley-interlocking/forms";
import { useViPageLoading } from "./ViPageLoadingProvider";

type SubmitState = "idle" | "sending" | "sent";

export function ValleyInterlockingContactForm() {
  const statusId = useId();
  const { hide: hidePageLoading } = useViPageLoading();
  const [form, setForm] = useState<ViContactInquiryInput>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof ViContactInquiryInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitState("sending");
    setError(null);

    try {
      await submitViContactInquiry(form);
      setSubmitState("sent");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      setSubmitState("idle");
      setError(err instanceof Error ? err.message : "Could not send your message");
    } finally {
      hidePageLoading();
    }
  };

  const buttonLabel =
    submitState === "sending" ? "SENDING..." : submitState === "sent" ? "MESSAGE SENT" : "Send Inquiry";

  const buttonClass =
    submitState === "sent"
      ? "bg-[var(--vi-tertiary)]"
      : "bg-[var(--vi-primary)] hover:opacity-90";

  const statusText =
    submitState === "sent"
      ? "Thank you — your demo inquiry was captured. No email was sent from this preview site."
      : submitState === "sending"
        ? "Sending your inquiry…"
        : "Demo form — submissions are logged for preview only, not emailed.";

  return (
    <form id="vi-contact-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-describedby={statusId}>
      <div className="space-y-1">
        <label htmlFor="vi-name" className="vi-label-md uppercase text-[var(--vi-on-surface-variant)]">
          Full Name
        </label>
        <input
          id="vi-name"
          type="text"
          required
          autoComplete="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="vi-input"
          placeholder="John Doe"
          disabled={submitState === "sending"}
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="vi-phone" className="vi-label-md uppercase text-[var(--vi-on-surface-variant)]">
          Phone Number
        </label>
        <input
          id="vi-phone"
          type="tel"
          required
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="vi-input"
          placeholder="(555) 000-0000"
          disabled={submitState === "sending"}
        />
      </div>
      <div className="space-y-1 md:col-span-2">
        <label htmlFor="vi-email" className="vi-label-md uppercase text-[var(--vi-on-surface-variant)]">
          Email Address
        </label>
        <input
          id="vi-email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="vi-input"
          placeholder="john@example.com"
          disabled={submitState === "sending"}
        />
      </div>
      <div className="space-y-1 md:col-span-2">
        <label htmlFor="vi-message" className="vi-label-md uppercase text-[var(--vi-on-surface-variant)]">
          Message
        </label>
        <textarea
          id="vi-message"
          required
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="vi-input min-h-[7rem] resize-y"
          placeholder="Tell us about your project..."
          disabled={submitState === "sending"}
        />
      </div>
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={submitState === "sending"}
          aria-busy={submitState === "sending"}
          className={`w-full min-h-11 rounded-lg py-4 vi-label-md uppercase tracking-widest text-[var(--vi-on-primary)] transition-all vi-ambient-shadow sm:py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vi-primary)] ${buttonClass}`}
        >
          {buttonLabel}
        </button>
        <p
          id={statusId}
          className="mt-3 text-center vi-label-sm text-[var(--vi-on-surface-variant)]"
          role={error ? "alert" : "status"}
          aria-live="polite"
        >
          {error ?? statusText}
        </p>
      </div>
    </form>
  );
}
