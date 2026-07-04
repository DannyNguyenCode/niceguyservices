"use client";

import { SD_CORE_COMPETENCIES, SD_EDUCATION_TIMELINE } from "./skylineDesignsData";
import { SD_IMG } from "./skylineDesignsImages";
import { SdContainer, SdIcon, SdImg } from "./SkylineDesignsShared";
import { useSdHeroParallax, useSdNavScroll, useSdReveal } from "./useSdEffects";

export function SkylineDesignsEducationBody() {
  useSdReveal(".sd-reveal, .sd-timeline-card, .sd-timeline-image");
  useSdNavScroll();
  useSdHeroParallax();

  return (
    <main>
      <header className="sd-hero-parallax relative flex flex-col items-center overflow-hidden px-[var(--sd-container-padding)] pt-48 pb-20 text-center">
        <SdContainer className="relative z-10 max-w-4xl">
          <span className="sd-label-md mb-4 block tracking-widest text-[var(--sd-primary)] uppercase">
            Academic Ascent
          </span>
          <h1 className="sd-display-xl text-[var(--sd-on-surface)]">
            Building a Foundation <br /> <span className="text-[var(--sd-primary)]">In the Clouds.</span>
          </h1>
          <p className="sd-body-lg mx-auto mt-6 max-w-2xl text-[var(--sd-secondary)]">
            A chronological journey through degrees, certifications, and the relentless pursuit of digital craftsmanship.
          </p>
        </SdContainer>
        <div className="sd-animate-float absolute top-1/4 -left-20 h-64 w-64 rounded-full bg-[color-mix(in_srgb,var(--sd-primary-container)_20%,transparent)] blur-3xl" />
        <div
          className="sd-animate-float absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[color-mix(in_srgb,var(--sd-surface-variant)_40%,transparent)] blur-3xl"
          style={{ animationDelay: "-2s" }}
        />
      </header>

      <SdContainer className="relative max-w-6xl py-[var(--sd-section-gap)]">
        <div className="sd-cloud-path-line absolute top-0 bottom-0 left-1/2 hidden w-1 -translate-x-1/2 md:block" />
        <div className="space-y-32">
          {SD_EDUCATION_TIMELINE.map((entry) => {
            const imageSrc = SD_IMG.education[entry.imageKey];
            const cardLeft = entry.imageSide === "right";
            return (
              <div key={entry.title} className="group relative flex flex-col items-center gap-12 md:flex-row">
                {cardLeft ? (
                  <div className="order-2 flex w-full justify-end md:order-1 md:w-1/2">
                    <div className="sd-timeline-card sd-reveal max-w-md rounded-lg border border-[color-mix(in_srgb,var(--sd-surface-variant)_50%,transparent)] bg-white p-8 shadow-xl shadow-[color-mix(in_srgb,var(--sd-primary)_5%,transparent)] transition-all duration-500 group-hover:scale-[1.02] hover:shadow-2xl">
                      <div className="mb-4 flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full text-[var(--sd-primary)] ${entry.iconBg}`}
                        >
                          <SdIcon name={entry.icon} />
                        </div>
                        <div>
                          <h3 className="sd-headline-md text-[var(--sd-on-surface)]">{entry.title}</h3>
                          <p className="sd-label-md text-[var(--sd-primary)]">{entry.meta}</p>
                        </div>
                      </div>
                      <p className="sd-body-md text-[var(--sd-secondary)]">{entry.description}</p>
                    </div>
                  </div>
                ) : (
                  <div className="order-1 w-full md:w-1/2">
                    <div className="sd-timeline-image sd-reveal relative h-64 overflow-hidden rounded-lg shadow-lg shadow-[color-mix(in_srgb,var(--sd-surface-tint)_10%,transparent)]">
                      <SdImg src={imageSrc} alt={entry.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                    </div>
                  </div>
                )}

                <div className="absolute left-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-[var(--sd-background)] bg-[var(--sd-primary)] text-[var(--sd-on-primary)] shadow-lg shadow-[color-mix(in_srgb,var(--sd-primary)_40%,transparent)] md:flex">
                  <SdIcon name={entry.markerIcon} className="text-sm" />
                </div>

                {cardLeft ? (
                  <div className="order-1 w-full md:order-2 md:w-1/2">
                    <div className="sd-timeline-image sd-reveal relative h-64 overflow-hidden rounded-lg shadow-lg shadow-[color-mix(in_srgb,var(--sd-surface-tint)_10%,transparent)]">
                      <SdImg src={imageSrc} alt={entry.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                    </div>
                  </div>
                ) : (
                  <div className="order-2 w-full md:w-1/2">
                    <div className="sd-timeline-card sd-reveal max-w-md rounded-lg border border-[color-mix(in_srgb,var(--sd-surface-variant)_50%,transparent)] bg-white p-8 shadow-xl shadow-[color-mix(in_srgb,var(--sd-primary)_5%,transparent)] transition-all duration-500 group-hover:scale-[1.02] hover:shadow-2xl">
                      <div className="mb-4 flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full text-[var(--sd-primary)] ${entry.iconBg}`}
                        >
                          <SdIcon name={entry.icon} />
                        </div>
                        <div>
                          <h3 className="sd-headline-md text-[var(--sd-on-surface)]">{entry.title}</h3>
                          <p className="sd-label-md text-[var(--sd-primary)]">{entry.meta}</p>
                        </div>
                      </div>
                      <p className="sd-body-md text-[var(--sd-secondary)]">{entry.description}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SdContainer>

      <section className="bg-[var(--sd-surface-container-low)] px-[var(--sd-container-padding)] py-20 text-center">
        <SdContainer>
          <h2 className="sd-headline-lg sd-reveal mb-12 text-[var(--sd-on-surface)]">Core Competencies</h2>
          <div className="sd-reveal mx-auto flex max-w-4xl flex-wrap justify-center gap-4">
            {SD_CORE_COMPETENCIES.map((skill) => (
              <span
                key={skill}
                className="sd-label-md rounded-full bg-[var(--sd-secondary-fixed)] px-6 py-2 text-[var(--sd-on-secondary-fixed-variant)] shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </SdContainer>
      </section>
    </main>
  );
}
