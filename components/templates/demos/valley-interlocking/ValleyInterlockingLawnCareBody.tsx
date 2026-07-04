"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { VI_LAWN_SERVICES } from "./valleyInterlockingData";
import { VI_LAWN_CARE_101, VI_LAWN_CARE_101_CTA, VI_LAWN_CARE_CTA, VI_LAWN_CARE_SERVICE } from "./valleyInterlockingLawnCareContent";
import { VI_LAWN_CARE_MAINTENANCE_GUIDE } from "./valleyInterlockingLawnCareMaintenanceGuideContent";
import { VI_LAWN_CARE_FAQ_PAGE } from "./valleyInterlockingLawnCareFaqContent";
import { VI_LAWN_CARE_RELATED_SERVICES } from "./valleyInterlockingRelatedServices";
import { VI_IMG } from "./valleyInterlockingImages";
import { ViFaqAccordion, ViServiceBenefitsSection, ViServiceContentParagraphs, ViServiceHero } from "./valleyInterlockingServiceSections";
import { ViAboutCtaBanner } from "./ViAboutCtaBanner";
import { ViRelatedServices } from "./ViRelatedServices";
import { ViContainer, ViIcon, ViImg } from "./ValleyInterlockingShared";
import { useViFocusTrap, useViReveal } from "./useViEffects";

const DETAIL_ICONS: Record<string, string> = {
  "Lawn Mowing": "precision_manufacturing",
  "Lawn Fertilization": "eco",
  "Weed Prevention": "shield",
  "Grass Edging": "border_all",
  "Lawn Repair": "construction",
};

const DETAIL_IMAGES: Record<string, string> = {
  "Lawn Mowing": VI_IMG.lawnCare.mowing,
  "Lawn Fertilization": VI_IMG.lawnCare.roots,
  "Weed Prevention": VI_IMG.serviceRefs["lawn-care-01"],
  "Grass Edging": VI_IMG.lawnCare.irrigation,
  "Lawn Repair": VI_IMG.serviceRefs["turf-fitting"],
};

function lawnPrecisionImage(imageKey?: "mowing" | "irrigation") {
  if (imageKey === "mowing") return VI_IMG.lawnCare.mowing;
  if (imageKey === "irrigation") return VI_IMG.lawnCare.irrigation;
  return VI_IMG.lawnCare.mowing;
}

