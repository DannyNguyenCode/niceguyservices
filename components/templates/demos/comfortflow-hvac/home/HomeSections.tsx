"use client";

import Link from "next/link";
import { cfhPath } from "../comfortflowHvacConfig";
import { CFH_HOME } from "../comfortflowHvacSiteContent";
import { cfhImage } from "../comfortflowHvacImages";
import { CfhContainer, CfhCtaLink, CfhIcon, CfhImg } from "../ComfortflowHvacShared";

export function HomeSections() {
  const { serviceSnippets, aboutPreview, processSteps, seoAeo, finalCta } = CFH_HOME;

  return (
    <>
      {/* Service snippets */}
      <section
        className="border-t border-[var(--cfh-outline-variant)]/30 bg-[var(--cfh-surface-container-lowest)]"
        aria-labelledby="cfh-home-services-heading"
      >
        <CfhContainer className="cfh-section-py">
          <div className="mb-10 max-w-3xl">
            <span className="cfh-label-caps mb-2 block text-[var(--cfh-secondary)]">{serviceSnippets.eyebrow}</span>
            <h2 id="cfh-home-services-heading" className="cfh-headline-md mb-4 text-[var(--cfh-primary)]">
              {serviceSnippets.title}
            </h2>
            <p className="cfh-body-lg text-[var(--cfh-on-surface-variant)]">{serviceSnippets.intro}</p>
          </div>
          <div className="grid grid-cols-1 gap-[var(--cfh-gutter)] sm:grid-cols-2 lg:grid-cols-3">
            {serviceSnippets.items.map((service) => (
              <article
                key={service.href}
                className="cfh-glass-card group flex h-full flex-col rounded-2xl p-6 transition-transform hover:-translate-y-1"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--cfh-secondary-fixed)]/25">
                  <CfhIcon name={service.icon} className="text-2xl text-[var(--cfh-secondary)]" />
                </div>
                <h3 className="cfh-headline-md mb-2 text-lg text-[var(--cfh-primary)]">{service.title}</h3>
                <p className="cfh-body-md mb-5 flex-1 text-[var(--cfh-on-surface-variant)]">{service.description}</p>
                <Link
                  href={cfhPath(service.href)}
                  className="cfh-interactive cfh-label-caps inline-flex items-center gap-1 text-[var(--cfh-secondary)] group-hover:gap-2"
                >
                  Learn more
                  <CfhIcon name="arrow_forward" className="text-sm" />
                </Link>
              </article>
            ))}
          </div>
        </CfhContainer>
      </section>

      {/* About preview */}
      <section className="cfh-section-py" aria-labelledby="cfh-home-about-heading">
        <CfhContainer>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--cfh-outline-variant)]/40">
              <CfhImg
                src={cfhImage(aboutPreview.imageKey)}
                alt="ComfortFlow HVAC technicians and engineering workshop in Toronto"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <span className="cfh-label-caps mb-2 block text-[var(--cfh-secondary)]">{aboutPreview.eyebrow}</span>
              <h2 id="cfh-home-about-heading" className="cfh-headline-md mb-4 text-[var(--cfh-primary)]">
                {aboutPreview.title}
              </h2>
              <p className="cfh-body-lg mb-6 text-[var(--cfh-on-surface-variant)]">{aboutPreview.body}</p>
              <ul className="mb-8 space-y-3">
                {aboutPreview.highlights.map((item) => (
                  <li key={item} className="cfh-body-md flex items-start gap-2 text-[var(--cfh-on-surface-variant)]">
                    <CfhIcon name="check_circle" className="mt-0.5 shrink-0 text-[var(--cfh-secondary)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <CfhCtaLink href={aboutPreview.href} variant="outline">
                  {aboutPreview.linkLabel}
                </CfhCtaLink>
                <CfhCtaLink href="/contact">Book a Consultation</CfhCtaLink>
              </div>
            </div>
          </div>
        </CfhContainer>
      </section>

      {/* How it works */}
      <section
        className="cfh-section-py bg-[var(--cfh-surface-container-low)]"
        aria-labelledby="cfh-home-process-heading"
      >
        <CfhContainer>
          <div className="mb-10 text-center">
            <span className="cfh-label-caps mb-2 block text-[var(--cfh-outline)]">{processSteps.eyebrow}</span>
            <h2 id="cfh-home-process-heading" className="cfh-headline-md text-[var(--cfh-primary)]">
              {processSteps.title}
            </h2>
          </div>
          <ol className="grid grid-cols-1 gap-[var(--cfh-gutter)] md:grid-cols-3">
            {processSteps.steps.map((step, index) => (
              <li
                key={step.title}
                className="cfh-glass-card relative rounded-2xl p-6"
              >
                <span className="cfh-label-caps mb-4 block text-[var(--cfh-brand-indigo)]">
                  Step {String(index + 1).padStart(2, "0")}
                </span>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--cfh-secondary-fixed)]/30">
                  <CfhIcon name={step.icon} className="text-2xl text-[var(--cfh-secondary)]" />
                </div>
                <h3 className="cfh-headline-md mb-2 text-lg text-[var(--cfh-primary)]">{step.title}</h3>
                <p className="cfh-body-md text-[var(--cfh-on-surface-variant)]">{step.description}</p>
              </li>
            ))}
          </ol>
        </CfhContainer>
      </section>

      {/* SEO / AEO FAQ */}
      <section className="cfh-section-py" aria-labelledby="cfh-home-faq-heading">
        <CfhContainer>
          <div className="mb-10 max-w-3xl">
            <span className="cfh-label-caps mb-2 block text-[var(--cfh-secondary)]">{seoAeo.eyebrow}</span>
            <h2 id="cfh-home-faq-heading" className="cfh-headline-md mb-4 text-[var(--cfh-primary)]">
              {seoAeo.title}
            </h2>
            <p className="cfh-body-lg text-[var(--cfh-on-surface-variant)]">{seoAeo.intro}</p>
          </div>
          <div className="grid grid-cols-1 gap-[var(--cfh-gutter)] lg:grid-cols-2">
            {seoAeo.items.map((item) => (
              <article
                key={item.question}
                className="cfh-glass-card rounded-2xl p-6"
                itemScope
                itemType="https://schema.org/Question"
              >
                <h3 className="cfh-headline-md mb-3 text-lg text-[var(--cfh-primary)]" itemProp="name">
                  {item.question}
                </h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="cfh-body-md mb-4 text-[var(--cfh-on-surface-variant)]" itemProp="text">
                    {item.answer}
                  </p>
                </div>
                <Link
                  href={cfhPath(seoAeo.cta.href)}
                  className="cfh-interactive cfh-label-caps inline-flex items-center gap-1 text-[var(--cfh-secondary)] hover:gap-2"
                >
                  {seoAeo.cta.label}
                  <CfhIcon name="arrow_forward" className="text-sm" />
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CfhCtaLink href={seoAeo.cta.href}>{seoAeo.cta.label}</CfhCtaLink>
            <CfhCtaLink href={seoAeo.secondaryCta.href} variant="outline">
              {seoAeo.secondaryCta.label}
            </CfhCtaLink>
          </div>
        </CfhContainer>
      </section>

      {/* Final CTA */}
      <section className="cfh-section-py border-t border-[var(--cfh-outline-variant)]/30" aria-labelledby="cfh-home-cta-heading">
        <CfhContainer>
          <div className="rounded-3xl bg-[var(--cfh-primary)] px-6 py-10 text-center text-[var(--cfh-on-primary)] md:px-12 md:py-14">
            <h2 id="cfh-home-cta-heading" className="cfh-headline-md mb-4">
              {finalCta.title}
            </h2>
            <p className="cfh-body-lg mx-auto mb-8 max-w-2xl text-[var(--cfh-on-primary)]/80">{finalCta.body}</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <CfhCtaLink href={finalCta.primaryCTA.href} variant="secondary">
                {finalCta.primaryCTA.label}
              </CfhCtaLink>
              <CfhCtaLink href={finalCta.secondaryCTA.href} variant="outlineOnDark">
                {finalCta.secondaryCTA.label}
              </CfhCtaLink>
            </div>
          </div>
        </CfhContainer>
      </section>
    </>
  );
}
