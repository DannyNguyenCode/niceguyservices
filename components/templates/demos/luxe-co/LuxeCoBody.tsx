"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { LC_SECTIONS, lcSectionHref } from "./luxeCoConfig";
import {
  LC_BUYING_STEPS,
  LC_HERO_STATS,
  LC_LIFESTYLES,
  LC_MARKET_INSIGHTS,
  LC_NEIGHBORHOODS,
  LC_PROPERTIES,
  LC_SELLING_STEPS,
  LC_TESTIMONIALS,
} from "./luxeCoData";
import { LC_IMAGES } from "./luxeCoImages";
import { useLuxeCoConsultation } from "./LuxeCoConsultation";
import {
  LcButton,
  LcContainer,
  LcIcon,
  LcSectionHeading,
  LcSectionLabel,
  LcStarRating,
  lcBody,
  lcDisplay,
} from "./LuxeCoShared";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function SectionMotion({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }
  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
      variants={fadeUp}
    >
      {children}
    </motion.section>
  );
}

function MapDecorations() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
      aria-hidden
      preserveAspectRatio="none"
    >
      <path className="lc-route-line" d="M 80 120 Q 200 80 320 140 T 560 100" />
      <path className="lc-route-line" d="M 120 280 L 280 240 L 420 300 L 600 260" />
      <circle cx="320" cy="140" r="4" fill="var(--lc-gold)" className="lc-pin-pulse" />
      <circle cx="420" cy="300" r="3" fill="var(--lc-gold-dim)" />
      <circle cx="560" cy="100" r="3" fill="var(--lc-beige-dark)" />
    </svg>
  );
}

