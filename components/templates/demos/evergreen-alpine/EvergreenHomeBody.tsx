import Image from "next/image";
import { EvergreenContactForm } from "@/components/templates/demos/evergreen-alpine/EvergreenContactForm";
import { EvergreenEstimateButton } from "@/components/templates/demos/evergreen-alpine/EvergreenEstimate";
import { EvergreenSectionLink } from "@/components/templates/demos/evergreen-alpine/EvergreenSectionLink";
import { EVERGREEN_PATHS, EVERGREEN_PHONE } from "@/components/templates/demos/evergreen-alpine/evergreenConfig";
import { EG_IMG } from "@/components/templates/demos/evergreen-alpine/evergreenImages";
import { HeroSplitSlider } from "@/components/templates/demos/evergreen-alpine/HeroSplitSlider";

/*
const SEASON_CARDS = [
  {
    season: "Spring",
    href: EVERGREEN_PATHS.spring,
    icon: "eco",
    accent: "#2E4A3E",
    services: ["Cleanup", "Mulch Installation", "Garden Preparation"],
  },
  {
    season: "Summer",
    href: EVERGREEN_PATHS.summer,
    icon: "sunny",
    accent: "#012d1d",
    services: ["Lawn Maintenance", "Garden Care", "Property Enhancements"],
  },
  {
    season: "Fall",
    href: EVERGREEN_PATHS.fall,
    icon: "nature",
    accent: "#653d26",
    services: ["Leaf Removal", "Pruning", "Winter Preparation"],
  },
  {
    season: "Winter",
    href: EVERGREEN_PATHS.winter,
    icon: "ac_unit",
    accent: "#171b2b",
    services: ["Snow Removal", "Salting", "Ice Management"],
  },
] as const;
*/

/*
const SEASON_JOURNEY = [
  {
    id: "spring",
    label: "March – May",
    title: "Spring Renewal",
    description:
      "The foundation of a healthy property starts with thorough cleanup, fresh plantings, and beds prepared for the growing season ahead.",
    services: ["Cleanup & debris removal", "Planting & garden prep", "Mulch & bed restoration"],
    image: EG_IMG.spring,
    imageAlt: "Fresh garden bed with mulch and spring seedlings",
    reverse: false,
  },
  {
    id: "summer",
    label: "June – August",
    title: "Summer Growth",
    description:
      "Peak season maintenance keeps your lawn lush and your landscape sharp — mowing, garden care, and enhancements that protect your investment.",
    services: ["Precision mowing", "Garden & irrigation care", "Landscape enhancements"],
    image: EG_IMG.summer,
    imageAlt: "Manicured green lawn on a residential property in summer",
    reverse: true,
  },
  {
    id: "fall",
    label: "September – November",
    title: "Fall Protection",
    description:
      "As temperatures drop, we focus on leaf management, final pruning, and preparing your property to enter winter in its best condition.",
    services: ["Leaf cleanup", "Pruning & cutbacks", "Winter preparation"],
    image: EG_IMG.fall,
    imageAlt: "Autumn walkway with golden leaves and tidy landscaping",
    reverse: false,
  },
  {
    id: "winter",
    label: "December – February",
    title: "Winter Reliability",
    description:
      "Reliable snow clearing and ice management keep your property safe and accessible — before you need to leave for work.",
    services: ["Residential snow removal", "Salting & de-icing", "Ice hazard management"],
    image: EG_IMG.winter,
    imageAlt: "Professionally cleared driveway after snowfall",
    reverse: true,
  },
] as const;
*/

