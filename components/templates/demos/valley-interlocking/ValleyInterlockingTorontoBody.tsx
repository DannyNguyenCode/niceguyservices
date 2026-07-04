"use client";

import Link from "next/link";
import { VI_PATHS } from "./valleyInterlockingConfig";
import { ViGoogleReviewGrid } from "./ViGoogleReviewCarousel";
import { ViFaqAccordion } from "./valleyInterlockingServiceSections";
import { VI_TORONTO_FAQS } from "./valleyInterlockingTorontoFaqContent";
import { VI_TORONTO_LOCATION, VI_TORONTO_FINAL_CTA, VI_TORONTO_SERVICES_CTA } from "./valleyInterlockingTorontoContent";
import { VI_IMG } from "./valleyInterlockingImages";
import { ViAboutCtaBanner } from "./ViAboutCtaBanner";
import { ViContainer, ViGoogleReviewBadge, ViIcon, ViImg, ViHeroContentPanel, VI_HERO_CTA_PRIMARY, VI_HERO_CTA_SECONDARY } from "./ValleyInterlockingShared";
import { useViReveal } from "./useViEffects";

const SERVICE_ICONS: Record<string, string> = {
  "Interlocking Stone Solutions": "grid_view",
  "Custom Landscape Design": "architecture",
  "Planting and Garden Design": "psychiatry",
  "Retaining Wall Construction": "reorder",
  "Outdoor Living": "deck",
  "Landscape Lighting": "lightbulb",
  "Structural Steel Installation": "engineering",
};

export function ValleyInterlockingTorontoBody() {
  const { hero, introduction, whyChooseUs, services, process, reviews } = VI_TORONTO_LOCATION;

  useViReveal(".vi-toronto-reveal");

  return (
    <main className="pt-[var(--vi-nav-height)]">
      <section className="vi-hero-under-nav vi-hero-under-nav--compact relative flex min-h-[700px] items-center overflow-hidden">
        <div className="vi-hero-backdrop absolute inset-0 z-0">
          <ViImg
            src={VI_IMG.toronto.hero}
            alt={VI_TORONTO_LOCATION.title}
            fill
            className="object-cover object-center transition-transform duration-[10000ms] hover:scale-110"
            priority
            sizes="100vw"
          />
          <div className="vi-hero-tint" aria-hidden="true" />
        </div>
        <ViContainer className="vi-toronto-reveal relative z-10 flex w-full items-center">
          <ViHeroContentPanel>
            <span className="vi-hero-content__eyebrow vi-label-sm uppercase tracking-widest">
              {VI_TORONTO_LOCATION.name}
            </span>
            <h1 className="vi-display-lg mb-6 leading-tight">{hero.headline}</h1>
            <p className="vi-body-lg mb-8">{hero.subheadline}</p>
            <div className="flex flex-wrap gap-4">
              <Link href={VI_PATHS.contact} className={VI_HERO_CTA_PRIMARY}>
                {hero.cta.label}
              </Link>
              <Link href={VI_PATHS.theTeam} className={VI_HERO_CTA_SECONDARY}>
                Meet the Team
              </Link>
            </div>
          </ViHeroContentPanel>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-surface-container-lowest)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-toronto-reveal grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{whyChooseUs.title}</h2>
              <div className="space-y-6 vi-body-md text-[var(--vi-on-surface-variant)]">
                {introduction.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <ul className="space-y-3">
                  {whyChooseUs.items.map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <ViIcon name="check_circle" className="shrink-0 text-[var(--vi-primary)]" />
                      <span>
                        <strong>{item.title}:</strong> {item.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl shadow-xl">
              <ViImg
                src={VI_IMG.toronto.landscape}
                alt="Landscape design in Toronto"
                width={800}
                height={600}
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-surface-container-low)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-toronto-reveal">
          <div className="mb-12 text-center">
            <h2 className="vi-headline-lg mb-3 text-[var(--vi-primary)]">{services.title}</h2>
            <p className="vi-body-md mx-auto max-w-2xl text-[var(--vi-on-surface-variant)]">{services.introduction}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.items.map((service, index) => (
              <article
                key={service.name}
                className={`rounded-xl bg-white p-8 vi-ambient-shadow ${
                  index === services.items.length - 1 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <ViIcon
                  name={SERVICE_ICONS[service.name] ?? "landscape"}
                  className="mb-6 text-4xl text-[var(--vi-primary)]"
                />
                <h3 className="vi-headline-md mb-3 text-[var(--vi-primary)]">{service.name}</h3>
                <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{service.description}</p>
              </article>
            ))}
          </div>
        </ViContainer>
      </section>

      <ViAboutCtaBanner content={VI_TORONTO_SERVICES_CTA} revealClass="vi-toronto-reveal" />

      <section className="overflow-hidden bg-[var(--vi-background)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-toronto-reveal">
          <h2 className="vi-headline-lg mb-12 text-center text-[var(--vi-primary)]">{process.title}</h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {process.steps.map((step) => (
              <article key={step.step} className="relative pt-16 text-center">
                <div className="absolute left-1/2 top-0 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--vi-primary)] text-lg font-bold text-[var(--vi-on-primary)]">
                  {step.step}
                </div>
                <h3 className="vi-headline-md mb-3 text-[var(--vi-primary)]">{step.title}</h3>
                <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{step.description}</p>
              </article>
            ))}
          </div>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-surface-container-low)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-toronto-reveal">
          <div className="mb-10 text-center">
            <h2 className="vi-headline-lg mb-3 text-[var(--vi-primary)]">{reviews.title}</h2>
            <p className="vi-body-md mb-6 text-[var(--vi-on-surface-variant)]">
              {reviews.rating} · {reviews.reviewCount} {reviews.platform} reviews
            </p>
            <div className="flex justify-center">
              <ViGoogleReviewBadge />
            </div>
          </div>
          <ViGoogleReviewGrid count={8} />
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-surface-container-lowest)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-toronto-reveal max-w-3xl">
          <h2 className="vi-headline-lg mb-12 text-center text-[var(--vi-primary)]">Frequently Asked Questions</h2>
          <ViFaqAccordion faqs={VI_TORONTO_FAQS} variant="bordered" defaultOpenIndex={null} />
        </ViContainer>
      </section>

      <ViAboutCtaBanner content={VI_TORONTO_FINAL_CTA} revealClass="vi-toronto-reveal" />
    </main>
  );
}