export function LuxeCoBody() {
  const reduce = useReducedMotion();
  const openConsultation = useLuxeCoConsultation();
  const featured = LC_PROPERTIES.find((p) => p.featured)!;
  const secondary = LC_PROPERTIES.filter((p) => !p.featured);
  const featuredNeighborhood = LC_NEIGHBORHOODS.find((n) => n.featured)!;
  const otherNeighborhoods = LC_NEIGHBORHOODS.filter((n) => !n.featured);

  return (
    <main className="lc-body-text text-[var(--lc-charcoal-muted)]" style={lcBody}>
      {/* 1. Hero */}
      <section
        id={LC_SECTIONS.hero}
        className="relative flex min-h-[100dvh] items-end overflow-hidden pb-20 pt-28 md:items-center md:pb-24 md:pt-0"
      >
        <div className="absolute inset-0">
          <Image
            src={LC_IMAGES.hero}
            alt="Cinematic luxury home with pool at dusk"
            fill
            priority
            className="object-cover brightness-[0.72] saturate-[0.9]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[var(--lc-charcoal)]/75 via-[var(--lc-charcoal)]/40 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-[var(--lc-charcoal)]/50 via-transparent to-transparent" />
        </div>

        <LcContainer className="relative z-10">
          <div className="grid items-end gap-12 lg:grid-cols-[1fr_auto]">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="max-w-2xl"
            >
              <LcSectionLabel>Luxury Real Estate Services</LcSectionLabel>
              <h1
                className="lc-display mb-6 text-4xl leading-[1.1] text-[var(--lc-bg-elevated)] md:text-5xl lg:text-[3.5rem]"
                style={lcDisplay}
              >
                Find More Than a Home. Find Your Place.
              </h1>
              <p className="mb-10 max-w-lg text-base leading-relaxed text-[var(--lc-beige)] md:text-lg">
                Local market guidance, curated listings, and neighborhood insight for confident
                real estate decisions.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <LcButton
                  href={lcSectionHref(LC_SECTIONS.neighborhoods)}
                  className="!bg-[var(--lc-bg-elevated)] !text-[var(--lc-charcoal)] hover:!bg-white"
                >
                  Explore Neighborhoods
                </LcButton>
                <LcButton
                  href={lcSectionHref(LC_SECTIONS.contact)}
                  variant="outline"
                  className="!border-[var(--lc-bg-elevated)] !text-[var(--lc-bg-elevated)] hover:!bg-white/10"
                >
                  Get Home Valuation
                </LcButton>
              </div>
            </motion.div>

            <motion.aside
              initial={reduce ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-xs border border-white/20 bg-[var(--lc-charcoal)]/80 p-6 backdrop-blur-sm lg:mb-8"
              aria-label="Market insights"
            >
              <p className="lc-label mb-5 text-[var(--lc-gold)]">Market Snapshot</p>
              <ul className="flex flex-col gap-4">
                {LC_HERO_STATS.map((stat) => (
                  <li
                    key={stat.label}
                    className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-[var(--lc-beige)]">{stat.label}</span>
                    <span className="lc-display text-lg text-[var(--lc-bg-elevated)]" style={lcDisplay}>
                      {stat.value}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.aside>
          </div>
        </LcContainer>
      </section>

      {/* 2. Lifestyle Match */}
      <SectionMotion
        id={LC_SECTIONS.lifestyle}
        className="border-t border-[var(--lc-line)] bg-[var(--lc-bg)] py-24 md:py-32"
      >
        <LcContainer>
          <div className="mb-16 max-w-2xl">
            <LcSectionLabel>Lifestyle Matching</LcSectionLabel>
            <LcSectionHeading className="mb-4 text-3xl md:text-4xl lg:text-5xl">
              What Fits Your Lifestyle?
            </LcSectionHeading>
            <p className="text-base leading-relaxed md:text-lg">
              Start with how you want to live — we&apos;ll guide you to neighborhoods and properties
              that match your rhythm, not just your budget.
            </p>
            <div className="lc-gold-rule mt-6" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LC_LIFESTYLES.map((item) => (
              <article
                key={item.id}
                className="lc-lifestyle-card group flex flex-col border border-[var(--lc-line)] bg-[var(--lc-bg-elevated)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="lc-lifestyle-image object-cover"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3
                    className="lc-display mb-2 text-xl text-[var(--lc-charcoal)]"
                    style={lcDisplay}
                  >
                    {item.title}
                  </h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed">{item.description}</p>
                  <LcButton
                    href={lcSectionHref(LC_SECTIONS.neighborhoods)}
                    variant="ghost"
                    className="self-start"
                  >
                    {item.cta}
                  </LcButton>
                </div>
              </article>
            ))}
          </div>
        </LcContainer>
      </SectionMotion>

      {/* 3. Neighborhood Explorer */}
      <SectionMotion
        id={LC_SECTIONS.neighborhoods}
        className="relative overflow-hidden border-t border-[var(--lc-line)] bg-[var(--lc-bg-warm)] py-24 md:py-32"
      >
        <div className="lc-map-grid absolute inset-0 opacity-50" aria-hidden />
        <MapDecorations />

        <LcContainer className="relative">
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <LcSectionLabel>City Guide</LcSectionLabel>
              <LcSectionHeading className="mb-4 text-3xl md:text-4xl lg:text-5xl">
                Explore the City Like a Local
              </LcSectionHeading>
              <p className="text-base leading-relaxed">
                Neighborhood-level data, lifestyle tags, and local indicators — mapped for buyers who
                want context before they commit.
              </p>
            </div>
            <p className="lc-label text-[var(--lc-charcoal-light)]">
              <LcIcon name="pin_drop" className="mr-1 text-[var(--lc-gold)]" />
              4 districts · live market data
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-12 lg:grid-rows-3">
            <article className="lc-neighborhood-card relative overflow-hidden border border-[var(--lc-line)] bg-[var(--lc-bg-elevated)] lg:col-span-7 lg:row-span-3 lg:h-full">
              <div className="relative aspect-[16/9] h-full lg:aspect-auto lg:min-h-[520px]">
                <Image
                  src={featuredNeighborhood.image}
                  alt={featuredNeighborhood.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[var(--lc-charcoal)]/80 via-[var(--lc-charcoal)]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col p-6 lg:p-10">
                  <span className="lc-label mb-3 inline-flex w-fit bg-[var(--lc-gold)] px-3 py-1 text-[var(--lc-charcoal)]">
                    {featuredNeighborhood.tag}
                  </span>
                  <h3
                    className="lc-display mb-2 text-3xl text-[var(--lc-bg-elevated)] md:text-4xl"
                    style={lcDisplay}
                  >
                    {featuredNeighborhood.name}
                  </h3>
                  <p className="lc-label mb-4 text-[var(--lc-gold-light)]">
                    {featuredNeighborhood.coords}
                  </p>
                  <p
                    className="lc-display mb-4 text-2xl text-[var(--lc-bg-elevated)]"
                    style={lcDisplay}
                  >
                    Avg. {featuredNeighborhood.avgPrice}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {featuredNeighborhood.indicators.map((ind) => (
                      <span
                        key={ind.label}
                        className="flex items-center gap-1.5 text-xs text-[var(--lc-beige)]"
                      >
                        <LcIcon name={ind.icon} className="text-sm text-[var(--lc-gold)]" />
                        {ind.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {otherNeighborhoods.map((hood, i) => (
              <article
                key={hood.id}
                className={`lc-neighborhood-card flex flex-col border border-[var(--lc-line)] bg-[var(--lc-bg-elevated)] lg:col-span-5 ${
                  i === 0 ? "lg:row-start-1" : i === 1 ? "lg:row-start-2" : "lg:row-start-3"
                }`}
              >
                <div className="relative aspect-[16/7] overflow-hidden">
                  <Image
                    src={hood.image}
                    alt={hood.name}
                    fill
                    className="object-cover"
                    sizes="40vw"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h3
                        className="lc-display text-xl text-[var(--lc-charcoal)]"
                        style={lcDisplay}
                      >
                        {hood.name}
                      </h3>
                      <span className="lc-label text-[var(--lc-gold)]">{hood.coords}</span>
                    </div>
                    <p className="lc-display text-lg text-[var(--lc-charcoal)]" style={lcDisplay}>
                      {hood.avgPrice}
                    </p>
                    <span className="lc-label mt-2 inline-block text-[var(--lc-charcoal-light)]">
                      {hood.tag}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-3 border-t border-[var(--lc-line)] pt-4">
                    {hood.indicators.map((ind) => (
                      <span key={ind.label} title={ind.label}>
                        <LcIcon name={ind.icon} className="text-lg text-[var(--lc-gold)]" />
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </LcContainer>
      </SectionMotion>

      {/* 4. Featured Properties */}
      <SectionMotion
        id={LC_SECTIONS.properties}
        className="border-t border-[var(--lc-line)] bg-[var(--lc-bg)] py-24 md:py-32"
      >
        <LcContainer>
          <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <LcSectionLabel>Curated Listings</LcSectionLabel>
              <LcSectionHeading className="text-3xl md:text-4xl lg:text-5xl">
                Curated Property Collection
              </LcSectionHeading>
            </div>
            <LcButton href={lcSectionHref(LC_SECTIONS.contact)} variant="ghost">
              View All Listings
            </LcButton>
          </div>

          <div className="grid gap-6 lg:grid-cols-12 lg:grid-rows-2">
            <article className="lc-property-card relative overflow-hidden border border-[var(--lc-line)] lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:h-full">
              <div className="relative aspect-[4/3] h-full lg:aspect-auto lg:min-h-[520px]">
                <Image
                  src={featured.image}
                  alt={featured.name}
                  fill
                  className="lc-property-image object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[var(--lc-charcoal)]/70 via-transparent to-transparent" />
                <span className="lc-label absolute left-6 top-6 bg-[var(--lc-gold)] px-3 py-1 text-[var(--lc-charcoal)]">
                  {featured.tag}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="lc-label mb-2 text-[var(--lc-gold-light)]">{featured.neighborhood}</p>
                  <h3
                    className="lc-display mb-2 text-3xl text-[var(--lc-bg-elevated)] md:text-4xl"
                    style={lcDisplay}
                  >
                    {featured.name}
                  </h3>
                  <p
                    className="lc-display mb-4 text-2xl text-[var(--lc-bg-elevated)]"
                    style={lcDisplay}
                  >
                    {featured.price}
                  </p>
                  <p className="mb-6 text-sm text-[var(--lc-beige)]">
                    {featured.beds} beds · {featured.baths} baths · {featured.sqft} sq ft
                  </p>
                  <LcButton
                    href={lcSectionHref(LC_SECTIONS.contact)}
                    className="!bg-[var(--lc-bg-elevated)] !text-[var(--lc-charcoal)]"
                  >
                    View Property
                  </LcButton>
                </div>
              </div>
            </article>

            {secondary.map((property, i) => (
              <article
                key={property.id}
                className={`lc-property-card flex flex-col border border-[var(--lc-line)] bg-[var(--lc-bg-elevated)] lg:col-span-5 lg:col-start-8 ${
                  i === 0 ? "lg:row-start-1" : "lg:row-start-2"
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.name}
                    fill
                    className="lc-property-image object-cover"
                    sizes="40vw"
                  />
                  <span className="lc-label absolute left-4 top-4 border border-[var(--lc-line)] bg-[var(--lc-bg-elevated)]/95 px-2 py-1 text-[var(--lc-charcoal)]">
                    {property.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="lc-label mb-1 text-[var(--lc-gold)]">{property.neighborhood}</p>
                  <h3
                    className="lc-display mb-1 text-2xl text-[var(--lc-charcoal)]"
                    style={lcDisplay}
                  >
                    {property.name}
                  </h3>
                  <p className="lc-display mb-3 text-xl text-[var(--lc-charcoal)]" style={lcDisplay}>
                    {property.price}
                  </p>
                  <p className="mb-6 text-sm">
                    {property.beds} beds · {property.baths} baths · {property.sqft} sq ft
                  </p>
                  <LcButton
                    href={lcSectionHref(LC_SECTIONS.contact)}
                    variant="outline"
                    className="mt-auto self-start"
                  >
                    View Property
                  </LcButton>
                </div>
              </article>
            ))}
          </div>
        </LcContainer>
      </SectionMotion>

      {/* 5. Market Intelligence */}
      <SectionMotion
        id={LC_SECTIONS.market}
        className="border-t border-[var(--lc-line)] bg-[var(--lc-bg-warm)] py-24 md:py-32"
      >
        <LcContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <LcSectionLabel>Advisor, Not Salesperson</LcSectionLabel>
              <LcSectionHeading className="mb-6 text-3xl md:text-4xl lg:text-5xl">
                Market Intelligence, Not Guesswork
              </LcSectionHeading>
              <p className="mb-6 text-base leading-relaxed md:text-lg">
                Real estate decisions deserve more than listing photos and generic market reports.
                We translate local data into clear guidance — so you know when to move, where to
                look, and how to position your next step.
              </p>
              <p className="text-sm leading-relaxed">
                Whether you&apos;re buying your first home, upgrading for family, or selling a
                long-held property, our role is to help you interpret the market — not pressure you
                through it.
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden border border-[var(--lc-line)]">
              <Image
                src={LC_IMAGES.marketEditorial}
                alt="Elegant interior living space"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {LC_MARKET_INSIGHTS.map((insight) => (
              <article
                key={insight.id}
                className="border border-[var(--lc-line)] bg-[var(--lc-bg-elevated)] p-8"
              >
                <LcIcon name={insight.icon} className="mb-5 text-3xl text-[var(--lc-gold)]" />
                <h3
                  className="lc-display mb-3 text-xl text-[var(--lc-charcoal)]"
                  style={lcDisplay}
                >
                  {insight.title}
                </h3>
                <p className="text-sm leading-relaxed">{insight.description}</p>
              </article>
            ))}
          </div>
        </LcContainer>
      </SectionMotion>

      {/* 6. Roadmap */}
      <SectionMotion
        id={LC_SECTIONS.roadmap}
        className="border-t border-[var(--lc-line)] bg-[var(--lc-bg)] py-24 md:py-32"
      >
        <LcContainer>
          <div className="mb-16 text-center">
            <LcSectionLabel>Your Journey</LcSectionLabel>
            <LcSectionHeading className="text-3xl md:text-4xl lg:text-5xl">
              Your Roadmap
            </LcSectionHeading>
            <div className="lc-gold-rule mx-auto mt-6" />
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3
                className="lc-display mb-8 border-b border-[var(--lc-line)] pb-4 text-2xl text-[var(--lc-charcoal)]"
                style={lcDisplay}
              >
                Buying Journey
              </h3>
              <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {LC_BUYING_STEPS.map((step) => (
                  <li key={step.step} className="lc-roadmap-step">
                    <span className="lc-label mb-2 block text-[var(--lc-gold)]">{step.step}</span>
                    <h4
                      className="lc-display mb-2 text-lg text-[var(--lc-charcoal)]"
                      style={lcDisplay}
                    >
                      {step.title}
                    </h4>
                    <p className="text-sm leading-relaxed">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3
                className="lc-display mb-8 border-b border-[var(--lc-line)] pb-4 text-2xl text-[var(--lc-charcoal)]"
                style={lcDisplay}
              >
                Selling Journey
              </h3>
              <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {LC_SELLING_STEPS.map((step) => (
                  <li key={step.step} className="lc-roadmap-step">
                    <span className="lc-label mb-2 block text-[var(--lc-gold)]">{step.step}</span>
                    <h4
                      className="lc-display mb-2 text-lg text-[var(--lc-charcoal)]"
                      style={lcDisplay}
                    >
                      {step.title}
                    </h4>
                    <p className="text-sm leading-relaxed">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </LcContainer>
      </SectionMotion>

      {/* 7. Testimonials */}
      <SectionMotion
        id={LC_SECTIONS.testimonials}
        className="border-t border-[var(--lc-line)] bg-[var(--lc-bg-warm)] py-24 md:py-32"
      >
        <LcContainer>
          <div className="mb-16 text-center">
            <LcSectionLabel>Client Stories</LcSectionLabel>
            <LcSectionHeading className="text-3xl md:text-4xl lg:text-5xl">
              Happy Homeowners
            </LcSectionHeading>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {LC_TESTIMONIALS.map((t) => (
              <article
                key={t.id}
                className="lc-testimonial-card flex flex-col border border-[var(--lc-line)] bg-[var(--lc-bg-elevated)] p-8"
              >
                <LcStarRating count={t.rating} />
                <div className="mt-6 flex-1 space-y-4 text-sm leading-relaxed">
                  <p>
                    <span className="lc-label text-[var(--lc-gold)]">Goal · </span>
                    {t.goal}
                  </p>
                  <p>
                    <span className="lc-label text-[var(--lc-gold)]">Challenge · </span>
                    {t.challenge}
                  </p>
                  <p>
                    <span className="lc-label text-[var(--lc-gold)]">Result · </span>
                    <span className="text-[var(--lc-charcoal)]">{t.result}</span>
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-4 border-t border-[var(--lc-line)] pt-6">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image src={t.image} alt={t.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--lc-charcoal)]">{t.name}</p>
                    <p className="text-xs text-[var(--lc-charcoal-light)]">{t.location}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </LcContainer>
      </SectionMotion>

      {/* 8. Final CTA */}
      <SectionMotion
        id={LC_SECTIONS.contact}
        className="border-t border-[var(--lc-line)] py-24 md:py-32"
      >
        <LcContainer>
          <div className="lc-cta-block px-8 py-16 text-center md:px-16 md:py-20">
            <LcSectionLabel>Start the Conversation</LcSectionLabel>
            <h2
              className="lc-display mx-auto mb-6 max-w-2xl text-3xl leading-tight text-[var(--lc-bg-elevated)] md:text-4xl lg:text-5xl"
              style={lcDisplay}
            >
              Let&apos;s Build Your Next Move Together.
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-[var(--lc-beige)]">
              Schedule a consultation or request a home valuation — we&apos;ll respond with local
              insight tailored to your goals.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <LcButton
                onClick={openConsultation}
                className="!bg-[var(--lc-bg-elevated)] !text-[var(--lc-charcoal)] hover:!bg-white"
              >
                Book Consultation
              </LcButton>
              <LcButton
                href={lcSectionHref(LC_SECTIONS.contact)}
                variant="outline"
                className="!border-[var(--lc-bg-elevated)] !text-[var(--lc-bg-elevated)] hover:!bg-white/10"
              >
                Get Home Valuation
              </LcButton>
            </div>
          </div>
        </LcContainer>
      </SectionMotion>
    </main>
  );
}
