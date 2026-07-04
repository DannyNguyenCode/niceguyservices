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
import { EvergreenSectionLink } from "./EvergreenSectionLink";
import { EVERGREEN_EMAIL, EVERGREEN_PATHS } from "./evergreenConfig";

type EstimateForm = {
  name: string;
  email: string;
  address: string;
  subject: string;
  message: string;
};

const DEFAULT_SUBJECT = "Property Estimate Request";

const EstimateContext = createContext<((subject?: string) => void) | null>(null);
const EstimateModalOpenContext = createContext(false);

export function useEvergreenEstimateModalOpen(): boolean {
  return useContext(EstimateModalOpenContext);
}

function buildMailtoHref(form: EstimateForm): string {
  const subject = form.subject.trim() || DEFAULT_SUBJECT;
  const body = [
    "Estimate request from EverGreen & Alpine website (demo)",
    "",
    `Name: ${form.name.trim()}`,
    `Email: ${form.email.trim()}`,
    `Property address: ${form.address.trim()}`,
    "",
    form.message.trim(),
  ].join("\n");

  return `mailto:${EVERGREEN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

type EvergreenEstimateModalProps = {
  open: boolean;
  onClose: () => void;
  defaultSubject?: string;
};

function EvergreenEstimateModal({ open, onClose, defaultSubject = DEFAULT_SUBJECT }: EvergreenEstimateModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [form, setForm] = useState<EstimateForm>({
    name: "",
    email: "",
    address: "",
    subject: defaultSubject,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      name: "",
      email: "",
      address: "",
      subject: defaultSubject,
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
  }, [open, onClose, defaultSubject]);

  const update = (field: keyof EstimateForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    window.location.href = buildMailtoHref(form);
    setSubmitted(true);
  };

  if (!open) return null;

  const inputClass =
    "w-full rounded-lg border border-[#c1c8c2] bg-white px-4 py-3 text-base text-[#1b1c1c] outline-none transition-colors focus:border-[#012d1d] focus:ring-2 focus:ring-[#012d1d]/15";

  return (
    <div
      className="eg-modal-backdrop fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="eg-estimate-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close estimate form"
        onClick={onClose}
        tabIndex={-1}
      />

      <div className="eg-modal-panel relative z-10 max-h-[94dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-[#fbf9f8] sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#c1c8c2]/40 bg-[#fbf9f8]/95 px-5 py-4 backdrop-blur-sm sm:px-6">
          <h2
            id="eg-estimate-modal-title"
            className="font-[family-name:var(--font-eg-headline)] text-xl font-bold text-[#012d1d] sm:text-2xl"
          >
            Request An Estimate
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#c1c8c2] text-[#414844] transition-colors hover:border-[#012d1d] hover:text-[#012d1d]"
            aria-label="Close"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-xl" aria-hidden>
              close
            </span>
          </button>
        </div>

        <div className="px-5 py-6 sm:px-6">
          {submitted ? (
            <div className="text-center">
              <span
                className="material-symbols-outlined mb-4 text-5xl text-[#012d1d]"
                aria-hidden
              >
                mail
              </span>
              <p className="text-lg font-semibold text-[#012d1d]">Opening your email app…</p>
              <p className="mt-2 text-sm text-[#414844]">
                Demo only — your message is prefilled for {EVERGREEN_EMAIL}. Send it from your
                email client to complete the request.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-lg bg-[#012d1d] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1b4332]"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm leading-relaxed text-[#414844]">
                Tell us about your property and we&apos;ll follow up with a tailored estimate.
                Fictional demo — submits via your email app.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="eg-estimate-name" className="mb-1.5 block text-sm font-semibold text-[#012d1d]">
                    Name
                  </label>
                  <input
                    id="eg-estimate-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={inputClass}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="eg-estimate-email" className="mb-1.5 block text-sm font-semibold text-[#012d1d]">
                    Email
                  </label>
                  <input
                    id="eg-estimate-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="eg-estimate-address" className="mb-1.5 block text-sm font-semibold text-[#012d1d]">
                    Address
                  </label>
                  <input
                    id="eg-estimate-address"
                    type="text"
                    required
                    autoComplete="street-address"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    className={inputClass}
                    placeholder="Property address"
                  />
                </div>

                <div>
                  <label htmlFor="eg-estimate-subject" className="mb-1.5 block text-sm font-semibold text-[#012d1d]">
                    Subject
                  </label>
                  <input
                    id="eg-estimate-subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="eg-estimate-message" className="mb-1.5 block text-sm font-semibold text-[#012d1d]">
                    Message
                  </label>
                  <textarea
                    id="eg-estimate-message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className={`${inputClass} resize-y min-h-[7rem]`}
                    placeholder="Describe your property needs, timeline, and any seasonal services you're interested in."
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#012d1d] px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-[#1b4332]"
                >
                  <span className="material-symbols-outlined text-xl" aria-hidden>
                    send
                  </span>
                  Send Estimate Request
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function EvergreenEstimateProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [defaultSubject, setDefaultSubject] = useState(DEFAULT_SUBJECT);

  const openEstimate = useCallback((subject?: string) => {
    setDefaultSubject(subject ?? DEFAULT_SUBJECT);
    setOpen(true);

    if (window.location.hash === "#contact") {
      const url = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(null, "", url);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }, []);

  return (
    <EstimateModalOpenContext.Provider value={open}>
      <EstimateContext.Provider value={openEstimate}>
        {children}
        <EvergreenEstimateModal open={open} onClose={() => setOpen(false)} defaultSubject={defaultSubject} />
      </EstimateContext.Provider>
    </EstimateModalOpenContext.Provider>
  );
}

type EvergreenEstimateButtonProps = {
  children: ReactNode;
  className?: string;
  defaultSubject?: string;
};

export function EvergreenEstimateButton({
  children,
  className = "",
}: EvergreenEstimateButtonProps) {
  return (
    <EvergreenSectionLink href={EVERGREEN_PATHS.contact} className={className}>
      {children}
    </EvergreenSectionLink>
  );
}
