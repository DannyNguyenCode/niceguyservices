"use client";

import Link from "next/link";
import { VI_LANDSCAPE_LIGHTING_INSTALL } from "./valleyInterlockingLandscapeLightingInstallContent";
import { VI_LIGHTING_BODY_COPY, VI_LIGHTING_CTA, VI_LIGHTING_LED_CTA, VI_LIGHTING_SERVICE } from "./valleyInterlockingLightingContent";
import { VI_LIGHTING_FAQ_PAGE } from "./valleyInterlockingLightingFaqContent";
import { VI_LIGHTING_RELATED_SERVICES } from "./valleyInterlockingRelatedServices";
import { VI_IMG } from "./valleyInterlockingImages";
import { ViFaqAccordion, ViServiceBodyCopySection, ViServiceContentParagraphs, ViServiceHero } from "./valleyInterlockingServiceSections";
import { ViAboutCtaBanner } from "./ViAboutCtaBanner";
import { ViRelatedServices } from "./ViRelatedServices";
import { ViContainer, ViIcon, ViImg } from "./ValleyInterlockingShared";
import { useViReveal } from "./useViEffects";

export function ValleyInterlockingLightingBody() {
  const [intro, , techniques, , , ledLighting, cost, factors] = VI_LIGHTING_SERVICE.sections;
  const howToGuide = VI_LANDSCAPE_LIGHTING_INSTALL;
  const ctas = ledLighting.ctas;

  useViReveal(".vi-lighting-reveal");

  return (
    <main className="overflow-hidden pt-[var(--vi-nav-height)]">
      <ViServiceHero
        imageSrc={VI_IMG.lighting.hero}
        imageAlt="Landscape lighting hero"
        heading={intro.heading}
        description={intro.content[0]}
        ctas={ctas}
        revealClass="vi-lighting-reveal"
      />

      <ViServiceBodyCopySection content={VI_LIGHTING_BODY_COPY} revealClass="vi-lighting-reveal" />

      <section className="py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-lighting-reveal mb-12 text-center">
            <h2 className="vi-headline-lg text-[var(--vi-primary)]">{techniques.heading}</h2>
          </div>
          <div className="vi-lighting-reveal grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {techniques.items.map((item) => (
              <article
                key={item.title}
                className="group rounded-lg border border-[var(--vi-surface-container-high)] bg-white p-8 vi-ambient-shadow transition-all hover:-translate-y-1 hover:border-[var(--vi-primary)] hover:bg-[var(--vi-primary)]"
              >
                <h3 className="vi-headline-md mb-3 text-[var(--vi-primary)] transition-colors group-hover:text-[var(--vi-on-primary)]">
                  {item.title}
                </h3>
                <p className="vi-body-md text-[var(--vi-on-surface-variant)] transition-colors group-hover:text-[color-mix(in_srgb,var(--vi-on-primary)_90%,transparent)]">
                  {item.content}
                </p>
              </article>
            ))}
          </div>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-surface-container-low)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-lighting-reveal flex flex-col items-center gap-12 lg:flex-row">
            <div className="lg:w-1/2">
              <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{ledLighting.heading}</h2>
              <ViServiceContentParagraphs content={ledLighting.content} />
            </div>
            <div className="w-full lg:w-1/2">
              <div className="overflow-hidden rounded-lg vi-ambient-shadow">
                <ViImg
                  src={VI_IMG.lighting.comparison}
                  alt="LED lighting installation"
                  width={800}
                  height={500}
                  className="h-auto w-full"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </ViContainer>
      </section>

      <ViAboutCtaBanner content={VI_LIGHTING_LED_CTA} revealClass="vi-lighting-reveal" />

      <section className="py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-lighting-reveal max-w-3xl">
          <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{cost.heading}</h2>
          <ViServiceContentParagraphs content={cost.content} />
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-surface-container-low)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <h2 className="vi-lighting-reveal vi-headline-lg mb-12 text-[var(--vi-primary)]">{factors.heading}</h2>
          <div className="vi-lighting-reveal grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {factors.items.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-[var(--vi-surface-container-high)] bg-white p-8 vi-ambient-shadow"
              >
                <h3 className="vi-headline-md mb-3 text-[var(--vi-primary)]">{item.title}</h3>
                <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{item.content}</p>
              </article>
            ))}
          </div>
        </ViContainer>
      </section>

      <section className="py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-lighting-reveal grid items-center gap-12 lg:grid-cols-2">
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
                Read the Full Installation Guide
                <ViIcon name="arrow_forward" className="text-sm" />
              </Link>
            </div>
            <div className="relative h-[min(480px,60dvh)] overflow-hidden rounded-xl vi-ambient-shadow">
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
        <ViContainer className="vi-lighting-reveal max-w-3xl">
          <h2 className="vi-headline-lg mb-4 text-center text-[var(--vi-primary)]">{VI_LIGHTING_FAQ_PAGE.heading}</h2>
          <p className="vi-body-md mb-12 text-center text-[var(--vi-on-surface-variant)]">{VI_LIGHTING_FAQ_PAGE.intro}</p>
          <ViFaqAccordion faqs={VI_LIGHTING_FAQ_PAGE.faqs} variant="bordered" defaultOpenIndex={null} />
        </ViContainer>
      </section>

      <ViRelatedServices
        items={VI_LIGHTING_RELATED_SERVICES}
        intro="Lighting works best as part of a complete outdoor plan — explore services that pair naturally with pathway, accent, and architectural illumination."
        revealClass="vi-lighting-reveal"
      />

      <ViAboutCtaBanner content={VI_LIGHTING_CTA} revealClass="vi-lighting-reveal" />
    </main>
  );
}
