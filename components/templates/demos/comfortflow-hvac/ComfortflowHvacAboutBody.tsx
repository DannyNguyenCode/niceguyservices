"use client";

import { cfhPath } from "./comfortflowHvacConfig";
import { CFH_ABOUT } from "./comfortflowHvacSiteContent";
import { cfhImage } from "./comfortflowHvacImages";
import { CfhContainer, CfhCtaLink, CfhIcon, CfhImg } from "./ComfortflowHvacShared";

export function ComfortflowHvacAboutBody() {
  const { hero, story, philosophy, values, serviceAreas, certifications, cta } = CFH_ABOUT;

  return (
    <main id="cfh-main-content" className="cfh-main overflow-x-hidden">
      <section className="cfh-section-py cfh-technical-pattern">
        <CfhContainer>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="cfh-label-caps mb-4 block text-[var(--cfh-secondary)]">{hero.eyebrow}</span>
              <h1 className="cfh-display cfh-gradient-text mb-6">{hero.headline}</h1>
              <p className="cfh-body-lg text-[var(--cfh-on-surface-variant)]">{hero.body}</p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--cfh-outline-variant)]/40">
              <CfhImg
                src={cfhImage(hero.imageKey)}
                alt="ComfortFlow HVAC workshop and engineering team"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </CfhContainer>
      </section>

      <section className="cfh-section-py bg-[var(--cfh-surface-container-low)]">
        <CfhContainer>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl order-2 lg:order-1">
              <CfhImg
                src={cfhImage(story.imageKey)}
                alt="ComfortFlow service network map"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="order-1 lg:order-2">
              <span className="cfh-label-caps mb-2 block text-[var(--cfh-outline)]">{story.eyebrow}</span>
              <h2 className="cfh-headline-md mb-4 text-[var(--cfh-primary)]">{story.title}</h2>
              <p className="cfh-body-lg text-[var(--cfh-on-surface-variant)]">{story.body}</p>
            </div>
          </div>
        </CfhContainer>
      </section>

      <section className="cfh-section-py">
        <CfhContainer>
          <div className="mb-12 text-center">
            <span className="cfh-label-caps mb-2 block text-[var(--cfh-secondary)]">{philosophy.eyebrow}</span>
            <h2 className="cfh-headline-md text-[var(--cfh-primary)]">{philosophy.title}</h2>
          </div>
          <div className="grid grid-cols-1 gap-[var(--cfh-gutter)] md:grid-cols-3">
            {philosophy.pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="cfh-glass-card rounded-2xl p-8 text-center transition-transform hover:-translate-y-1"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--cfh-secondary-fixed)]/30">
                  <CfhIcon name={pillar.icon} className="text-3xl text-[var(--cfh-secondary)]" />
                </div>
                <h3 className="cfh-headline-md mb-3 text-[var(--cfh-primary)]">{pillar.title}</h3>
                <p className="cfh-body-md text-[var(--cfh-on-surface-variant)]">{pillar.description}</p>
              </div>
            ))}
          </div>
        </CfhContainer>
      </section>

      <section className="cfh-section-py bg-[var(--cfh-surface-container)]">
        <CfhContainer>
          <div className="mb-12 max-w-2xl">
            <span className="cfh-label-caps mb-2 block text-[var(--cfh-outline)]">{values.eyebrow}</span>
            <h2 className="cfh-headline-md mb-4 text-[var(--cfh-primary)]">{values.title}</h2>
            <p className="cfh-body-lg text-[var(--cfh-on-surface-variant)]">{values.intro}</p>
          </div>
          <div className="grid grid-cols-1 gap-[var(--cfh-gutter)] sm:grid-cols-2 lg:grid-cols-4">
            {values.items.map((item) => (
              <div key={item.number} className="cfh-glass-card rounded-2xl p-6">
                <span className="cfh-label-caps mb-2 block text-[var(--cfh-brand-indigo)]">{item.number}</span>
                <span className="cfh-label-caps mb-3 block text-[var(--cfh-secondary)]">{item.label}</span>
                <h3 className="cfh-headline-md mb-2 text-lg text-[var(--cfh-primary)]">{item.title}</h3>
                <p className="cfh-body-md text-[var(--cfh-on-surface-variant)]">{item.description}</p>
              </div>
            ))}
          </div>
        </CfhContainer>
      </section>

      <section className="cfh-section-py">
        <CfhContainer>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="cfh-label-caps mb-2 block text-[var(--cfh-secondary)]">{serviceAreas.eyebrow}</span>
              <h2 className="cfh-headline-md mb-4 text-[var(--cfh-primary)]">{serviceAreas.title}</h2>
              <p className="cfh-body-lg mb-8 text-[var(--cfh-on-surface-variant)]">{serviceAreas.body}</p>
              <div className="mb-6">
                <p className="cfh-label-caps mb-3 text-[var(--cfh-outline)]">Primary Hubs</p>
                <div className="flex flex-wrap gap-2">
                  {serviceAreas.primaryHubs.map((hub) => (
                    <span
                      key={hub}
                      className="rounded-full bg-[var(--cfh-secondary)] px-4 py-2 text-sm font-semibold text-[var(--cfh-on-secondary)]"
                    >
                      {hub}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="cfh-label-caps mb-3 text-[var(--cfh-outline)]">Service Nodes</p>
                <div className="flex flex-wrap gap-2">
                  {serviceAreas.secondaryNodes.map((node) => (
                    <span
                      key={node}
                      className="rounded-full border border-[var(--cfh-outline-variant)] px-4 py-2 text-sm text-[var(--cfh-on-surface-variant)]"
                    >
                      {node}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl cfh-network-glow">
              <CfhImg
                src={cfhImage(serviceAreas.imageKey)}
                alt="GTA service area network map"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </CfhContainer>
      </section>

      <section className="border-y border-[var(--cfh-outline-variant)]/40 py-12">
        <CfhContainer>
          <p className="cfh-label-caps mb-8 text-center text-[var(--cfh-outline)]">{certifications.title}</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {certifications.items.map((cert) => (
              <div key={cert.label} className="flex items-center gap-3">
                <CfhIcon name={cert.icon} className="text-2xl text-[var(--cfh-brand-indigo)]" />
                <span className="cfh-body-md font-semibold text-[var(--cfh-primary)]">{cert.label}</span>
              </div>
            ))}
          </div>
        </CfhContainer>
      </section>

      <section className="cfh-section-py">
        <CfhContainer>
          <div className="rounded-3xl bg-[var(--cfh-primary)] p-8 text-center text-[var(--cfh-on-primary)] md:p-16">
            <h2 className="cfh-headline-md mb-4">{cta.title}</h2>
            <p className="cfh-body-lg mx-auto mb-8 max-w-2xl text-[var(--cfh-on-primary)]/80">{cta.body}</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <CfhCtaLink href={cta.primaryCTA.href} variant="secondary">
                {cta.primaryCTA.label}
              </CfhCtaLink>
              <CfhCtaLink href={cta.secondaryCTA.href} variant="outlineOnDark">
                {cta.secondaryCTA.label}
              </CfhCtaLink>
            </div>
          </div>
        </CfhContainer>
      </section>
    </main>
  );
}
