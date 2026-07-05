"use client";

import Link from "next/link";
import { VI_PATHS, VI_SERVICE_LINKS, type ViServiceLinkKey } from "./valleyInterlockingConfig";
import { VI_FAQS } from "./valleyInterlockingFaqContent";
import { VI_ABOUT_CTA_BANNER } from "./valleyInterlockingAboutContent";
import { VI_HOME_GET_INSPIRED_CTA, VI_HOME_SERVICES, VI_HOME_SERVICES_INTRO } from "./valleyInterlockingData";
import { VI_IMG } from "./valleyInterlockingImages";
import { VI_HOME_PAGE } from "./valleyInterlockingSiteContent";
import { ViFaqAccordion } from "./valleyInterlockingServiceSections";
import { ViAboutCtaBanner } from "./ViAboutCtaBanner";
import { ViContainer, ViIcon, ViImg, ViHeroContentPanel, VI_HERO_CTA_PRIMARY } from "./ValleyInterlockingShared";
import { useViNavScroll, useViReveal } from "./useViEffects";

type ViLocationPathKey = "toronto" | "edmonton";
type ViHomeImageKey = "home.toronto" | "home.edmonton";

function viHomeImage(key: ViHomeImageKey): string {
  return key === "home.toronto" ? VI_IMG.home.toronto : VI_IMG.home.edmonton;
}

export function ValleyInterlockingHomeBody() {
  useViNavScroll();
  useViReveal(".vi-home-reveal");

  const { hero, locationsSection } = VI_HOME_PAGE;

  return (
    <main className="pt-[var(--vi-nav-height)]">
      <section className="vi-hero-under-nav vi-hero-under-nav--compact vi-hero-home relative flex h-[min(870px,100dvh)] items-stretch overflow-hidden">
        <div className="vi-hero-backdrop absolute inset-0 z-0">
          <ViImg
            src={VI_IMG.home.hero}
            alt={hero.heroImageAlt}
            fill
            className="vi-hero-backdrop__image object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="vi-hero-tint" aria-hidden="true" />
        </div>
        <ViContainer className="vi-hero-home__container relative z-10 flex h-full w-full items-center">
          <ViHeroContentPanel>
            <h1 className="vi-display-lg mb-6 leading-tight">{hero.headline}</h1>
            <p className="vi-body-lg mb-8">{hero.subhead}</p>
            <div className="flex flex-wrap gap-4">
              {hero.ctas.map((cta: any) => (
                <Link
                  key={cta.pathKey}
                  href={VI_PATHS[cta.pathKey as ViLocationPathKey]}
                  className={VI_HERO_CTA_PRIMARY}
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          </ViHeroContentPanel>
        </ViContainer>
      </section>

      <section id="locations" className="scroll-mt-[var(--vi-nav-height)] bg-[var(--vi-surface-container-lowest)] py-[var(--vi-stack-lg)]">
        <ViContainer className="mb-12 text-center">
          <h2 className="vi-headline-lg mb-2 text-[var(--vi-primary)]">{locationsSection.heading}</h2>
          <div className="mx-auto h-1 w-20 bg-[var(--vi-secondary)]" />
        </ViContainer>
        <ViContainer className="grid gap-6 md:grid-cols-2">
          {locationsSection.cards.map((loc: any) => (
            <Link
              key={loc.title}
              href={VI_PATHS[loc.pathKey as ViLocationPathKey]}
              aria-label={`${loc.title}: ${loc.description}`}
              className="group relative block h-72 cursor-pointer overflow-hidden rounded-xl shadow-sm transition-all hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vi-primary)] sm:h-80 md:h-96"
            >
              <ViImg
                src={viHomeImage(loc.imageKey as ViHomeImageKey)}
                alt={loc.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--vi-primary)_58%,transparent)] to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-[var(--vi-on-primary)] sm:p-8 md:p-12">
                <h3 className="vi-headline-md mb-1">{loc.title}</h3>
                <p className="vi-body-md mb-6 opacity-80">{loc.description}</p>
                <span className="inline-block border-b border-[var(--vi-on-primary)] pb-1 vi-label-md">
                  View Regional Portfolio
                </span>
              </div>
            </Link>
          ))}
        </ViContainer>
      </section>

      <section id="services" className="scroll-mt-[var(--vi-nav-height)] bg-[var(--vi-background)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div className="max-w-2xl">
              <h2 className="vi-headline-lg mb-2 text-[var(--vi-primary)]">{VI_HOME_SERVICES_INTRO.title}</h2>
              <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{VI_HOME_SERVICES_INTRO.description}</p>
            </div>
            <Link
              href={VI_PATHS.services}
              className="mb-1 flex shrink-0 items-center gap-1 vi-label-md text-[var(--vi-primary)] transition-all hover:gap-2"
            >
              All Services <ViIcon name="trending_flat" />
            </Link>
          </div>
          <div className="vi-home-services-masonry">
            {VI_HOME_SERVICES.map((service: { title: string; description: string; imageKey: keyof typeof VI_IMG.home; linkKey: ViServiceLinkKey; gridClass: string; imageAlt: string }) => {
              const image = VI_IMG.home[service.imageKey];
              const href = VI_SERVICE_LINKS[service.linkKey];
              return (
                <Link
                  key={service.title}
                  href={href}
                  className={`vi-service-tile vi-home-service-tile group relative col-span-1 row-span-1 block overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)] bg-[var(--vi-surface-container-high)] shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vi-primary)] ${service.gridClass}`}
                >
                  <ViImg
                    src={image}
                    alt={service.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
                  <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
                    <h3 className="vi-headline-md mb-2 text-white">{service.title}</h3>
                    <p className="text-white/90">{service.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </ViContainer>
      </section>

      <ViAboutCtaBanner content={VI_HOME_GET_INSPIRED_CTA} revealClass="vi-home-reveal" />

      <section className="bg-[var(--vi-background)] py-[var(--vi-stack-lg)]">
        <ViContainer className="max-w-3xl">
          <h2 className="vi-headline-lg mb-12 text-center text-[var(--vi-primary)]">FAQs</h2>
          <ViFaqAccordion faqs={VI_FAQS} />
        </ViContainer>
      </section>

      <ViAboutCtaBanner content={VI_ABOUT_CTA_BANNER} revealClass="vi-home-reveal" />
    </main>
  );
}
