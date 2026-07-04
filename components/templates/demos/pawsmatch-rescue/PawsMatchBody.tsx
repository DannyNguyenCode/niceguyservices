"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { PMR_PATHS, PMR_SECTIONS, pmrSectionHref } from "./pawsMatchRescueConfig";
import {
  PMR_ADOPTION_STEPS,
  PMR_DONATION_TIERS,
  PMR_FAQ_ITEMS,
  PMR_RESCUE_JOURNEY,
  PMR_SUCCESS_STORIES,
  PMR_VOLUNTEER_OPPORTUNITIES,
} from "./pawsMatchRescueData";
import { PMR_IMAGES } from "./pawsMatchRescueImages";
import {
  PmrButton,
  PmrContainer,
  PmrIcon,
  PmrSectionHeading,
  PmrSectionLabel,
  PmrTag,
  pmrBody,
  pmrDisplay,
} from "./PawsMatchShared";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
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
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      variants={fadeUp}
    >
      {children}
    </motion.section>
  );
}

export function PawsMatchHomeBody() {
  const [openFaq, setOpenFaq] = useState<string | null>(PMR_FAQ_ITEMS[0]?.id ?? null);

  return (
    <main className="pmr-body-text text-[var(--pmr-brown-muted)]" style={pmrBody}>
      {/* 1. Hero */}
      <section
        id={PMR_SECTIONS.hero}
        className="relative min-h-[520px] overflow-hidden bg-[var(--pmr-bg)] md:min-h-[580px] lg:min-h-[640px]"
      >
        <Image
          src={PMR_IMAGES.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:object-[center_30%]"
          aria-hidden
        />
        <p className="sr-only">A friendly golden retriever in warm sunlight</p>

        <PmrContainer className="relative z-10 flex min-h-[inherit] items-center py-24 md:py-32">
          <div className="max-w-xl rounded-2xl border border-[var(--pmr-line)] bg-[var(--pmr-card)]/65 p-6 text-left shadow-[var(--pmr-card-shadow)] backdrop-blur-md md:p-8 lg:p-10">
            <PmrTag variant="terracotta">Matching & Personalization</PmrTag>
            <PmrSectionHeading
              as="h1"
              className="mt-4 text-4xl leading-[1.12] md:text-5xl lg:text-[3.25rem]"
            >
              <span className="block">Find Your Perfect</span>
              <span className="block text-[var(--pmr-terracotta)]">Soul-Pet</span>
            </PmrSectionHeading>
            <p className="mt-5 max-w-lg text-base leading-relaxed md:text-lg">
              We match rescue animals with families who share their rhythm — energy, space,
              patience, and love. Not a transaction. A beginning.
            </p>
            <div className="mt-8 flex flex-wrap justify-start gap-3">
              <PmrButton href={PMR_PATHS.pets}>Meet Adoptable Pets</PmrButton>
              <PmrButton href={PMR_PATHS.process} variant="outline">
                How Adoption Works
              </PmrButton>
            </div>
          </div>
        </PmrContainer>
      </section>

      {/* Process: Journey + Rescue + Volunteer */}
      <section id={PMR_SECTIONS.process} className="scroll-mt-20 py-16 md:py-24">
        <PmrContainer>
          {/* Adoption Journey */}
          <div className="mb-20">
            <div className="mb-10 text-center">
              <PmrSectionLabel>The Perfect Journey</PmrSectionLabel>
              <PmrSectionHeading className="text-3xl md:text-4xl">
                Five Steps to Forever
              </PmrSectionHeading>
            </div>

            <div className="relative hidden xl:grid xl:grid-cols-5 xl:gap-4">
              {PMR_ADOPTION_STEPS.map((step) => (
                <div key={step.step} className="relative text-center">
                  <div
                    className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl ${step.accent === "terracotta"
                        ? "bg-[rgba(198,123,92,0.12)] text-[var(--pmr-terracotta)]"
                        : step.accent === "sage"
                          ? "bg-[var(--pmr-sage-light)] text-[var(--pmr-sage-muted)]"
                          : "bg-[var(--pmr-bg-warm)] text-[var(--pmr-brown)]"
                      }`}
                  >
                    <PmrIcon name={step.icon} className="text-3xl" />
                  </div>
                  <span className="pmr-label text-[var(--pmr-terracotta)]">Step {step.step}</span>
                  <h3 className="mt-2 text-xl font-bold text-[var(--pmr-brown)]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 xl:hidden">
              {PMR_ADOPTION_STEPS.map((step) => (
                <div key={step.step} className="pmr-card flex gap-4 p-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--pmr-sage-light)] text-[var(--pmr-sage-muted)]">
                    <PmrIcon name={step.icon} className="text-2xl" />
                  </div>
                  <div>
                    <span className="pmr-label text-[var(--pmr-terracotta)]">Step {step.step}</span>
                    <h3 className="font-bold text-[var(--pmr-brown)]">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rescue Journey */}
          <SectionMotion className="mb-20">
            <div className="pmr-card overflow-hidden">
              <div className="grid lg:grid-cols-2">
                <div className="p-8 md:p-10 lg:p-12">
                  <PmrSectionLabel>Our Rescue Journey</PmrSectionLabel>
                  <PmrSectionHeading className="mb-6 text-2xl md:text-3xl">
                    From Intake to{" "}
                    <span className="text-[var(--pmr-terracotta)]">Forever Home</span>
                  </PmrSectionHeading>
                  <ul className="space-y-5">
                    {PMR_RESCUE_JOURNEY.map((item, i) => (
                      <li key={item.title} className="flex gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--pmr-terracotta)] text-sm font-bold text-white">
                          {i + 1}
                        </span>
                        <div>
                          <h4 className="font-semibold text-[var(--pmr-brown)]">{item.title}</h4>
                          <p className="mt-1 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative min-h-[280px] lg:min-h-0">
                  <Image
                    src={PMR_IMAGES.rescueJourney}
                    alt="Volunteer caring for a rescue dog in a warm shelter environment"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </SectionMotion>

          {/* Volunteer Board */}
          <SectionMotion>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <PmrSectionLabel>Community Board</PmrSectionLabel>
                <PmrSectionHeading className="text-2xl md:text-3xl">
                  Volunteer With Us
                </PmrSectionHeading>
                <p className="mt-2 max-w-lg text-sm">
                  Pin your skills to our board — every shift moves a pet closer to their person.
                </p>
              </div>
              <PmrButton href={pmrSectionHref(PMR_SECTIONS.contact)} variant="outline" className="shrink-0">
                Become a Volunteer
              </PmrButton>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PMR_VOLUNTEER_OPPORTUNITIES.map((opp) => (
                <article
                  key={opp.id}
                  className="pmr-pinned-card relative mt-3 p-5 pt-6"
                  style={{ transform: `rotate(${opp.rotation}deg)` }}
                >
                  <PmrIcon name={opp.icon} className="mb-3 text-2xl text-[var(--pmr-terracotta)]" />
                  <h3 className="font-bold text-[var(--pmr-brown)]">{opp.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{opp.description}</p>
                  <a
                    href={pmrSectionHref(PMR_SECTIONS.contact)}
                    className="pmr-focus-ring mt-4 inline-flex text-sm font-semibold text-[var(--pmr-terracotta)]"
                  >
                    Sign up →
                  </a>
                </article>
              ))}
            </div>
          </SectionMotion>
        </PmrContainer>
      </section>

      {/* 8. Donate / Pantry */}
      <section id={PMR_SECTIONS.donate} className="scroll-mt-20 bg-[var(--pmr-bg-warm)] py-16 md:py-24">
        <PmrContainer>
          <div className="mb-10 text-center">
            <PmrSectionLabel>The Pantry</PmrSectionLabel>
            <PmrSectionHeading className="text-3xl md:text-4xl">
              Tangible Impact, One Gift at a Time
            </PmrSectionHeading>
            <p className="mx-auto mt-3 max-w-xl text-sm md:text-base">
              Every dollar goes directly to food, medicine, and emergency care for animals
              waiting for their match.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PMR_DONATION_TIERS.map((tier) => (
              <div
                key={tier.label}
                className={`pmr-pantry-tier p-6 ${"highlight" in tier && tier.highlight ? "pmr-pantry-tier-highlight" : ""}`}
              >
                {"amount" in tier && tier.amount > 0 ? (
                  <p className="text-3xl font-bold text-[var(--pmr-terracotta)]">${tier.amount}</p>
                ) : (
                  <PmrIcon name="volunteer_activism" className="text-3xl text-[var(--pmr-terracotta)]" />
                )}
                <h3 className="mt-3 font-bold text-[var(--pmr-brown)]">{tier.label}</h3>
                <p className="mt-2 text-sm leading-relaxed">{tier.description}</p>
              </div>
            ))}
          </div>

          <div className="pmr-pantry-card mt-10 flex flex-col items-center justify-between gap-6 p-8 md:flex-row md:p-10">
            <div>
              <h3 className="text-2xl font-bold" style={pmrDisplay}>
                Keep The Pantry Stocked
              </h3>
              <p className="mt-2 max-w-md text-sm text-white/85">
                Donate supplies or set up a monthly gift — our wishlist is updated weekly with
                what rescues need most.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={pmrSectionHref(PMR_SECTIONS.contact)}
                className="pmr-focus-ring inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--pmr-brown)] transition-opacity hover:opacity-90"
              >
                Donate Now
              </a>
              <a
                href={pmrSectionHref(PMR_SECTIONS.contact)}
                className="pmr-focus-ring inline-flex items-center justify-center rounded-full border border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                View Wishlist
              </a>
            </div>
          </div>
        </PmrContainer>
      </section>

      {/* 9. Success Stories — Storybook style */}
      <section id={PMR_SECTIONS.stories} className="scroll-mt-20 py-16 md:py-24">
        <PmrContainer>
          <div className="mb-12 text-center">
            <PmrSectionLabel>Happy Trails</PmrSectionLabel>
            <PmrSectionHeading serif className="text-3xl md:text-4xl">
              Success Stories
            </PmrSectionHeading>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            {PMR_SUCCESS_STORIES.map((story) => (
              <article key={story.id} className="pmr-story-card p-6 md:p-8">
                <p className="pmr-label mb-4 text-[var(--pmr-terracotta)]">{story.chapter}</p>
                <div
                  className="pmr-scrapbook-photo relative mx-auto mb-6 aspect-[4/3] w-full max-w-[240px] overflow-hidden rounded-md"
                  style={{ transform: `rotate(${story.rotation}deg)` }}
                >
                  <Image
                    src={story.image}
                    alt={story.imageAlt}
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                </div>
                <h3
                  className="pmr-display mb-3 text-center text-xl text-[var(--pmr-brown)]"
                  style={pmrDisplay}
                >
                  {story.title}
                </h3>
                <blockquote className="text-center text-sm italic leading-relaxed text-[var(--pmr-brown-muted)]">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
                <p className="mt-4 text-center text-xs font-semibold text-[var(--pmr-brown-light)]">
                  — {story.author}
                </p>
              </article>
            ))}
          </div>
        </PmrContainer>
      </section>

      {/* 10–11. Contact: FAQ + Final CTA */}
      <section id={PMR_SECTIONS.contact} className="scroll-mt-20 bg-[var(--pmr-bg-warm)] py-16 md:py-24">
        <PmrContainer>
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 text-center">
              <PmrSectionLabel>Questions</PmrSectionLabel>
              <PmrSectionHeading className="text-2xl md:text-3xl">FAQ</PmrSectionHeading>
            </div>

            <div className="space-y-3">
              {PMR_FAQ_ITEMS.map((item) => {
                const isOpen = openFaq === item.id;
                return (
                  <div key={item.id} className="pmr-card overflow-hidden">
                    <button
                      type="button"
                      className="pmr-focus-ring flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : item.id)}
                    >
                      <span className="font-semibold text-[var(--pmr-brown)]">{item.question}</span>
                      <PmrIcon
                        name="expand_more"
                        className={`shrink-0 text-xl text-[var(--pmr-terracotta)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className="pmr-accordion-content"
                      style={{
                        maxHeight: isOpen ? "200px" : "0",
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <p className="border-t border-[var(--pmr-line)] px-5 py-4 text-sm leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Final CTA */}
          <div className="pmr-card mx-auto mt-16 max-w-3xl px-8 py-12 text-center md:px-12 md:py-16">
            <PmrSectionHeading serif className="text-2xl leading-snug md:text-4xl">
              Your next chapter could start with a pawprint.
            </PmrSectionHeading>
            <p className="mx-auto mt-4 max-w-md text-sm md:text-base">
              Whether you&apos;re ready to adopt, foster, or volunteer — we&apos;re here to walk
              beside you every step of the way.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <PmrButton href={PMR_PATHS.pets}>Discover pets</PmrButton>
              <PmrButton href={PMR_PATHS.account} variant="outline">
                My applications
              </PmrButton>
            </div>
          </div>
        </PmrContainer>
      </section>
    </main>
  );
}

/** @deprecated Use PawsMatchHomeBody */
export { PawsMatchHomeBody as PawsMatchBody };
