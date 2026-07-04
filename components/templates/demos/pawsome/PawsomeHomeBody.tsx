"use client";

import Link from "next/link";
import { PS_IMAGES } from "./pawsomeImages";
import { PS_PATHS } from "./pawsomeConfig";
import { PS_POINTS, PS_PRODUCTS, PS_RESOURCES } from "./pawsomeData";
import { PawsomeProductCard } from "./PawsomeProductCard";
import {
  PsBadge,
  PsIcon,
  PsPageWrap,
  PsPrimaryButton,
  PsProgressBar,
  PsSecondaryButton,
} from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

const CATEGORIES = [
  { label: "Dogs", image: PS_IMAGES.dogCategory, href: PS_PATHS.shop },
  { label: "Cats", image: PS_IMAGES.catCategory, href: PS_PATHS.shopLuna },
];

const REWARD_TRACK = [
  { level: 1, label: "Welcome Treat", points: 0, unlocked: true },
  { level: 2, label: "Free Shipping", points: 500, unlocked: true },
  { level: 3, label: "15% Off", points: 1000, unlocked: false, current: true },
  { level: 4, label: "VIP Box", points: 2000, unlocked: false },
];

const TRUST_BADGES = [
  { icon: "verified", label: "Vet Approved" },
  { icon: "eco", label: "Sustainably Sourced" },
  { icon: "local_shipping", label: "Free Shipping $75+" },
  { icon: "support_agent", label: "24/7 Pet Support" },
];

