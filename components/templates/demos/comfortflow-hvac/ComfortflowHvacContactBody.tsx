"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CFH_CONTACT } from "./comfortflowHvacSiteContent";
import { cfhImage } from "./comfortflowHvacImages";
import { CfhContainer, CfhIcon, CfhImg } from "./ComfortflowHvacShared";

type FormValues = Record<string, string>;

export function ComfortflowHvacContactBody() {
  const { hero, form, contactCards, emergencyBanner } = CFH_CONTACT;
  const [values, setValues] = useState<FormValues>(() =>
    Object.fromEntries(form.fields.map((field) => [field.name, ""])),
  );
  const [submitted, setSubmitted] = useState(false);

  function handleChange(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main id="cfh-main-content" className="cfh-main overflow-x-hidden">
      <section className="cfh-section-py cfh-technical-pattern">
        <CfhContainer>
          <div className="mx-auto max-w-2xl text-center">
            <span className="cfh-label-caps mb-4 block text-[var(--cfh-secondary)]">{hero.eyebrow}</span>
            <h1 className="cfh-display cfh-gradient-text mb-4">{hero.title}</h1>
            <p className="cfh-body-lg text-[var(--cfh-on-surface-variant)]">{hero.body}</p>
          </div>
        </CfhContainer>
      </section>

      <section className="pb-16">
        <CfhContainer>
          <div className="grid grid-cols-1 gap-[var(--cfh-gutter)] lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="cfh-glass-card rounded-2xl p-6 md:p-8">
                {submitted ? (
                  <div
                    className="rounded-xl border border-[var(--cfh-secondary)]/30 bg-[var(--cfh-secondary-fixed)]/20 p-8 text-center"
                    role="status"
                  >
                    <CfhIcon name="check_circle" className="mb-4 text-5xl text-[var(--cfh-secondary)]" />
                    <h2 className="cfh-headline-md mb-2 text-[var(--cfh-primary)]">Booking Request Received</h2>
                    <p className="cfh-body-md text-[var(--cfh-on-surface-variant)]">
                      This is a demo form — no data was sent. Our dispatch team would contact you at{" "}
                      {values.email || "your email"} to confirm your service window.
                    </p>
                    <button
                      type="button"
                      className="cfh-interactive mt-6 text-sm font-bold text-[var(--cfh-secondary)] underline"
                      onClick={() => setSubmitted(false)}
                    >
                      Submit another request
                    </button>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {form.fields.map((field) => (
                        <div
                          key={field.name}
                          className={field.type === "select" || field.name === "preferredDate" ? "" : ""}
                        >
                          <label
                            htmlFor={`cfh-${field.name}`}
                            className="cfh-label-caps mb-2 block text-[var(--cfh-on-surface-variant)]"
                          >
                            {field.label}
                            {field.required ? (
                              <span className="text-[var(--cfh-error)]" aria-hidden>
                                {" "}
                                *
                              </span>
                            ) : null}
                            {field.required ? <span className="sr-only"> (required)</span> : null}
                          </label>
                          {field.type === "select" ? (
                            <select
                              id={`cfh-${field.name}`}
                              name={field.name}
                              required={field.required}
                              value={values[field.name]}
                              onChange={(e) => handleChange(field.name, e.target.value)}
                              className="w-full rounded-lg border border-[var(--cfh-outline-variant)] bg-[var(--cfh-surface-container-lowest)] px-4 py-3 cfh-body-md text-[var(--cfh-on-surface)] outline-none focus:border-[var(--cfh-secondary)]"
                            >
                              <option value="">Select…</option>
                              {"options" in field && field.options
                                ? field.options.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))
                                : null}
                            </select>
                          ) : (
                            <input
                              id={`cfh-${field.name}`}
                              name={field.name}
                              type={field.type}
                              required={field.required}
                              value={values[field.name]}
                              onChange={(e) => handleChange(field.name, e.target.value)}
                              autoComplete={
                                field.name === "email"
                                  ? "email"
                                  : field.name === "phone"
                                    ? "tel"
                                    : field.name === "fullName"
                                      ? "name"
                                      : undefined
                              }
                              className="w-full rounded-lg border border-[var(--cfh-outline-variant)] bg-[var(--cfh-surface-container-lowest)] px-4 py-3 cfh-body-md text-[var(--cfh-on-surface)] outline-none focus:border-[var(--cfh-secondary)]"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="cfh-interactive w-full rounded-lg bg-[var(--cfh-secondary)] px-8 py-4 font-bold text-[var(--cfh-on-secondary)] transition-opacity hover:opacity-90"
                    >
                      {form.submitLabel}
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="space-y-[var(--cfh-gutter)] lg:col-span-5">
              {contactCards.map((card) => (
                <div key={card.title} className="cfh-glass-card rounded-2xl p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <CfhIcon name={card.icon} className="text-2xl text-[var(--cfh-brand-indigo)]" />
                    <h2 className="cfh-headline-md text-lg text-[var(--cfh-primary)]">{card.title}</h2>
                  </div>
                  <ul className="space-y-1">
                    {card.lines.map((line) => (
                      <li key={line} className="cfh-body-md text-[var(--cfh-on-surface-variant)]">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </CfhContainer>
      </section>

      <section className="pb-16">
        <CfhContainer>
          <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-[var(--cfh-outline-variant)]/40">
            <CfhImg
              src={cfhImage("serviceMap")}
              alt="ComfortFlow service area map across the Greater Toronto Area"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </CfhContainer>
      </section>

      <section className="pb-16">
        <CfhContainer>
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--cfh-error)]/30 bg-[var(--cfh-error-container)]/30 p-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-4">
              <CfhIcon name={emergencyBanner.icon} className="text-4xl text-[var(--cfh-error)]" fill />
              <div>
                <h2 className="cfh-headline-md text-[var(--cfh-error)]">{emergencyBanner.title}</h2>
                <p className="cfh-body-md text-[var(--cfh-on-surface-variant)]">{emergencyBanner.body}</p>
              </div>
            </div>
            <Link
              href={emergencyBanner.cta.href}
              className="cfh-interactive shrink-0 rounded-lg bg-[var(--cfh-error)] px-6 py-3 font-bold text-[var(--cfh-on-error)]"
            >
              {emergencyBanner.cta.label}
            </Link>
          </div>
        </CfhContainer>
      </section>
    </main>
  );
}
