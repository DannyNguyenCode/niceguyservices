"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HR_FREQUENCIES, HR_PROPERTY_SIZES } from "./homeRestorationData";
import { HrButton, HrIcon, HrSectionLabel, hrDisplay } from "./HomeRestorationShared";

const STEPS = [
  { id: 1, label: "Property Size" },
  { id: 2, label: "Frequency" },
  { id: 3, label: "Preferred Date" },
  { id: 4, label: "Contact" },
] as const;

type FormData = {
  propertySize: string;
  frequency: string;
  date: string;
  name: string;
  email: string;
  phone: string;
};

const initialForm: FormData = {
  propertySize: "",
  frequency: "",
  date: "",
  name: "",
  email: "",
  phone: "",
};

export function HomeRestorationBooking() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const progress = (step / STEPS.length) * 100;

  const canAdvance = () => {
    if (step === 1) return !!form.propertySize;
    if (step === 2) return !!form.frequency;
    if (step === 3) return !!form.date;
    if (step === 4) return form.name && form.email && form.phone;
    return false;
  };

  const handleNext = () => {
    if (step < 4 && canAdvance()) setStep((s) => s + 1);
    else if (step === 4 && canAdvance()) setSubmitted(true);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const update = (field: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="hr-card rounded-2xl p-8 text-center md:p-12">
        <HrIcon name="check_circle" className="hr-check-icon mb-4 text-5xl" />
        <h3 className="hr-display mb-3 text-2xl text-[var(--hr-charcoal)]" style={hrDisplay}>
          Your Consultation Is Requested
        </h3>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-[var(--hr-charcoal-muted)]">
          Thank you, {form.name}. Our concierge team will reach out within one business day to confirm
          your restoration visit. This is a demo — no request was sent.
        </p>
      </div>
    );
  }

  const stepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            {HR_PROPERTY_SIZES.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => update("propertySize", size.id)}
                className={`hr-focus-ring rounded-xl border p-4 text-left transition-all ${
                  form.propertySize === size.id
                    ? "border-[var(--hr-gold)] bg-[var(--hr-gold-light)]/20 shadow-sm"
                    : "border-[var(--hr-line)] hover:border-[var(--hr-gold)]/50"
                }`}
              >
                <span className="block text-sm font-medium text-[var(--hr-charcoal)]">{size.label}</span>
                <span className="text-xs text-[var(--hr-charcoal-light)]">{size.sqft}</span>
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            {HR_FREQUENCIES.map((freq) => (
              <button
                key={freq.id}
                type="button"
                onClick={() => update("frequency", freq.id)}
                className={`hr-focus-ring rounded-xl border px-5 py-4 text-left text-sm font-medium transition-all ${
                  form.frequency === freq.id
                    ? "border-[var(--hr-gold)] bg-[var(--hr-gold-light)]/20"
                    : "border-[var(--hr-line)] hover:border-[var(--hr-gold)]/50"
                }`}
              >
                {freq.label}
              </button>
            ))}
          </div>
        );
      case 3:
        return (
          <div>
            <label htmlFor="hr-date" className="hr-label mb-3 block text-[var(--hr-charcoal-muted)]">
              Select your preferred date
            </label>
            <input
              id="hr-date"
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="hr-focus-ring w-full rounded-xl border border-[var(--hr-line)] bg-[var(--hr-bg)] px-4 py-3.5 text-sm text-[var(--hr-charcoal)]"
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="hr-name" className="hr-label mb-2 block text-[var(--hr-charcoal-muted)]">
                Full Name
              </label>
              <input
                id="hr-name"
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="hr-focus-ring w-full rounded-xl border border-[var(--hr-line)] bg-[var(--hr-bg)] px-4 py-3.5 text-sm"
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="hr-email" className="hr-label mb-2 block text-[var(--hr-charcoal-muted)]">
                Email
              </label>
              <input
                id="hr-email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="hr-focus-ring w-full rounded-xl border border-[var(--hr-line)] bg-[var(--hr-bg)] px-4 py-3.5 text-sm"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="hr-phone" className="hr-label mb-2 block text-[var(--hr-charcoal-muted)]">
                Phone
              </label>
              <input
                id="hr-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="hr-focus-ring w-full rounded-xl border border-[var(--hr-line)] bg-[var(--hr-bg)] px-4 py-3.5 text-sm"
                autoComplete="tel"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const StepWrapper = reduce ? "div" : motion.div;

  return (
    <div className="hr-card overflow-hidden rounded-2xl">
      <div className="border-b border-[var(--hr-line)] px-6 py-5 md:px-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <HrSectionLabel>Concierge Booking</HrSectionLabel>
          <span className="text-xs text-[var(--hr-charcoal-light)]">
            Step {step} of {STEPS.length}
          </span>
        </div>
        <div className="hr-booking-progress">
          <div className="hr-booking-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {STEPS.map((s) => (
            <span
              key={s.id}
              className={`hr-label rounded-full px-3 py-1 text-[0.625rem] ${
                s.id === step
                  ? "bg-[var(--hr-charcoal)] text-[var(--hr-bg-elevated)]"
                  : s.id < step
                    ? "bg-[var(--hr-gold-light)]/40 text-[var(--hr-charcoal)]"
                    : "bg-[var(--hr-bg-warm)] text-[var(--hr-charcoal-light)]"
              }`}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8">
        <h3 className="hr-display mb-6 text-xl text-[var(--hr-charcoal)]" style={hrDisplay}>
          {STEPS[step - 1].label}
        </h3>

        <AnimatePresence mode="wait">
          <StepWrapper
            key={step}
            className="hr-booking-step min-h-[180px]"
            {...(!reduce && {
              initial: { opacity: 0, x: 16 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -16 },
              transition: { duration: 0.3 },
            })}
          >
            {stepContent()}
          </StepWrapper>
        </AnimatePresence>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {step > 1 ? (
            <HrButton variant="outline" onClick={handleBack} className="sm:min-w-[140px]">
              Back
            </HrButton>
          ) : (
            <div />
          )}
          <HrButton
            onClick={handleNext}
            className={`sm:min-w-[200px] ${!canAdvance() ? "pointer-events-none opacity-50" : ""}`}
          >
            {step === 4 ? "Request Consultation" : "Continue"}
          </HrButton>
        </div>
      </div>
    </div>
  );
}
