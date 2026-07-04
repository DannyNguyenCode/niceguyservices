"use client";

import Link from "next/link";
import { VI_PATHS, VI_SERVICE_LINKS } from "./valleyInterlockingConfig";
import { VI_SERVICES_CTA, VI_SERVICES_MASONRY } from "./valleyInterlockingData";
import { VI_IMG } from "./valleyInterlockingImages";
import { ViAboutCtaBanner } from "./ViAboutCtaBanner";
import { ViContainer, ViIcon, ViImg, ViHeroContentPanel, VI_HERO_CTA_PRIMARY, VI_HERO_CTA_SECONDARY } from "./ValleyInterlockingShared";
import { ViAllAspectsCoveredSection, ViCustomerTestimonialsSection } from "./valleyInterlockingServiceSections";
import { useViNavScroll, useViReveal } from "./useViEffects";

type ViMasonryService = (typeof VI_SERVICES_MASONRY)[number];

function chunkServices<T>(items: readonly T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

function ViServiceMasonryCard({
  service,
  size,
}: {
  service: ViMasonryService;
  size: "large" | "small";
}) {
  const isLarge = size === "large";
  const image = VI_IMG.services[service.imageKey];

  return (
    <Link
      href={VI_SERVICE_LINKS[service.linkKey]}
      className={`vi-perspective-card vi-reveal group relative block h-full overflow-hidden rounded-xl bg-white ${
        isLarge ? "min-h-[320px]" : "min-h-[200px]"
      }`}
    >
      <ViImg
        src={image}
        alt={service.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes={isLarge ? "50vw" : "33vw"}
      />
      <div className={`absolute inset-0 z-10 bg-gradient-to-t ${service.gradient}`} />
      <div className={`absolute bottom-0 left-0 z-20 ${isLarge ? "p-8 md:p-12" : "p-6"}`}>
        {"icon" in service && service.icon ? (
          <ViIcon name={service.icon} className="mb-3 text-4xl text-[var(--vi-primary-fixed-dim)]" />
        ) : null}
        <h3 className="vi-headline-md text-white">{service.title}</h3>
        {isLarge ? (
          <p className="vi-body-md text-[var(--vi-on-primary-container)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {service.subtitle}
          </p>
        ) : (
          <div className="mt-1 flex items-center text-[var(--vi-on-tertiary-container)]">
            <span className="vi-label-md">{service.subtitle}</span>
            <ViIcon name="arrow_forward" className="ml-2 text-sm" />
          </div>
        )}
      </div>
    </Link>
  );
}

function ViServiceMasonryRow({
  row,
  rowIndex,
}: {
  row: ViMasonryService[];
  rowIndex: number;
}) {
  const largeFirst = rowIndex % 2 === 0;
  const [large, smallA, smallB] = largeFirst ? row : [row[2], row[0], row[1]];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:grid-rows-2">
      {largeFirst ? (
        <>
          <div className="h-full md:col-start-1 md:row-span-2 md:row-start-1">
            <ViServiceMasonryCard service={large} size="large" />
          </div>
          <div className="h-full md:col-start-2 md:row-start-1">
            <ViServiceMasonryCard service={smallA} size="small" />
          </div>
          <div className="h-full md:col-start-2 md:row-start-2">
            <ViServiceMasonryCard service={smallB} size="small" />
          </div>
        </>
      ) : (
        <>
          <div className="h-full md:col-start-1 md:row-start-1">
            <ViServiceMasonryCard service={smallA} size="small" />
          </div>
          <div className="h-full md:col-start-1 md:row-start-2">
            <ViServiceMasonryCard service={smallB} size="small" />
          </div>
          <div className="h-full md:col-start-2 md:row-span-2 md:row-start-1">
            <ViServiceMasonryCard service={large} size="large" />
          </div>
        </>
      )}
    </div>
  );
}

export function ValleyInterlockingServicesBody() {
  useViNavScroll();
  useViReveal(".vi-perspective-card, .vi-services-aspects-reveal, .vi-services-testimonials-reveal, .vi-services-reveal");

  return (
    <main className="pt-[var(--vi-nav-height)]">
      <section className="vi-hero-under-nav vi-hero-under-nav--compact relative flex h-[min(870px,100dvh)] items-center overflow-hidden">
        <div className="vi-hero-backdrop absolute inset-0 z-0">
          <ViImg
            src={VI_IMG.services.hero}
            alt="High-end residential landscape with slate steps and manicured hedges at golden hour"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="vi-hero-tint" aria-hidden="true" />
        </div>
        <ViContainer className="relative z-10 flex w-full items-center">
          <ViHeroContentPanel>
            <h1 className="vi-display-lg mb-6 leading-tight">Architectural Landscapes Crafted for Life</h1>
            <p className="vi-body-lg mb-8">
              We bridge the gap between structural integrity and organic beauty. Our commitment to craftsmanship
              ensures year-round outdoor enjoyment, transforming your property into a durable, luxury sanctuary
              designed to evolve with the seasons.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={VI_PATHS.gallery} className={VI_HERO_CTA_PRIMARY}>
                View Our Gallery
              </Link>
              <Link href={VI_PATHS.quote} className={VI_HERO_CTA_SECONDARY}>
                Get A Quote
              </Link>
            </div>
          </ViHeroContentPanel>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-surface-container-low)] px-[var(--vi-margin-mobile)] py-[var(--vi-stack-lg)] md:px-[var(--vi-margin-desktop)]">
        <ViContainer className="!px-0">
          <div className="mb-[var(--vi-stack-lg)] flex flex-col items-end justify-between gap-6 md:flex-row">
            <div className="max-w-2xl">
              <h2 className="vi-headline-lg mb-2 text-[var(--vi-primary)]">Explore Our Specializations</h2>
              <p className="vi-body-md text-[var(--vi-on-surface-variant)]">
                From the initial structural foundation to the final seasonal planting, we provide a holistic approach
                to outdoor environments.
              </p>
            </div>
            <span className="rounded-full bg-[var(--vi-surface-container-highest)] px-3 py-1 vi-label-sm text-[var(--vi-on-surface-variant)]">
              9 Service Pages
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {chunkServices(VI_SERVICES_MASONRY, 3).map((row, rowIndex) => (
              <ViServiceMasonryRow key={row.map((service) => service.slug).join("-")} row={row} rowIndex={rowIndex} />
            ))}
          </div>
        </ViContainer>
      </section>

      <ViAllAspectsCoveredSection revealClass="vi-services-aspects-reveal vi-reveal" />

      <ViCustomerTestimonialsSection revealClass="vi-services-testimonials-reveal vi-reveal" />

      <ViAboutCtaBanner content={VI_SERVICES_CTA} revealClass="vi-services-reveal" />
    </main>
  );
}