const SEASON_FEATURE_SECTIONS = [
  {
    id: "spring",
    eyebrow: "Spring Services",
    title: "Cleanup & Garden Renewal",
    description:
      "Wake your property up after winter with thorough cleanup, refreshed beds, and plantings that set the tone for a strong growing season.",
    services: [
      "Debris & Leaf Cleanup",
      "Mulch Installation",
      "Garden Bed Preparation",
      "Spring Planting",
    ],
    serviceIcon: "eco",
    estimateSubject: "Spring Service Estimate",
    cta: "Get Spring Care",
    image: EG_IMG.spring,
    imageAlt: "Fresh garden bed with mulch and spring seedlings",
    theme: {
      section: "bg-[#1b4332] text-white",
      eyebrow: "text-[#c1ecd4]",
      body: "text-white/80",
      serviceIcon: "text-[#c1ecd4]",
      button: "bg-white text-[#1b4332] hover:opacity-90",
      imageBorder: "border-white/10",
    },
    reverse: false,
  },
  {
    id: "summer",
    eyebrow: "Summer Services",
    title: "Lawn & Garden Maintenance",
    description:
      "Peak-season care keeps your lawn lush and your landscape sharp — consistent mowing, garden attention, and enhancements that protect your investment.",
    services: [
      "Precision Lawn Mowing",
      "Garden & Irrigation Care",
      "Landscape Enhancements",
      "Property Upkeep",
    ],
    serviceIcon: "sunny",
    estimateSubject: "Summer Maintenance Estimate",
    cta: "Get Summer Care",
    image: EG_IMG.summer,
    imageAlt: "Manicured green lawn on a residential property in summer",
    theme: {
      section: "bg-[#012d1d] text-white",
      eyebrow: "text-[#c1ecd4]",
      body: "text-white/80",
      serviceIcon: "text-[#c1ecd4]",
      button: "bg-white text-[#012d1d] hover:opacity-90",
      imageBorder: "border-white/10",
    },
    reverse: true,
  },
  {
    id: "fall",
    eyebrow: "Fall Services",
    title: "Leaf Management & Winter Prep",
    description:
      "As temperatures drop, we manage leaves, finalize pruning, and prepare your property to enter winter in its best condition.",
    services: [
      "Leaf Removal",
      "Pruning & Cutbacks",
      "Winter Preparation",
      "Property Winterization",
    ],
    serviceIcon: "nature",
    estimateSubject: "Fall Service Estimate",
    cta: "Get Fall Care",
    image: EG_IMG.fall,
    imageAlt: "Autumn walkway with golden leaves and tidy landscaping",
    theme: {
      section: "bg-[#653d26] text-white",
      eyebrow: "text-[#f4d4a8]",
      body: "text-white/85",
      serviceIcon: "text-[#f4d4a8]",
      button: "bg-white text-[#653d26] hover:opacity-90",
      imageBorder: "border-white/10",
    },
    reverse: false,
  },
  {
    id: "winter",
    eyebrow: "Winter Services",
    title: "Snow & Ice Management",
    description:
      "Dependable winter care for homeowners and businesses. We monitor conditions and respond before ice becomes a hazard — so your property stays safe and accessible.",
    services: [
      "Residential Snow Removal",
      "Commercial Snow Removal",
      "Salting",
      "Ice Management",
    ],
    serviceIcon: "ac_unit",
    estimateSubject: "Winter Coverage Estimate",
    cta: "Get Winter Coverage",
    image: EG_IMG.snowPlow,
    imageAlt: "Professional snow plow clearing a residential driveway at night",
    theme: {
      section: "bg-[#171b2b] text-white",
      eyebrow: "text-[#dee1f8]",
      body: "text-white/80",
      serviceIcon: "text-[#c1ecd4]",
      button: "bg-white text-[#171b2b] hover:opacity-90",
      imageBorder: "border-white/10",
    },
    reverse: true,
  },
] as const;

const CHALLENGES = [
  {
    icon: "gesture",
    title: "Cracked Driveways",
    problem: "Damaged surfaces reduce curb appeal and create trip hazards.",
    outcome: "Restore a safe, durable entrance that protects your home's value.",
  },
  {
    icon: "water_drop",
    title: "Poor Drainage",
    problem: "Standing water damages foundations and drowns landscaping.",
    outcome: "Redirect water properly so your property stays dry year-round.",
  },
  {
    icon: "park",
    title: "Overgrown Landscapes",
    problem: "Untamed beds and hedges make a property feel neglected.",
    outcome: "Reclaim clean lines and healthy growth you can be proud of.",
  },
  {
    icon: "grass",
    title: "Lawn Damage",
    problem: "Patchy, stressed turf signals deeper soil and care issues.",
    outcome: "Rebuild a thick, resilient lawn that thrives in every season.",
  },
  {
    icon: "ac_unit",
    title: "Winter Ice Hazards",
    problem: "Unsafe walkways and driveways create liability and stress.",
    outcome: "Wake up to cleared, treated surfaces — safe before sunrise.",
  },
] as const;

