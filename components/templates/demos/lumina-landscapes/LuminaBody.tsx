"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { LUMINA_SECTIONS, luminaSectionHref } from "./luminaConfig";
import {
  LUMINA_BUDGET_OPTIONS,
  LUMINA_MATERIALS,
  LUMINA_PROCESS_STEPS,
  LUMINA_PROJECTS,
  LUMINA_PROPERTY_TYPES,
  LUMINA_STUDIO_STATS,
  LUMINA_TIMELINE_OPTIONS,
} from "./luminaData";
import { LUMINA_IMAGES } from "./luminaImages";
import { LuminaExperiencesSection } from "./LuminaExperiencesSection";
import {
  LuminaBlueprintOverlay,
  LuminaButton,
  LuminaSectionHeading,
  LuminaSectionLabel,
  luminaBody,
  luminaDisplay,
  luminaLabel,
} from "./LuminaShared";

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
      style={{ overflow: "visible" }}
    >
      {children}
    </motion.section>
  );
}

export function LuminaBody() {
  const reduce = useReducedMotion();

  return (
    <main className="lumina-body-text text-[var(--lumina-cream-muted)]" style={luminaBody}>
      {/* 1. Hero */}
      <section
        id={LUMINA_SECTIONS.hero}
        className="relative flex min-h-[100dvh] items-end overflow-hidden pb-24 pt-36 md:items-center md:pb-20 md:pt-0"
      >
        <div className="absolute inset-0">
          <Image
            src={LUMINA_IMAGES.hero}
            alt="Cinematic luxury outdoor living space at dusk"
            fill
            priority
            className="object-cover brightness-[0.45] saturate-[0.85]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[var(--lumina-bg)] via-[var(--lumina-bg)]/55 to-[var(--lumina-bg)]/30" />
          <LuminaBlueprintOverlay />
          <div className="absolute inset-0 lumina-blueprint-grid-fine opacity-30" aria-hidden />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[var(--lumina-container)] px-5 md:px-8 lg:px-12">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-3xl"
          >
            <LuminaSectionLabel>Landscape Architecture Studio</LuminaSectionLabel>
            <h1
              className="lumina-display mb-6 text-4xl leading-[1.08] text-[var(--lumina-cream)] md:text-5xl lg:text-6xl"
              style={luminaDisplay}
            >
              Designing Outdoor Retreats With Architectural Precision
            </h1>
            <p className="mb-10 max-w-xl text-base leading-relaxed md:text-lg">
              We transform ordinary backyards into private resort destinations — guided by site
              intelligence, material craft, and a studio-led design process.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <LuminaButton href={luminaSectionHref(LUMINA_SECTIONS.consultation)}>
                Schedule a Design Consultation
              </LuminaButton>
              <LuminaButton
                href={luminaSectionHref(LUMINA_SECTIONS.process)}
                variant="outline"
              >
                Explore Our Process
              </LuminaButton>
            </div>
          </motion.div>

          <div className="mt-16 hidden gap-12 border-l border-[var(--lumina-line-strong)] pl-8 md:flex">
            <div>
              <p className="lumina-label text-[var(--lumina-bronze)]" style={luminaLabel}>
                Studio Since
              </p>
              <p className="lumina-display mt-1 text-2xl text-[var(--lumina-cream)]" style={luminaDisplay}>
                2008
              </p>
            </div>
            <div>
              <p className="lumina-label text-[var(--lumina-bronze)]" style={luminaLabel}>
                Focus
              </p>
              <p className="lumina-display mt-1 text-2xl text-[var(--lumina-cream)]" style={luminaDisplay}>
                Private Retreats
              </p>
            </div>
          </div>
        </div>

        {/* Side trail marker */}
        <div
          className="absolute bottom-32 left-4 hidden flex-col items-center gap-3 md:flex lg:left-8"
          aria-hidden
        >
          <span className="lumina-label [writing-mode:vertical-rl] text-[var(--lumina-bronze-dim)]">
            Trail 01
          </span>
          <div className="h-16 w-px bg-linear-to-b from-[var(--lumina-bronze)] to-transparent" />
        </div>
      </section>

      {/* 2. Studio Introduction */}
      <SectionMotion
        id={LUMINA_SECTIONS.studio}
        className="relative overflow-hidden px-5 py-24 md:px-8 md:py-32 lg:px-12"
      >
        <div className="absolute inset-0 lumina-stone-grain opacity-60" aria-hidden />
        <div className="relative mx-auto grid max-w-[var(--lumina-container)] gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden lg:col-span-5 lg:aspect-auto lg:min-h-[520px]">
            <Image
              src={LUMINA_IMAGES.studio}
              alt="Architectural outdoor living space with stone and glass"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            <div className="absolute inset-0 border border-[var(--lumina-line)]" />
            <div className="absolute bottom-6 left-6 right-6 border border-[var(--lumina-line)] bg-[var(--lumina-bg)]/80 p-4 backdrop-blur-sm">
              <p className="lumina-label text-[var(--lumina-bronze)]" style={luminaLabel}>
                Design-Led Practice
              </p>
              <p className="mt-1 text-sm text-[var(--lumina-cream-muted)]">
                Every project begins in the studio — not on a sales call.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center lg:col-span-7">
            <LuminaSectionLabel>The Studio</LuminaSectionLabel>
            <LuminaSectionHeading className="mb-6">
              A landscape practice built like an architecture firm
            </LuminaSectionHeading>
            <p className="mb-6 text-base leading-relaxed md:text-lg">
              Lumina Landscapes is not a mowing crew with a design brochure. We are a studio of
              landscape architects, horticulturists, and builders who treat every property as a
              site-specific composition — balancing structure, planting, light, and water into
              cohesive outdoor rooms.
            </p>
            <p className="mb-10 text-base leading-relaxed">
              Our clients don&apos;t hire us for maintenance. They hire us to reimagine how they
              live outside — from the first site walk to the final lighting adjustment at dusk.
            </p>

            <div className="grid grid-cols-3 gap-6 border-t border-[var(--lumina-line)] pt-8">
              {LUMINA_STUDIO_STATS.map((stat) => (
                <div key={stat.label}>
                  <p
                    className="lumina-display text-2xl text-[var(--lumina-bronze)] md:text-3xl"
                    style={luminaDisplay}
                  >
                    {stat.value}
                  </p>
                  <p className="lumina-label mt-2 text-[var(--lumina-cream-muted)]" style={luminaLabel}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionMotion>

      <div className="mx-auto max-w-[var(--lumina-container)] px-5 lumina-section-divider md:px-8 lg:px-12" />

      {/* 3. Design Process Journey */}
      <SectionMotion
        id={LUMINA_SECTIONS.process}
        className="relative overflow-hidden px-5 py-24 md:px-8 md:py-32 lg:px-12"
      >
        <LuminaBlueprintOverlay />
        <div className="relative mx-auto max-w-[var(--lumina-container)]">
          <div className="mb-16 max-w-2xl">
            <LuminaSectionLabel>Design Process</LuminaSectionLabel>
            <LuminaSectionHeading className="mb-4">
              A guided path from discovery to reveal
            </LuminaSectionHeading>
            <p className="text-base leading-relaxed">
              Six waypoints on the trail — each step documented, each decision intentional. This
              is how a backyard becomes a destination.
            </p>
          </div>

          <div className="relative">
            {/* SVG trail path — desktop */}
            <svg
              className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-full -translate-x-1/2 md:block"
              viewBox="0 0 1200 900"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d="M 80 40 Q 300 120 600 180 T 1120 320 Q 900 480 600 540 T 80 680 Q 400 760 600 820 T 1120 860"
                fill="none"
                stroke="rgba(184, 149, 106, 0.25)"
                strokeWidth="1.5"
                strokeDasharray="6 8"
              />
            </svg>

            <div className="relative flex flex-col gap-0 md:gap-4">
              {LUMINA_PROCESS_STEPS.map((step, i) => {
                const isEven = i % 2 === 0;
                return (
                  <div
                    key={step.step}
                    className={`relative grid items-center gap-6 py-8 md:grid-cols-2 md:gap-12 md:py-10 ${
                      isEven ? "" : "md:[direction:rtl]"
                    }`}
                  >
                    <div className={`${isEven ? "md:pr-8" : "md:pl-8 md:[direction:ltr]"}`}>
                      <div className="flex items-start gap-5">
                        <div className="relative shrink-0">
                          <div
                            className={`lumina-process-dot flex h-10 w-10 items-center justify-center rounded-full bg-[var(--lumina-bg-surface)] ${
                              i === 0 ? "lumina-process-dot-active" : ""
                            }`}
                          >
                            <span
                              className="lumina-label text-[10px] text-[var(--lumina-bronze)]"
                              style={luminaLabel}
                            >
                              {step.step}
                            </span>
                          </div>
                          {i < LUMINA_PROCESS_STEPS.length - 1 ? (
                            <div className="absolute left-1/2 top-10 h-[calc(100%+2rem)] w-px -translate-x-1/2 bg-linear-to-b from-[var(--lumina-bronze-dim)] to-transparent md:hidden" />
                          ) : null}
                        </div>
                        <div>
                          <h3
                            className="lumina-display mb-2 text-xl text-[var(--lumina-cream)] md:text-2xl"
                            style={luminaDisplay}
                          >
                            {step.title}
                          </h3>
                          <p className="text-sm leading-relaxed md:text-base">{step.description}</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`hidden md:block ${isEven ? "md:pl-8" : "md:pr-8 md:[direction:ltr]"}`}
                    >
                      {i === 2 ? (
                        <div className="relative aspect-video overflow-hidden border border-[var(--lumina-line)]">
                          <Image
                            src={LUMINA_IMAGES.processSketch}
                            alt="Architectural landscape design sketch"
                            fill
                            className="object-cover opacity-80"
                            sizes="40vw"
                          />
                        </div>
                      ) : (
                        <div className="flex h-full min-h-[100px] items-center justify-center border border-dashed border-[var(--lumina-line)] px-6 py-8">
                          <p className="lumina-label text-center text-[var(--lumina-bronze-dim)]" style={luminaLabel}>
                            Waypoint {step.step}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SectionMotion>

      {/* 4. Material Library */}
      <SectionMotion
        id={LUMINA_SECTIONS.materials}
        className="bg-[var(--lumina-bg-elevated)] px-5 py-24 md:px-8 md:py-32 lg:px-12"
      >
        <div className="mx-auto max-w-[var(--lumina-container)]">
          <div className="mb-14 text-center">
            <LuminaSectionLabel>Material Library</LuminaSectionLabel>
            <LuminaSectionHeading className="mx-auto max-w-2xl">
              Curated samples from our architecture-grade palette
            </LuminaSectionHeading>
            <p className="mx-auto mt-4 max-w-xl text-base">
              Each material is selected for texture, longevity, and the atmosphere it creates under
              natural and designed light.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LUMINA_MATERIALS.map((material) => (
              <article
                key={material.name}
                className="lumina-material-tile group relative aspect-[3/4] overflow-hidden bg-[var(--lumina-bg-surface)]"
              >
                <Image
                  src={material.image}
                  alt={material.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[var(--lumina-bg)] via-[var(--lumina-bg)]/20 to-transparent" />
                <div className="lumina-material-overlay absolute inset-0 bg-[var(--lumina-bg)]/40" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <h3
                    className="lumina-display text-lg text-[var(--lumina-cream)] md:text-xl"
                    style={luminaDisplay}
                  >
                    {material.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-90">{material.note}</p>
                </div>
                <div className="absolute right-4 top-4 h-8 w-8 border border-[var(--lumina-line-strong)] opacity-60" aria-hidden />
              </article>
            ))}
          </div>
        </div>
      </SectionMotion>

      {/* 5. Private Resort Experiences */}
      <LuminaExperiencesSection />

      {/* 6. Featured Transformations */}
      <SectionMotion
        id={LUMINA_SECTIONS.transformations}
        className="bg-[var(--lumina-bg-elevated)] px-5 py-24 md:px-8 md:py-32 lg:px-12"
      >
        <div className="mx-auto max-w-[var(--lumina-container)]">
          <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <LuminaSectionLabel>Featured Transformations</LuminaSectionLabel>
              <LuminaSectionHeading>Completed outdoor retreats</LuminaSectionHeading>
            </div>
            <p className="max-w-sm text-sm leading-relaxed md:text-right">
              Estate studies and backyard resorts — each documented as a full design-build case
              study.
            </p>
          </div>

          <div className="flex flex-col gap-16">
            {LUMINA_PROJECTS.map((project, i) => (
              <article
                key={project.name}
                className="grid gap-8 border border-[var(--lumina-line)] bg-[var(--lumina-bg)] lg:grid-cols-12"
              >
                <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[360px]">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 58vw, 100vw"
                  />
                  <div className="absolute left-0 top-0 h-full w-1 lumina-case-accent" aria-hidden />
                </div>

                <div className="flex flex-col justify-center px-6 pb-8 lg:col-span-5 lg:px-8 lg:py-10">
                  <p className="lumina-label mb-3 text-[var(--lumina-bronze)]" style={luminaLabel}>
                    Case Study {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3
                    className="lumina-display mb-4 text-2xl text-[var(--lumina-cream)] md:text-3xl"
                    style={luminaDisplay}
                  >
                    {project.name}
                  </h3>

                  <dl className="mb-6 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="lumina-label text-[var(--lumina-bronze-dim)]" style={luminaLabel}>
                        Project Type
                      </dt>
                      <dd className="mt-1 text-[var(--lumina-cream)]">{project.type}</dd>
                    </div>
                    <div>
                      <dt className="lumina-label text-[var(--lumina-bronze-dim)]" style={luminaLabel}>
                        Timeline
                      </dt>
                      <dd className="mt-1 text-[var(--lumina-cream)]">{project.timeline}</dd>
                    </div>
                  </dl>

                  <div className="mb-6">
                    <p className="lumina-label mb-2 text-[var(--lumina-bronze-dim)]" style={luminaLabel}>
                      Main Features
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {project.features.map((f) => (
                        <li
                          key={f}
                          className="border border-[var(--lumina-line)] px-3 py-1 text-xs text-[var(--lumina-cream-muted)]"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-sm leading-relaxed md:text-base">
                    <span className="text-[var(--lumina-cream)]">Result: </span>
                    {project.result}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </SectionMotion>

      {/* 7. Consultation Room */}
      <SectionMotion
        id={LUMINA_SECTIONS.consultation}
        className="relative overflow-hidden px-5 py-24 md:px-8 md:py-32 lg:px-12"
      >
        <LuminaBlueprintOverlay />
        <div className="relative mx-auto grid max-w-[var(--lumina-container)] gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <LuminaSectionLabel>Consultation Room</LuminaSectionLabel>
            <LuminaSectionHeading className="mb-6">
              Begin your landscape plan
            </LuminaSectionHeading>
            <p className="mb-8 max-w-md text-base leading-relaxed">
              This is not a quote form — it is the first step into our design studio. Share your
              property, your goals, and the retreat you imagine. We respond within two business days
              with a consultation invitation.
            </p>
            <div className="space-y-4 text-sm">
              <p className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[var(--lumina-bronze)]" aria-hidden>
                  mail
                </span>
                studio@luminalandscapes.demo
              </p>
              <p className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[var(--lumina-bronze)]" aria-hidden>
                  location_on
                </span>
                Design studio — by appointment only
              </p>
            </div>
          </div>

          <form
            className="border border-[var(--lumina-line)] bg-[var(--lumina-bg-elevated)] p-6 md:p-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <p className="lumina-label mb-6 text-[var(--lumina-bronze)]" style={luminaLabel}>
              Project Intake
            </p>

            <div className="space-y-5">
              <label className="block">
                <span className="lumina-label mb-2 block text-[var(--lumina-cream-muted)]" style={luminaLabel}>
                  Name
                </span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  className="lumina-input w-full px-4 py-3 text-sm text-[var(--lumina-cream)]"
                  placeholder="Your full name"
                />
              </label>

              <label className="block">
                <span className="lumina-label mb-2 block text-[var(--lumina-cream-muted)]" style={luminaLabel}>
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="lumina-input w-full px-4 py-3 text-sm text-[var(--lumina-cream)]"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block">
                <span className="lumina-label mb-2 block text-[var(--lumina-cream-muted)]" style={luminaLabel}>
                  Property Type
                </span>
                <select
                  name="propertyType"
                  className="lumina-input w-full px-4 py-3 text-sm text-[var(--lumina-cream)]"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select property type
                  </option>
                  {LUMINA_PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="lumina-label mb-2 block text-[var(--lumina-cream-muted)]" style={luminaLabel}>
                  Project Goals
                </span>
                <textarea
                  name="goals"
                  rows={3}
                  className="lumina-input w-full resize-none px-4 py-3 text-sm text-[var(--lumina-cream)]"
                  placeholder="Describe the outdoor retreat you envision..."
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="lumina-label mb-2 block text-[var(--lumina-cream-muted)]" style={luminaLabel}>
                    Budget Range
                  </span>
                  <select
                    name="budget"
                    className="lumina-input w-full px-4 py-3 text-sm text-[var(--lumina-cream)]"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select range
                    </option>
                    {LUMINA_BUDGET_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="lumina-label mb-2 block text-[var(--lumina-cream-muted)]" style={luminaLabel}>
                    Preferred Timeline
                  </span>
                  <select
                    name="timeline"
                    className="lumina-input w-full px-4 py-3 text-sm text-[var(--lumina-cream)]"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select timeline
                    </option>
                    {LUMINA_TIMELINE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="lumina-btn-primary lumina-label mt-8 w-full px-6 py-4 text-xs tracking-[0.18em]"
              style={luminaLabel}
            >
              Begin My Landscape Plan
            </button>
          </form>
        </div>
      </SectionMotion>
    </main>
  );
}
