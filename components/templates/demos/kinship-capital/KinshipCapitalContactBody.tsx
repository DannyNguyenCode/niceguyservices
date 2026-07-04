"use client";

import { KC_EMAIL, KC_PHONE, KC_ADDRESS } from "./kinshipCapitalConfig";
import { KC_IMG } from "./kinshipCapitalImages";
import { KcContainer, KcIcon, KcImg } from "./KinshipCapitalShared";
import { useKcFormLabelFocus } from "./useKcEffects";

export function KinshipCapitalContactBody() {
  useKcFormLabelFocus("kc-contact-form");

  return (
    <main>
      <section className="relative overflow-hidden pt-20 pb-32">
        <KcContainer className="relative z-10 text-center">
          <span className="kc-label-sm mb-4 block uppercase tracking-widest text-[var(--kc-primary)]">Kinship &amp; Capital</span>
          <h1 className="kc-headline-xl mx-auto mb-6 max-w-3xl text-[var(--kc-on-surface)]">
            Let&apos;s discuss your family&apos;s legacy.
          </h1>
          <p className="kc-body-lg mx-auto max-w-2xl text-[var(--kc-on-surface-variant)]">
            A welcoming, high-touch consultation experience designed to simplify complex financial futures for
            high-net-worth families.
          </p>
        </KcContainer>
      </section>

      <section className="relative z-20 -mt-20 pb-[var(--kc-stack-lg)]">
        <KcContainer>
          <div className="grid grid-cols-1 gap-[var(--kc-gutter)] lg:grid-cols-12">
            <div className="space-y-[var(--kc-gutter)] lg:col-span-5">
              <div className="rounded-xl border border-[color-mix(in_srgb,var(--kc-outline-variant)_30%,transparent)] bg-[var(--kc-surface-container-lowest)] p-10 shadow-sm">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--kc-primary-fixed)]">
                  <KcIcon name="diversity_3" className="text-[var(--kc-primary)]" />
                </div>
                <h2 className="kc-headline-md mb-4">Not sure where to start?</h2>
                <p className="kc-body-md mb-6 text-[var(--kc-on-surface-variant)]">
                  Wealth planning can feel overwhelming. We&apos;ll help guide you through the process with a focus on your
                  family&apos;s unique narrative and long-term values.
                </p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: "verified_user", label: "Fiduciary Standard" },
                    { icon: "workspace_premium", label: "Certified CPAs" },
                  ].map((badge) => (
                    <div
                      key={badge.label}
                      className="flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--kc-outline-variant)_20%,transparent)] bg-[var(--kc-background)] px-4 py-2"
                    >
                      <KcIcon name={badge.icon} className="text-sm text-[var(--kc-primary)]" />
                      <span className="kc-label-sm">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-[var(--kc-gutter)] md:grid-cols-2 lg:grid-cols-1">
                <div className="flex flex-col justify-between rounded-xl border border-[color-mix(in_srgb,var(--kc-outline-variant)_30%,transparent)] bg-[var(--kc-surface-container-lowest)] p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <KcIcon name="call" className="text-[var(--kc-primary)]" />
                      <div>
                        <p className="kc-label-sm mb-1 uppercase text-[var(--kc-primary)]">Direct Line</p>
                        <p className="kc-headline-md">{KC_PHONE}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <KcIcon name="mail" className="text-[var(--kc-primary)]" />
                      <div>
                        <p className="kc-label-sm mb-1 uppercase text-[var(--kc-primary)]">Concierge Email</p>
                        <p className="kc-headline-md">{KC_EMAIL}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl bg-[var(--kc-primary-container)] p-8 text-[var(--kc-on-primary-container)]">
                  <div className="relative z-10">
                    <div className="mb-8 flex items-start gap-4">
                      <KcIcon name="location_on" />
                      <div>
                        <p className="kc-label-sm mb-1 uppercase opacity-80">Main Office</p>
                        <p className="kc-body-lg">
                          {KC_ADDRESS.split(",")[0]},<br />
                          {KC_ADDRESS.split(",").slice(1).join(",").trim()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <KcIcon name="schedule" />
                      <div>
                        <p className="kc-label-sm mb-1 uppercase opacity-80">Hours of Service</p>
                        <p className="kc-body-md">Mon — Fri: 8:00 AM – 6:00 PM EST</p>
                        <p className="kc-body-md">Sat: By Private Appointment Only</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 scale-150 rotate-12 opacity-10">
                    <KcIcon name="account_balance" className="text-9xl" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[color-mix(in_srgb,var(--kc-outline-variant)_30%,transparent)] bg-[var(--kc-surface-container-lowest)] p-8 shadow-sm md:p-12 lg:col-span-7">
              <div className="mb-10">
                <h3 className="kc-headline-lg mb-2">Request a Private Consultation</h3>
                <p className="kc-body-md text-[var(--kc-on-surface-variant)]">
                  Please provide a few details so we can prepare for our initial conversation.
                </p>
              </div>
              <form id="kc-contact-form" className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 gap-[var(--kc-gutter)] md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="kc-label-sm text-[var(--kc-on-surface-variant)]" htmlFor="kc-name">
                      Full Name
                    </label>
                    <input className="kc-input-underline kc-body-md" id="kc-name" placeholder="Johnathan Miller" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="kc-label-sm text-[var(--kc-on-surface-variant)]" htmlFor="kc-email">
                      Email Address
                    </label>
                    <input className="kc-input-underline kc-body-md" id="kc-email" placeholder="j.miller@family.office" type="email" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-[var(--kc-gutter)] md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="kc-label-sm text-[var(--kc-on-surface-variant)]" htmlFor="kc-service">
                      Service of Interest
                    </label>
                    <select className="kc-input-underline kc-body-md appearance-none" id="kc-service" defaultValue="Legacy & Trust Planning">
                      <option>Legacy &amp; Trust Planning</option>
                      <option>Investment Management</option>
                      <option>Family Office Services</option>
                      <option>Tax Strategy</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="kc-label-sm text-[var(--kc-on-surface-variant)]" htmlFor="kc-phone">
                      Phone Number
                    </label>
                    <input className="kc-input-underline kc-body-md" id="kc-phone" placeholder="+1 (000) 000-0000" type="tel" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="kc-label-sm text-[var(--kc-on-surface-variant)]" htmlFor="kc-message">
                    How can we assist your family?
                  </label>
                  <textarea
                    className="kc-input-underline kc-body-md resize-none"
                    id="kc-message"
                    placeholder="Describe your current situation or goals..."
                    rows={4}
                  />
                </div>
                <div className="flex flex-col items-center justify-between gap-6 pt-4 md:flex-row">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-[var(--kc-primary-fixed)]">
                      <KcImg src={KC_IMG.contact.advisor} alt="Sarah Jenkins, Senior Client Partner" fill className="object-cover" sizes="40px" />
                    </div>
                    <div>
                      <p className="kc-label-sm">Sarah Jenkins</p>
                      <p className="text-[12px] text-[var(--kc-on-surface-variant)]">Senior Client Partner</p>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[var(--kc-primary)] px-10 py-4 kc-label-sm text-[var(--kc-on-primary)] transition-all hover:opacity-95 hover:shadow-lg active:scale-95 md:w-auto"
                  >
                    Request Call Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        </KcContainer>
      </section>

      <section className="mb-[var(--kc-stack-lg)]">
        <KcContainer>
          <div className="relative h-[400px] overflow-hidden rounded-xl border border-[var(--kc-outline-variant)] grayscale transition-all duration-700 hover:grayscale-0">
            <KcImg src={KC_IMG.contact.office} alt="Greenwich office building" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 flex items-center justify-center bg-[color-mix(in_srgb,var(--kc-primary)_10%,transparent)]">
              <div className="flex flex-col items-center rounded-xl bg-[var(--kc-surface-container-lowest)] p-6 shadow-xl">
                <KcIcon name="pin_drop" className="mb-2 text-4xl text-[var(--kc-primary)]" fill />
                <p className="kc-headline-md">Our Greenwich Office</p>
                <a
                  className="kc-label-sm mt-2 text-[var(--kc-primary)] hover:underline"
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </KcContainer>
      </section>

      <section className="bg-[var(--kc-surface-container)] py-24">
        <KcContainer className="text-center">
          <h4 className="kc-label-sm mb-12 uppercase tracking-[0.2em] text-[var(--kc-outline)]">
            Trusted by Over 500 Multi-Generational Families
          </h4>
          <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale md:gap-24">
            {["account_balance", "shield_with_heart", "family_history", "gavel", "receipt_long"].map((icon) => (
              <KcIcon key={icon} name={icon} className="text-5xl" />
            ))}
          </div>
        </KcContainer>
      </section>
    </main>
  );
}
