"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CP_PATHS } from "./companionPetConfig";
import { CP_FAQS, CP_PRODUCTS, CP_RESOURCES, CP_TESTIMONIALS } from "./companionPetData";
import { DealBanner } from "./DealBanner";
import { FAQAccordion } from "./FAQAccordion";
import { LoyaltyProgress } from "./LoyaltyProgress";
import { RecommendationCarousel } from "./RecommendationCarousel";
import { ResourceCard } from "./ResourceCard";
import { RewardsWidget } from "./RewardsWidget";
import { TestimonialCard } from "./TestimonialCard";

const HERO_BG =
  "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&h=800&fit=crop";

function HeroBg() {
  const [processedBg, setProcessedBg] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        if (lum > 200) {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        } else if (lum > 160) {
          const t = (lum - 160) / 40;
          data[i] = Math.round(data[i] + (255 - data[i]) * t);
          data[i + 1] = Math.round(data[i + 1] + (255 - data[i + 1]) * t);
          data[i + 2] = Math.round(data[i + 2] + (255 - data[i + 2]) * t);
        }
      }
      ctx.putImageData(imgData, 0, 0);
      setProcessedBg(canvas.toDataURL("image/png"));
    };
    img.src = HERO_BG;
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
      {processedBg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={processedBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[#f0eeeb]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#fafaf9]/95 via-[#fafaf9]/70 to-transparent" />
    </div>
  );
}

function HeroFloatingUI() {
  const featured = CP_PRODUCTS[0];
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-md md:h-[480px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="cp-card cp-float absolute left-0 top-8 z-10 w-44 overflow-hidden rounded-2xl shadow-lg md:w-48"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={featured.image} alt="" className="aspect-square w-full object-cover" />
        <div className="p-3">
          <p className="text-[10px] text-[var(--cp-slate)]">{featured.brand}</p>
          <p className="line-clamp-1 text-xs font-semibold">{featured.name}</p>
          <p className="mt-1 text-sm font-semibold">${featured.price.toFixed(2)}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35 }}
        className="absolute right-0 top-0 z-20 w-52 md:w-56"
      >
        <RewardsWidget />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="cp-card cp-float-delay-1 absolute bottom-24 left-4 z-10 w-48 rounded-2xl p-3 md:w-52"
      >
        <LoyaltyProgress compact showLabels={false} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="absolute bottom-4 right-2 z-10 w-48 md:w-52"
      >
        <DealBanner />
      </motion.div>
    </div>
  );
}

export function CompanionPetHomeBody() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-[var(--cp-border)] bg-[var(--cp-white)]">
        <div className="absolute inset-0 lg:left-1/2">
          <HeroBg />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-8 md:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[var(--cp-blue-muted)] px-4 py-1.5 text-xs font-semibold text-[var(--cp-blue)]">
              <span className="material-symbols-outlined text-sm" aria-hidden>
                verified
              </span>
              Gold Companion · 1,240 points available
            </p>
            <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-[var(--cp-charcoal)] md:text-5xl">
              Premium care for the pets you love most
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-[var(--cp-slate)]">
              Intelligent shopping, personalized recommendations, and a rewards system that makes every order feel
              like progress — not a transaction.
            </p>
            <form className="mt-6 flex max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
              <label className="sr-only" htmlFor="hero-search">
                Search products
              </label>
              <input
                id="hero-search"
                type="search"
                placeholder="Search food, wellness, toys…"
                className="flex-1 rounded-2xl border border-[var(--cp-border)] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--cp-blue)]"
              />
              <button
                type="submit"
                className="rounded-2xl bg-[var(--cp-charcoal)] px-5 py-3 text-sm font-semibold text-white"
              >
                Search
              </button>
            </form>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={CP_PATHS.shop}
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--cp-blue)] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Shop now
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={CP_PATHS.rewards}
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--cp-border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--cp-charcoal)]"
              >
                View rewards
              </Link>
            </div>
          </div>
          <HeroFloatingUI />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--cp-charcoal)]">Recommended for Luna</h2>
            <p className="mt-1 text-sm text-[var(--cp-slate)]">Curated from your pet profile and purchase history</p>
          </div>
          <Link href={CP_PATHS.shop} className="text-sm font-medium text-[var(--cp-blue)] hover:underline">
            View all
          </Link>
        </div>
        <RecommendationCarousel products={CP_PRODUCTS.filter((p) => p.recommended)} />
      </section>

      <section className="border-y border-[var(--cp-border)] bg-[var(--cp-warm-gray)] py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--cp-charcoal)]">Your loyalty progression</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--cp-slate)]">
                Earn XP with every purchase, unlock tier benefits, and track achievements — designed like a modern
                dashboard, not a game.
              </p>
              <Link
                href={CP_PATHS.rewards}
                className="mt-4 inline-flex text-sm font-semibold text-[var(--cp-blue)] hover:underline"
              >
                Open rewards dashboard →
              </Link>
            </div>
            <LoyaltyProgress />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="text-2xl font-semibold text-[var(--cp-charcoal)]">Trending resources</h2>
        <p className="mt-1 text-sm text-[var(--cp-slate)]">Expert guides to help you shop smarter</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CP_RESOURCES.filter((r) => r.trending).map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--cp-border)] bg-[var(--cp-warm-gray)] py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-center text-2xl font-semibold text-[var(--cp-charcoal)]">Trusted by pet parents</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {CP_TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <h2 className="text-center text-2xl font-semibold text-[var(--cp-charcoal)]">Common questions</h2>
        <div className="mt-8">
          <FAQAccordion items={CP_FAQS} />
        </div>
      </section>
    </main>
  );
}
