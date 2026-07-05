"use client";

import Link from "next/link";
import { ppePath } from "./powerPelletElectricConfig";
import { PPE_HOME } from "./powerPelletElectricSiteContent";
import { ppeImage } from "./powerPelletElectricImages";
import { PpeContainer, PpeCtaLink, PpeIcon, PpeImg } from "./PowerPelletElectricShared";

export function PowerPelletElectricHomeBody() {
  const { hero, trustIndicators, servicePreview, howItWorks, gallery, finalCta } = PPE_HOME;

  return (
    <main id="ppe-main-content" className="ppe-main overflow-x-hidden ppe-arcade-grid pb-24 lg:pb-12">
      <section className="relative flex flex-col items-center overflow-hidden px-[var(--ppe-margin-mobile)] pb-16 pt-6 text-center sm:pt-8 md:px-[var(--ppe-margin-desktop)] md:py-20">
        <div className="relative z-10 max-w-4xl">
          <span className="ppe-label-caps mb-4 block uppercase tracking-[0.2em] text-[var(--ppe-secondary-fixed)]">
            {hero.eyebrow}
          </span>
          <h1 className="ppe-display mb-6 leading-tight text-[var(--ppe-primary)] uppercase">
            Power Up Your Home or Business With{" "}
            <span className="text-[var(--ppe-primary-fixed)]">{hero.headlineAccent}</span> Electrical Work
          </h1>
          <p className="ppe-body-lg mx-auto mb-10 max-w-2xl text-[var(--ppe-on-surface-variant)]">{hero.body}</p>
          <div className="mb-12 flex flex-col items-center justify-center gap-6 md:flex-row">
            <PpeCtaLink
              href={hero.primaryCTA.href}
              className="rounded-full px-10 py-4 font-bold ppe-headline-md"
            >
              {hero.primaryCTA.label} <PpeIcon name="bolt" />
            </PpeCtaLink>
            <PpeCtaLink
              href={hero.secondaryCTA.href}
              variant="secondary"
              className="rounded-full px-10 py-4 font-bold ppe-headline-md"
            >
              {hero.secondaryCTA.label} <PpeIcon name="electric_bolt" />
            </PpeCtaLink>
          </div>
          <Link
            href={ppePath("/contact")}
            className="ppe-interactive inline-flex animate-pulse items-center gap-3 rounded-xl border-2 border-[var(--ppe-error)] bg-[color-mix(in_srgb,var(--ppe-error-container)_20%,transparent)] px-6 py-3 text-[var(--ppe-error)]"
          >
            <PpeIcon name="emergency_home" fill />
            <span className="ppe-label-caps">
              {hero.emergencyCallout.label} — {hero.emergencyCallout.text}
            </span>
          </Link>
        </div>
      </section>

      <section className="px-[var(--ppe-margin-mobile)] py-12 md:px-[var(--ppe-margin-desktop)]">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {trustIndicators.map((item) => (
            <div
              key={item.label}
              className="ppe-maze-border group flex cursor-default flex-col items-center p-4 text-center transition-colors hover:bg-[var(--ppe-surface-container)]"
            >
              <PpeIcon name={item.icon} className="mb-2 text-3xl text-[var(--ppe-primary-fixed)] transition-transform group-hover:scale-110" />
              <p className="ppe-label-caps uppercase">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative px-[var(--ppe-margin-mobile)] py-24 md:px-[var(--ppe-margin-desktop)]">
        <div className="mb-12 flex items-center gap-4">
          <h2 className="ppe-headline-lg uppercase text-[var(--ppe-secondary)]">Expert Level Services</h2>
          <div className="h-[2px] flex-grow ppe-pellet-path" />
        </div>
        <div className="grid grid-cols-1 gap-[var(--ppe-gutter)] md:grid-cols-2 lg:grid-cols-4">
          {servicePreview.map((service) => (
            <Link
              key={service.title}
              href={ppePath(service.href)}
              className="ppe-maze-border group flex flex-col gap-4 bg-[var(--ppe-surface-container-low)] p-8 ppe-neon-glow-pink transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--ppe-secondary-container)]">
                <PpeIcon name={service.icon} className="text-[var(--ppe-secondary)]" fill />
              </div>
              <h3 className="ppe-headline-md uppercase text-[var(--ppe-secondary)]">{service.title}</h3>
              <p className="ppe-body-md text-[var(--ppe-on-surface-variant)]">{service.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[color-mix(in_srgb,var(--ppe-surface-container-lowest)_50%,transparent)] px-[var(--ppe-margin-mobile)] py-24 md:px-[var(--ppe-margin-desktop)]">
        <PpeContainer>
          <div className="flex flex-col items-start gap-12 md:flex-row">
            <div className="w-full md:sticky md:top-32 md:w-1/3">
              <h2 className="ppe-display mb-6 uppercase text-[var(--ppe-primary-fixed)]">{howItWorks.title}</h2>
              <p className="ppe-body-lg mb-8 text-[var(--ppe-on-surface-variant)]">{howItWorks.intro}</p>
              <div className="ppe-maze-border border-[var(--ppe-primary-fixed)] bg-[var(--ppe-surface-container)] p-6 ppe-neon-glow-yellow">
                <h4 className="ppe-label-caps mb-2 text-[var(--ppe-primary-fixed)]">OPERATIONAL STATUS</h4>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 animate-ping rounded-full bg-[var(--ppe-primary-fixed)]" />
                  <span className="ppe-label-caps">{howItWorks.statusLabel}</span>
                </div>
              </div>
            </div>
            <div className="w-full space-y-8 md:w-2/3">
              {howItWorks.steps.map((step, index) => {
                const isLast = index === howItWorks.steps.length - 1;
                const highlight = "highlight" in step && step.highlight;
                return (
                  <div
                    key={step.step}
                    className={`relative flex items-start gap-6 ${isLast ? "pl-8" : "border-l-4 border-dotted border-[var(--ppe-on-tertiary-container)] pb-8 pl-8"}`}
                  >
                    <div
                      className={`absolute -left-[14px] top-0 flex h-6 w-6 items-center justify-center rounded-full ${
                        highlight
                          ? "bg-[var(--ppe-secondary)] ppe-neon-glow-pink"
                          : "bg-[var(--ppe-primary-fixed)]"
                      }`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          highlight ? "bg-[var(--ppe-on-secondary)]" : "bg-[var(--ppe-on-primary)]"
                        }`}
                      />
                    </div>
                    <div
                      className={`ppe-maze-border w-full bg-[var(--ppe-surface-container)] p-8 ${
                        highlight ? "border-[var(--ppe-secondary)] ppe-neon-glow-pink" : ""
                      } ${index === 0 ? "border-[var(--ppe-primary-fixed)]" : ""}`}
                    >
                      <span
                        className={`ppe-label-caps mb-2 block ${
                          highlight ? "text-[var(--ppe-secondary)]" : "text-[var(--ppe-primary-fixed)]"
                        }`}
                      >
                        {step.stage}
                      </span>
                      <h4
                        className={`ppe-headline-md mb-4 uppercase ${
                          highlight ? "text-[var(--ppe-secondary)]" : "text-[var(--ppe-primary-fixed)]"
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p className="text-[var(--ppe-on-surface-variant)]">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </PpeContainer>
      </section>

      <section className="px-[var(--ppe-margin-mobile)] py-24 md:px-[var(--ppe-margin-desktop)]">
        <h2 className="ppe-headline-lg mb-12 text-center uppercase text-[var(--ppe-primary)]">
          {gallery.title}
        </h2>
        <div className="grid h-auto grid-cols-1 gap-4 md:h-[600px] md:grid-cols-4">
          {gallery.images.map((image) => (
            <div
              key={image.src}
              className={`ppe-maze-border group relative min-h-[200px] overflow-hidden ${image.className ?? ""}`}
            >
              <PpeImg
                src={ppeImage(image.src)}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              {image.src === "panelCloseup" ? (
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--ppe-background)] to-transparent opacity-60" />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="px-[var(--ppe-margin-mobile)] py-24 md:px-[var(--ppe-margin-desktop)]">
        <div className="ppe-maze-border relative overflow-hidden border-[var(--ppe-primary-fixed)] bg-[var(--ppe-surface-container)] p-16 text-center ppe-neon-glow-yellow">
          <div className="absolute left-0 top-0 h-1 w-full ppe-pellet-path" />
          <div className="absolute bottom-0 left-0 h-1 w-full ppe-pellet-path" />
          <h2 className="ppe-display mb-6 uppercase text-[var(--ppe-primary-fixed)]">{finalCta.title}</h2>
          <p className="ppe-body-lg mx-auto mb-10 max-w-2xl text-[var(--ppe-on-surface-variant)]">{finalCta.body}</p>
          <PpeCtaLink href={finalCta.href} className="rounded-full px-12 py-5 font-bold ppe-headline-md">
            {finalCta.label}
          </PpeCtaLink>
        </div>
      </section>
    </main>
  );
}
