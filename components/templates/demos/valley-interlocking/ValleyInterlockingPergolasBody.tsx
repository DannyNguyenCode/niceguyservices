"use client";

import Link from "next/link";
import { VI_PERGOLA_BUILD_CTA, VI_PERGOLA_DESIGNED_CTA, VI_PERGOLA_SERVICE } from "./valleyInterlockingPergolaContent";
import { VI_PERGOLA_BUILD_GUIDE } from "./valleyInterlockingPergolaBuildGuideContent";
import { VI_PERGOLA_FAQ_PAGE } from "./valleyInterlockingPergolaFaqContent";
import { VI_PERGOLA_RELATED_SERVICES } from "./valleyInterlockingRelatedServices";
import { VI_IMG } from "./valleyInterlockingImages";
import { ViFaqAccordion, ViServiceBenefitsSection, ViServiceContentParagraphs, ViServiceHero } from "./valleyInterlockingServiceSections";
import { ViAboutCtaBanner } from "./ViAboutCtaBanner";
import { ViRelatedServices } from "./ViRelatedServices";
import { ViContainer, ViIcon, ViImg } from "./ValleyInterlockingShared";
import { useViReveal } from "./useViEffects";

const FEATURE_IMAGES = [VI_IMG.pergolas.composite, VI_IMG.pergolas.aluminum, VI_IMG.pergolas.cedar] as const;

export function ValleyInterlockingPergolasBody() {
  const [intro, benefits, features, , , ourWork, styles] = VI_PERGOLA_SERVICE.sections;
  const howToGuide = VI_PERGOLA_BUILD_GUIDE;

  useViReveal(".vi-pergola-reveal");

  return (
    <main className="overflow-hidden pt-[var(--vi-nav-height)]">
      <ViServiceHero
        imageSrc={VI_IMG.pergolas.hero}
        imageAlt="Pergola outdoor living space"
        heading={intro.heading}
        description={intro.content[0]}
        ctas={ourWork.ctas}
        revealClass="vi-pergola-reveal"
      />

      <ViServiceBenefitsSection
        heading={benefits.heading}
        paragraphs={benefits.content}
        imageSrc={VI_IMG.pergolas.hero}
        imageAlt="Modern pergola over stone patio at golden hour"
        imagePosition="right"
        revealClass="vi-pergola-reveal"
      />

      <section className="bg-[var(--vi-surface)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-pergola-reveal">
          <h2 className="vi-headline-lg mb-12 text-center text-[var(--vi-primary)]">{features.heading}</h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {features.items.map((item, index) => (
              <article key={item.title} className="flex flex-col gap-6">
                <div className="aspect-video overflow-hidden rounded-xl shadow-md">
                  <ViImg
                    src={FEATURE_IMAGES[index] ?? VI_IMG.pergolas.hero}
                    alt={item.imageDescription}
                    width={640}
                    height={360}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="vi-headline-md text-[var(--vi-primary)]">{item.title}</h3>
                <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{item.content}</p>
              </article>
            ))}
          </div>
        </ViContainer>
      </section>

      <section className="py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-pergola-reveal grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <h2 className="vi-headline-lg text-[var(--vi-primary)]">{ourWork.heading}</h2>
              <ViServiceContentParagraphs content={ourWork.content} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <ViImg
                src={VI_IMG.pergolas.louvred}
                alt="Louvred pergola installation"
                width={400}
                height={400}
                className="aspect-square w-full rounded-xl object-cover shadow-md"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <ViImg
                src={VI_IMG.pergolas.retractable}
                alt="Retractable pergola system"
                width={400}
                height={400}
                className="aspect-square w-full rounded-xl object-cover shadow-md"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
          </div>
        </ViContainer>
      </section>

      <ViAboutCtaBanner content={VI_PERGOLA_DESIGNED_CTA} revealClass="vi-pergola-reveal" />

      <section className="bg-[var(--vi-surface-container)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-pergola-reveal">
          <h2 className="vi-headline-lg mb-12 text-center text-[var(--vi-primary)]">{styles.heading}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {styles.styles.map((style) => (
              <div
                key={style}
                className="group rounded-lg border border-[var(--vi-outline-variant)] bg-[var(--vi-background)] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[var(--vi-primary)] hover:bg-[var(--vi-primary)] hover:shadow-md"
              >
                <h5 className="vi-label-md font-bold text-[var(--vi-primary)] transition-colors group-hover:text-[var(--vi-on-primary)]">
                  {style}
                </h5>
              </div>
            ))}
          </div>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-background)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-pergola-reveal grid items-start gap-12 lg:grid-cols-2">
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
                Read the Full Build Guide
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
        <ViContainer className="vi-pergola-reveal max-w-3xl">
          <h2 className="vi-headline-lg mb-4 text-center text-[var(--vi-primary)]">{VI_PERGOLA_FAQ_PAGE.heading}</h2>
          <p className="vi-body-md mb-12 text-center text-[var(--vi-on-surface-variant)]">{VI_PERGOLA_FAQ_PAGE.intro}</p>
          <ViFaqAccordion faqs={VI_PERGOLA_FAQ_PAGE.faqs} variant="bordered" defaultOpenIndex={null} />
        </ViContainer>
      </section>

      <ViRelatedServices
        items={VI_PERGOLA_RELATED_SERVICES}
        intro="Complete your outdoor living plan — explore services that pair naturally with a new pergola build."
        revealClass="vi-pergola-reveal"
      />

      <ViAboutCtaBanner content={VI_PERGOLA_BUILD_CTA} revealClass="vi-pergola-reveal" />
    </main>
  );
}