export function PawsomeHomeBody() {
  return (
    <main className="py-8 md:py-12">
      <PsPageWrap>
        {/* Hero */}
        <section className="mb-16 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <PsBadge variant="secondary">Premium Pet Wellness</PsBadge>
            <h1
              className="text-3xl font-bold tracking-tight text-[var(--ps-primary)] md:text-5xl md:leading-tight"
              style={headline}
            >
              Wellness curated for every companion
            </h1>
            <p className="max-w-lg text-lg text-[var(--ps-on-surface-variant)]">
              Personalized nutrition, rewards, and expert resources — all in one fictional demo
              ecosystem built for modern pet parents.
            </p>
            <div className="flex flex-wrap gap-3">
              <PsPrimaryButton href={PS_PATHS.shop}>Shop Now</PsPrimaryButton>
              <PsSecondaryButton href={PS_PATHS.rewards}>View Rewards</PsSecondaryButton>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[var(--ps-shadow-lg)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PS_IMAGES.heroHome} alt="" className="h-full w-full object-cover" />
          </div>
        </section>

        {/* Points bar */}
        <section className="mb-16 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col items-center gap-8 rounded-xl border border-white/40 bg-[var(--ps-surface-container-lowest)] p-8 shadow-[var(--ps-shadow)] md:flex-row lg:col-span-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PS_IMAGES.lunaProfile}
              alt=""
              className="h-24 w-24 rounded-full border-4 border-[color-mix(in_srgb,var(--ps-secondary)_20%,transparent)] object-cover"
            />
            <div className="flex-1 space-y-3 text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ps-secondary)]">
                {PS_POINTS.tier} Member
              </p>
              <h2 className="text-2xl font-bold text-[var(--ps-primary)]" style={headline}>
                {PS_POINTS.balance.toLocaleString()} Points
              </h2>
              <p className="text-sm text-[var(--ps-on-surface-variant)]">
                {PS_POINTS.pointsToNext} points to {PS_POINTS.nextTier}
              </p>
              <PsProgressBar value={PS_POINTS.progress} />
            </div>
            <Link
              href={PS_PATHS.rewards}
              className="rounded-xl bg-[var(--ps-secondary)] px-6 py-3 text-sm font-semibold text-[var(--ps-on-secondary)]"
            >
              Redeem
            </Link>
          </div>
          <div className="rounded-xl bg-[var(--ps-primary-container)] p-8 text-[var(--ps-on-primary)] lg:col-span-4">
            <PsIcon name="local_fire_department" filled className="text-3xl text-[var(--ps-tertiary-fixed-dim)]" />
            <p className="mt-4 text-sm opacity-80">Delivery streak</p>
            <p className="text-3xl font-bold" style={headline}>
              8 Months
            </p>
            <p className="mt-2 text-sm opacity-70">Keep ordering to unlock bonus rewards</p>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[var(--ps-primary)] md:text-3xl" style={headline}>
              Shop by Companion
            </h2>
            <Link href={PS_PATHS.shop} className="text-sm font-semibold tracking-wide text-[var(--ps-secondary)] hover:underline">
              View All
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 ps-hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group min-w-[200px] flex-1 overflow-hidden rounded-xl bg-[var(--ps-surface-container-lowest)] shadow-[var(--ps-shadow)] transition-all hover:-translate-y-1 hover:shadow-[var(--ps-shadow-lg)]"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="p-4 text-center font-semibold text-[var(--ps-primary)]" style={headline}>
                  {cat.label}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Bento products */}
        <section className="mb-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[var(--ps-primary)] md:text-3xl" style={headline}>
              Trending Essentials
            </h2>
            <Link href={PS_PATHS.shop} className="text-sm font-semibold text-[var(--ps-secondary)] hover:underline">
              Browse Shop
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PS_PRODUCTS.slice(0, 4).map((p) => (
              <PawsomeProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Rewards track */}
        <section className="mb-20">
          <div className="relative overflow-hidden rounded-3xl bg-[var(--ps-primary-container)] p-8 md:p-12">
            <h2 className="mb-8 text-2xl font-semibold text-white md:text-3xl" style={headline}>
              Pawsome Pass: Rewards Track
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 ps-hide-scrollbar snap-x">
              {REWARD_TRACK.map((tier) => (
                <div
                  key={tier.level}
                  className={`min-w-[160px] snap-start rounded-xl p-5 ${
                    tier.current
                      ? "bg-[var(--ps-secondary)] text-[var(--ps-on-secondary)] ring-2 ring-[var(--ps-secondary-container)]"
                      : tier.unlocked
                        ? "bg-[var(--ps-surface-container-lowest)] text-[var(--ps-primary)]"
                        : "bg-[var(--ps-surface-container-lowest)]/20 text-white/60"
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider">Level {tier.level}</p>
                  <p className="mt-2 font-semibold" style={headline}>
                    {tier.label}
                  </p>
                  <p className="mt-1 text-xs opacity-70">{tier.points} pts</p>
                  {tier.unlocked ? (
                    <PsIcon name="check_circle" filled className="mt-3 text-[var(--ps-secondary)]" />
                  ) : tier.current ? (
                    <span className="mt-3 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">
                      Current
                    </span>
                  ) : (
                    <PsIcon name="lock" className="mt-3 opacity-50" />
                  )}
                </div>
              ))}
            </div>
            <Link
              href={PS_PATHS.rewards}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ps-secondary-container)] hover:underline"
            >
              View full dashboard <PsIcon name="arrow_forward" className="text-sm" />
            </Link>
          </div>
        </section>

        {/* Resource preview */}
        <section className="mb-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[var(--ps-primary)] md:text-3xl" style={headline}>
              Latest Resources
            </h2>
            <Link href={PS_PATHS.resources} className="text-sm font-semibold text-[var(--ps-secondary)] hover:underline">
              Resource Center
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PS_RESOURCES.map((r) => (
              <Link
                key={r.title}
                href={PS_PATHS.resources}
                className="group overflow-hidden rounded-xl bg-[var(--ps-surface-container-lowest)] shadow-[var(--ps-shadow)] transition-all hover:-translate-y-1 hover:shadow-[var(--ps-shadow-lg)]"
              >
                <div className="aspect-video overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <PsBadge variant="secondary">{r.category}</PsBadge>
                  <h3 className="mt-2 line-clamp-2 font-semibold text-[var(--ps-primary)]" style={headline}>
                    {r.title}
                  </h3>
                  <p className="mt-2 text-xs text-[var(--ps-on-surface-variant)]">
                    {r.readTime} · +{r.points} pts
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trust badges */}
        <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {TRUST_BADGES.map((b) => (
            <div
              key={b.label}
              className="flex flex-col items-center gap-2 rounded-xl bg-[var(--ps-surface-container-low)] p-6 text-center"
            >
              <PsIcon name={b.icon} className="text-2xl text-[var(--ps-secondary)]" />
              <span className="text-xs font-semibold text-[var(--ps-on-surface-variant)]">{b.label}</span>
            </div>
          ))}
        </section>
      </PsPageWrap>
    </main>
  );
}