const PORTFOLIO = [
  { src: EG_IMG.portfolioFeatured, alt: "Stone terrace with outdoor fireplace", label: "Patios", span: "col-span-1 md:col-span-8 md:row-span-2" },
  { src: EG_IMG.portfolioMasonry, alt: "Retaining wall stone masonry detail", label: "Retaining Walls", span: "col-span-1 md:col-span-4" },
  { src: EG_IMG.portfolioLawn, alt: "Precision lawn overlooking modern home", label: "Garden Installations", span: "col-span-1 md:col-span-4" },
  { src: EG_IMG.portfolioWalkway, alt: "Flagstone walkway with spring plantings", label: "Walkways", span: "col-span-1 md:col-span-5" },
  { src: EG_IMG.portfolioDriveway, alt: "Interlocking stone driveway at luxury estate", label: "Driveways", span: "col-span-1 md:col-span-7" },
  { src: EG_IMG.portfolioGarden, alt: "Structured garden bed with ornamental grasses", label: "Interlocking", span: "col-span-1 md:col-span-12 md:h-64" },
] as const;

const WHY_CHOOSE_US = [
  {
    icon: "calendar_month",
    title: "Year-Round Stewardship",
    description:
      "One partner for landscaping, maintenance, and snow removal — coordinated care through every season.",
  },
  {
    icon: "groups",
    title: "Local, Dedicated Crew",
    description:
      "Our team knows neighborhood properties and responds with the consistency homeowners expect.",
  },
  {
    icon: "architecture",
    title: "Craftsmanship First",
    description:
      "From hardscaping to seasonal upkeep, we build and maintain with long-term quality in mind.",
  },
  {
    icon: "handshake",
    title: "Clear Communication",
    description:
      "Straightforward estimates, dependable scheduling, and no surprises — just property care you can trust.",
  },
] as const;

const PROCESS = [
  { step: "01", title: "Assess", description: "Property review and consultation to understand your goals." },
  { step: "02", title: "Plan", description: "Customized service strategy tailored to your property and seasons." },
  { step: "03", title: "Execute", description: "Professional installation and maintenance with minimal disruption." },
  { step: "04", title: "Maintain", description: "Ongoing seasonal care that keeps your property at its best." },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "They handle every season without us having to chase them down. Our lawn looks great in summer, and the driveway is always clear before we leave in winter.",
    name: "Sarah Mitchell",
    detail: "Homeowner, Oak Ridge",
  },
  {
    quote:
      "Communication is clear, crews show up when promised, and the quality is consistent. It feels like having a property manager who actually cares.",
    name: "David Chen",
    detail: "Homeowner, Evergreen Valley",
  },
  {
    quote:
      "The patio and walkway they built transformed our backyard. And knowing they handle snow removal too means one less thing to worry about.",
    name: "Patricia Walsh",
    detail: "Homeowner, Highland Estates",
  },
] as const;

const SERVICE_AREAS = [
  "Alpine Heights",
  "Evergreen Valley",
  "Silver Creek",
  "Highland Estates",
  "Oak Ridge",
  "Pine Terrace",
  "Maple Grove",
  "Riverdale",
] as const;

