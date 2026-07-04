"use client";

import Link from "next/link";
import { LoContainer, LoFooter, LoImg, LoNav } from "./LiquidOccasionsShared";
import { LO_PATHS } from "./liquidOccasionsConfig";
import { LO_IMAGES } from "./liquidOccasionsImages";
import { useLoReveal } from "./useLoReveal";

export function LiquidOccasionsPortfolioBody() {
  useLoReveal("section.lo-reveal-section", "visible");

  return (
    <>
      <LoNav />
      <main className="relative overflow-hidden pt-40">
        <section className="lo-reveal-section mx-auto mb-[var(--lo-section-gap)] max-w-[var(--lo-container-max)] px-[var(--lo-gutter)] text-center">
          <span className="lo-label mb-4 inline-block rounded-full bg-[var(--lo-secondary-container)] px-4 py-1 text-[var(--lo-on-secondary-fixed)]">
            OUR PORTFOLIO
          </span>
          <h1 className="lo-display mb-6 text-[var(--lo-on-background)]">Stories of Transformation</h1>
          <p className="lo-body-lg mx-auto max-w-2xl text-[var(--lo-on-surface-variant)]">
            We don&apos;t just organize events; we weave narratives. Explore the alchemy of turning bold
            dreams into reality through our signature planning journey.
          </p>
        </section>

        <div className="relative w-full">
          <section className="lo-reveal-section relative overflow-hidden bg-[var(--lo-surface-container-low)] pb-32 pt-20">
            <div className="lo-yellow-path-vertical absolute top-0 h-full opacity-30" />
            <LoContainer className="relative z-20 grid items-center gap-20 md:grid-cols-2">
              <div className="space-y-12">
                <div className="relative">
                  <span className="absolute -left-12 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--lo-secondary-container)] font-bold text-[var(--lo-on-secondary-fixed)]">
                    1
                  </span>
                  <h2 className="lo-headline-lg mb-4 text-[var(--lo-primary)]">
                    The Vision: Midnight in Monaco
                  </h2>
                  <p className="lo-body-lg text-[var(--lo-on-surface-variant)]">
                    The client dreamed of a gala that felt like a plunge into the deep Mediterranean,
                    blending architectural sharpness with the fluid mystery of the ocean. They wanted
                    guests to feel weightless.
                  </p>
                </div>
                <div className="relative pt-10">
                  <div className="lo-circular-mask lo-floating-element relative ml-auto h-64 w-64 overflow-hidden border-4 border-white shadow-xl">
                    <LoImg src={LO_IMAGES.portfolio.moodBoard} alt="Luxury event mood board" width={256} height={256} />
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-xl shadow-2xl">
                  <LoImg src={LO_IMAGES.portfolio.azureGala} alt="Grand ballroom transformed into a deep blue oasis" fill />
                </div>
                <div className="absolute -bottom-10 -left-10 z-20 w-80 rounded-lg border-l-4 border-[var(--lo-secondary-container)] bg-[color-mix(in_srgb,var(--lo-surface-container-highest)_95%,transparent)] p-8 shadow-xl backdrop-blur-md">
                  <span className="lo-label mb-2 block text-[var(--lo-secondary)]">THE JOURNEY</span>
                  <p className="lo-body-md italic text-[var(--lo-on-surface)]">
                    &quot;We spent three months sourcing the specific &apos;Abyss&apos; pigment for the floor
                    graphics and engineering a custom scent of ozone and sea salt.&quot;
                  </p>
                </div>
              </div>
            </LoContainer>
          </section>
        </div>

        <section className="lo-reveal-section relative py-[var(--lo-section-gap)]">
          <LoContainer>
            <div className="mx-auto mb-24 max-w-3xl text-center">
              <span className="mb-4 block text-4xl font-bold text-[var(--lo-primary-container)]">02</span>
              <h2 className="lo-display mb-6">The Ethereal Orchard</h2>
              <p className="lo-body-lg">
                A corporate retreat that needed to break the boardroom cycle. We took them to a forgotten
                grove and built a sanctuary of glass and moss.
              </p>
            </div>
            <div className="flex flex-col gap-32">
              <div className="flex flex-col items-center gap-16 md:flex-row">
                <div className="order-2 w-full md:order-1 md:w-1/2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-64 w-full translate-y-8 overflow-hidden rounded-full shadow-lg">
                      <LoImg src={LO_IMAGES.portfolio.moss} alt="Organic event details" fill className="h-full w-full" />
                    </div>
                    <div className="h-64 w-full -translate-y-8 overflow-hidden rounded-full shadow-lg">
                      <LoImg src={LO_IMAGES.portfolio.sketch} alt="Glass marquee architectural sketch" fill className="h-full w-full" />
                    </div>
                  </div>
                </div>
                <div className="order-1 w-full md:order-2 md:w-1/2">
                  <h3 className="lo-headline-md mb-4 text-[var(--lo-on-surface)]">Planning: Rescuing the Wild</h3>
                  <p className="lo-body-md text-[var(--lo-on-surface-variant)]">
                    The logistics were impossible. No power, no level ground, and a forecast for rain. We
                    didn&apos;t fight the environment; we embraced it. Our team worked with arborists to ensure
                    every glass pane was positioned to reflect the canopy without disturbing a single branch.
                  </p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl bg-[var(--lo-surface-container-high)] p-12">
                <div className="relative z-10 flex flex-col items-center gap-12 md:flex-row">
                  <div className="w-full md:w-1/3">
                    <h3 className="lo-headline-md mb-4 text-[var(--lo-primary)]">The Celebration</h3>
                    <p className="lo-body-md mb-8">
                      As the sun set, the glass walls vanished into the twilight. Long timber tables held
                      locally foraged feasts. It wasn&apos;t just a dinner; it was a reconnection with nature
                      and each other.
                    </p>
                    <Link
                      href={LO_PATHS.process}
                      className="inline-block rounded-full bg-[var(--lo-primary)] px-8 py-3 font-bold text-[var(--lo-on-primary)] transition-transform hover:scale-105"
                    >
                      View Full Journey
                    </Link>
                  </div>
                  <div className="w-full md:w-2/3">
                    <div className="group relative h-96 w-full overflow-hidden rounded-lg shadow-2xl">
                      <LoImg
                        src={LO_IMAGES.portfolio.orchardCelebration}
                        alt="Magical outdoor dinner under ancient trees"
                        fill
                        className="transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-6 left-6 text-white">
                        <p className="lo-label opacity-80">FINAL RESULT</p>
                        <p className="lo-headline-md">A Night Under the Living Stars</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </LoContainer>
        </section>

        <section className="lo-reveal-section relative overflow-hidden bg-[var(--lo-on-background)] py-[var(--lo-section-gap)] text-[var(--lo-surface)]">
          <LoContainer className="relative z-10">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="order-2 lg:order-1 lg:col-span-5">
                <div className="relative mx-auto aspect-square w-full max-w-md">
                  <div className="absolute left-0 top-0 z-0 h-4/5 w-4/5 overflow-hidden rounded-full border-8 border-[color-mix(in_srgb,var(--lo-secondary-container)_20%,transparent)]">
                    <LoImg src={LO_IMAGES.portfolio.kineticMain} alt="High-energy fashion show event" fill />
                  </div>
                  <div className="lo-floating-element absolute bottom-0 right-0 z-10 h-3/5 w-3/5 overflow-hidden rounded-full border-8 border-[var(--lo-primary-container)]">
                    <LoImg src={LO_IMAGES.portfolio.kineticTech} alt="Premium event lighting rig" fill />
                  </div>
                </div>
              </div>
              <div className="order-1 text-right lg:order-2 lg:col-span-7">
                <span className="lo-label mb-4 inline-block rounded-full bg-[var(--lo-primary)] px-4 py-1 text-[var(--lo-on-primary)]">
                  PROJECT 03
                </span>
                <h2 className="lo-display mb-8 leading-tight">
                  Kinetic Velocity:
                  <br />
                  The Tech Launch
                </h2>
                <div className="flex flex-col items-end gap-6">
                  <div className="max-w-lg">
                    <h4 className="mb-2 font-bold text-[var(--lo-secondary-container)]">The Dream</h4>
                    <p className="opacity-80">
                      A tech giant wanted their product launch to feel like it was moving at the speed of
                      thought. Sharp angles, neon pulses, and high-velocity energy.
                    </p>
                  </div>
                  <div className="max-w-lg">
                    <h4 className="mb-2 font-bold text-[var(--lo-secondary-container)]">The Result</h4>
                    <p className="opacity-80">
                      We transformed an industrial hangar into a light-synchronized immersive tunnel where
                      guests were literally part of the data flow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </LoContainer>
        </section>

        <section className="lo-reveal-section bg-[var(--lo-surface)] px-[var(--lo-gutter)] py-32 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="lo-headline-lg mb-8">Ready to write your next chapter?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={LO_PATHS.journey}
                className="rounded-full bg-[var(--lo-primary)] px-10 py-4 text-lg font-bold text-[var(--lo-on-primary)] transition-transform hover:scale-105"
              >
                Start Your Journey
              </Link>
              <Link
                href={LO_PATHS.portfolio}
                className="rounded-full border-2 border-[var(--lo-outline)] px-10 py-4 text-lg font-bold text-[var(--lo-on-surface)] transition-colors hover:bg-[var(--lo-surface-container)]"
              >
                See More Work
              </Link>
            </div>
          </div>
        </section>
      </main>
      <LoFooter showAccentLine />
    </>
  );
}
