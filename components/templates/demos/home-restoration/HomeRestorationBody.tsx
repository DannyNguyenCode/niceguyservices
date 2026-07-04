"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HR_SECTIONS, hrSectionHref } from "./homeRestorationConfig";
import {
  HR_BEFORE_AFTER,
  HR_CLIENT_STORIES,
  HR_JOURNEY_STEPS,
  HR_PACKAGES,
  HR_SPACES,
  HR_TRUST_ITEMS,
  type RestorationSpace,
} from "./homeRestorationData";
import { HR_IMAGES } from "./homeRestorationImages";
import { HomeRestorationBeforeAfter } from "./HomeRestorationBeforeAfter";
import { HomeRestorationBooking } from "./HomeRestorationBooking";
import { HomeRestorationSpaceModal } from "./HomeRestorationSpaceModal";
import {
  HrArchFrame,
  HrButton,
  HrContainer,
  HrIcon,
  HrSectionHeading,
  HrSectionLabel,
  hrBody,
  hrDisplay,
} from "./HomeRestorationShared";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function SectionMotion({
  children,
  className = "",
  id,
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
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
      data-dark={dark || undefined}
    >
      {children}
    </motion.section>
  );
}

function HeroSection() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 40]);
  const imageScale = useTransform(scrollY, [0, 600], [1, reduce ? 1 : 1.06]);

  return (
    <section
      id={HR_SECTIONS.hero}
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-[var(--hr-bg)] pt-24 pb-16 md:pt-28"
    >
      <HrContainer>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
          >
            <HrSectionLabel>Premium Home Concierge</HrSectionLabel>
            <h1
              className="hr-display mb-6 text-4xl leading-[1.08] text-[var(--hr-charcoal)] md:text-5xl lg:text-[3.25rem]"
              style={hrDisplay}
            >
              The Art of Home Restoration
            </h1>
            <p className="mb-8 max-w-lg text-base leading-relaxed text-[var(--hr-charcoal-muted)] md:text-lg">
              A premium experience focused on restoring comfort, cleanliness, and peace of mind to
              your home — not merely cleaning it, but reclaiming your sanctuary.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <HrButton href={hrSectionHref(HR_SECTIONS.contact)}>Book Consultation</HrButton>
              <HrButton href={hrSectionHref(HR_SECTIONS.process)} variant="ghost">
                Explore Our Process
              </HrButton>
            </div>
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-md lg:max-w-none"
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            <HrArchFrame className="aspect-[3/4] w-full md:aspect-[4/5]">
              <motion.div
                className="relative h-full w-full"
                style={{ y: imageY, scale: imageScale }}
              >
                <Image
                  src={HR_IMAGES.hero}
                  alt="Sunlit minimalist interior with architectural arches"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
            </HrArchFrame>
          </motion.div>
        </div>
      </HrContainer>
    </section>
  );
}

function SanctuarySection() {
  return (
    <SectionMotion
      id={HR_SECTIONS.sanctuary}
      className="bg-[var(--hr-bg-elevated)] py-20 md:py-28"
    >
      <HrContainer>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[var(--hr-shadow-lg)]">
            <Image
              src={HR_IMAGES.sanctuary}
              alt="Calm, restored living space with warm natural light"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <HrSectionLabel>Emotional Story</HrSectionLabel>
            <HrSectionHeading className="mb-6 text-3xl leading-tight md:text-4xl">
              A Home Should Feel Like a Sanctuary
            </HrSectionHeading>
            <div className="space-y-4 text-base leading-relaxed text-[var(--hr-charcoal-muted)]">
              <p>
                Between demanding careers, family rhythms, and the quiet accumulation of daily life,
                even the most beautiful homes lose their sense of calm. Surfaces fill. Closets swell.
                The feeling of refuge gives way to a low hum of overwhelm.
              </p>
              <p>
                We exist to restore that feeling — not with harsh chemicals or rushed routines, but
                with the considered care of a boutique hospitality team treating your home as a living
                space deserving of intention.
              </p>
              <p>
                Every restoration visit is designed to return comfort, clarity, and peace of mind —
                so you walk through your door and exhale.
              </p>
            </div>
          </div>
        </div>
      </HrContainer>
    </SectionMotion>
  );
}

