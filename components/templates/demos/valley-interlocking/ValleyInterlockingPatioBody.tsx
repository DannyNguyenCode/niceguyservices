"use client";

import Link from "next/link";
import { ViAboutCtaBanner } from "./ViAboutCtaBanner";
import { VI_PATIO_CTA, VI_PATIO_DESIGN_CTA, VI_PATIO_SERVICE } from "./valleyInterlockingPatioContent";
import { VI_PATIO_DESIGN_GUIDE } from "./valleyInterlockingPatioDesignGuideContent";
import { VI_PATIO_FAQ_PAGE } from "./valleyInterlockingPatioFaqContent";
import { VI_PATIO_RELATED_SERVICES } from "./valleyInterlockingRelatedServices";
import { VI_IMG } from "./valleyInterlockingImages";
import { ViFaqAccordion, ViServiceContentParagraphs, ViServiceHero } from "./valleyInterlockingServiceSections";
import { ViRelatedServices } from "./ViRelatedServices";
import { ViContainer, ViIcon, ViImg } from "./ValleyInterlockingShared";
import { useViReveal } from "./useViEffects";

export function ValleyInterlockingPatioBody() {
  const [intro, , value, design, materialsPalette, roofingStyles] = VI_PATIO_SERVICE.sections;
  const howToGuide = VI_PATIO_DESIGN_GUIDE;
  const heroCtas = value.ctas;
  const patioImages = VI_IMG.patio;

  useViReveal(".vi-patio-reveal");

  return (
    <main className="overflow-hidden pt-[var(--vi-nav-height)]">
      <ViServiceHero
        imageSrc={VI_IMG.patio.hero}
        imageAlt="Patio outdoor living space"
        heading={intro.heading}
        description={intro.content[0]}
        ctas={heroCtas}
        revealClass="vi-patio-reveal"
      />

      <section className="bg-[var(--vi-background)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-patio-reveal grid items-center gap-16 lg:grid-cols-2">
            <div className="overflow-hidden rounded-xl vi-ambient-shadow">
              <ViImg
                src={VI_IMG.patio.value}
                alt="Luxury patio"
                width={800}
                height={600}
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{value.heading}</h2>
              <ViServiceContentParagraphs content={value.content} />
            </div>
          </div>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-surface-container-low)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-patio-reveal grid items-center gap-16 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{design.heading}</h2>
              <ViServiceContentParagraphs content={design.content} />
            </div>
            <div className="order-1 overflow-hidden rounded-xl vi-ambient-shadow lg:order-2">
              <ViImg
                src={VI_IMG.patio.design}
                alt="Patio design"
                width={800}
                height={600}
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </ViContainer>
      </section>

      <ViAboutCtaBanner content={VI_PATIO_DESIGN_CTA} revealClass="vi-patio-reveal" />

      <section className="bg-[var(--vi-background)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-patio-reveal text-center">
          <h2 className="vi-headline-lg mb-4 text-[var(--vi-primary)]">{materialsPalette.heading}</h2>
          <p className="vi-body-lg mx-auto mb-16 max-w-2xl text-[var(--vi-on-surface-variant)]">
            {materialsPalette.intro}
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-12 lg:grid-cols-4">
            {materialsPalette.materials.map((material: any) => {
              const imageSrc =
                "imageKey" in material && material.imageKey
                  ? patioImages[material.imageKey]
                  : null;
              return (
                <div key={material.name} className="group cursor-default">
                  <div className="vi-mask-circle relative mb-6 aspect-square overflow-hidden border-4 border-transparent transition-all duration-300 group-hover:border-[var(--vi-tertiary-container)]">
                    {imageSrc ? (
                      <ViImg
                        src={imageSrc}
                        alt={material.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[var(--vi-surface-container-low)]">
                        <ViIcon name="texture" className="text-4xl text-[var(--vi-primary)]" />
                      </div>
                    )}
                  </div>
                  <h4 className="vi-headline-md text-[var(--vi-on-surface)] transition-colors group-hover:text-[var(--vi-tertiary-container)]">
                    {material.name}
                  </h4>
                  <p className="vi-label-md mt-2 text-[var(--vi-on-surface-variant)]">{material.tagline}</p>
                </div>
              );
            })}
          </div>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-surface-container-low)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-patio-reveal">
          <div className="mb-12 flex flex-col items-end gap-6 md:flex-row">
            <div className="max-w-xl">
              <h2 className="vi-headline-lg mb-4 text-[var(--vi-primary)]">{roofingStyles.heading}</h2>
              <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{roofingStyles.intro}</p>
            </div>
            <div
              className="mb-4 hidden h-0.5 flex-1 bg-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] md:block"
              aria-hidden
            />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {roofingStyles.styles.map((style: any) => (
              <article
                key={style.name}
                className="rounded-xl border border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)] bg-white p-8 vi-ambient-shadow transition-colors hover:border-[color-mix(in_srgb,var(--vi-tertiary-container)_50%,transparent)]"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-[var(--vi-surface-container-low)] text-[var(--vi-primary)]">
                  <ViIcon name={style.icon} className="text-3xl" />
                </div>
                <h3 className="vi-headline-md mb-4 text-[var(--vi-primary)]">{style.name}</h3>
                <p className="vi-body-md mb-6 text-[var(--vi-on-surface-variant)]">{style.description}</p>
                <ul className="space-y-3">
                  {style.features.map((feature: any) => (
                    <li key={feature} className="flex items-center gap-2 vi-label-md text-[var(--vi-on-surface)]">
                      <ViIcon name="check_circle" className="vi-sage text-sm" fill />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-background)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-patio-reveal grid items-start gap-12 lg:grid-cols-2">
            <div>
              <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{howToGuide.title}</h2>
              <p className="vi-body-md mb-8 text-[var(--vi-on-surface-variant)]">{howToGuide.serviceSummary}</p>
              <ol className="mb-8 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {howToGuide.serviceStepTitles.map((title: any, index: any) => (
                  <li key={title} className="flex items-start gap-4">
                    <span className="vi-step-number vi-label-md flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--vi-primary)] text-[var(--vi-primary)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="vi-body-md pt-2 text-[var(--vi-on-surface)]">{title}</span>
                  </li>
                ))}
              </ol>
              <Link
                href={howToGuide.path}
                className="vi-label-md inline-flex items-center gap-3 bg-[var(--vi-primary)] px-8 py-4 text-[var(--vi-on-primary)] transition-all hover:bg-[var(--vi-primary-container)]"
              >
                Read the Full Design Guide
                <ViIcon name="arrow_forward" className="text-sm" />
              </Link>
            </div>
            <div className="relative h-[min(480px,60dvh)] overflow-hidden rounded-xl vi-ambient-shadow lg:sticky lg:top-24">
              <ViImg
                src={howToGuide.heroImage}
                alt={howToGuide.heroImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-surface-container-lowest)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-patio-reveal max-w-3xl">
          <h2 className="vi-headline-lg mb-4 text-center text-[var(--vi-primary)]">{VI_PATIO_FAQ_PAGE.heading}</h2>
          <p className="vi-body-md mb-12 text-center text-[var(--vi-on-surface-variant)]">{VI_PATIO_FAQ_PAGE.intro}</p>
          <ViFaqAccordion faqs={VI_PATIO_FAQ_PAGE.faqs} variant="bordered" defaultOpenIndex={null} />
        </ViContainer>
      </section>

      <ViRelatedServices
        items={VI_PATIO_RELATED_SERVICES}
        intro="Complete your outdoor living plan — explore services that pair naturally with a new patio build."
        revealClass="vi-patio-reveal"
      />

      <ViAboutCtaBanner content={VI_PATIO_CTA} revealClass="vi-patio-reveal" />
    </main>
  );
}

