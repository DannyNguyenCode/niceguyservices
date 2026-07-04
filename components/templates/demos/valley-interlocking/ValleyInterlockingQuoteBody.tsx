"use client";

import Link from "next/link";
import { VI_PATHS } from "./valleyInterlockingConfig";
import { VI_QUOTE_NEXT_STEPS } from "./valleyInterlockingData";
import { ViContainer, ViIcon } from "./ValleyInterlockingShared";
import { ValleyInterlockingQuoteForm } from "./ValleyInterlockingQuoteForm";
import { useViFormLabelFocus, useViNavScroll } from "./useViEffects";

const SUPPORT_PHONE = "1-800-825-5391";

export function ValleyInterlockingQuoteBody() {
  useViNavScroll();
  useViFormLabelFocus("vi-quote-form");

  return (
    <main id="vi-quote-main" className="pt-[var(--vi-nav-height)]">
      <section
        className="vi-hero-under-nav vi-hero-under-nav--form relative flex min-h-[min(435px,50dvh)] items-center bg-[var(--vi-surface-container-low)] pb-[var(--vi-stack-lg)]"
        aria-labelledby="vi-quote-hero-title"
      >
        <ViContainer>
          <div className="max-w-3xl">
            <h1 id="vi-quote-hero-title" className="vi-display-lg mb-6 leading-tight text-[var(--vi-primary)]">
              Let&apos;s Craft Your Outdoor Legacy
            </h1>
            <p className="vi-body-lg text-[var(--vi-on-surface-variant)]">
              Start your journey toward a breathtaking outdoor space today. Follow our simple process to receive a
              detailed, personalized quote.
            </p>
          </div>
        </ViContainer>
      </section>

      <section className="py-12 md:py-16 lg:py-[var(--vi-stack-lg)]" aria-labelledby="vi-quote-form-heading">
        <ViContainer>
          <h2 id="vi-quote-form-heading" className="vi-sr-only">
            Request A Quote
          </h2>
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:col-span-8">
              <ValleyInterlockingQuoteForm />
            </div>
            <aside className="min-w-0 lg:col-span-4" aria-labelledby="vi-quote-next-steps">
              <div className="rounded-xl border border-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] bg-[var(--vi-surface-container-low)] p-6 sm:p-8 lg:sticky lg:top-[calc(var(--vi-nav-height)+1.5rem)] lg:p-12">
                <h3 id="vi-quote-next-steps" className="vi-headline-md mb-8 text-[var(--vi-primary)] sm:mb-12">
                  What Happens Next?
                </h3>
                <div className="relative">
                  <div className="absolute bottom-0 left-[15px] top-0 w-0.5 bg-[var(--vi-secondary-container)]" aria-hidden="true" />
                  <ol className="space-y-8 sm:space-y-10 lg:space-y-12">
                    {VI_QUOTE_NEXT_STEPS.map((step) => (
                      <li key={step.title} className="relative flex items-start gap-4 sm:gap-6">
                      <div
                        className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          "highlight" in step && step.highlight
                            ? "bg-[var(--vi-primary)] text-[var(--vi-on-primary)]"
                            : "border-2 border-[var(--vi-secondary)] bg-white text-[var(--vi-secondary)]"
                        }`}
                        aria-hidden="true"
                      >
                        <ViIcon name={step.icon} className="text-base" fill />
                      </div>
                      <div>
                        <p className="vi-label-md text-[var(--vi-on-surface)]">{step.title}</p>
                        <p className="vi-body-md text-sm text-[var(--vi-on-surface-variant)]">{step.description}</p>
                      </div>
                    </li>
                    ))}
                  </ol>
                </div>
                <div className="mt-8 rounded-xl border border-[color-mix(in_srgb,var(--vi-tertiary)_20%,transparent)] bg-white p-4 sm:mt-12 sm:p-6">
                  <p className="vi-label-md mb-2 text-[var(--vi-primary)]">Need immediate help?</p>
                  <a
                    href={`tel:${SUPPORT_PHONE.replace(/\D/g, "")}`}
                    className="inline-flex min-h-[2.75rem] items-center gap-3 text-[var(--vi-on-surface-variant)] transition-colors hover:text-[var(--vi-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vi-primary)]"
                  >
                    <ViIcon name="phone" className="text-[var(--vi-secondary)]" aria-hidden="true" />
                    <span className="text-sm">
                      Call us: <span className="whitespace-nowrap">1-800-VALLEY-1</span>
                    </span>
                  </a>
                </div>
                <Link
                  href={VI_PATHS.theTeam}
                  className="mt-6 inline-flex w-full min-h-[2.75rem] items-center justify-center gap-2 rounded-lg border-2 border-[var(--vi-primary)] bg-white px-6 py-3 vi-label-md text-[var(--vi-primary)] transition-all hover:bg-[var(--vi-primary)] hover:text-[var(--vi-on-primary)]"
                >
                  <ViIcon name="groups" aria-hidden="true" />
                  Meet the Team
                </Link>
              </div>
            </aside>
          </div>
        </ViContainer>
      </section>
    </main>
  );
}
