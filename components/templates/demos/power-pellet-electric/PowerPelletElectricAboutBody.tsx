"use client";

import { ppePath } from "./powerPelletElectricConfig";
import { PPE_ABOUT } from "./powerPelletElectricSiteContent";
import { PpeContainer, PpeCtaLink, PpeIcon } from "./PowerPelletElectricShared";

const glowClass: Record<string, string> = {
  pink: "hover:ppe-glow-pink",
  yellow: "hover:ppe-glow-yellow",
  blue: "hover:ppe-glow-blue",
};

const hoverBgClass: Record<string, string> = {
  "primary-fixed": "group-hover:bg-[var(--ppe-primary-fixed)] group-hover:text-[var(--ppe-on-primary)]",
  secondary: "group-hover:bg-[var(--ppe-secondary)] group-hover:text-[var(--ppe-on-secondary)]",
  "tertiary-fixed-dim":
    "group-hover:bg-[var(--ppe-tertiary-fixed-dim)] group-hover:text-[var(--ppe-on-tertiary)]",
};

const valueIconClass: Record<string, string> = {
  "primary-fixed": "text-[var(--ppe-primary-fixed)]",
  secondary: "text-[var(--ppe-secondary)]",
  "tertiary-fixed-dim": "text-[var(--ppe-tertiary-fixed-dim)]",
};

export function PowerPelletElectricAboutBody() {
  const { pageTitle, estBadge, intro, sections, valuesSection, cta } = PPE_ABOUT;

  return (
    <main id="ppe-main-content" className="ppe-main overflow-x-hidden pb-24 pt-32 lg:pb-12">
      <header className="mb-24 px-[var(--ppe-margin-mobile)] text-center md:px-[var(--ppe-margin-desktop)]">
        <div className="mb-6 inline-block rounded-lg ppe-maze-border px-4 py-1 text-[var(--ppe-secondary-fixed)] ppe-label-caps">
          {estBadge}
        </div>
        <h1 className="ppe-display mb-8 uppercase leading-none tracking-tighter text-[var(--ppe-primary-fixed)]">
          {pageTitle}
        </h1>
        <p className="ppe-body-lg mx-auto max-w-3xl leading-relaxed text-[var(--ppe-on-surface-variant)]">
          {intro}
        </p>
        <div className="relative mx-auto mt-16 h-[280px] w-full max-w-4xl overflow-hidden rounded-xl ppe-maze-border ppe-glow-blue md:h-[400px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-lg bg-[color-mix(in_srgb,var(--ppe-surface)_80%,transparent)] p-8 ppe-maze-border backdrop-blur-md">
              <PpeIcon name="bolt" className="text-6xl text-[var(--ppe-primary-fixed)]" fill />
            </div>
          </div>
        </div>
      </header>

      <section className="mb-32 grid grid-cols-1 gap-[var(--ppe-gutter)] px-[var(--ppe-margin-mobile)] md:grid-cols-2 md:px-[var(--ppe-margin-desktop)]">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`group bg-[var(--ppe-surface-container-low)] p-8 ppe-maze-border transition-all duration-500 ${glowClass[section.glow] ?? ""}`}
          >
            <div className="mb-6 flex items-center gap-4">
              <PpeIcon
                name={section.icon}
                className={`text-4xl ${
                  section.glow === "pink"
                    ? "text-[var(--ppe-secondary)]"
                    : section.glow === "yellow"
                      ? "text-[var(--ppe-primary-fixed)]"
                      : "text-[var(--ppe-tertiary-fixed-dim)]"
                }`}
              />
              <h3 className="ppe-headline-md uppercase text-[var(--ppe-primary)]">{section.title}</h3>
            </div>
            <p className="ppe-body-md text-[var(--ppe-on-surface-variant)]">{section.description}</p>
            <div className="mt-8 border-b-2 border-dotted border-[var(--ppe-arcade-blue)] opacity-30 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </section>

      <section className="relative overflow-hidden bg-[var(--ppe-surface-container-highest)] py-24">
        <div className="absolute left-0 top-1/2 h-0 w-full -translate-y-1/2 border-t-2 border-dotted border-[var(--ppe-on-tertiary-container)] opacity-20" />
        <PpeContainer className="relative z-10">
          <div className="mb-16 flex flex-col items-end justify-between gap-[var(--ppe-gutter)] md:flex-row">
            <div className="max-w-xl">
              <h2 className="ppe-headline-lg mb-4 uppercase text-[var(--ppe-secondary)]">
                {valuesSection.title}
              </h2>
              <p className="ppe-body-md text-[var(--ppe-on-surface-variant)]">{valuesSection.intro}</p>
            </div>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--ppe-secondary)_20%,transparent)] ppe-glow-pink">
                <PpeIcon name="joystick" className="text-[var(--ppe-secondary)]" />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--ppe-primary-fixed)_20%,transparent)] ppe-glow-yellow">
                <PpeIcon name="energy_savings_leaf" className="text-[var(--ppe-primary-fixed)]" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-[var(--ppe-gutter)] md:grid-cols-3 lg:grid-cols-6">
            {valuesSection.values.map((value) => (
              <div key={value.label} className="group text-center">
                <div
                  className={`mb-4 flex aspect-square w-full items-center justify-center rounded-xl ppe-maze-border transition-colors duration-300 ${hoverBgClass[value.hoverColor] ?? ""}`}
                >
                  <PpeIcon
                    name={value.icon}
                    className={`text-4xl ${valueIconClass[value.hoverColor] ?? valueIconClass["primary-fixed"]}`}
                  />
                </div>
                <h4 className="ppe-label-caps text-[var(--ppe-on-surface)]">{value.label}</h4>
              </div>
            ))}
          </div>
        </PpeContainer>
      </section>

      <section className="px-[var(--ppe-margin-mobile)] py-24 text-center md:px-[var(--ppe-margin-desktop)]">
        <div className="rounded-2xl bg-[var(--ppe-surface-container)] p-12 ppe-maze-border ppe-glow-blue">
          <h2 className="ppe-headline-lg mb-6 uppercase text-[var(--ppe-primary)]">{cta.title}</h2>
          <p className="ppe-body-lg mx-auto mb-10 max-w-2xl text-[var(--ppe-on-surface-variant)]">{cta.body}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <PpeCtaLink href={cta.primaryHref} className="rounded-full px-10 py-4 text-lg font-bold ppe-glow-yellow">
              {cta.primaryLabel}
            </PpeCtaLink>
            <PpeCtaLink href={cta.secondaryHref} variant="outline" className="rounded-full px-10 py-4 text-lg font-bold">
              {cta.secondaryLabel}
            </PpeCtaLink>
          </div>
        </div>
      </section>
    </main>
  );
}
