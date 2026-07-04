"use client";

import Link from "next/link";
import { VI_BUSINESS_HOURS, VI_OFFICES, VI_PATHS, viMapsSearchUrl } from "./valleyInterlockingConfig";
import { ViContainer, ViIcon } from "./ValleyInterlockingShared";
import { ValleyInterlockingContactForm } from "./ValleyInterlockingContactForm";
import { useViFormLabelFocus, useViNavScroll } from "./useViEffects";

export function ValleyInterlockingContactBody() {
  useViNavScroll();
  useViFormLabelFocus("vi-contact-form");

  return (
    <main id="contact" className="pt-[var(--vi-nav-height)]">
      <section className="vi-hero-under-nav vi-hero-under-nav--form relative flex min-h-[min(435px,50dvh)] items-center bg-[var(--vi-surface-container-low)] pb-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="max-w-3xl">
            <h1 className="vi-display-lg mb-6 leading-tight text-[var(--vi-primary)]">Get in Touch</h1>
            <p className="vi-body-lg text-[var(--vi-on-surface-variant)]">
              Transforming your outdoor living space begins with a conversation. Reach out to our expert team in Toronto
              or Edmonton to discuss your vision.
            </p>
          </div>
        </ViContainer>
      </section>

      <section className="py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="grid grid-cols-1 items-start gap-[var(--vi-stack-lg)] lg:grid-cols-12">
            <div className="space-y-[var(--vi-stack-lg)] lg:col-span-5">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
                {VI_OFFICES.map((office) => (
                  <div
                    key={office.id}
                    className="rounded-xl border border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)] bg-[var(--vi-surface-container-lowest)] p-6 vi-ambient-shadow"
                  >
                    <h3 className="vi-headline-md mb-6 flex items-center gap-1 text-[var(--vi-primary)]">
                      <ViIcon name="location_on" className="text-[var(--vi-secondary)]" />
                      {office.name}
                    </h3>
                    <div className="space-y-3 text-[var(--vi-on-surface-variant)]">
                      <p className="flex items-start gap-3">
                        <ViIcon name="map" className="text-[var(--vi-outline)]" />
                        <span>
                          {office.address[0]}
                          <br />
                          {office.address[1]}
                        </span>
                      </p>
                      <p className="flex items-center gap-3">
                        <ViIcon name="call" className="text-[var(--vi-outline)]" />
                        <a href={office.phoneHref} className="transition-colors hover:text-[var(--vi-primary)]">
                          {office.phone}
                        </a>
                      </p>
                      <p className="flex items-center gap-3">
                        <ViIcon name="mail" className="text-[var(--vi-outline)]" />
                        <a href={`mailto:${office.email}`} className="transition-colors hover:text-[var(--vi-primary)]">
                          {office.email}
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href={VI_PATHS.theTeam}
                className="inline-flex w-full min-h-[2.75rem] items-center justify-center gap-2 rounded-lg border-2 border-[var(--vi-primary)] bg-white px-8 py-3 vi-label-md text-[var(--vi-primary)] transition-all hover:bg-[var(--vi-primary)] hover:text-[var(--vi-on-primary)]"
              >
                <ViIcon name="groups" aria-hidden="true" />
                Meet the Team
              </Link>

              <div className="rounded-xl bg-[var(--vi-surface-container)] p-6">
                <h3 className="vi-headline-md mb-6 flex items-center gap-1 text-[var(--vi-primary)]">
                  <ViIcon name="schedule" className="text-[var(--vi-secondary)]" />
                  Business Hours
                </h3>
                <div className="space-y-3">
                  {VI_BUSINESS_HOURS.map((row) => (
                    <div
                      key={row.day}
                      className={`flex justify-between gap-4 border-b border-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] pb-1 ${
                        row.day === "Sunday" ? "border-b-0" : ""
                      }`}
                    >
                      <span className="vi-label-md">{row.day}</span>
                      <span
                        className={
                          row.day === "Sunday"
                            ? "font-bold text-[var(--vi-secondary)]"
                            : "text-[var(--vi-on-surface-variant)]"
                        }
                      >
                        {row.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-xl border border-[color-mix(in_srgb,var(--vi-outline-variant)_10%,transparent)] bg-[var(--vi-surface-container-lowest)] p-6 vi-ambient-shadow sm:p-8 lg:p-12">
                <h3 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">Quick Contact Form</h3>
                <p className="mb-12 text-[var(--vi-on-surface-variant)]">
                  Have a specific project in mind? Fill out the form below and our regional consultant will contact you
                  within 24 hours.
                </p>
                <ValleyInterlockingContactForm />
              </div>

              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                {VI_OFFICES.map((office) => (
                  <a
                    key={`map-${office.id}`}
                    href={viMapsSearchUrl(office.mapLocation)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vi-map-tile group relative block h-64 overflow-hidden rounded-xl vi-ambient-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vi-primary)]"
                    aria-label={`${office.mapLabel} — opens in Google Maps`}
                  >
                    <div className="h-full w-full bg-[var(--vi-surface-variant)] transition-colors group-hover:bg-[color-mix(in_srgb,var(--vi-primary)_15%,var(--vi-surface-variant))]" />
                    <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-6 py-1 vi-label-sm text-[var(--vi-primary)] shadow-sm backdrop-blur-md">
                      {office.mapLabel}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </ViContainer>
      </section>
    </main>
  );
}
