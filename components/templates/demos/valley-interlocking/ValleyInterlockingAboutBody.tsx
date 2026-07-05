"use client";

import Link from "next/link";
import { VI_PATHS, viJsonServicePath } from "./valleyInterlockingConfig";
import { VI_ABOUT_CTA_AFTER_MISSION, VI_ABOUT_PAGE } from "./valleyInterlockingAboutContent";
import { VI_IMG } from "./valleyInterlockingImages";
import { VI_HOME_PAGE } from "./valleyInterlockingSiteContent";
import { ViAboutCtaBanner } from "./ViAboutCtaBanner";
import { ViContainer, ViIcon, ViImg, ViHeroContentPanel, VI_HERO_CTA_PRIMARY } from "./ValleyInterlockingShared";
import { useViNavScroll, useViReveal } from "./useViEffects";

const EXPERIENCE_ICONS = ["groups", "verified"] as const;

export function ValleyInterlockingAboutBody() {
  const [mission, experience, services, about, whyChooseUs] = VI_ABOUT_PAGE.sections;

  useViNavScroll();
  useViReveal(".vi-about-reveal");

  return (
    <main className="pt-[var(--vi-nav-height)]">
      <section className="vi-hero-under-nav vi-hero-under-nav--compact relative flex h-[min(870px,100dvh)] items-center overflow-hidden">
        <div className="vi-hero-backdrop absolute inset-0 z-0">
          <ViImg
            src={VI_IMG.about.hero}
            alt="Professionally landscaped luxury backyard"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="vi-hero-tint" aria-hidden="true" />
        </div>
        <ViContainer className="vi-about-reveal relative z-10 flex w-full items-center">
          <ViHeroContentPanel>
            <h1 className="vi-display-lg mb-6 leading-tight">{VI_ABOUT_PAGE.name}</h1>
            <div className="vi-body-lg mb-8 space-y-4">
              {about.content.map((paragraph: string) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              {VI_HOME_PAGE.hero.ctas.map((cta: any) => (
                <Link
                  key={cta.pathKey}
                  href={VI_PATHS[cta.pathKey as "toronto" | "edmonton"]}
                  className={VI_HERO_CTA_PRIMARY}
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          </ViHeroContentPanel>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-surface-container-lowest)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-about-reveal mx-auto max-w-4xl text-center">
          <h2 className="vi-headline-lg mb-8 text-[var(--vi-primary)]">{mission.heading}</h2>
          <div className="vi-body-lg space-y-4 leading-relaxed text-[var(--vi-on-surface-variant)]">
            {mission.content.map((paragraph: string) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-surface-container-low)] py-[var(--vi-stack-lg)]">
        <ViContainer className="vi-about-reveal mx-auto max-w-4xl">
          <h2 className="vi-headline-lg mb-8 text-center text-[var(--vi-primary)]">{whyChooseUs.heading}</h2>
          <div className="vi-body-lg space-y-4 leading-relaxed text-[var(--vi-on-surface-variant)]">
            {whyChooseUs.content.map((paragraph: string) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </ViContainer>
      </section>

      <ViAboutCtaBanner content={VI_ABOUT_CTA_AFTER_MISSION} />

      <section className="bg-[var(--vi-surface-container-lowest)] py-[var(--vi-stack-lg)]">        <ViContainer>
          <div className="vi-about-reveal grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="relative">
              <div className="absolute -left-4 -top-4 z-0 h-full w-full rounded-lg border-2 border-[var(--vi-primary)]" />
              <div className="relative z-10 min-h-[280px] overflow-hidden rounded-lg vi-ambient-shadow md:min-h-[500px]">
                <ViImg
                  src={VI_IMG.about.craftsman}
                  alt="Skilled landscaper at work"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            <div>
              <h2 className="vi-headline-lg mb-12 text-[var(--vi-primary)]">{experience.heading}</h2>
              <div className="space-y-10">
                {experience.subsections.map((subsection: { heading: string; content: string[] }, index: number) => (
                  <div key={subsection.heading} className="flex gap-6">
                    <ViIcon
                      name={EXPERIENCE_ICONS[index] ?? "handshake"}
                      className="text-3xl text-[var(--vi-primary)]"
                    />
                    <div>
                      <h3 className="vi-headline-md mb-2 text-[var(--vi-on-surface)]">{subsection.heading}</h3>
                      <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{subsection.content[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-surface-container-lowest)] py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="vi-about-reveal grid grid-cols-1 items-start gap-12 md:grid-cols-12">
            <div className="md:col-span-6">
              <h2 className="vi-headline-lg mb-8 text-[var(--vi-primary)]">{services.heading}</h2>
              <div className="vi-body-lg mb-8 space-y-4 leading-relaxed text-[var(--vi-on-surface-variant)]">
                {services.content.map((paragraph: string) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {services.ctas[0] ? (
                <Link
                  href={viJsonServicePath(services.ctas[0].url)}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-[var(--vi-primary)] px-8 py-4 vi-label-md text-[var(--vi-primary)] transition-all hover:bg-[var(--vi-primary)] hover:text-[var(--vi-on-primary)]"
                >
                  {services.ctas[0].label}
                </Link>
              ) : null}
            </div>
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] bg-[var(--vi-surface-container-low)] p-8 md:col-span-6">
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-12">
                {services.services.map((service: string) => (
                  <li key={service} className="flex items-center gap-2 vi-body-md text-[var(--vi-on-surface)]">
                    <ViIcon name="check_circle" className="text-[var(--vi-primary)]" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ViContainer>
      </section>

      <ViAboutCtaBanner />
    </main>
  );
}