export function ValleyInterlockingLawnCareBody() {
  const [
    intro,
    benefits,
    lawnServices,
    ,
    ,
    lawnCare,
    mowing,
    fertilization,
    weedPrevention,
    grassEdging,
    lawnRepair,
  ] = VI_LAWN_CARE_SERVICE.sections;

  const detailSections = [mowing, fertilization, weedPrevention, grassEdging, lawnRepair];
  const heroCtas = lawnCare.ctas;
  const howToGuide = VI_LAWN_CARE_MAINTENANCE_GUIDE;
  const [activeDetailIndex, setActiveDetailIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useViReveal(".vi-lawn-reveal");
  useViFocusTrap(dialogRef, activeDetailIndex !== null);

  const closeDetail = useCallback(() => setActiveDetailIndex(null), []);
  const activeDetail = activeDetailIndex !== null ? detailSections[activeDetailIndex] : null;

  useEffect(() => {
    if (activeDetailIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDetail();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeDetailIndex, closeDetail]);

  const openDetail = (index: number) => setActiveDetailIndex(index);

  return (
    <main className="overflow-hidden pt-[var(--vi-nav-height)]">
      <ViServiceHero
        imageSrc={VI_IMG.lawnCare.hero}
        imageAlt="Manicured emerald green lawn surrounding a luxury modern estate at golden hour"
        heading={intro.heading}
        description={intro.content[0]}
        ctas={heroCtas}
        revealClass="vi-lawn-reveal"
      />

      <ViServiceBenefitsSection
        heading={benefits.heading}
        paragraphs={benefits.content}
        imageSrc={VI_IMG.lawnCare.mowing}
        imageAlt="Professional lawn mowing on a manicured residential lawn"
        imagePosition="left"
        revealClass="vi-lawn-reveal"
      />

      <section className="py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-lawn-reveal">
          <div className="mb-12 text-center">
            <h2 className="vi-headline-lg mb-3 text-[var(--vi-primary)]">{lawnServices.heading}</h2>
            <div className="mx-auto h-1 w-24 bg-[var(--vi-secondary)]" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {VI_LAWN_SERVICES.map((item, index) => {
              const imageLeft = index === 3;

              if (item.large) {
                return (
                  <article
                    key={item.title}
                    className="group overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] bg-[var(--vi-surface-container-lowest)] vi-ambient-shadow transition-colors hover:border-[color-mix(in_srgb,var(--vi-primary)_40%,transparent)] md:col-span-8"
                  >
                    <div className="flex h-full flex-col md:flex-row">
                      {imageLeft ? (
                        <div className="h-64 md:h-auto md:w-1/2">
                          <ViImg
                            src={lawnPrecisionImage(item.imageKey)}
                            alt={item.title}
                            width={800}
                            height={600}
                            className="h-full w-full object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      ) : null}
                      <div className="flex flex-col justify-center p-8 md:w-1/2 lg:p-12">
                        <ViIcon
                          name={item.icon}
                          className="mb-6 text-4xl text-[var(--vi-primary)]"
                          fill={index === 0}
                        />
                        <h3 className="vi-headline-md mb-3 text-[var(--vi-primary)]">{item.title}</h3>
                        <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{item.description}</p>
                      </div>
                      {!imageLeft ? (
                        <div className="h-64 md:h-auto md:w-1/2">
                          <ViImg
                            src={lawnPrecisionImage(item.imageKey)}
                            alt={item.title}
                            width={800}
                            height={600}
                            className="h-full w-full object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              }

              return (
                <article
                  key={item.title}
                  className="rounded-xl border border-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] bg-[var(--vi-surface-container-lowest)] p-8 vi-ambient-shadow transition-colors hover:border-[color-mix(in_srgb,var(--vi-primary)_40%,transparent)] md:col-span-4 lg:p-12"
                >
                  <ViIcon name={item.icon} className="mb-6 text-4xl text-[var(--vi-primary)]" />
                  <h3 className="vi-headline-md mb-3 text-[var(--vi-primary)]">{item.title}</h3>
                  <p className="vi-body-md mb-6 text-[var(--vi-on-surface-variant)]">{item.description}</p>
                  {"tags" in item && item.tags ? (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[color-mix(in_srgb,var(--vi-tertiary)_10%,transparent)] px-3 py-1 vi-label-sm text-[var(--vi-tertiary)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </ViContainer>
      </section>

      <section className="overflow-hidden bg-[var(--vi-surface-container-low)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-lawn-reveal grid grid-cols-1 items-center gap-12 md:grid-cols-12 lg:gap-16">
            <div className="space-y-6 md:col-span-5">
              <h2 className="vi-headline-lg leading-tight text-[var(--vi-primary)]">
                {VI_LAWN_CARE_101.heading}
              </h2>
              <p className="vi-body-lg text-[var(--vi-on-surface-variant)]">{VI_LAWN_CARE_101.intro}</p>
              <div className="mt-8 space-y-6">
                {VI_LAWN_CARE_101.tiles.map((tile, index) => (
                  <div
                    key={tile.title}
                    className={`rounded-xl bg-white p-8 vi-ambient-shadow ${
                      index === 0
                        ? "-ml-0 border-l-4 border-[var(--vi-secondary)] md:-ml-12"
                        : "border-l-4 border-[var(--vi-primary)]"
                    }`}
                  >
                    <p className="vi-label-md mb-2 uppercase text-[var(--vi-primary)]">{tile.eyebrow}</p>
                    <h3 className="vi-headline-md mb-3 text-[var(--vi-primary)]">{tile.title}</h3>
                    <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{tile.content}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative md:col-span-7">
              <div className="aspect-square overflow-hidden rounded-2xl vi-ambient-shadow">
                <ViImg
                  src={VI_IMG.lawnCare.roots}
                  alt="Healthy turf root structure in aerated soil"
                  width={900}
                  height={900}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </ViContainer>
      </section>

      <ViAboutCtaBanner content={VI_LAWN_CARE_101_CTA} revealClass="vi-lawn-reveal" />

      <section className="py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-lawn-reveal">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {detailSections.map((section, index) => {
              const icon = DETAIL_ICONS[section.heading] ?? "grass";
              const [cardDescription] = section.content;

              return (
                <button
                  key={section.heading}
                  type="button"
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] bg-[var(--vi-surface-container-lowest)] text-left vi-ambient-shadow transition-colors hover:border-[color-mix(in_srgb,var(--vi-primary)_40%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vi-primary)]"
                  onClick={() => openDetail(index)}
                  aria-label={`View details for ${section.heading}`}
                >
                  <div className="flex flex-1 flex-col p-8">
                    <ViIcon
                      name={icon}
                      className="mb-6 text-4xl text-[var(--vi-primary)]"
                    />
                    <h3 className="vi-headline-md mb-3 text-[var(--vi-primary)]">{section.heading}</h3>
                    <p className="vi-body-md flex-1 text-[var(--vi-on-surface-variant)]">{cardDescription}</p>
                  </div>
                  <div className="border-t border-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] px-8 py-4 transition-colors group-hover:bg-[var(--vi-surface-container-low)]">
                    <span className="vi-label-md flex items-center gap-1 text-[var(--vi-primary)] transition-all group-hover:gap-2">
                      View more details
                      <ViIcon name="chevron_right" className="text-lg" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </ViContainer>
      </section>

      {activeDetail ? (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[color-mix(in_srgb,var(--vi-on-background)_60%,transparent)] p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={activeDetail.heading}
          onClick={closeDetail}
        >
          <button
            type="button"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--vi-surface-container-lowest)] text-[var(--vi-primary)] vi-ambient-shadow transition-colors hover:bg-[var(--vi-surface-container-low)]"
            onClick={closeDetail}
            aria-label="Close details"
          >
            <ViIcon name="close" />
          </button>
          <article
            className="grid max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-[var(--vi-surface-container-lowest)] vi-ambient-shadow md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative min-h-[220px] md:min-h-full">
              <ViImg
                src={DETAIL_IMAGES[activeDetail.heading] ?? VI_IMG.lawnCare.mowing}
                alt={activeDetail.heading}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="overflow-y-auto p-8 md:p-10">
              <ViIcon
                name={DETAIL_ICONS[activeDetail.heading] ?? "grass"}
                className="mb-4 text-5xl text-[var(--vi-primary)]"
              />
              <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{activeDetail.heading}</h2>
              <ViServiceContentParagraphs content={activeDetail.content} />
            </div>
          </article>
        </div>
      ) : null}

      <section className="bg-[var(--vi-background)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-lawn-reveal grid items-start gap-12 lg:grid-cols-2">
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
                Read the Full Maintenance Guide
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
        <ViContainer className="vi-lawn-reveal max-w-3xl">
          <h2 className="vi-headline-lg mb-4 text-center text-[var(--vi-primary)]">{VI_LAWN_CARE_FAQ_PAGE.heading}</h2>
          <p className="vi-body-md mb-12 text-center text-[var(--vi-on-surface-variant)]">{VI_LAWN_CARE_FAQ_PAGE.intro}</p>
          <ViFaqAccordion faqs={VI_LAWN_CARE_FAQ_PAGE.faqs} variant="bordered" defaultOpenIndex={null} />
        </ViContainer>
      </section>

      <ViRelatedServices
        items={VI_LAWN_CARE_RELATED_SERVICES}
        intro="Complete your property care plan — explore services that pair naturally with professional lawn maintenance."
        revealClass="vi-lawn-reveal"
      />

      <ViAboutCtaBanner content={VI_LAWN_CARE_CTA} revealClass="vi-lawn-reveal" />
    </main>
  );
}
