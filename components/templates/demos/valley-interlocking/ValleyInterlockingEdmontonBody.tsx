"use client";

import Link from "next/link";
import { VI_PATHS } from "./valleyInterlockingConfig";
import { ViGoogleReviewGrid } from "./ViGoogleReviewCarousel";
import { ViFaqAccordion } from "./valleyInterlockingServiceSections";
import { VI_EDMONTON_FAQS } from "./valleyInterlockingEdmontonFaqContent";
import { VI_EDMONTON_LOCATION, VI_EDMONTON_FINAL_CTA, VI_EDMONTON_SERVICES_CTA } from "./valleyInterlockingEdmontonContent";
import { VI_IMG } from "./valleyInterlockingImages";
import { ViAboutCtaBanner } from "./ViAboutCtaBanner";
import { ViContainer, ViGoogleReviewBadge, ViIcon, ViImg, ViHeroContentPanel, VI_HERO_CTA_PRIMARY, VI_HERO_CTA_SECONDARY } from "./ValleyInterlockingShared";
import { useViReveal } from "./useViEffects";

const WHY_CHOOSE_ICONS = ["verified", "handyman", "sentiment_satisfied"] as const;

const SERVICE_ICONS: Record<string, string> = {
  "Interlocking Stone Solutions": "grid_view",
  "Custom Landscape Design": "architecture",
  "Planting and Garden Design": "psychiatry",
  "Outdoor Living": "deck",
  "Landscape Lighting": "lightbulb",
  "Deck & Fence Construction": "fence",
  "Retaining Wall Construction": "reorder",
  "Structural Steel Installation": "engineering",
  "Home Renovation": "house",
};

export function ValleyInterlockingEdmontonBody() {
  const { hero, introduction, whyChooseUs, services, trust, reviews } = VI_EDMONTON_LOCATION;

  useViReveal(".vi-edmonton-reveal");

  return (
    <main className="pt-[var(--vi-nav-height)]">
      <section className="vi-hero-under-nav vi-hero-under-nav--compact relative flex min-h-[700px] items-center overflow-hidden">
        <div className="vi-hero-backdrop absolute inset-0 z-0">
          <ViImg
            src={VI_IMG.edmonton.hero}
            alt={VI_EDMONTON_LOCATION.title}
            fill
            className="object-cover object-center transition-transform duration-[10000ms] hover:scale-110"
            priority
            sizes="100vw"
          />
          <div className="vi-hero-tint" aria-hidden="true" />
        </div>
        <ViContainer className="vi-edmonton-reveal relative z-10 flex w-full items-center">
          <ViHeroContentPanel>
            <span className="vi-hero-content__eyebrow vi-label-sm uppercase tracking-widest">
              {VI_EDMONTON_LOCATION.name}
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
          <div className="vi-edmonton-reveal grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{introduction.heading}</h2>
              <p className="vi-body-lg mb-8 text-[var(--vi-on-surface-variant)]">{introduction.content[0]}</p>
              <div className="space-y-4">
                <h3 className="vi-headline-md text-[var(--vi-primary)]">{whyChooseUs.title}</h3>
                <ul className="space-y-3 vi-body-md text-[var(--vi-on-surface-variant)]">
                  {whyChooseUs.items.map((item: any, index: any) => (
                    <li key={item.title} className="flex gap-3">
                      <ViIcon name={WHY_CHOOSE_ICONS[index] ?? "check_circle"} className="shrink-0 text-[var(--vi-primary)]" />
                      <span>
                        <strong>{item.title}:</strong> {item.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative min-h-[280px] overflow-hidden rounded-xl shadow-xl md:min-h-[500px]">
              <ViImg
                src={VI_IMG.edmonton.landscape}
                alt={`Premium landscaping in the West Region — ${VI_EDMONTON_LOCATION.title}`}
                width={800}
                height={500}
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-surface-container-low)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-edmonton-reveal">
          <div className="mb-12 text-center">
            <h2 className="vi-headline-lg mb-3 text-[var(--vi-primary)]">{services.title}</h2>
            <p className="vi-body-md mx-auto max-w-2xl text-[var(--vi-on-surface-variant)]">{services.introduction}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.items.map((service: any) => (
              <article
                key={service.name}
                className="rounded-xl border border-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] bg-white p-8 vi-ambient-shadow transition-transform hover:-translate-y-1"
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

      <ViAboutCtaBanner content={VI_EDMONTON_SERVICES_CTA} revealClass="vi-edmonton-reveal" />

      <section className="bg-[var(--vi-background)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-edmonton-reveal text-center">
          <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{trust.title}</h2>
          <p className="vi-body-lg mx-auto max-w-3xl text-[var(--vi-on-surface-variant)]">{trust.content[0]}</p>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-surface-container-low)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-edmonton-reveal">
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
        <ViContainer className="vi-edmonton-reveal max-w-3xl">
          <h2 className="vi-headline-lg mb-12 text-center text-[var(--vi-primary)]">Frequently Asked Questions</h2>
          <ViFaqAccordion faqs={VI_EDMONTON_FAQS} variant="bordered" defaultOpenIndex={null} />
        </ViContainer>
      </section>

      <ViAboutCtaBanner content={VI_EDMONTON_FINAL_CTA} revealClass="vi-edmonton-reveal" />
    </main>
  );
}