export function EvergreenHomeBody() {
  return (
    <main>
      {/* Section 1 — Hero */}
      <section className="relative flex min-h-[min(100dvh,56rem)] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <HeroSplitSlider
            beforeSrc={EG_IMG.heroBefore}
            afterSrc={EG_IMG.heroAfter}
            beforeAlt="Overgrown residential backyard before landscaping transformation"
            afterAlt="Transformed backyard with interlocking patio and manicured lawn"
          />
          <div className="eg-hero-overlay absolute inset-0" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-32 text-center md:px-16 md:py-40">
          <div className="mb-6 flex flex-wrap justify-center gap-3">
            {["Landscaping", "Property Maintenance", "Snow Removal"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mx-auto max-w-4xl font-[family-name:var(--font-eg-headline)] text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            Your Property&apos;s Partner Through Every Season
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            Landscaping, property maintenance, and snow removal services designed to keep your
            property looking its best year-round.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <EvergreenEstimateButton className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-bold text-[#012d1d] transition-opacity hover:opacity-90">
              Request Estimate
            </EvergreenEstimateButton>
            <EvergreenSectionLink
              href={EVERGREEN_PATHS.spring}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-white px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10"
            >
              View Our Services
            </EvergreenSectionLink>
          </div>
        </div>
      </section>

      {/* Section 2 — Property Care Command Center (hidden)
      <section className="bg-[#fbf9f8] py-20 md:py-28" id="overview">
        <div className="mx-auto max-w-7xl px-5 md:px-16">
          <div className="mb-14 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#012d1d]">
              Year-Round Overview
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-eg-headline)] text-3xl font-bold text-[#012d1d] md:text-4xl">
              Property Care Command Center
            </h2>
            <p className="mt-4 text-lg text-[#414844]">
              A clear view of how we manage your property through every season — organized care,
              not complicated software.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SEASON_CARDS.map((card) => (
              <EvergreenSectionLink
                key={card.season}
                href={card.href}
                aria-label={`View ${card.season} services`}
                className="group flex flex-col rounded-xl border border-[#c1c8c2]/50 bg-white p-8 transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#012d1d]"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span
                    className="material-symbols-outlined text-3xl transition-transform group-hover:scale-110"
                    style={{ color: card.accent }}
                    aria-hidden
                  >
                    {card.icon}
                  </span>
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: card.accent }}
                  >
                    {card.season}
                  </span>
                </div>
                <ul className="mt-auto space-y-3">
                  {card.services.map((service) => (
                    <li
                      key={service}
                      className="flex items-center gap-2 font-medium text-[#1b1c1c]"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#012d1d]" />
                      {service}
                    </li>
                  ))}
                </ul>
              </EvergreenSectionLink>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Section 3 — Four Seasons Journey (hidden, grouped with Property Overview)
      <section className="bg-white py-20 md:py-28" id="seasons">
        <div className="mx-auto max-w-7xl px-5 md:px-16">
          <div className="mb-20 text-center">
            <h2 className="font-[family-name:var(--font-eg-headline)] text-3xl font-bold text-[#012d1d] md:text-4xl">
              A Year of Care
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#414844]">
              Scroll through the seasons and see how we protect, maintain, and improve your
              property all year long.
            </p>
          </div>

          <div className="space-y-24 md:space-y-32">
            {SEASON_JOURNEY.map((season) => (
              <article
                key={season.id}
                className={`flex flex-col items-center gap-10 md:gap-16 ${
                  season.reverse ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#c1c8c2]/40">
                    <Image
                      src={season.image}
                      alt={season.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>

                <div className={`w-full md:w-1/2 ${season.reverse ? "md:pl-4" : "md:pr-4"}`}>
                  <p className="text-sm font-bold uppercase tracking-widest text-[#012d1d]">
                    {season.label}
                  </p>
                  <h3 className="mt-3 font-[family-name:var(--font-eg-headline)] text-2xl font-bold text-[#012d1d] md:text-3xl">
                    {season.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-[#414844]">{season.description}</p>
                  <ul className="mt-6 space-y-2">
                    {season.services.map((item) => (
                      <li key={item} className="flex items-center gap-2 font-semibold text-[#012d1d]">
                        <span className="material-symbols-outlined text-lg" aria-hidden>
                          check_circle
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Seasonal service features */}
      {SEASON_FEATURE_SECTIONS.map((season) => (
        <section
          key={season.id}
          className={`relative overflow-hidden py-20 scroll-mt-20 md:py-28 ${season.theme.section}`}
          id={season.id}
        >
          <div className="mx-auto max-w-7xl px-5 md:px-16">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div className={season.reverse ? "lg:col-start-2 lg:row-start-1" : ""}>
                <p className={`text-sm font-semibold uppercase tracking-widest ${season.theme.eyebrow}`}>
                  {season.eyebrow}
                </p>
                <h2 className="mt-4 font-[family-name:var(--font-eg-headline)] text-3xl font-bold md:text-4xl">
                  {season.title}
                </h2>
                <p className={`mt-6 text-lg leading-relaxed ${season.theme.body}`}>{season.description}</p>

                <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {season.services.map((service) => (
                    <li key={service} className="flex items-start gap-3">
                      <span
                        className={`material-symbols-outlined mt-0.5 ${season.theme.serviceIcon}`}
                        aria-hidden
                      >
                        {season.serviceIcon}
                      </span>
                      <span className="font-semibold">{service}</span>
                    </li>
                  ))}
                </ul>

                <EvergreenEstimateButton
                  defaultSubject={season.estimateSubject}
                  className={`mt-10 inline-flex min-h-12 items-center rounded-lg px-8 py-3.5 font-bold transition-opacity ${season.theme.button}`}
                >
                  {season.cta}
                </EvergreenEstimateButton>
              </div>

              <div
                className={`relative aspect-[4/3] overflow-hidden rounded-xl border lg:aspect-square ${
                  season.reverse ? "lg:col-start-1 lg:row-start-1" : ""
                } ${season.theme.imageBorder}`}
              >
                <Image
                  src={season.image}
                  alt={season.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* What We Achieved — Landscaping & Construction Showcase */}
      <section className="scroll-mt-20 bg-[#fbf9f8] py-20 md:py-28" id="portfolio">
        <div className="mx-auto max-w-7xl px-5 md:px-16">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="font-[family-name:var(--font-eg-headline)] text-3xl font-bold text-[#012d1d] md:text-4xl">
                What We Achieved
              </h2>
              <p className="mt-3 max-w-lg text-lg text-[#414844]">
                Interlocking, patios, walkways, driveways, retaining walls, and garden
                installations — built to last.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:auto-rows-[200px]">
            {PORTFOLIO.map((item) => (
              <figure
                key={item.label}
                className={`group relative overflow-hidden rounded-xl ${item.span}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-[#012d1d]/80 px-6 py-4">
                  <span className="text-sm font-bold uppercase tracking-widest text-white">
                    {item.label}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us — About */}
      <section id="why-choose-us" className="scroll-mt-20 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-16">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#012d1d]">
                About Us
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-eg-headline)] text-3xl font-bold text-[#012d1d] md:text-4xl">
                Why Choose Us
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#414844]">
                EverGreen &amp; Alpine is a property stewardship team built for homeowners who
                want one reliable partner — not a patchwork of contractors. We combine
                landscaping, year-round maintenance, and winter services under a single plan
                designed around your property.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-[#414844]">
                Whether you need seasonal care, a major installation, or dependable snow removal,
                our crew shows up prepared, communicates clearly, and treats your home like our
                own.
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#c1c8c2]/40">
              <Image
                src={EG_IMG.heroAfter}
                alt="Transformed residential property with manicured landscaping"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {WHY_CHOOSE_US.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-[#c1c8c2]/40 bg-[#fbf9f8] p-8"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1b4332]/10">
                  <span className="material-symbols-outlined text-2xl text-[#012d1d]" aria-hidden>
                    {item.icon}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-eg-headline)] text-xl font-bold text-[#012d1d]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[#414844]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-[#012d1d] py-24 text-center text-white md:py-32">
        <div className="mx-auto max-w-3xl px-5 md:px-16">
          <h2 className="font-[family-name:var(--font-eg-headline)] text-4xl font-bold md:text-5xl lg:text-6xl">
            Ready For A Better Season?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85 md:text-xl">
            Let us help you maintain, improve, and protect your property all year long.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <EvergreenEstimateButton className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-white px-10 py-4 text-lg font-bold text-[#012d1d] transition-opacity hover:opacity-90 sm:w-auto">
              Request Estimate
            </EvergreenEstimateButton>
            <a
              href={`tel:${EVERGREEN_PHONE.replace(/\D/g, "")}`}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-white px-10 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              <span className="material-symbols-outlined" aria-hidden>
                call
              </span>
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section id="how-we-work" className="scroll-mt-20">
        <div className="bg-[#f6f3f2] pt-20 md:pt-28">
          <div className="mx-auto max-w-7xl px-5 md:px-16">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-eg-headline)] text-3xl font-bold text-[#012d1d] md:text-4xl">
                How We Work
              </h2>
              <p className="mt-4 text-lg text-[#414844]">
                We focus on real property challenges and a clear process — so you know what to
                expect from first visit through ongoing care.
              </p>
            </div>

            <div className="mb-14 max-w-xl">
              <h3 className="font-[family-name:var(--font-eg-headline)] text-2xl font-bold text-[#012d1d] md:text-3xl">
                Problems We Help Solve
              </h3>
              <p className="mt-4 text-lg text-[#414844]">
                Every property faces challenges. We focus on outcomes that protect your home and
                improve how you live in it.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-3 md:pb-28">
              {CHALLENGES.map((item) => (
                <article
                  key={item.title}
                  className="rounded-xl border border-[#c1c8c2]/40 bg-white p-8"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1b4332]/10">
                    <span className="material-symbols-outlined text-2xl text-[#012d1d]" aria-hidden>
                      {item.icon}
                    </span>
                  </div>
                  <h4 className="font-[family-name:var(--font-eg-headline)] text-xl font-bold text-[#012d1d]">
                    {item.title}
                  </h4>
                  <p className="mt-3 text-[#414844]">{item.problem}</p>
                  <p className="mt-4 font-semibold text-[#012d1d]">{item.outcome}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-16">
            <div className="mb-16 text-center">
              <h3 className="font-[family-name:var(--font-eg-headline)] text-2xl font-bold text-[#012d1d] md:text-3xl">
                Our Process
              </h3>
              <p className="mx-auto mt-4 max-w-xl text-lg text-[#414844]">
                From first visit to ongoing care — a straightforward path to a property you can
                trust.
              </p>
            </div>

            {/* Desktop horizontal roadmap */}
            <div className="relative hidden md:block">
              <div className="absolute left-[12.5%] right-[12.5%] top-8 h-0.5 eg-process-line" />
              <div className="grid grid-cols-4 gap-6">
                {PROCESS.map((step) => (
                  <div key={step.title} className="relative text-center">
                    <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#012d1d] bg-white">
                      <span className="font-[family-name:var(--font-eg-headline)] text-lg font-bold text-[#012d1d]/30">
                        {step.step}
                      </span>
                    </div>
                    <h4 className="font-[family-name:var(--font-eg-headline)] text-xl font-bold text-[#012d1d]">
                      {step.title}
                    </h4>
                    <p className="mt-3 text-[#414844]">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile vertical roadmap */}
            <div className="relative md:hidden">
              <div className="absolute bottom-4 left-8 top-4 w-0.5 eg-process-line" />
              <div className="space-y-10">
                {PROCESS.map((step) => (
                  <div key={step.title} className="relative flex gap-6 pl-4">
                    <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#012d1d] bg-white">
                      <span className="font-[family-name:var(--font-eg-headline)] text-lg font-bold text-[#012d1d]/30">
                        {step.step}
                      </span>
                    </div>
                    <div className="pt-2">
                      <h4 className="font-[family-name:var(--font-eg-headline)] text-xl font-bold text-[#012d1d]">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-[#414844]">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10 — Testimonials */}
      <section id="reviews" className="scroll-mt-20 bg-[#f6f3f2] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-16">
          <h2 className="mb-14 text-center font-[family-name:var(--font-eg-headline)] text-3xl font-bold text-[#012d1d] md:text-4xl">
            Who We Have Helped
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <blockquote
                key={item.name}
                className="rounded-xl border border-[#c1c8c2]/40 bg-white p-8"
              >
                <div className="mb-4 flex text-[#012d1d]" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-lg italic leading-relaxed text-[#1b1c1c]">&ldquo;{item.quote}&rdquo;</p>
                <footer className="mt-6">
                  <cite className="not-italic">
                    <span className="block font-bold text-[#012d1d]">{item.name}</span>
                    <span className="text-sm text-[#414844]">{item.detail}</span>
                  </cite>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Where to Contact — service areas & form */}
      <section id="contact" className="scroll-mt-20 bg-[#1b4332] py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-16">
          <h2 className="mb-14 text-center font-[family-name:var(--font-eg-headline)] text-3xl font-bold md:text-4xl">
            Where to Contact
          </h2>
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="font-[family-name:var(--font-eg-headline)] text-3xl font-bold md:text-4xl">
              Serving Your Neighborhood
            </h3>
            <p className="mt-4 text-lg text-white/85">
              We provide year-round property care across local neighborhoods. Don&apos;t see yours?
              Reach out — we&apos;re happy to discuss coverage in your area.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {SERVICE_AREAS.map((area) => (
                <div key={area} className="flex items-center gap-2 font-semibold">
                  <span className="material-symbols-outlined text-[#c1ecd4] text-lg" aria-hidden>
                    location_on
                  </span>
                  {area}
                </div>
              ))}
            </div>

            <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-xl border border-white/10">
              <Image
                src={EG_IMG.serviceMap}
                alt="Map showing service area neighborhoods"
                fill
                className="object-cover opacity-60 grayscale"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="eg-map-pin flex flex-col items-center">
                  <span
                    className="material-symbols-outlined text-5xl text-[#c1ecd4]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden
                  >
                    location_on
                  </span>
                  <span className="mt-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-[#012d1d]">
                    Local Coverage
                  </span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${EVERGREEN_PHONE.replace(/\D/g, "")}`}
              className="mt-8 inline-flex items-center gap-2 font-semibold text-[#c1ecd4] transition-colors hover:text-white"
            >
              <span className="material-symbols-outlined text-xl" aria-hidden>
                call
              </span>
              {EVERGREEN_PHONE}
            </a>
          </div>

          <div className="rounded-xl border border-white/10 bg-white p-8 text-[#1b1c1c] md:p-10">
            <h3 className="font-[family-name:var(--font-eg-headline)] text-2xl font-bold text-[#012d1d] md:text-3xl">
              Get In Touch
            </h3>
            <div className="mt-6">
              <EvergreenContactForm />
            </div>
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}
