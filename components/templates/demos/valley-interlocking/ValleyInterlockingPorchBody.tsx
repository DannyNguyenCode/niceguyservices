"use client";

import Link from "next/link";
import { VI_PORCH_BUILD_CTA, VI_PORCH_STYLES_CTA, VI_PORCH_SERVICE } from "./valleyInterlockingPorchContent";
import { VI_PORCH_BUILD_GUIDE } from "./valleyInterlockingPorchBuildGuideContent";
import { VI_PORCH_FAQ_PAGE } from "./valleyInterlockingPorchFaqContent";
import { VI_PORCH_RELATED_SERVICES } from "./valleyInterlockingRelatedServices";
import { VI_IMG } from "./valleyInterlockingImages";
import { ViFaqAccordion, ViServiceBenefitsSection, ViServiceContentParagraphs, ViServiceHero } from "./valleyInterlockingServiceSections";
import { ViAboutCtaBanner } from "./ViAboutCtaBanner";
import { ViRelatedServices } from "./ViRelatedServices";
import { ViContainer, ViIcon, ViImg } from "./ValleyInterlockingShared";
import { useViReveal } from "./useViEffects";

export function ValleyInterlockingPorchBody() {
  const [intro, benefits, styles, , , frontPorch, backPorch] = VI_PORCH_SERVICE.sections;
  const howToGuide = VI_PORCH_BUILD_GUIDE;
  const porchImages = VI_IMG.porch;

  useViReveal(".vi-porch-reveal");

  return (
    <main className="overflow-hidden pt-[var(--vi-nav-height)]">
      <ViServiceHero
        imageSrc={VI_IMG.porch.hero}
        imageAlt="Porch"
        heading={intro.heading}
        description={intro.content[0]}
        ctas={frontPorch.ctas}
        revealClass="vi-porch-reveal"
      />

      <ViServiceBenefitsSection
        heading={benefits.heading}
        paragraphs={benefits.content}
        imageSrc={porchImages.front}
        imageAlt="Front porch design with welcoming covered entry"
        imagePosition="left"
        revealClass="vi-porch-reveal"
      />

      <section className="bg-[var(--vi-surface)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-porch-reveal">
          <h2 className="vi-headline-lg mb-12 text-center text-[var(--vi-primary)]">{styles.heading}</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {styles.items.map((style: any) => (
              <article
                key={style.title}
                className="group overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--vi-outline-variant)_10%,transparent)] bg-white shadow-sm vi-ambient-shadow transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <ViImg
                    src={porchImages[style.imageKey]}
                    alt={style.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-8">
                  <h3 className="vi-headline-md mb-3 text-[var(--vi-primary)]">{style.title}</h3>
                  <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{style.content}</p>
                </div>
              </article>
            ))}
          </div>
        </ViContainer>
      </section>

      <ViAboutCtaBanner content={VI_PORCH_STYLES_CTA} revealClass="vi-porch-reveal" />

      <section className="py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-porch-reveal grid items-center gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <h2 className="vi-headline-lg mb-8 text-[var(--vi-primary)]">{frontPorch.heading}</h2>
              <ViServiceContentParagraphs content={frontPorch.content} />
            </div>
            <div className="order-1 h-[400px] overflow-hidden rounded-xl shadow-lg md:order-2">
              <ViImg
                src={VI_IMG.porch.front}
                alt="Front porch design"
                width={800}
                height={400}
                className="h-full w-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-surface-container-lowest)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-porch-reveal grid items-center gap-12 md:grid-cols-2">
            <div className="h-[400px] overflow-hidden rounded-xl shadow-lg">
              <ViImg
                src={VI_IMG.porch.back}
                alt="Back porch living"
                width={800}
                height={400}
                className="h-full w-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="vi-headline-lg mb-8 text-[var(--vi-primary)]">{backPorch.heading}</h2>
              <ViServiceContentParagraphs content={backPorch.content} />
            </div>
          </div>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-background)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-porch-reveal grid items-start gap-12 lg:grid-cols-2">
            <div>
              <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{howToGuide.serviceTitle}</h2>
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
        <ViContainer className="vi-porch-reveal max-w-3xl">
          <h2 className="vi-headline-lg mb-4 text-center text-[var(--vi-primary)]">{VI_PORCH_FAQ_PAGE.heading}</h2>
          <p className="vi-body-md mb-12 text-center text-[var(--vi-on-surface-variant)]">{VI_PORCH_FAQ_PAGE.intro}</p>
          <ViFaqAccordion faqs={VI_PORCH_FAQ_PAGE.faqs} variant="bordered" defaultOpenIndex={null} />
        </ViContainer>
      </section>

      <ViRelatedServices
        items={VI_PORCH_RELATED_SERVICES}
        intro="Complete your outdoor living plan — explore services that pair naturally with a new porch build."
        revealClass="vi-porch-reveal"
      />

      <ViAboutCtaBanner content={VI_PORCH_BUILD_CTA} revealClass="vi-porch-reveal" />
    </main>
  );
}

