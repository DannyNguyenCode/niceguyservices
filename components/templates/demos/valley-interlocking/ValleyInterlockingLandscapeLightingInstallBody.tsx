"use client";

import Link from "next/link";
import { VI_LANDSCAPE_LIGHTING_INSTALL } from "./valleyInterlockingLandscapeLightingInstallContent";
import { ViArticleRelatedServices } from "./ViArticleRelatedServices";
import { ViLandscapeLightingInstallSidebar } from "./ViLandscapeLightingInstallSidebar";
import { ViContainer, ViIcon, ViImg } from "./ValleyInterlockingShared";
import { useViNavScroll } from "./useViEffects";

const article = VI_LANDSCAPE_LIGHTING_INSTALL;

function PhaseHeading({ number, title, light }: { number: number; title: string; light?: boolean }) {
  return (
    <div className="mb-[var(--vi-stack-md)] flex items-center gap-4">
      <span
        className={`vi-headline-lg flex h-10 w-10 items-center justify-center rounded-full text-[18px] font-bold ${
          light
            ? "bg-[var(--vi-primary-fixed)] text-[var(--vi-on-primary-fixed)]"
            : "bg-[var(--vi-primary)] text-[var(--vi-on-primary)]"
        }`}
      >
        {number}
      </span>
      <h2 className={`vi-headline-lg ${light ? "text-[var(--vi-surface)]" : "text-[var(--vi-on-background)]"}`}>
        {title}
      </h2>
    </div>
  );
}

