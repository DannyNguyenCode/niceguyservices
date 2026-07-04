"use client";

import Link from "next/link";
import { VI_INTERLOCKING_BENEFITS_CTA, VI_INTERLOCKING_QUALITIES_CTA, VI_INTERLOCKING_SERVICE } from "./valleyInterlockingInterlockingContent";
import { VI_INTERLOCKING_FAQ_PAGE } from "./valleyInterlockingInterlockingFaqContent";
import { VI_HOW_TO_LAY_INTERLOCKING } from "./valleyInterlockingHowToLayInterlockingContent";
import { VI_INTERLOCKING_RELATED_SERVICES } from "./valleyInterlockingRelatedServices";
import { VI_IMG } from "./valleyInterlockingImages";
import { ViFaqAccordion, ViServiceContentParagraphs, ViServiceHero } from "./valleyInterlockingServiceSections";
import { ViAboutCtaBanner } from "./ViAboutCtaBanner";
import { ViRelatedServices } from "./ViRelatedServices";
import { ViContainer, ViIcon, ViImg } from "./ValleyInterlockingShared";
import { useViReveal } from "./useViEffects";

const BENEFIT_TILE_SHAPES = [
  "rounded-lg h-48 w-48",
  "rounded-full h-48 w-48",
  "rounded-lg h-48 w-64",
] as const;

const BENEFIT_IMAGE_ALTS = [
  "Durable interlocking stone driveway surface",
  "Professional interlocking paver installation",
  "Weather-resistant interlocking patio in snow",
] as const;

function interlockingBenefitImage(imageReference: string, index: number): string {
  const refs = VI_IMG.serviceRefs as Record<string, string>;
  return refs[imageReference] ?? VI_IMG.interlocking.benefitTiles[index] ?? VI_IMG.interlocking.hero;
}

const QUALITY_ICONS = ["fitness_center", "dynamic_form", "cleaning_services"] as const;

export function ValleyInterlockingInterlockingBody() {
  const [intro, pavers, benefits, , , qualities] = VI_INTERLOCKING_SERVICE.sections;
  const howToGuide = VI_HOW_TO_LAY_INTERLOCKING;

  useViReveal(".vi-interlocking-reveal");

  return (
    <main className="overflow-hidden pt-[var(--vi-nav-height)]">
      <ViServiceHero
        imageSrc={VI_IMG.interlocking.hero}
        imageAlt="A grand residential driveway featuring intricate interlocking paving stones"
        heading={intro.heading}
        description={intro.content[0]}
        ctas={qualities.ctas}
        revealClass="vi-interlocking-reveal"
      />

      <section className="bg-[var(--vi-surface-container-low)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-interlocking-reveal max-w-3xl">
          <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{pavers.heading}</h2>
          <ViServiceContentParagraphs content={pavers.content} />
        </ViContainer>
      </section>

      <section className="py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-interlocking-reveal mb-12 text-center">
            <h2 className="vi-headline-lg text-[var(--vi-primary)]">{benefits.heading}</h2>
          </div>
          <div className="vi-interlocking-reveal grid grid-cols-1 gap-12 md:grid-cols-3">
            {benefits.items.map((item, index) => (
              <article key={item.title} className="group flex flex-col items-center text-center">
                <div
                  className={`relative mb-6 overflow-hidden vi-ambient-shadow transition-transform duration-500 group-hover:scale-105 ${BENEFIT_TILE_SHAPES[index] ?? "rounded-lg h-48 w-48"}`}
                >
                  <ViImg
                    src={interlockingBenefitImage(item.imageReference, index)}
                    alt={BENEFIT_IMAGE_ALTS[index] ?? item.title}
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                </div>
                <h3 className="vi-headline-md mb-2 text-[var(--vi-primary)]">{item.title}</h3>
                <p className="vi-body-md px-4 text-[var(--vi-on-surface-variant)]">{item.content}</p>
              </article>
            ))}
          </div>
        </ViContainer>
      </section>

      <ViAboutCtaBanner content={VI_INTERLOCKING_BENEFITS_CTA} revealClass="vi-interlocking-reveal" />

      <section className="py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-interlocking-reveal mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <h2 className="vi-headline-lg max-w-xl text-[var(--vi-primary)]">{qualities.heading}</h2>
          </div>
          <div className="vi-interlocking-reveal grid gap-8 md:grid-cols-3">
            {qualities.items.map((item, index) => (
              <article
                key={item.title}
                className="rounded-xl border border-[var(--vi-outline-variant)] bg-white p-8 vi-ambient-shadow"
              >
                <div className="mb-6 flex items-center gap-4">
                  <ViIcon name={QUALITY_ICONS[index] ?? "verified"} className="text-4xl text-[var(--vi-primary)]" />
                  <h3 className="vi-headline-md text-[var(--vi-primary)]">{item.title}</h3>
                </div>
                {item.bullets.map((bullet) => (
                  <p key={bullet} className="vi-body-md text-[var(--vi-on-surface-variant)]">
                    {bullet}
                  </p>
                ))}
                <div className="mt-6 h-2 w-full rounded-full bg-[var(--vi-surface-container)]">
                  <div className="h-2 w-full rounded-full bg-[var(--vi-primary)]" />
                </div>
              </article>
            ))}
          </div>
        </ViContainer>
      </section>

      <section className="relative overflow-hidden bg-[var(--vi-surface-container-low)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-interlocking-reveal grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{howToGuide.title}</h2>
              <p className="vi-body-md mb-8 text-[var(--vi-on-surface-variant)]">{howToGuide.serviceSummary}</p>
              <ol className="mb-8 space-y-3">
                {howToGuide.serviceStepTitles.map((title, index) => (
                  <li key={title} className="flex items-center gap-4">
                    <span className="vi-step-number vi-label-md flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--vi-primary)] text-[var(--vi-primary)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="vi-body-md text-[var(--vi-on-surface)]">{title}</span>
                  </li>
                ))}
              </ol>
              <Link
                href={howToGuide.path}
                className="vi-label-md inline-flex items-center gap-3 bg-[var(--vi-primary)] px-8 py-4 text-[var(--vi-on-primary)] transition-all hover:bg-[var(--vi-primary-container)]"
              >
                Read the Full Technical Guide
                <ViIcon name="arrow_forward" className="text-sm" />
              </Link>
            </div>
            <div className="relative h-[min(480px,60dvh)] overflow-hidden rounded-xl vi-ambient-shadow">
              <ViImg
                src={VI_IMG.interlocking.install}
                alt="A technical cross-section of a luxury paving project under construction"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-surface-container-lowest)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-interlocking-reveal max-w-3xl">
          <h2 className="vi-headline-lg mb-4 text-center text-[var(--vi-primary)]">{VI_INTERLOCKING_FAQ_PAGE.heading}</h2>
          <p className="vi-body-md mb-12 text-center text-[var(--vi-on-surface-variant)]">{VI_INTERLOCKING_FAQ_PAGE.intro}</p>
          <ViFaqAccordion faqs={VI_INTERLOCKING_FAQ_PAGE.faqs} variant="bordered" defaultOpenIndex={null} />
        </ViContainer>
      </section>

      <ViRelatedServices items={VI_INTERLOCKING_RELATED_SERVICES} revealClass="vi-interlocking-reveal" />

      <ViAboutCtaBanner content={VI_INTERLOCKING_QUALITIES_CTA} revealClass="vi-interlocking-reveal" />
    </main>
  );
}
