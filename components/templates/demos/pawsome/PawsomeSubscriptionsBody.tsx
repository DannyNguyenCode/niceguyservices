"use client";

import Link from "next/link";
import { PS_PATHS } from "./pawsomeConfig";
import { PS_SUBSCRIPTIONS } from "./pawsomeData";
import { PsBadge, PsIcon, PsPageWrap } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

export function PawsomeSubscriptionsBody() {
  return (
    <main className="py-8 md:py-12">
      <PsPageWrap>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[var(--ps-primary)] md:text-4xl" style={headline}>
            Manage subscriptions
          </h1>
          <p className="mt-2 text-[var(--ps-on-surface-variant)]">
            Pause, skip, or adjust delivery for Luna and Oliver — fictional demo plans.
          </p>
        </div>

        <ul className="space-y-6">
          {PS_SUBSCRIPTIONS.map((sub) => (
            <li
              key={sub.id}
              className="overflow-hidden rounded-xl bg-[var(--ps-surface-container-lowest)] shadow-[var(--ps-shadow)]"
            >
              <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sub.image}
                  alt=""
                  className="h-32 w-full rounded-xl object-cover md:h-28 md:w-40"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <PsBadge variant="secondary">{sub.pet}</PsBadge>
                    {sub.status ? (
                      <span className="text-xs font-semibold text-[var(--ps-secondary)]">{sub.status}</span>
                    ) : null}
                  </div>
                  <h2 className="mt-2 text-xl font-semibold text-[var(--ps-primary)]" style={headline}>
                    {sub.label}
                  </h2>
                  <p className="text-sm text-[var(--ps-on-surface-variant)]">{sub.product}</p>
                  <p className="mt-2 text-sm">
                    <span className="font-semibold text-[var(--ps-primary)]">{sub.frequency}</span>
                    <span className="text-[var(--ps-on-surface-variant)]"> · Next: {sub.nextDate}</span>
                  </p>
                  {sub.streak ? (
                    <p className="mt-1 text-xs text-[var(--ps-on-tertiary-container)]">
                      {sub.streak} streak · Saved {sub.savings} total
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col">
                  <button
                    type="button"
                    className="rounded-xl bg-[var(--ps-surface-container-high)] px-5 py-2.5 text-sm font-semibold text-[var(--ps-primary)]"
                  >
                    Skip delivery
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-[var(--ps-outline-variant)] px-5 py-2.5 text-sm font-semibold text-[var(--ps-on-surface-variant)]"
                  >
                    Edit plan
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-xl bg-[color-mix(in_srgb,var(--ps-secondary-container)_12%,transparent)] p-6">
          <div className="flex items-start gap-4">
            <PsIcon name="autorenew" className="text-3xl text-[var(--ps-secondary)]" />
            <div>
              <h3 className="font-semibold text-[var(--ps-primary)]" style={headline}>
                Subscribe &amp; save 15%
              </h3>
              <p className="mt-1 text-sm text-[var(--ps-on-surface-variant)]">
                Add another pet plan from the shop and earn bonus points on every refill.
              </p>
              <Link href={PS_PATHS.shop} className="mt-3 inline-block text-sm font-semibold text-[var(--ps-secondary)]">
                Browse shop →
              </Link>
            </div>
          </div>
        </div>
      </PsPageWrap>
    </main>
  );
}
