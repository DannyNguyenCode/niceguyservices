"use client";

import Link from "next/link";
import { VI_DRIVEWAY_MAINTENANCE_CTA, VI_DRIVEWAY_SERVICE } from "./valleyInterlockingDrivewayContent";
import { VI_DRIVEWAY_PAVING_GUIDE } from "./valleyInterlockingDrivewayPavingGuideContent";
import { VI_DRIVEWAY_FAQ_PAGE } from "./valleyInterlockingDrivewayFaqContent";
import { VI_DRIVEWAY_RELATED_SERVICES } from "./valleyInterlockingRelatedServices";
import { VI_IMG } from "./valleyInterlockingImages";
import { ViFaqAccordion, ViServiceContentParagraphs, ViServiceHero } from "./valleyInterlockingServiceSections";
import { ViAboutCtaBanner } from "./ViAboutCtaBanner";
import { ViDrivewayPavingBenefitsSection } from "./ViDrivewayPavingBenefitsSection";
import { ViRelatedServices } from "./ViRelatedServices";
import { ViContainer, ViIcon, ViImg } from "./ValleyInterlockingShared";
import { useViReveal } from "./useViEffects";

export function ValleyInterlockingDrivewayBody() {
  const [intro, options, , , types, benefits, keyElements, maintenance, ethical] = VI_DRIVEWAY_SERVICE.sections;
  const [plainConcrete, exposedAggregate] = types.subsections;
  const heroCtas = types.ctas;
  const drivewayImages = VI_IMG.driveway;
  const howToGuide = VI_DRIVEWAY_PAVING_GUIDE;

  useViReveal(".vi-driveway-reveal");

  return (
    <main className="overflow-hidden pt-[var(--vi-nav-height)]">
      <ViServiceHero
        imageSrc={drivewayImages.hero}
        imageAlt="Luxury suburban driveway with natural stone paving, charcoal block curbing, and manicured landscaping."
        heading={intro.heading}
        description={intro.content[0]}
        ctas={heroCtas}
        revealClass="vi-driveway-reveal"
      />

      <ViDrivewayPavingBenefitsSection benefits={benefits} revealClass="vi-driveway-reveal" />

      <section className="bg-[var(--vi-surface)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-driveway-reveal">
          <h2 className="vi-headline-lg mb-12 text-center text-[var(--vi-primary)]">{options.heading}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {options.items.map((item) => (
              <article
                key={item.title}
                className="flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_10px_30px_rgba(62,92,118,0.05)] transition-shadow hover:shadow-xl"
              >
                <div className="relative h-48">
                  <ViImg
                    src={drivewayImages[item.imageKey]}
                    alt={item.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex grow flex-col p-6">
                  <h3 className="vi-headline-md mb-3 text-[var(--vi-primary)]">{item.title}</h3>
                  <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{item.content}</p>
                </div>
              </article>
            ))}
          </div>
        </ViContainer>
      </section>
      <section className="bg-[var(--vi-surface-container-low)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-driveway-reveal">
            <h2 className="vi-headline-lg mb-12 text-[var(--vi-primary)]">{types.heading}</h2>
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="space-y-8 lg:col-span-2">
                <ViServiceContentParagraphs content={types.content} />
                {exposedAggregate ? (
                  <div className="rounded-xl bg-[var(--vi-surface-container)] p-8">
                    <h3 className="vi-headline-md mb-3 text-[var(--vi-primary)]">{exposedAggregate.title}</h3>
                    <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{exposedAggregate.content}</p>
                  </div>
                ) : null}
              </div>
              {plainConcrete ? (
                <aside>
                  <div className="rounded-xl bg-[var(--vi-surface-container)] p-8">
                    <h3 className="vi-headline-md mb-3 text-[var(--vi-primary)]">{plainConcrete.title}</h3>
                    <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{plainConcrete.content}</p>
                  </div>
                </aside>
              ) : null}
            </div>
          </div>
        </ViContainer>
      </section>

      <section className="relative bg-[var(--vi-surface-container)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-driveway-reveal">
            <h2 className="vi-headline-lg mb-12 text-[var(--vi-primary)]">{keyElements.heading}</h2>
            <div className="flex flex-col items-start gap-12 lg:flex-row">
              <div className="w-full space-y-12 lg:w-1/2">
                {keyElements.items.map((item) => (
                  <div key={item.title}>
                    <h3 className="vi-headline-md mb-3 text-[var(--vi-primary)]">{item.title}</h3>
                    <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{item.content}</p>
                  </div>
                ))}
              </div>
              <div className="w-full lg:w-1/2">
                <div className="overflow-hidden rounded-2xl border-8 border-white shadow-2xl">
                  <ViImg
                    src={VI_IMG.driveway.keyElements}
                    alt={keyElements.imageDescription}
                    width={800}
                    height={600}
                    className="h-auto w-full"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </ViContainer>
      </section>

      <section className="border-t border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)] bg-white py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-driveway-reveal">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{maintenance.heading}</h2>
              <div className="vi-body-lg space-y-6 text-[var(--vi-on-surface-variant)]">
                {maintenance.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div>
              <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{ethical.heading}</h2>
              <div className="vi-body-lg space-y-6 text-[var(--vi-on-surface-variant)]">
                {ethical.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-background)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-driveway-reveal grid items-start gap-12 lg:grid-cols-2">
            <div>
              <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{howToGuide.serviceTitle}</h2>
              <p className="vi-body-md mb-8 text-[var(--vi-on-surface-variant)]">{howToGuide.serviceSummary}</p>
              <ol className="mb-8 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {howToGuide.serviceStepTitles.map((title, index) => (
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
                Read the Full Guide
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
        <ViContainer className="vi-driveway-reveal max-w-3xl">
          <h2 className="vi-headline-lg mb-4 text-center text-[var(--vi-primary)]">{VI_DRIVEWAY_FAQ_PAGE.heading}</h2>
          <p className="vi-body-md mb-12 text-center text-[var(--vi-on-surface-variant)]">{VI_DRIVEWAY_FAQ_PAGE.intro}</p>
          <ViFaqAccordion faqs={VI_DRIVEWAY_FAQ_PAGE.faqs} variant="bordered" defaultOpenIndex={null} />
        </ViContainer>
      </section>

      <ViRelatedServices
        items={VI_DRIVEWAY_RELATED_SERVICES}
        intro="Complete your hardscape plan — explore services that pair naturally with a new driveway installation."
        revealClass="vi-driveway-reveal"
      />

      <ViAboutCtaBanner content={VI_DRIVEWAY_MAINTENANCE_CTA} revealClass="vi-driveway-reveal" />
    </main>
  );
}
