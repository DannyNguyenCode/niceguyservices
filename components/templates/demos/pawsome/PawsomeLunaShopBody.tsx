"use client";

import Link from "next/link";
import { PS_IMAGES } from "./pawsomeImages";
import { PS_PATHS } from "./pawsomeConfig";
import { PS_LUNA_RECOMMENDATIONS, PS_POINTS } from "./pawsomeData";
import { PawsomeProductCard } from "./PawsomeProductCard";
import { PsIcon, PsPageWrap, PsProgressBar } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

export function PawsomeLunaShopBody() {
  return (
    <main className="py-8 md:py-12">
      <PsPageWrap>
        <section className="mb-12 overflow-hidden rounded-3xl bg-[var(--ps-surface-container-lowest)] p-8 shadow-[var(--ps-shadow)] md:p-12">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PS_IMAGES.lunaProfile}
              alt=""
              className="h-32 w-32 rounded-full border-4 border-[color-mix(in_srgb,var(--ps-secondary)_20%,transparent)] object-cover"
            />
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ps-secondary)]">
                Personalized for
              </p>
              <h1 className="mt-2 text-3xl font-bold text-[var(--ps-primary)] md:text-4xl" style={headline}>
                Luna&apos;s Shop
              </h1>
              <p className="mt-2 max-w-lg text-[var(--ps-on-surface-variant)]">
                Curated picks based on Luna&apos;s age, dietary goals, and wellness profile — fictional demo
                recommendations only.
              </p>
              <div className="mt-6 max-w-md">
                <div className="mb-2 flex justify-between text-xs font-semibold">
                  <span className="text-[var(--ps-on-surface-variant)]">Profile match</span>
                  <span className="text-[var(--ps-secondary)]">98%</span>
                </div>
                <PsProgressBar value={98} />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[var(--ps-primary)]" style={headline}>
            Recommended for Luna
          </h2>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--ps-on-surface-variant)]">
            <input type="checkbox" defaultChecked className="accent-[var(--ps-secondary)]" />
            Auto-recommend
          </label>
        </section>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PS_LUNA_RECOMMENDATIONS.map((product) => (
            <PawsomeProductCard key={product.id} product={product} layout="compact" />
          ))}
        </div>

        <section className="mt-12 rounded-xl bg-[var(--ps-tertiary-fixed)] p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--ps-on-tertiary-fixed)]">
                {PS_POINTS.balance.toLocaleString()} points available
              </p>
              <p className="mt-1 text-xs text-[var(--ps-on-tertiary-fixed)] opacity-80">
                Redeem on Luna&apos;s next order
              </p>
            </div>
            <Link
              href={PS_PATHS.rewards}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--ps-primary)] px-6 py-3 text-sm font-semibold text-[var(--ps-on-primary)]"
            >
              View rewards <PsIcon name="arrow_forward" className="text-sm" />
            </Link>
          </div>
        </section>
      </PsPageWrap>
    </main>
  );
}
