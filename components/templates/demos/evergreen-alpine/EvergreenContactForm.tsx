"use client";

import { useState, type FormEvent } from "react";
import { EVERGREEN_EMAIL } from "./evergreenConfig";

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const DEFAULT_SUBJECT = "Contact Request";

function buildMailtoHref(form: ContactForm): string {
  const body = [
    "Contact request from EverGreen & Alpine website (demo)",
    "",
    `Name: ${form.name.trim()}`,
    `Email: ${form.email.trim()}`,
    `Phone: ${form.phone.trim() || "Not provided"}`,
    "",
    form.message.trim(),
  ].join("\n");

  return `mailto:${EVERGREEN_EMAIL}?subject=${encodeURIComponent(DEFAULT_SUBJECT)}&body=${encodeURIComponent(body)}`;
}

const inputClass =
  "w-full rounded-lg border border-[#c1c8c2] bg-white px-4 py-3 text-base text-[#1b1c1c] outline-none transition-colors focus:border-[#012d1d] focus:ring-2 focus:ring-[#012d1d]/15";

export function EvergreenContactForm() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    window.location.href = buildMailtoHref(form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <span className="material-symbols-outlined mb-4 text-5xl text-[#012d1d]" aria-hidden>
          mail
        </span>
        <p className="text-lg font-semibold text-[#012d1d]">Opening your email app…</p>
        <p className="mt-2 text-sm text-[#414844]">
          Demo only — your message is prefilled for {EVERGREEN_EMAIL}. Send it from your email
          client to complete the request.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="mb-6 text-sm leading-relaxed text-[#414844]">
        Tell us about your property and we&apos;ll follow up. Fictional demo — submits via your
        email app.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="eg-contact-name" className="mb-1.5 block text-sm font-semibold text-[#012d1d]">
            Name
          </label>
          <input
            id="eg-contact-name"
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
          <label htmlFor="eg-contact-email" className="mb-1.5 block text-sm font-semibold text-[#012d1d]">
            Email
          </label>
          <input
            id="eg-contact-email"
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
          <label htmlFor="eg-contact-phone" className="mb-1.5 block text-sm font-semibold text-[#012d1d]">
            Phone <span className="font-normal text-[#414844]">(optional)</span>
          </label>
          <input
            id="eg-contact-phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass}
            placeholder="(555) 000-0000"
          />
        </div>

        <div>
          <label htmlFor="eg-contact-message" className="mb-1.5 block text-sm font-semibold text-[#012d1d]">
            Message
          </label>
          <textarea
            id="eg-contact-message"
            required
            rows={4}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            className={`${inputClass} min-h-[7rem] resize-y`}
            placeholder="How can we help with your property?"
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#012d1d] px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-[#1b4332]"
        >
          <span className="material-symbols-outlined text-xl" aria-hidden>
            send
          </span>
          Send Message
        </button>
      </form>
    </>
  );
}
