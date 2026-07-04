"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { LC_CONTACT } from "./luxeCoData";
import { LcButton, LcIcon, lcDisplay } from "./LuxeCoShared";

type ConsultationForm = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
};

const INTEREST_OPTIONS = [
  { value: "consultation", label: "Book a consultation" },
  { value: "buying", label: "Buying a home" },
  { value: "selling", label: "Selling a home" },
  { value: "valuation", label: "Home valuation" },
] as const;

const ConsultationContext = createContext<(() => void) | null>(null);

function buildMailtoHref(form: ConsultationForm): string {
  const interestLabel =
    INTEREST_OPTIONS.find((o) => o.value === form.interest)?.label ?? "Consultation";
  const subject = `LUXE & CO. — ${interestLabel}`;
  const body = [
    "Consultation request from LUXE & CO. website (demo)",
    "",
    `Name: ${form.name.trim()}`,
    `Email: ${form.email.trim()}`,
    `Phone: ${form.phone.trim() || "Not provided"}`,
    `Interest: ${interestLabel}`,
    "",
    form.message.trim(),
  ].join("\n");

  return `mailto:${LC_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function LuxeCoConsultationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [form, setForm] = useState<ConsultationForm>({
    name: "",
    email: "",
    phone: "",
    interest: "consultation",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      name: "",
      email: "",
      phone: "",
      interest: "consultation",
      message: "",
    });
    setSubmitted(false);
    previousFocus.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previousFocus.current?.focus();
    };
  }, [open, onClose]);

  const update = (field: keyof ConsultationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    window.location.href = buildMailtoHref(form);
    setSubmitted(true);
  };

  if (!open) return null;

  const fieldClass =
    "lc-focus-ring w-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-[var(--lc-bg-elevated)] placeholder:text-[var(--lc-beige)]/50 outline-none transition-colors focus:border-[var(--lc-gold)] focus:ring-2 focus:ring-[var(--lc-gold)]/20";

  return (
    <div
      className="lc-modal-backdrop fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lc-consultation-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close consultation form"
        onClick={onClose}
        tabIndex={-1}
      />

      <div className="lc-modal-panel lc-cta-block relative z-10 max-h-[94dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[var(--lc-charcoal)] px-5 py-5 sm:px-8">
          <div>
            <p className="lc-label mb-2 text-[var(--lc-gold)]">Start the Conversation</p>
            <h2
              id="lc-consultation-modal-title"
              className="lc-display text-2xl text-[var(--lc-bg-elevated)] sm:text-3xl"
              style={lcDisplay}
            >
              Book a Consultation
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="lc-focus-ring flex h-10 w-10 shrink-0 items-center justify-center border border-white/20 text-[var(--lc-beige)] transition-colors hover:border-[var(--lc-gold)] hover:text-[var(--lc-bg-elevated)]"
            aria-label="Close"
            onClick={onClose}
          >
            <LcIcon name="close" className="text-xl" />
          </button>
        </div>

        <div className="px-5 py-6 sm:px-8 sm:py-8">
          {submitted ? (
            <div className="text-center">
              <LcIcon name="mail" className="mb-4 text-5xl text-[var(--lc-gold)]" />
              <p className="lc-display text-xl text-[var(--lc-bg-elevated)]" style={lcDisplay}>
                Opening your email app…
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--lc-beige)]">
                Demo only — your message is prefilled for {LC_CONTACT.email}. Send it from your
                email client to complete the request.
              </p>
              <LcButton
                type="button"
                onClick={onClose}
                className="mt-8 !bg-[var(--lc-bg-elevated)] !text-[var(--lc-charcoal)] hover:!bg-white"
              >
                Close
              </LcButton>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm leading-relaxed text-[var(--lc-beige)]">
                Schedule a consultation or tell us about your goals — we&apos;ll respond with local
                insight tailored to you. Fictional demo — submits via your email app.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="lc-consult-name" className="lc-label mb-2 block text-[var(--lc-gold-light)]">
                    Full Name
                  </label>
                  <input
                    id="lc-consult-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={fieldClass}
                    placeholder="Your full name"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="lc-consult-email" className="lc-label mb-2 block text-[var(--lc-gold-light)]">
                      Email
                    </label>
                    <input
                      id="lc-consult-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className={fieldClass}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="lc-consult-phone" className="lc-label mb-2 block text-[var(--lc-gold-light)]">
                      Phone
                    </label>
                    <input
                      id="lc-consult-phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className={fieldClass}
                      placeholder="(212) 555-0100"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lc-consult-interest" className="lc-label mb-2 block text-[var(--lc-gold-light)]">
                    I&apos;m interested in
                  </label>
                  <select
                    id="lc-consult-interest"
                    required
                    value={form.interest}
                    onChange={(e) => update("interest", e.target.value)}
                    className={`${fieldClass} cursor-pointer`}
                  >
                    {INTEREST_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="text-[var(--lc-charcoal)]">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="lc-consult-message" className="lc-label mb-2 block text-[var(--lc-gold-light)]">
                    Message
                  </label>
                  <textarea
                    id="lc-consult-message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className={`${fieldClass} min-h-[7rem] resize-y`}
                    placeholder="Tell us about your timeline, neighborhoods of interest, or property details."
                  />
                </div>

                <LcButton
                  type="submit"
                  className="mt-2 w-full !bg-[var(--lc-bg-elevated)] !text-[var(--lc-charcoal)] hover:!bg-white"
                >
                  <LcIcon name="send" className="text-lg" />
                  Send Request
                </LcButton>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function LuxeCoConsultationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openConsultation = useCallback(() => setOpen(true), []);

  return (
    <ConsultationContext.Provider value={openConsultation}>
      {children}
      <LuxeCoConsultationModal open={open} onClose={() => setOpen(false)} />
    </ConsultationContext.Provider>
  );
}

export function useLuxeCoConsultation(): () => void {
  const open = useContext(ConsultationContext);
  if (!open) {
    throw new Error("useLuxeCoConsultation must be used within LuxeCoConsultationProvider");
  }
  return open;
}
