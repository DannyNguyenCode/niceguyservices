"use client";

import Link from "next/link";
import { VI_BACKYARD_OUTDOOR_LIVING_CTA, VI_BACKYARD_SMALL_BACKYARD_CTA, VI_BACKYARD_SERVICE } from "./valleyInterlockingBackyardContent";
import { VI_BACKYARD_DESIGN_GUIDE } from "./valleyInterlockingBackyardDesignGuideContent";
import { VI_BACKYARD_FAQ_PAGE } from "./valleyInterlockingBackyardFaqContent";
import { VI_BACKYARD_RELATED_SERVICES } from "./valleyInterlockingRelatedServices";
import { VI_IMG } from "./valleyInterlockingImages";
import { ViFaqAccordion, ViServiceBenefitsSection, ViServiceContentParagraphs, ViServiceHero } from "./valleyInterlockingServiceSections";
import { ViAboutCtaBanner } from "./ViAboutCtaBanner";
import { ViRelatedServices } from "./ViRelatedServices";
import { ViContainer, ViIcon, ViImg } from "./ValleyInterlockingShared";
import { useViReveal } from "./useViEffects";

const SMALL_BACKYARD_IMAGES = [
  { src: VI_IMG.backyard.livingWall, alt: "Vertical garden in a compact backyard" },
  { src: VI_IMG.backyard.decking, alt: "Decking and seating in a small backyard" },
] as const;

export function ValleyInterlockingBackyardBody() {
  const [intro, benefits, frontYards, , entertainment, lowMaintenance, smallBackyards] = VI_BACKYARD_SERVICE.sections;
  const howToGuide = VI_BACKYARD_DESIGN_GUIDE;

  useViReveal(".vi-backyard-reveal");

  return (
    <main className="overflow-x-hidden pt-(--vi-nav-height)">
      <ViServiceHero
        imageSrc={VI_IMG.backyard.hero}
        imageAlt="Backyard landscaping"
        heading={intro.heading}
        description={intro.content[0]}
        ctas={intro.ctas}
        revealClass="vi-backyard-reveal"
      />

      <ViServiceBenefitsSection
        heading={benefits.heading}
        paragraphs={benefits.content}
        imageSrc={VI_IMG.backyard.decking}
        imageAlt="Decking and outdoor seating in a landscaped backyard"
        imagePosition="right"
        revealClass="vi-backyard-reveal"
      />

      <section className="py-(--vi-stack-lg)">
        <ViContainer>
          <div className="vi-backyard-reveal flex flex-col items-center gap-12 md:flex-row">
            <div className="w-full md:w-1/2">
              <h2 className="vi-headline-lg mb-6 text-(--vi-primary)">{frontYards.heading}</h2>
              <ViServiceContentParagraphs content={frontYards.content} />
            </div>
            <div className="w-full md:w-1/2">
              <ViImg
                src={VI_IMG.backyard.plan}
                alt="Landscaping design plan"
                width={800}
                height={400}
                className="h-[400px] w-full rounded-xl object-cover vi-ambient-shadow"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </ViContainer>
      </section>

      <section className="bg-(--vi-surface-container-lowest) py-(--vi-stack-lg)">
        <ViContainer>
          <div className="vi-backyard-reveal grid items-start gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="vi-headline-lg mb-6 text-(--vi-primary)">{entertainment.heading}</h2>
              <ViServiceContentParagraphs content={entertainment.content} />
            </div>
            <div>
              <h2 className="vi-headline-lg mb-6 text-(--vi-primary)">{lowMaintenance.heading}</h2>
              <ViServiceContentParagraphs content={lowMaintenance.content} />
            </div>
          </div>
        </ViContainer>
      </section>

      <ViAboutCtaBanner content={VI_BACKYARD_OUTDOOR_LIVING_CTA} revealClass="vi-backyard-reveal" />

      <section className="py-(--vi-stack-lg)">
        <ViContainer>
          <div className="vi-backyard-reveal flex flex-col items-start gap-12 lg:flex-row">
            <div className="w-full lg:w-3/5">
              <h2 className="vi-headline-lg mb-6 text-(--vi-primary)">{smallBackyards.heading}</h2>
              <div className="space-y-4">
                <ViServiceContentParagraphs content={smallBackyards.content} />
              </div>
            </div>
            <div className="flex w-full flex-col gap-6 lg:w-2/5">
              {SMALL_BACKYARD_IMAGES.map((image) => (
                <ViImg
                  key={image.alt}
                  src={image.src}
                  alt={image.alt}
                  width={640}
                  height={400}
                  className="h-64 w-full rounded-xl object-cover vi-ambient-shadow lg:h-72"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              ))}
            </div>
          </div>
        </ViContainer>
      </section>

      <section className="bg-(--vi-background) py-(--vi-stack-lg)">
        <ViContainer>
          <div className="vi-backyard-reveal grid items-start gap-12 lg:grid-cols-2">
            <div>
              <h2 className="vi-headline-lg mb-6 text-(--vi-primary)">{howToGuide.serviceTitle}</h2>
              <p className="vi-body-md mb-8 text-(--vi-on-surface-variant)">{howToGuide.serviceSummary}</p>
              <ol className="mb-8 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {howToGuide.serviceStepTitles.map((title, index) => (
                  <li key={title} className="flex items-start gap-4">
                    <span className="vi-step-number vi-label-md flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-(--vi-primary) text-(--vi-primary)">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="vi-body-md pt-2 text-(--vi-on-surface)">{title}</span>
                  </li>
                ))}
              </ol>
              <Link
                href={howToGuide.path}
                className="vi-label-md inline-flex items-center gap-3 bg-(--vi-primary) px-8 py-4 text-(--vi-on-primary) transition-all hover:bg-(--vi-primary-container)"
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

      <section className="bg-(--vi-surface-container-lowest) py-(--vi-stack-lg)">
        <ViContainer className="vi-backyard-reveal max-w-3xl">
          <h2 className="vi-headline-lg mb-4 text-center text-(--vi-primary)">{VI_BACKYARD_FAQ_PAGE.heading}</h2>
          <p className="vi-body-md mb-12 text-center text-(--vi-on-surface-variant)">{VI_BACKYARD_FAQ_PAGE.intro}</p>
          <ViFaqAccordion faqs={VI_BACKYARD_FAQ_PAGE.faqs} variant="bordered" defaultOpenIndex={null} />
        </ViContainer>
      </section>

      <ViRelatedServices
        items={VI_BACKYARD_RELATED_SERVICES}
        intro="Complete your outdoor living plan — explore services that pair naturally with a backyard landscape design."
        revealClass="vi-backyard-reveal"
      />

      <ViAboutCtaBanner content={VI_BACKYARD_SMALL_BACKYARD_CTA} revealClass="vi-backyard-reveal" />
    </main>
  );
}