function TrustBar() {
  const reduce = useReducedMotion();

  return (
    <section
      id={HR_SECTIONS.trust}
      className="border-y border-[var(--hr-line)] bg-[var(--hr-bg)] py-8 md:py-10"
    >
      <HrContainer>
        <motion.ul
          className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8"
          variants={reduce ? undefined : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {HR_TRUST_ITEMS.map((item) => (
            <motion.li
              key={item.label}
              variants={reduce ? undefined : fadeUp}
              className="hr-trust-item flex flex-col items-center gap-2 text-center text-[var(--hr-charcoal-muted)]"
            >
              <HrIcon name={item.icon} className="text-2xl text-[var(--hr-gold)]" />
              <span className="text-xs font-medium tracking-wide md:text-sm">{item.label}</span>
            </motion.li>
          ))}
        </motion.ul>
      </HrContainer>
    </section>
  );
}

function SpacesSection({
  onSelectSpace,
}: {
  onSelectSpace: (space: RestorationSpace) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <SectionMotion id={HR_SECTIONS.spaces} className="bg-[var(--hr-bg)] py-20 md:py-28">
      <HrContainer>
        <div className="mb-12 max-w-2xl">
          <HrSectionLabel>Curated Services</HrSectionLabel>
          <HrSectionHeading className="text-3xl md:text-4xl">
            Curated Restoration Services
          </HrSectionHeading>
          <p className="mt-4 text-[var(--hr-charcoal-muted)]">
            Each space in your home carries a different rhythm. We restore them with the same
            editorial care a design studio brings to a new commission.
          </p>
        </div>

        <motion.div
          className="grid auto-rows-[200px] grid-cols-1 gap-4 md:auto-rows-[220px] md:grid-cols-3 md:gap-5"
          variants={reduce ? undefined : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {HR_SPACES.map((space) => (
            <motion.button
              key={space.id}
              type="button"
              variants={reduce ? undefined : fadeUp}
              onClick={() => onSelectSpace(space)}
              className={`hr-space-card hr-focus-ring group text-left ${space.gridClass}`}
              aria-label={`View restoration details for ${space.title}`}
            >
              <div className="relative h-full w-full">
                <Image
                  src={space.image}
                  alt={space.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="hr-space-img object-cover"
                />
                <div className="hr-space-overlay absolute inset-0 bg-[var(--hr-charcoal)]/50" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                  <h3 className="hr-display text-xl text-white md:text-2xl" style={hrDisplay}>
                    {space.title}
                  </h3>
                  <p className="mt-1 max-w-xs text-sm text-white/80">{space.description}</p>
                  <span className="hr-space-cta hr-label mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-white backdrop-blur-sm">
                    View Restoration Details
                    <HrIcon name="arrow_forward" className="text-sm" />
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </HrContainer>
    </SectionMotion>
  );
}

function ProcessSection() {
  const reduce = useReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);
  const lineInView = useInView(lineRef, { once: true, margin: "-80px" });

  return (
    <SectionMotion
      id={HR_SECTIONS.process}
      className="bg-[var(--hr-charcoal)] py-20 text-[var(--hr-bg-elevated)] md:py-28"
      dark
    >
      <HrContainer>
        <div className="mb-14 text-center">
          <HrSectionLabel>The Restoration Journey</HrSectionLabel>
          <HrSectionHeading className="text-3xl text-[var(--hr-bg-elevated)] md:text-4xl">
            The Path to Purity
          </HrSectionHeading>
        </div>

        <div ref={lineRef} className="relative">
          <svg
            className="pointer-events-none absolute left-0 right-0 top-8 hidden h-1 w-full md:block"
            preserveAspectRatio="none"
            aria-hidden
          >
            <line
              x1="12.5%"
              y1="0"
              x2="87.5%"
              y2="0"
              className={`hr-timeline-line ${lineInView ? "hr-timeline-active" : ""}`}
            />
          </svg>

          <div className="grid gap-8 md:grid-cols-4 md:gap-6">
            {HR_JOURNEY_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                className="hr-timeline-step group text-center"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
                  <svg className="absolute inset-0" viewBox="0 0 64 64" aria-hidden>
                    <circle cx="32" cy="32" r="8" className="hr-timeline-dot" />
                  </svg>
                  <span className="hr-display relative z-10 text-lg text-[var(--hr-gold)]" style={hrDisplay}>
                    {step.step}
                  </span>
                </div>
                <h3 className="hr-display mb-2 text-lg text-[var(--hr-bg-elevated)]" style={hrDisplay}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--hr-beige)]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </HrContainer>
    </SectionMotion>
  );
}

function GallerySection() {
  return (
    <SectionMotion id={HR_SECTIONS.gallery} className="bg-[var(--hr-bg-elevated)] py-20 md:py-28">
      <HrContainer>
        <div className="mb-12 text-center">
          <HrSectionLabel>Transformation</HrSectionLabel>
          <HrSectionHeading className="text-3xl md:text-4xl">Restored Spaces</HrSectionHeading>
          <p className="mx-auto mt-4 max-w-xl text-[var(--hr-charcoal-muted)]">
            See the difference thoughtful restoration makes. Drag each slider to witness the
            transformation.
          </p>
        </div>
        <HomeRestorationBeforeAfter items={HR_BEFORE_AFTER} />
      </HrContainer>
    </SectionMotion>
  );
}

function PackagesSection() {
  const reduce = useReducedMotion();

  return (
    <SectionMotion id={HR_SECTIONS.packages} className="bg-[var(--hr-bg)] py-20 md:py-28">
      <HrContainer>
        <div className="mb-12 text-center">
          <HrSectionLabel>Hospitality Tiers</HrSectionLabel>
          <HrSectionHeading className="text-3xl md:text-4xl">
            The Hospitality Tiers
          </HrSectionHeading>
          <p className="mx-auto mt-4 max-w-xl text-[var(--hr-charcoal-muted)]">
            Choose the rhythm of care that suits your home — each tier styled with the attention of
            a luxury hotel suite.
          </p>
        </div>

        <motion.div
          className="grid gap-6 lg:grid-cols-3 lg:gap-8"
          variants={reduce ? undefined : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {HR_PACKAGES.map((pkg) => (
            <motion.article
              key={pkg.id}
              variants={reduce ? undefined : fadeUp}
              className={`hr-package-card flex flex-col p-6 md:p-8 ${
                pkg.featured ? "hr-package-featured lg:-mt-4 lg:mb-4" : ""
              }`}
            >
              {pkg.featured ? (
                <span className="hr-label mb-4 inline-flex w-fit rounded-full bg-[var(--hr-gold)] px-3 py-1 text-[var(--hr-charcoal)]">
                  Most Popular
                </span>
              ) : null}
              <h3
                className={`hr-display mb-1 text-xl ${pkg.featured ? "text-[var(--hr-bg-elevated)]" : "text-[var(--hr-charcoal)]"}`}
                style={hrDisplay}
              >
                {pkg.name}
              </h3>
              <p
                className={`mb-4 text-sm ${pkg.featured ? "text-[var(--hr-beige)]" : "text-[var(--hr-charcoal-light)]"}`}
              >
                {pkg.tagline}
              </p>
              <p
                className={`hr-display mb-6 text-3xl ${pkg.featured ? "text-[var(--hr-gold-light)]" : "text-[var(--hr-charcoal)]"}`}
                style={hrDisplay}
              >
                {pkg.price}
              </p>
              <ul className="mb-6 flex-1 space-y-2.5">
                {pkg.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex items-start gap-2 text-sm ${pkg.featured ? "text-[var(--hr-beige)]" : "text-[var(--hr-charcoal-muted)]"}`}
                  >
                    <HrIcon name="check" className={`mt-0.5 shrink-0 text-base ${pkg.featured ? "text-[var(--hr-gold-light)]" : "hr-check-icon"}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <div
                className={`mb-6 space-y-1 text-xs ${pkg.featured ? "text-[var(--hr-beige)]" : "text-[var(--hr-charcoal-light)]"}`}
              >
                <p>
                  <span className="font-medium">Duration:</span> {pkg.duration}
                </p>
                <p>
                  <span className="font-medium">Recommended:</span> {pkg.recommended}
                </p>
              </div>
              <HrButton
                href={hrSectionHref(HR_SECTIONS.contact)}
                variant={pkg.featured ? "primary" : "outline"}
                className={`w-full ${pkg.featured ? "bg-[var(--hr-gold)] text-[var(--hr-charcoal)] hover:bg-[var(--hr-gold-light)]" : ""}`}
              >
                Book Now
              </HrButton>
            </motion.article>
          ))}
        </motion.div>
      </HrContainer>
    </SectionMotion>
  );
}

function StoriesSection() {
  const reduce = useReducedMotion();

  return (
    <SectionMotion id={HR_SECTIONS.stories} className="bg-[var(--hr-bg-warm)] py-20 md:py-28">
      <HrContainer>
        <div className="mb-14 text-center">
          <HrSectionLabel>Client Stories</HrSectionLabel>
          <HrSectionHeading className="text-3xl md:text-4xl">
            Beyond Clean: Restored Homes
          </HrSectionHeading>
        </div>

        <div className="space-y-20 md:space-y-28">
          {HR_CLIENT_STORIES.map((story, i) => (
            <motion.article
              key={story.id}
              className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                story.align === "right" ? "lg:[&>*:first-child]:order-2" : ""
              }`}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.05 }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[var(--hr-shadow-lg)]">
                <Image
                  src={story.image}
                  alt={story.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div>
                <HrSectionLabel>{story.location}</HrSectionLabel>
                <HrSectionHeading as="h3" className="mb-6 text-2xl md:text-3xl">
                  {story.title}
                </HrSectionHeading>
                <div className="space-y-5">
                  <div>
                    <h4 className="hr-label mb-2 text-[var(--hr-gold)]">The Challenge</h4>
                    <p className="text-sm leading-relaxed text-[var(--hr-charcoal-muted)]">
                      {story.challenge}
                    </p>
                  </div>
                  <div>
                    <h4 className="hr-label mb-2 text-[var(--hr-gold)]">The Restoration</h4>
                    <p className="text-sm leading-relaxed text-[var(--hr-charcoal-muted)]">
                      {story.restoration}
                    </p>
                  </div>
                  <div>
                    <h4 className="hr-label mb-2 text-[var(--hr-gold)]">The Result</h4>
                    <p className="text-sm leading-relaxed text-[var(--hr-charcoal-muted)]">
                      {story.result}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </HrContainer>
    </SectionMotion>
  );
}

function ContactSection() {
  return (
    <SectionMotion
      id={HR_SECTIONS.contact}
      className="bg-[var(--hr-charcoal)] py-20 md:py-28"
      dark
    >
      <HrContainer>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-[var(--hr-bg-elevated)]">
            <HrSectionLabel>Concierge Experience</HrSectionLabel>
            <HrSectionHeading className="mb-6 text-3xl text-[var(--hr-bg-elevated)] md:text-4xl">
              Begin Your Restoration
            </HrSectionHeading>
            <p className="mb-8 max-w-md text-sm leading-relaxed text-[var(--hr-beige)]">
              Tell us about your home and we&apos;ll craft a restoration plan tailored to your
              rhythm. Our concierge team responds within one business day.
            </p>
            <ul className="space-y-3 text-sm text-[var(--hr-beige)]">
              {[
                "Personalized home assessment",
                "Flexible scheduling to your calendar",
                "White-glove service from arrival to walkthrough",
                "Eco-friendly products throughout",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <HrIcon name="check_circle" className="text-[var(--hr-gold)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <HomeRestorationBooking />
        </div>
      </HrContainer>
    </SectionMotion>
  );
}

export function HomeRestorationBody() {
  const [selectedSpace, setSelectedSpace] = useState<RestorationSpace | null>(null);

  return (
    <main className="hr-body-text text-[var(--hr-charcoal-muted)]" style={hrBody}>
      <HeroSection />
      <SanctuarySection />
      <TrustBar />
      <SpacesSection onSelectSpace={setSelectedSpace} />
      <ProcessSection />
      <GallerySection />
      <PackagesSection />
      <StoriesSection />
      <ContactSection />
      <HomeRestorationSpaceModal
        space={selectedSpace}
        onClose={() => setSelectedSpace(null)}
      />
    </main>
  );
}
