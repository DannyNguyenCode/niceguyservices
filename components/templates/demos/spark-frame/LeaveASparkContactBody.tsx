"use client";

import { useState, type FormEvent } from "react";
import { LasSectionHeading } from "./LasSectionHeading";
import { TextureOverlay } from "./TextureOverlays";
import { LAS_CONTACT, LAS_CONTACT_PAGE } from "./leaveASparkSiteContent";

export function LeaveASparkContactBody() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="pt-[5rem]">
      <TextureOverlay className="las-container las-section-py" grain ink>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <LasSectionHeading
              title={LAS_CONTACT_PAGE.title}
              accent={LAS_CONTACT_PAGE.titleAccent}
              body={LAS_CONTACT_PAGE.intro}
            />
            <dl className="mt-8 flex flex-col gap-4">
              <div>
                <dt className="las-label text-[var(--las-muted)]">Phone</dt>
                <dd className="las-body mt-1">
                  <a href={`tel:${LAS_CONTACT.phone.replace(/\D/g, "")}`} className="las-focus-ring hover:text-[var(--las-red)]">
                    {LAS_CONTACT.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="las-label text-[var(--las-muted)]">Email</dt>
                <dd className="las-body mt-1">
                  <a href={`mailto:${LAS_CONTACT.email}`} className="las-focus-ring hover:text-[var(--las-red)]">
                    {LAS_CONTACT.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="las-label text-[var(--las-muted)]">Address</dt>
                <dd className="las-body mt-1 text-[var(--las-muted)]">{LAS_CONTACT.address}</dd>
              </div>
              <div>
                <dt className="las-label text-[var(--las-muted)]">Hours</dt>
                <dd className="las-body mt-1 text-[var(--las-muted)]">{LAS_CONTACT.hours}</dd>
              </div>
            </dl>
          </div>

          <div className="las-comic-panel border-[3px] border-[var(--las-off-white)] bg-[var(--las-surface-raised)] p-6 md:p-8">
            {submitted ? (
              <p className="las-body text-[var(--las-off-white)]">
                Thank you — this is a demo form. No data was stored. A real deployment would route this to your inbox.
              </p>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="las-name" className="las-label mb-1.5 block text-[var(--las-muted)]">
                    Full Name *
                  </label>
                  <input
                    id="las-name"
                    name="name"
                    type="text"
                    required
                    className="las-focus-ring w-full min-h-11 border border-[var(--las-divider)] bg-[var(--las-bg-primary)] px-3 py-2 text-[var(--las-off-white)]"
                  />
                </div>
                <div>
                  <label htmlFor="las-email" className="las-label mb-1.5 block text-[var(--las-muted)]">
                    Email *
                  </label>
                  <input
                    id="las-email"
                    name="email"
                    type="email"
                    required
                    className="las-focus-ring w-full min-h-11 border border-[var(--las-divider)] bg-[var(--las-bg-primary)] px-3 py-2 text-[var(--las-off-white)]"
                  />
                </div>
                <div>
                  <label htmlFor="las-phone" className="las-label mb-1.5 block text-[var(--las-muted)]">
                    Phone
                  </label>
                  <input
                    id="las-phone"
                    name="phone"
                    type="tel"
                    className="las-focus-ring w-full min-h-11 border border-[var(--las-divider)] bg-[var(--las-bg-primary)] px-3 py-2 text-[var(--las-off-white)]"
                  />
                </div>
                <div>
                  <label htmlFor="las-service" className="las-label mb-1.5 block text-[var(--las-muted)]">
                    Service Type *
                  </label>
                  <select
                    id="las-service"
                    name="service"
                    required
                    className="las-focus-ring w-full min-h-11 border border-[var(--las-divider)] bg-[var(--las-bg-primary)] px-3 py-2 text-[var(--las-off-white)]"
                  >
                    <option value="">Select a service</option>
                    {LAS_CONTACT_PAGE.serviceOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="las-message" className="las-label mb-1.5 block text-[var(--las-muted)]">
                    Project Details *
                  </label>
                  <textarea
                    id="las-message"
                    name="message"
                    required
                    rows={4}
                    className="las-focus-ring w-full border border-[var(--las-divider)] bg-[var(--las-bg-primary)] px-3 py-2 text-[var(--las-off-white)]"
                  />
                </div>
                <button type="submit" className="las-btn-primary las-focus-ring las-energy-trace w-full justify-center">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </TextureOverlay>
    </main>
  );
}
