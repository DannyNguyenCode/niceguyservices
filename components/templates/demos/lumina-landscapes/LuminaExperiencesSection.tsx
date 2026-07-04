"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { LUMINA_SECTIONS } from "./luminaConfig";
import { LUMINA_EXPERIENCES } from "./luminaData";
import {
  LuminaSectionHeading,
  LuminaSectionLabel,
  luminaBody,
  luminaDisplay,
  luminaLabel,
} from "./LuminaShared";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

function FadeInMotion({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1], delay }}
      variants={fadeIn}
    >
      {children}
    </motion.div>
  );
}

function ExperienceMotion({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <article className={className}>{children}</article>;
  }
  return (
    <motion.article
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1], delay }}
      variants={fadeIn}
    >
      {children}
    </motion.article>
  );
}

type LuminaExperiencesSectionProps = {
  /** Extra top padding when rendered below fixed nav on a standalone page. */
  standalone?: boolean;
};

export function LuminaExperiencesSection({ standalone = false }: LuminaExperiencesSectionProps) {
  return (
    <section
      id={LUMINA_SECTIONS.experiences}
      className={`relative overflow-x-clip px-5 md:px-8 lg:px-12 ${
        standalone ? "pb-24 pt-36 md:pb-32 md:pt-40" : "py-24 md:py-32"
      }`}
    >
      <div
        className="lumina-body-text mx-auto max-w-[var(--lumina-container)] text-[var(--lumina-cream-muted)]"
        style={luminaBody}
      >
        <FadeInMotion className="mb-16 max-w-2xl">
          <LuminaSectionLabel>Private Resort Experiences</LuminaSectionLabel>
          <LuminaSectionHeading className="mb-4">
            Outdoor destinations designed for how you live
          </LuminaSectionHeading>
          <p className="text-base leading-relaxed">
            Each space is a chapter in your property&apos;s story — not a catalog feature, but a
            place you return to every season.
          </p>
        </FadeInMotion>

        <div className="flex flex-col gap-20 md:gap-28">
          {LUMINA_EXPERIENCES.map((exp, i) => (
            <ExperienceMotion
              key={exp.id}
              delay={i * 0.06}
              className="lumina-experience-block grid min-w-0 items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <div
                className={`relative min-w-0 aspect-[4/3] overflow-hidden lg:aspect-[5/4] ${
                  exp.align === "right" ? "lg:col-start-2 lg:row-start-1" : ""
                }`}
              >
                <Image
                  src={exp.image}
                  alt=""
                  aria-labelledby={`lumina-experience-${exp.id}-title`}
                  fill
                  className="lumina-experience-image object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[var(--lumina-bg)]/60 via-transparent to-transparent" />
                <span
                  className="lumina-label absolute left-5 top-5 border border-[var(--lumina-line)] bg-[var(--lumina-bg)]/70 px-3 py-1.5 text-[var(--lumina-bronze)] backdrop-blur-sm"
                  style={luminaLabel}
                >
                  Destination {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div
                className={`min-w-0 ${
                  exp.align === "right" ? "lg:col-start-1 lg:row-start-1" : ""
                }`}
              >
                <h3
                  id={`lumina-experience-${exp.id}-title`}
                  className="lumina-display lumina-experience-title mb-4 text-2xl text-[var(--lumina-cream)] md:text-3xl lg:text-4xl"
                  style={luminaDisplay}
                >
                  {exp.title}
                </h3>
                <p className="mb-8 text-base leading-relaxed md:text-lg">{exp.description}</p>
                <div className="flex flex-wrap gap-6 border-t border-[var(--lumina-line)] pt-6">
                  <div>
                    <p className="lumina-label text-[var(--lumina-bronze-dim)]" style={luminaLabel}>
                      Design Style
                    </p>
                    <p className="mt-1 text-sm text-[var(--lumina-cream)]">{exp.style}</p>
                  </div>
                  <div>
                    <p className="lumina-label text-[var(--lumina-bronze-dim)]" style={luminaLabel}>
                      Feature
                    </p>
                    <p className="mt-1 text-sm text-[var(--lumina-cream)]">{exp.feature}</p>
                  </div>
                </div>
              </div>
            </ExperienceMotion>
          ))}
        </div>
      </div>
    </section>
  );
}