export function ValleyInterlockingLandscapeLightingInstallBody() {
  useViNavScroll();

  return (
    <main className="overflow-x-hidden pt-[var(--vi-nav-height)]">
      <ViContainer className="py-[var(--vi-stack-lg)]">
        <section className="mx-auto mb-[var(--vi-stack-lg)] max-w-4xl">
          <div className="vi-caption mb-4 inline-flex items-center rounded bg-[color-mix(in_srgb,var(--vi-tertiary)_10%,transparent)] px-3 py-1 font-bold uppercase text-[var(--vi-tertiary)]">
            {article.eyebrow}
          </div>
          <h1 className="vi-display-lg mb-[var(--vi-stack-md)] leading-tight text-[var(--vi-on-background)]">
            {article.title}
          </h1>
          <div className="rounded-xl border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-lowest)] p-[var(--vi-stack-md)] vi-ambient-shadow">
            <p className="vi-body-md leading-relaxed text-[var(--vi-on-surface-variant)]">{article.summary}</p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-[var(--vi-gutter)] xl:grid-cols-12">
          <div className="space-y-[var(--vi-stack-lg)] xl:col-span-8">
            <section id="system-selection" className="scroll-mt-24">
              <PhaseHeading number={1} title="System Selection" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {article.systemTypes.map((system) => (
                  <div
                    key={system.id}
                    className={`group rounded-lg border p-6 transition-colors ${
                      system.featured
                        ? "border-[var(--vi-primary)] bg-[color-mix(in_srgb,var(--vi-primary-container)_5%,transparent)]"
                        : "border-[var(--vi-outline-variant)] bg-white hover:border-[var(--vi-primary)]"
                    }`}
                  >
                    <ViIcon name={system.icon} className="mb-2 text-[var(--vi-primary)]" />
                    <h3 className="vi-label-md mb-2 text-[var(--vi-on-surface)]">{system.title}</h3>
                    <p className="vi-caption text-[var(--vi-on-secondary-container)]">{system.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="relative aspect-video overflow-hidden rounded-xl border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-high)] vi-ambient-shadow">
              <ViImg
                src={article.heroImage}
                alt={article.heroImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 66vw"
                priority
              />
            </div>

            <section id="solar-installation" className="scroll-mt-24">
              <PhaseHeading number={2} title="Solar Installation" />
              <div className="space-y-4">
                {article.solarSteps.map((step) => (
                  <div
                    key={step.number}
                    className="flex gap-4 rounded-xl border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-lowest)] p-5"
                  >
                    <span className="vi-headline-lg text-[24px] text-[color-mix(in_srgb,var(--vi-primary)_40%,transparent)]">
                      {step.number}
                    </span>
                    <div>
                      <strong className="vi-label-md mb-1 block uppercase text-[var(--vi-on-surface)]">
                        {step.title}
                      </strong>
                      <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              id="low-voltage"
              className="vi-ink-zone scroll-mt-24 rounded-2xl bg-[var(--vi-inverse-surface)] p-8 text-[var(--vi-surface)]"
            >
              <PhaseHeading number={3} title="Low Voltage Setup" light />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {article.lowVoltageCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-xl border border-[color-mix(in_srgb,var(--vi-surface)_10%,transparent)] bg-[color-mix(in_srgb,var(--vi-surface-container-highest)_10%,transparent)] p-5 transition-colors hover:bg-[color-mix(in_srgb,var(--vi-surface-container-highest)_20%,transparent)]"
                  >
                    <h4 className="vi-label-md mb-2 uppercase text-[var(--vi-primary-fixed)]">{card.title}</h4>
                    <p className="vi-body-md text-[var(--vi-surface-variant)] opacity-90">{card.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="line-voltage" className="scroll-mt-24">
              <PhaseHeading number={4} title={article.lineVoltage.title} />
              <div className="rounded-r-xl border border-[var(--vi-outline-variant)] border-l-4 border-l-[var(--vi-error)] bg-[color-mix(in_srgb,var(--vi-error-container)_10%,transparent)] p-8">
                <div className="mb-6 flex items-start gap-4">
                  <ViIcon name="warning" className="text-[32px] text-[var(--vi-error)]" />
                  <div>
                    <h3 className="vi-label-md mb-1 uppercase text-[var(--vi-error)]">
                      {article.lineVoltage.safetyTitle}
                    </h3>
                    <p className="vi-body-md font-medium text-[var(--vi-on-surface)]">
                      {article.lineVoltage.safetyBody}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 border-t border-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] pt-4 md:grid-cols-2">
                  {article.lineVoltage.requirements.map((req) => (
                    <div key={req.label} className="flex items-center gap-3">
                      <ViIcon name={req.icon} className="text-[var(--vi-secondary)]" />
                      <span className="vi-body-md font-medium text-[var(--vi-on-surface)]">{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="lg:hidden">
              <ViArticleRelatedServices services={article.relatedServices} />
            </div>

            <div className="border-l-8 border-[var(--vi-primary)] bg-[var(--vi-primary-container)] p-[var(--vi-stack-md)] text-[var(--vi-on-primary-container)]">
              <h2 className="vi-display-lg mb-4">{article.closing.title}</h2>
              <div className="flex flex-col items-center gap-8 md:flex-row">
                <div className="flex-1">
                  {article.closing.content.map((paragraph) => (
                    <p key={paragraph} className="vi-body-md mb-4 leading-relaxed last:mb-6">
                      {paragraph}
                    </p>
                  ))}
                  <Link
                    href={article.closing.ctaHref}
                    className="vi-label-md inline-flex bg-[var(--vi-on-tertiary-container)] px-8 py-4 uppercase tracking-widest text-[var(--vi-primary)] transition-colors hover:bg-[var(--vi-surface)]"
                  >
                    {article.closing.ctaLabel}
                  </Link>
                </div>
                <div className="flex aspect-square w-full items-center justify-center border border-[color-mix(in_srgb,var(--vi-surface)_20%,transparent)] bg-[color-mix(in_srgb,var(--vi-surface)_10%,transparent)] md:w-1/3">
                  <ViIcon name="lightbulb" className="text-8xl opacity-40" fill />
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4">
            <ViLandscapeLightingInstallSidebar />
          </div>
        </div>
      </ViContainer>
    </main>
  );
}
