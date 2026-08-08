import Image from "next/image";
import PixelCtaLink from "@/components/ui/PixelCtaLink";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  HOME_HERO_EXPECTATION,
  HOME_HERO_PRIMARY_CTA,
  HOME_HERO_SECONDARY_CTA,
} from "@/components/homepage/homepageHeroContent";

export {
  HOME_HERO_EXPECTATION,
  HOME_HERO_HEADING,
  HOME_HERO_PRIMARY_CTA,
  HOME_HERO_SECONDARY_CTA,
} from "@/components/homepage/homepageHeroContent";

export default function HomeHero() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 ng-grid-bg opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 hidden h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl dark:block"
        style={{ background: "radial-gradient(closest-side, var(--ng-hero-glow), transparent)" }}
        aria-hidden
      />

      <section
        className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-14 px-6 pb-24 pt-8 lg:grid-cols-12 lg:gap-6 lg:px-10 lg:pt-14"
        aria-labelledby="home-hero-heading"
      >
        <div className="lg:col-span-5">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--ng-border)] bg-white/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--ng-heading)] backdrop-blur dark:bg-white/5">
            <Sparkles className="h-3 w-3" aria-hidden />
            Websites, pixel by pixel
          </div>

          {/*
            Word boundary between “Websites” and “That” is a real space in the DOM
            (before the visual line break) so textContent / accessible name stay correct.
          */}
          <h1
            id="home-hero-heading"
            className="font-pixel text-[44px] font-extrabold capitalize leading-[0.98] tracking-tight text-[color:var(--ng-heading)] sm:text-[54px] lg:text-[64px]"
          >
            We Build{" "}
            <span className="pixel-word ng-pixel-word-highlight">Websites</span>
            {" "}
            <br aria-hidden="true" />
            That Grow{" "}
            <span className="pixel-word ng-pixel-word-base">Businesses</span>
          </h1>

          <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-[color:var(--ng-body)]">
            A tiny Toronto studio obsessed with craft. We build fast, thoughtful
            websites that convert visitors into customers — one deliberate
            decision at a time.
          </p>

          <div className="mt-10 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              <PixelCtaLink
                href={HOME_HERO_PRIMARY_CTA.href}
                color="var(--ng-btn-coral)"
                fill="var(--ng-btn-coral)"
                textColor="var(--ng-btn-text)"
                filled
                className="group"
              >
                {HOME_HERO_PRIMARY_CTA.label}
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </PixelCtaLink>
              <PixelCtaLink
                href={HOME_HERO_SECONDARY_CTA.href}
                color="var(--ng-btn-sky)"
                className="group home-hero-secondary-cta"
              >
                {HOME_HERO_SECONDARY_CTA.label}
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </PixelCtaLink>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[color:var(--ng-body)]">
              {HOME_HERO_EXPECTATION}
            </p>
          </div>
        </div>

        <div className="relative z-10 lg:col-span-7">
          <p className="sr-only">
            Decorative pixel-art browser window illustrating a crafted website layout.
          </p>
          <div
            aria-hidden="true"
            className="home-hero-browser relative mx-auto aspect-[5/4] w-full overflow-hidden rounded-2xl lg:mx-0 lg:ml-auto lg:w-[min(100%,580px)] xl:w-[min(100%,640px)]"
          >
            <Image
              src="/pixel-browser.png"
              alt=""
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 70vw, 640px"
              className="pixel-browser-mockup"
              priority
              fetchPriority="high"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
