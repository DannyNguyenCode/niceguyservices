"use client";

import { BoltIcon, ClockIcon, ShieldCheckIcon, UserIcon } from "@heroicons/react/24/outline";
import { ComicHeroHouse } from "./ComicHeroHouse";
import { SparkButton } from "./SparkButton";
import { TextureOverlay } from "./TextureOverlays";
import { LAS_HOME } from "./leaveASparkSiteContent";

const HERO_TRUST = [
  { icon: ShieldCheckIcon, label: "LICENSED", sub: "& INSURED" },
  { icon: BoltIcon, label: "QUALITY", sub: "CRAFTSMANSHIP" },
  { icon: ClockIcon, label: "ON TIME", sub: "EVERY TIME" },
  { icon: UserIcon, label: "BUILT ON", sub: "TRUST" },
] as const;

export function HeroSection() {
  const { hero } = LAS_HOME;

  return (
    <section className="relative overflow-x-clip pt-[4.5rem] lg:min-h-dvh">
      <TextureOverlay className="las-container pb-16 pt-8 lg:px-12 lg:pb-16" grain ink>
        <div className="las-hero-grid gap-10 lg:gap-8">
          {/* LEFT — headline, CTAs, trust */}
          <div className="las-hero-content relative z-10 lg:pt-6">
            <h1 className="las-display max-w-xl text-[clamp(2.25rem,8.5vw,5.25rem)] leading-[0.88] sm:text-[clamp(2.5rem,7vw,5.5rem)] lg:text-[clamp(2.75rem,5.5vw,5.75rem)]">
              <span className="block text-[var(--las-off-white)]">{hero.headline.line1}</span>
              <span className="block text-[var(--las-off-white)]">{hero.headline.line2}</span>
              <span className="block text-[var(--las-red)]">{hero.headline.accent}</span>
            </h1>

            <p className="las-body mt-8 max-w-md text-base leading-relaxed text-[var(--las-off-white)]/80">
              {hero.body}
            </p>

            <div className="las-btn-stack mt-8">
              <SparkButton href={hero.primaryCTA.href}>{hero.primaryCTA.label}</SparkButton>
              <SparkButton href={hero.secondaryCTA.href} variant="secondary">
                {hero.secondaryCTA.label}
              </SparkButton>
            </div>

            <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-4">
              {HERO_TRUST.map(({ icon: Icon, label, sub }) => (
                <li key={label} className="flex items-center gap-3">
                  <Icon className="h-6 w-6 shrink-0 text-[var(--las-red)]" strokeWidth={2} aria-hidden />
                  <div className="las-hero-trust-label">
                    {label}
                    <br />
                    {sub}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="las-hero-visual relative w-full max-lg:mx-auto max-lg:max-w-xl lg:pr-2 xl:pr-4">
            <ComicHeroHouse />
          </div>
        </div>
      </TextureOverlay>
    </section>
  );
}
