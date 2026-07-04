"use client";

import { VI_ABOUT_PAGE } from "./valleyInterlockingAboutContent";
import { VI_ABOUT_PROMISES, VI_TEAM_CTA } from "./valleyInterlockingData";
import { VI_IMG } from "./valleyInterlockingImages";
import { ViAboutCtaBanner } from "./ViAboutCtaBanner";
import { ViContainer, ViIcon, ViImg, ViHeroContentPanel } from "./ValleyInterlockingShared";
import { useViNavScroll, useViReveal } from "./useViEffects";

const TEAM_VALUES = VI_ABOUT_PAGE.sections[1].subsections;

export function ValleyInterlockingTeamBody() {
  useViNavScroll();
  useViReveal(".vi-team-reveal");

  return (
    <main className="pt-[var(--vi-nav-height)]">
      <section className="vi-hero-under-nav vi-hero-under-nav--compact relative flex h-[min(870px,100dvh)] items-center overflow-hidden">
        <div className="vi-hero-backdrop absolute inset-0 z-0">
          <ViImg
            src={VI_IMG.about.craftsman}
            alt="Skilled Valley Interlocking landscaper at work"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="vi-hero-tint" aria-hidden="true" />
        </div>
        <ViContainer className="vi-team-reveal relative z-10 flex w-full items-center">
          <ViHeroContentPanel>
            <h1 className="vi-display-lg mb-6 leading-tight">Meet Our Team</h1>
            <p className="vi-body-lg">
              Certified craftspeople and designers serving Toronto and Edmonton — dedicated to transforming outdoor
              spaces with precision, care, and lasting quality.
            </p>
          </ViHeroContentPanel>
        </ViContainer>
      </section>

      <section className="bg-[var(--vi-primary)] py-[var(--vi-stack-lg)] text-[var(--vi-on-primary)]">
        <ViContainer>
          <div className="vi-team-reveal grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
            <div className="relative min-h-[280px] overflow-hidden rounded-lg vi-ambient-shadow md:min-h-[420px]">
              <ViImg
                src={VI_IMG.about.craftsman}
                alt="Valley Interlocking landscaping crew at work on a residential project"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="vi-headline-lg mb-8">{VI_ABOUT_PAGE.sections[1].heading}</h2>
              <div className="space-y-8">
                {TEAM_VALUES.map((item, index) => (
                  <div key={item.heading} className="flex gap-4 sm:gap-6">
                    <ViIcon
                      name={index === 0 ? "groups" : "verified"}
                      className="shrink-0 text-3xl text-[var(--vi-secondary-fixed)]"
                      aria-hidden
                    />
                    <div>
                      <h3 className="vi-headline-md mb-2">{item.heading}</h3>
                      <p className="vi-body-md opacity-90">{item.content[0]}</p>
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
          <div className="vi-team-reveal mb-10 text-center md:mb-12">
            <h2 className="vi-headline-lg mb-3 text-[var(--vi-primary)]">How We Work With You</h2>
            <p className="vi-body-md mx-auto max-w-2xl text-[var(--vi-on-surface-variant)]">
              Every project is led by experienced specialists who listen first, then build with integrity.
            </p>
          </div>
          <ul className="vi-team-reveal grid grid-cols-1 gap-6 md:grid-cols-3">
            {VI_ABOUT_PROMISES.map((promise) => (
              <li
                key={promise.title}
                className="rounded-xl border border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)] bg-[var(--vi-background)] p-6 vi-ambient-shadow sm:p-8"
              >
                <ViIcon name={promise.icon} className="mb-4 text-4xl text-[var(--vi-primary)]" aria-hidden />
                <h3 className="vi-headline-md mb-3 text-[var(--vi-primary)]">{promise.title}</h3>
                <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{promise.description}</p>
              </li>
            ))}
          </ul>
        </ViContainer>
      </section>

      <ViAboutCtaBanner content={VI_TEAM_CTA} revealClass="vi-team-reveal" />
    </main>
  );
}
