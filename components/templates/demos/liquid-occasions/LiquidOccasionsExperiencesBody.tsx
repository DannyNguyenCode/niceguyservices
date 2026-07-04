"use client";

import Link from "next/link";
import {
  LoContainer,
  LoFooter,
  LoIcon,
  LoImg,
  LoNav,
  LoWaveDivider,
} from "./LiquidOccasionsShared";
import { LO_PATHS } from "./liquidOccasionsConfig";
import { LO_IMAGES } from "./liquidOccasionsImages";
import { useLoReveal, useLoScrollPath } from "./useLoReveal";

export function LiquidOccasionsExperiencesBody() {
  useLoScrollPath(".lo-yellow-path-vertical");
  useLoReveal(".lo-experience-circle");

  return (
    <>
      <LoNav ctaVariant="container" />
      <main className="relative overflow-hidden pt-40">
        <div className="lo-yellow-path-vertical top-0 bottom-0 hidden opacity-20 lg:block" />

        <section className="relative z-10 mx-auto mb-[var(--lo-section-gap)] max-w-[var(--lo-container-max)] px-[var(--lo-gutter)] text-center">
          <span className="lo-label mb-4 block tracking-widest text-[var(--lo-secondary)]">
            Crafting the Unforgettable
          </span>
          <h1 className="lo-display mx-auto mb-6 max-w-4xl text-[var(--lo-on-surface)]">
            Journeys Defined by <span className="text-[var(--lo-primary)] italic">Emotion</span>
          </h1>
          <p className="lo-body-lg mx-auto max-w-2xl text-[var(--lo-on-surface-variant)]">
            We don&apos;t just plan logistics; we architect memories. Every liquid occasion is a fluid
            narrative designed to resonate long after the final toast.
          </p>
        </section>

        <section className="relative overflow-visible py-20">
          <LoContainer className="grid items-center gap-16 lg:grid-cols-2">
            <div className="lo-experience-circle lo-scroll-reveal group relative order-2 lg:order-1">
              <div className="absolute -inset-4 scale-110 rounded-full border-2 border-[color-mix(in_srgb,var(--lo-secondary)_20%,transparent)]" />
              <svg className="pointer-events-none absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
                <circle className="lo-circle-stroke" cx="50" cy="50" fill="none" r="48" stroke="#fdd815" strokeWidth="0.5" />
              </svg>
              <div className="relative z-10 aspect-square overflow-hidden rounded-full shadow-2xl">
                <LoImg
                  src={LO_IMAGES.experiences.weddings}
                  alt="Luxury wedding reception in a Mediterranean garden at dusk"
                  fill
                  className="transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 z-20 flex h-32 w-32 items-center justify-center rounded-full bg-[var(--lo-secondary-container)] shadow-lg">
                <LoIcon name="favorite" className="text-4xl text-[var(--lo-on-secondary-container)]" />
              </div>
            </div>
            <div className="order-1 lg:order-2 lg:pl-12">
              <h2 className="lo-headline-lg mb-6 text-[var(--lo-on-surface)]">Weddings</h2>
              <p className="lo-body-lg mb-8 text-[var(--lo-on-surface-variant)]">
                A union of souls deserves more than a schedule. We weave your personal history into a
                sensory journey, creating a day that feels like a shared dream brought to life.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Bespoke Design", "Intimate Narrative"].map((tag) => (
                  <span
                    key={tag}
                    className="lo-label rounded-full bg-[var(--lo-secondary-fixed)] px-4 py-1.5 text-[var(--lo-on-secondary-fixed)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </LoContainer>
        </section>

        <LoWaveDivider className="fill-[var(--lo-surface-container)] -mt-1" />

        <section className="bg-[var(--lo-surface-container)] py-20">
          <LoContainer className="grid items-center gap-16 lg:grid-cols-2">
            <div className="lg:pr-12">
              <h2 className="lo-headline-lg mb-6 text-[var(--lo-on-surface)]">Corporate Events</h2>
              <p className="lo-body-lg mb-8 text-[var(--lo-on-surface-variant)]">
                Transform business objectives into immersive brand experiences. We elevate the standard
                corporate gathering into a dynamic environment that inspires loyalty and innovation.
              </p>
              <Link
                href={LO_PATHS.portfolio}
                className="lo-label inline-block rounded-full bg-[var(--lo-primary)] px-8 py-3 text-[var(--lo-on-primary)] shadow-xl transition-transform hover:scale-105"
              >
                View Case Studies
              </Link>
            </div>
            <div className="lo-experience-circle lo-scroll-reveal group relative">
              <div className="absolute -inset-4 scale-110 rounded-full border-2 border-[color-mix(in_srgb,var(--lo-primary)_10%,transparent)]" />
              <div className="relative z-10 aspect-square overflow-hidden rounded-full shadow-2xl">
                <LoImg
                  src={LO_IMAGES.experiences.corporate}
                  alt="Sophisticated corporate summit in a modern architectural space"
                  fill
                  className="transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
            </div>
          </LoContainer>
        </section>

        <LoWaveDivider flip fillClass="fill-[var(--lo-surface-container)]" />

        <section className="relative py-20">
          <LoContainer className="flex flex-col items-center text-center">
            <div className="lo-experience-circle lo-scroll-reveal group relative mb-12 w-full max-w-lg">
              <div className="aspect-square overflow-hidden rounded-full border-[16px] border-[var(--lo-surface)] shadow-2xl">
                <LoImg
                  src={LO_IMAGES.experiences.social}
                  alt="Vibrant birthday celebration in a luxury rooftop lounge"
                  fill
                  className="transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              <div className="absolute top-0 -left-10 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--lo-secondary)] text-[var(--lo-on-secondary)] shadow-lg">
                <LoIcon name="celebration" className="text-3xl" />
              </div>
            </div>
            <h2 className="lo-headline-lg mb-6 text-[var(--lo-on-surface)]">Social Celebrations</h2>
            <p className="lo-body-lg mb-8 max-w-2xl text-[var(--lo-on-surface-variant)]">
              Milestones aren&apos;t just dates; they are the chapters of your life. We curate the
              atmosphere, the sound, and the flavor to ensure your celebration feels exactly as it
              should: legendary.
            </p>
            <div className="flex gap-4">
              {["local_bar", "music_note", "restaurant"].map((icon) => (
                <div
                  key={icon}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--lo-surface-container-high)]"
                >
                  <LoIcon name={icon} className="text-[var(--lo-primary)]" />
                </div>
              ))}
            </div>
          </LoContainer>
        </section>

        <section className="relative z-10 bg-[var(--lo-surface-bright)] py-20">
          <LoContainer>
            <div className="grid gap-8 md:grid-cols-2">
              {[
                {
                  img: LO_IMAGES.experiences.charity,
                  title: "Charity & Fundraising",
                  desc: "Amplify your cause through experiential storytelling that converts attendees into lifelong advocates.",
                  cta: "Partner With Us",
                  color: "text-[var(--lo-primary)]",
                  ring: "ring-[var(--lo-primary-fixed)]",
                },
                {
                  img: LO_IMAGES.experiences.community,
                  title: "Community Events",
                  desc: "Fostering connection through shared space and collective rhythm. We design the pulse of the community.",
                  cta: "Explore Impact",
                  color: "text-[var(--lo-secondary)]",
                  ring: "ring-[var(--lo-secondary-fixed)]",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="group flex flex-col items-center rounded-xl border border-[color-mix(in_srgb,var(--lo-outline)_5%,transparent)] bg-[var(--lo-surface-container-lowest)] p-10 text-center shadow-lg transition-all duration-500 hover:shadow-2xl"
                >
                  <div className={`mb-8 h-48 w-48 overflow-hidden rounded-full ring-4 ring-offset-4 ${card.ring}`}>
                    <LoImg
                      src={card.img}
                      alt=""
                      width={192}
                      height={192}
                      className="h-full w-full transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="lo-headline-md mb-4 text-[var(--lo-on-surface)]">{card.title}</h3>
                  <p className="lo-body-md mb-6 text-[var(--lo-on-surface-variant)]">{card.desc}</p>
                  <span className={`lo-label flex items-center gap-2 ${card.color} transition-all group-hover:gap-4`}>
                    {card.cta} <LoIcon name="arrow_forward" />
                  </span>
                </div>
              ))}
            </div>
          </LoContainer>
        </section>

        <section className="relative overflow-hidden bg-[var(--lo-on-surface)] py-[var(--lo-section-gap)] text-[var(--lo-surface)]">
          <LoContainer className="relative z-10 text-center">
            <h2 className="lo-display mb-8">
              Ready to write your <span className="text-[var(--lo-secondary-fixed)]">next chapter</span>?
            </h2>
            <Link
              href={LO_PATHS.journey}
              className="lo-headline-md inline-block rounded-full bg-[var(--lo-primary-container)] px-12 py-4 text-[var(--lo-on-primary-container)] shadow-2xl transition-transform hover:scale-105"
            >
              Begin Your Journey
            </Link>
          </LoContainer>
        </section>
      </main>
      <LoFooter />
    </>
  );
}
