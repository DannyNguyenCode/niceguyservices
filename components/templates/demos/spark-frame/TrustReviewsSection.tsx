"use client";

import {
  ShieldCheckIcon,
  MapPinIcon,
  ClockIcon,
  DocumentCheckIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { LasSectionHeading } from "./LasSectionHeading";
import { LAS_HOME } from "./leaveASparkSiteContent";

const TRUST_ICONS = {
  badge: DocumentCheckIcon,
  shield: ShieldCheckIcon,
  warranty: ShieldCheckIcon,
  map: MapPinIcon,
  emergency: PhoneIcon,
  clock: ClockIcon,
} as const;

export function TrustReviewsSection() {
  const { trust } = LAS_HOME;

  return (
    <section className="bg-[var(--las-bg-secondary)] las-section-py">
      <div className="las-container">
        <LasSectionHeading title={trust.title} accent={trust.titleAccent} className="mb-10" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {trust.reviews.map((review, i) => (
            <article
              key={review.author}
              className={`las-review-insert relative ${i === 1 ? "lg:mt-6" : i === 2 ? "lg:-mt-4" : ""}`}
            >
              <span className="las-quote-mark" aria-hidden>
                &ldquo;
              </span>
              <p className="las-body mt-2 text-[0.9375rem] leading-relaxed">{review.quote}</p>
              <footer className="mt-4 border-t border-[#ccc] pt-3">
                <p className="las-label text-[#333]">{review.author}</p>
                <p className="las-body text-[0.8125rem] text-[#666]">{review.location}</p>
                <p className="sr-only">{review.rating} out of 5 stars</p>
                <div className="mt-1 flex gap-0.5" aria-hidden>
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <span key={j} className="text-[var(--las-red)]">
                      ★
                    </span>
                  ))}
                </div>
              </footer>
            </article>
          ))}
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {trust.indicators.map((item) => {
            const Icon = TRUST_ICONS[item.icon as keyof typeof TRUST_ICONS] ?? ShieldCheckIcon;
            return (
              <li
                key={item.label}
                className="flex items-start gap-3 border border-[var(--las-divider)] bg-[var(--las-surface-raised)] p-4"
              >
                <Icon className="h-5 w-5 shrink-0 text-[var(--las-red)]" aria-hidden />
                <div>
                  <p className="las-label text-[var(--las-off-white)]">{item.label}</p>
                  <p className="las-body mt-0.5 text-[0.75rem] text-[var(--las-muted)]">{item.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
