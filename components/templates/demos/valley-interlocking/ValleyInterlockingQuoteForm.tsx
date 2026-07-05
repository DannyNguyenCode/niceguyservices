"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { submitViQuoteInquiry } from "@/lib/templates/api/valley-interlocking-inquiries";
import type { ViQuoteInquiryInput } from "@/lib/templates/valley-interlocking/forms";
import { VI_QUOTE_LOCATIONS, VI_QUOTE_SERVICES } from "./valleyInterlockingData";
import { ViIcon } from "./ValleyInterlockingShared";
import { useViPageLoading } from "./ViPageLoadingProvider";

type QuoteForm = ViQuoteInquiryInput;

type SubmitState = "idle" | "sending" | "sent";

const inputClass =
  "w-full min-h-[2.75rem] rounded-xl border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-low)] px-4 py-3 vi-body-md outline-none transition-colors focus:border-[var(--vi-primary)] focus:ring-1 focus:ring-[var(--vi-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vi-primary)] sm:px-6";

function serviceId(service: string) {
  return `vi-quote-service-${service.toLowerCase().replace(/\s+/g, "-")}`;
}

export function ValleyInterlockingQuoteForm() {
  const formId = useId();
  const { hide: hidePageLoading } = useViPageLoading();
  const statusId = `${formId}-status`;
  const disclaimerId = `${formId}-disclaimer`;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [form, setForm] = useState<QuoteForm>({
    name: "",
    phone: "",
    email: "",
    location: VI_QUOTE_LOCATIONS[0].id,
    services: [],
    address: "",
    details: "",
  });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleService = (service: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s: any) => s !== service)
        : [...prev.services, service],
    }));
  };

  const resetForm = useCallback(() => {
    setShowSuccess(false);
    setSubmitState("idle");
    setError(null);
    setForm({
      name: "",
      phone: "",
      email: "",
      location: VI_QUOTE_LOCATIONS[0].id,
      services: [],
      address: "",
      details: "",
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitState("sending");
    setError(null);

    try {
      await submitViQuoteInquiry(form);
      setSubmitState("sent");
      setShowSuccess(true);
    } catch (err) {
      setSubmitState("idle");
      setError(err instanceof Error ? err.message : "Could not send your quote request");
    } finally {
      hidePageLoading();
    }
  };

  useEffect(() => {
    if (!showSuccess) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        resetForm();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus();
    };
  }, [showSuccess, resetForm]);

  const statusMessage =
    error ??
    (submitState === "sending"
      ? "Sending your quote request."
      : submitState === "sent"
        ? "Quote request captured for this demo. No email was sent."
        : "");

  return (
    <>
      <form
        id="vi-quote-form"
        onSubmit={handleSubmit}
        aria-describedby={disclaimerId}
        className="space-y-8 rounded-xl border border-[color-mix(in_srgb,var(--vi-surface-variant)_50%,transparent)] bg-white p-6 vi-ambient-shadow sm:space-y-10 sm:p-8 lg:space-y-12 lg:p-12"
      >
        <div
          role="status"
          id={statusId}
          aria-live="polite"
          aria-atomic="true"
          className="vi-sr-only"
        >
          {statusMessage}
        </div>

        <div className="flex flex-col gap-4 border-b border-[var(--vi-surface-variant)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex text-[var(--vi-secondary)]" aria-hidden="true">
              {Array.from({ length: 5 }).map((_: any, i: any) => (
                <ViIcon key={i} name="star" fill className="text-base" />
              ))}
            </div>
            <span className="vi-label-md text-[var(--vi-on-surface-variant)]">Top Rated in Ontario &amp; Alberta</span>
          </div>
          <span className="w-fit rounded-full bg-[color-mix(in_srgb,var(--vi-tertiary)_10%,transparent)] px-3 py-1 vi-label-sm text-[var(--vi-tertiary)]">
            Secure Form
          </span>
        </div>

        <fieldset className="space-y-4 sm:space-y-6" disabled={submitState === "sending"}>
          <legend className="mb-2 flex w-full items-center gap-3 text-left">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--vi-primary)] font-bold text-[var(--vi-on-primary)]" aria-hidden="true">
              1
            </span>
            <span className="vi-headline-md text-[var(--vi-primary)]">Tell Us About You</span>
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="vi-quote-name" className="vi-label-md uppercase text-[var(--vi-on-surface-variant)]">
                Full Name
              </label>
              <input
                id="vi-quote-name"
                required
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="vi-quote-phone" className="vi-label-md uppercase text-[var(--vi-on-surface-variant)]">
                Phone Number
              </label>
              <input
                id="vi-quote-phone"
                required
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
                placeholder="(555) 000-0000"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="vi-quote-email" className="vi-label-md uppercase text-[var(--vi-on-surface-variant)]">
                Email Address
              </label>
              <input
                id="vi-quote-email"
                required
                type="email"
                autoComplete="email"
                inputMode="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                placeholder="john@example.com"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4 sm:space-y-6" disabled={submitState === "sending"}>
          <legend className="mb-2 flex w-full items-center gap-3 text-left">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--vi-primary)] font-bold text-[var(--vi-on-primary)]" aria-hidden="true">
              2
            </span>
            <span className="vi-headline-md text-[var(--vi-primary)]">Project Location</span>
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2" role="radiogroup" aria-label="Project location">
            {VI_QUOTE_LOCATIONS.map((loc: any) => (
              <label key={loc.id} className="vi-choice-card">
                <input
                  type="radio"
                  name="location"
                  value={loc.id}
                  checked={form.location === loc.id}
                  onChange={() => setForm({ ...form, location: loc.id })}
                  className="peer vi-sr-only"
                />
                <div className="h-full rounded-xl border-2 border-[var(--vi-outline-variant)] p-4 transition-all peer-checked:border-[var(--vi-primary)] peer-checked:bg-[color-mix(in_srgb,var(--vi-primary-fixed-dim)_10%,transparent)] sm:p-6">
                  <p className="vi-label-md text-[var(--vi-on-surface)]">{loc.label}</p>
                  <p className="mt-1 vi-label-sm text-[var(--vi-on-surface-variant)]">{loc.detail}</p>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-4 sm:space-y-6" disabled={submitState === "sending"}>
          <legend className="mb-2 flex w-full flex-col items-start gap-1 text-left sm:flex-row sm:items-center sm:gap-3">
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--vi-primary)] font-bold text-[var(--vi-on-primary)]" aria-hidden="true">
                3
              </span>
              <span className="vi-headline-md text-[var(--vi-primary)]">Service Selection</span>
            </span>
            <span className="vi-label-sm font-normal normal-case tracking-normal text-[var(--vi-on-surface-variant)] sm:ml-11">
              Select all that apply
            </span>
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {VI_QUOTE_SERVICES.map((service: any) => {
              const id = serviceId(service);
              return (
                <label key={service} htmlFor={id} className="vi-service-chip">
                  <input
                    id={id}
                    type="checkbox"
                    checked={form.services.includes(service)}
                    onChange={() => toggleService(service)}
                    className="h-4 w-4 shrink-0 rounded text-[var(--vi-primary)] focus:ring-[var(--vi-primary)]"
                  />
                  <span className="vi-label-sm leading-snug">{service}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="space-y-4 sm:space-y-6" disabled={submitState === "sending"}>
          <legend className="mb-2 flex w-full items-center gap-3 text-left">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--vi-primary)] font-bold text-[var(--vi-on-primary)]" aria-hidden="true">
              4
            </span>
            <span className="vi-headline-md text-[var(--vi-primary)]">Project Details</span>
          </legend>
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-1">
              <label htmlFor="vi-quote-address" className="vi-label-md uppercase text-[var(--vi-on-surface-variant)]">
                Project Street Address
              </label>
              <input
                id="vi-quote-address"
                required
                type="text"
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={inputClass}
                placeholder="123 Luxury Lane"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="vi-quote-details" className="vi-label-md uppercase text-[var(--vi-on-surface-variant)]">
                Brief Description of Project
              </label>
              <textarea
                id="vi-quote-details"
                rows={4}
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                className={`${inputClass} vi-custom-scrollbar min-h-[6rem] resize-y`}
                placeholder="Tell us about your vision, specific materials you like, or any technical requirements..."
              />
            </div>
          </div>
        </fieldset>

        <div className="border-t border-[var(--vi-surface-variant)] pt-6">
          <button
            type="submit"
            disabled={submitState === "sending" || submitState === "sent"}
            aria-busy={submitState === "sending"}
            aria-describedby={statusId}
            className={`flex min-h-[3rem] w-full items-center justify-center gap-3 rounded-xl px-4 py-4 vi-headline-md shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vi-primary)] disabled:opacity-80 sm:py-6 ${
              submitState === "sent"
                ? "bg-[var(--vi-tertiary)] text-[var(--vi-on-tertiary)]"
                : "bg-[var(--vi-primary)] text-[var(--vi-on-primary)] hover:bg-[var(--vi-primary-container)] hover:text-[var(--vi-on-primary-container)] hover:shadow-[color-mix(in_srgb,var(--vi-primary)_20%,transparent)]"
            }`}
          >
            {submitState === "sending" ? (
              <>
                <ViIcon name="progress_activity" className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                <span>Sending...</span>
              </>
            ) : submitState === "sent" ? (
              <>
                <ViIcon name="check" aria-hidden="true" />
                <span>Request Received!</span>
              </>
            ) : (
              <>
                <span>Submit Quote Request</span>
                <ViIcon name="arrow_forward" aria-hidden="true" />
              </>
            )}
          </button>
          <p id={disclaimerId} className="mt-6 text-center vi-label-sm italic text-[var(--vi-on-surface-variant)]">
            By submitting, you agree to our Terms of Service and Privacy Policy.
          </p>
          {error ? (
            <p className="mt-2 text-center vi-label-sm text-[var(--vi-error)]" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </form>

      {showSuccess ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm motion-reduce:backdrop-blur-none"
            aria-label="Close confirmation dialog"
            onClick={resetForm}
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vi-quote-success-title"
            aria-describedby="vi-quote-success-desc"
            tabIndex={-1}
            className="fixed top-1/2 left-1/2 z-[100] mx-4 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 text-center vi-ambient-shadow focus:outline-none sm:p-10 lg:p-12"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--vi-tertiary)_10%,transparent)]" aria-hidden="true">
              <ViIcon name="celebration" className="text-4xl text-[var(--vi-tertiary)]" />
            </div>
            <h3 id="vi-quote-success-title" className="vi-headline-md mb-3 text-[var(--vi-primary)]">
              Thank You!
            </h3>
            <p id="vi-quote-success-desc" className="vi-body-md text-[var(--vi-on-surface-variant)]">
              We&apos;ve captured your demo quote request. This preview site does not send real email.
            </p>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={resetForm}
              className="mt-10 min-h-[2.75rem] vi-label-md text-[var(--vi-primary)] underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vi-primary)]"
            >
              Close
            </button>
          </div>
        </>
      ) : null}
    </>
  );
}
