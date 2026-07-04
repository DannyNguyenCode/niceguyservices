"use client";

import { useId, useState, type FormEvent } from "react";
import { VI_EMAIL } from "./valleyInterlockingConfig";
import { useViPageLoading } from "./ViPageLoadingProvider";

type QuoteForm = {
  name: string;
  phone: string;
  location: string;
  services: string[];
  details: string;
};

function buildMailtoHref(form: QuoteForm): string {
  const body = [
    "Edmonton site visit request (Valley Interlocking demo)",
    "",
    `Name: ${form.name.trim()}`,
    `Phone: ${form.phone.trim()}`,
    `Location: ${form.location}`,
    `Services: ${form.services.join(", ") || "Not specified"}`,
    "",
    form.details.trim(),
  ].join("\n");

  return `mailto:${VI_EMAIL}?subject=${encodeURIComponent("Edmonton Site Visit Request")}&body=${encodeURIComponent(body)}`;
}

const SERVICE_OPTIONS = ["Interlocking", "Retaining Walls", "Deck & Fence", "Full Landscaping"] as const;
const LOCATION_OPTIONS = [
  "Edmonton (North/South/Central)",
  "St. Albert",
  "Sherwood Park",
  "Leduc",
  "Spruce Grove",
  "Other / Regional",
] as const;

export function ValleyInterlockingEdmontonQuoteForm() {
  const statusId = useId();
  const { hide: hidePageLoading } = useViPageLoading();
  const [form, setForm] = useState<QuoteForm>({
    name: "",
    phone: "",
    location: LOCATION_OPTIONS[0],
    services: [],
    details: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const toggleService = (service: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      window.location.href = buildMailtoHref(form);
      hidePageLoading();
      setSubmitting(false);
      setSent(true);
      setForm({ name: "", phone: "", location: LOCATION_OPTIONS[0], services: [], details: "" });
      window.setTimeout(() => setSent(false), 4000);
    }, 800);
  };

  return (
    <form id="vi-edmonton-quote-form" onSubmit={handleSubmit} className="space-y-6" aria-describedby={statusId}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="vi-edm-name" className="vi-label-md uppercase text-[var(--vi-on-surface-variant)]">
            Full Name
          </label>
          <input id="vi-edm-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="vi-input" placeholder="John Doe" disabled={submitting} autoComplete="name" />
        </div>
        <div className="space-y-1">
          <label htmlFor="vi-edm-phone" className="vi-label-md uppercase text-[var(--vi-on-surface-variant)]">
            Phone Number
          </label>
          <input id="vi-edm-phone" required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="vi-input" placeholder="(780) 000-0000" disabled={submitting} autoComplete="tel" />
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor="vi-edm-location" className="vi-label-md uppercase text-[var(--vi-on-surface-variant)]">
          Service Location
        </label>
        <select id="vi-edm-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="vi-input" disabled={submitting}>
          {LOCATION_OPTIONS.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <fieldset className="space-y-3">
        <legend className="vi-label-md uppercase text-[var(--vi-on-surface-variant)]">Interested Services</legend>
        <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
          {SERVICE_OPTIONS.map((service) => {
            const id = `vi-edm-service-${service.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <label key={service} htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-2 vi-label-sm">
                <input id={id} type="checkbox" checked={form.services.includes(service)} onChange={() => toggleService(service)} className="rounded text-[var(--vi-primary)] focus:ring-[var(--vi-primary)]" disabled={submitting} />
                {service}
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="space-y-1">
        <label htmlFor="vi-edm-details" className="vi-label-md uppercase text-[var(--vi-on-surface-variant)]">
          Project Details
        </label>
        <textarea id="vi-edm-details" rows={3} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} className="vi-input min-h-[5rem] resize-y" placeholder="Tell us about your vision..." disabled={submitting} />
      </div>
      <button type="submit" disabled={submitting} aria-busy={submitting} className="w-full min-h-11 rounded-lg bg-[var(--vi-primary)] py-4 vi-label-md text-[var(--vi-on-primary)] shadow-md transition-all hover:opacity-90 disabled:opacity-70">
        {submitting ? "Opening email app…" : "Request an Edmonton Site Visit"}
      </button>
      <p id={statusId} className="vi-label-sm text-[var(--vi-on-surface-variant)]" role="status" aria-live="polite">
        {sent ? `Demo only — your request opens in your email app for ${VI_EMAIL}.` : "Submitting opens your email client with a pre-filled message (demo placeholder)."}
      </p>
    </form>
  );
}
