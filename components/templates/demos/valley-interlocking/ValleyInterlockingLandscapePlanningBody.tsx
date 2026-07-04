"use client";

import Link from "next/link";
import { VI_PATHS } from "./valleyInterlockingConfig";
import { VI_LANDSCAPE_PLANNING } from "./valleyInterlockingLandscapePlanningContent";
import { ViArticleRelatedServices } from "./ViArticleRelatedServices";
import { ViLandscapePlanningSidebar } from "./ViLandscapePlanningSidebar";
import { ViContainer, ViIcon, ViImg } from "./ValleyInterlockingShared";
import { useViNavScroll } from "./useViEffects";

const article = VI_LANDSCAPE_PLANNING;

function phaseBadgeClass(tone: "primary" | "secondary" | "tertiary" | "ink") {
  switch (tone) {
    case "secondary":
      return "bg-[var(--vi-secondary)] text-[var(--vi-on-secondary)]";
    case "tertiary":
      return "bg-[var(--vi-tertiary)] text-[var(--vi-on-tertiary)]";
    case "ink":
      return "bg-[var(--vi-primary-fixed)] text-[var(--vi-on-primary-fixed)]";
    default:
      return "bg-[var(--vi-primary)] text-[var(--vi-on-primary)]";
  }
}

function phaseLabelClass(tone: "primary" | "secondary" | "tertiary" | "ink") {
  switch (tone) {
    case "secondary":
      return "text-[var(--vi-secondary)]";
    case "tertiary":
      return "text-[var(--vi-tertiary)]";
    case "ink":
      return "text-[var(--vi-primary-fixed-dim)]";
    default:
      return "text-[var(--vi-primary)]";
  }
}

export function ValleyInterlockingLandscapePlanningBody() {
  useViNavScroll();

  const [design, logistics, specialties, winter, maintenance] = article.sections;

  return (
    <main className="overflow-x-hidden pt-[var(--vi-nav-height)]">
      <ViContainer className="py-[var(--vi-stack-lg)]">
        <div className="mb-[var(--vi-stack-lg)]">
          <nav className="vi-caption mb-4 flex items-center gap-2 text-[var(--vi-outline)]" aria-label="Breadcrumb">
            <Link href={VI_PATHS.resources} className="hover:text-[var(--vi-primary)]">
              Knowledge Base
            </Link>
            <ViIcon name="chevron_right" className="text-[14px]" />
            <span className="font-bold text-[var(--vi-primary)]">{article.breadcrumb}</span>
          </nav>
          <h1 className="vi-display-lg mb-4 text-[var(--vi-on-surface)]">{article.title}</h1>
          <p className="vi-body-md max-w-2xl text-[var(--vi-on-surface-variant)]">{article.summary}</p>
        </div>

        <div className="flex flex-col gap-[var(--vi-stack-lg)] lg:flex-row">
          <div className="min-w-0 flex-1 space-y-[var(--vi-stack-lg)]">
            <section
              id={design.id}
              className="vi-blueprint-grid rounded-lg border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-lowest)] p-8"
            >
              <div className="mb-6 flex items-start gap-4">
                <span className={`rounded-lg p-3 font-bold ${phaseBadgeClass(design.tone)}`}>{design.number}</span>
                <div>
                  <h2 className="vi-headline-lg mb-2">{design.title}</h2>
                  <p className={`vi-caption font-bold uppercase tracking-wider ${phaseLabelClass(design.tone)}`}>
                    {design.phase}
                  </p>
                </div>
              </div>
              <div className="vi-body-md space-y-4 leading-relaxed text-[var(--vi-on-surface-variant)]">
                <p>{design.intro}</p>
                {design.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {design.cards.map((card) => (
                    <div key={card.title} className="rounded border border-[var(--vi-outline-variant)] bg-white p-4">
                      <h4 className="vi-label-md mb-2 flex items-center gap-2 text-[var(--vi-on-surface)]">
                        <ViIcon name={card.icon} className="text-[var(--vi-primary)]" />
                        {card.title}
                      </h4>
                      <p className="text-sm text-[var(--vi-on-surface-variant)]">{card.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section
              id={logistics.id}
              className="rounded-lg border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-lowest)] p-8"
            >
              <div className="mb-6 flex items-start gap-4">
                <span className={`rounded-lg p-3 font-bold ${phaseBadgeClass(logistics.tone)}`}>{logistics.number}</span>
                <div>
                  <h2 className="vi-headline-lg mb-2">{logistics.title}</h2>
                  <p className={`vi-caption font-bold uppercase tracking-wider ${phaseLabelClass(logistics.tone)}`}>
                    {logistics.phase}
                  </p>
                </div>
              </div>
              <p className="vi-body-md mb-4 text-[var(--vi-on-surface-variant)]">{logistics.intro}</p>
              <ul className="space-y-3">
                {logistics.timelineItems.map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <ViIcon name="check_circle" className="shrink-0 text-[var(--vi-primary)]" fill />
                    <span className="vi-body-md text-[var(--vi-on-surface-variant)]">
                      <strong className="text-[var(--vi-on-surface)]">{item.label}:</strong> {item.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="grid gap-[var(--vi-stack-md)] md:grid-cols-2">
              <div className="relative h-64 overflow-hidden rounded-lg border border-[var(--vi-outline-variant)]">
                <ViImg src={article.heroImage} alt={article.heroImageAlt} fill className="object-cover" sizes="50vw" />
              </div>
              <div className="relative h-64 overflow-hidden rounded-lg border border-[var(--vi-outline-variant)]">
                <ViImg src={article.galleryImage} alt={article.galleryImageAlt} fill className="object-cover" sizes="50vw" />
              </div>
            </div>

            <section
              id={specialties.id}
              className="rounded-lg border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-lowest)] p-8"
            >
              <div className="mb-6 flex items-start gap-4">
                <span className={`rounded-lg p-3 font-bold ${phaseBadgeClass(specialties.tone)}`}>
                  {specialties.number}
                </span>
                <div>
                  <h2 className="vi-headline-lg mb-2">{specialties.title}</h2>
                  <p className={`vi-caption font-bold uppercase tracking-wider ${phaseLabelClass(specialties.tone)}`}>
                    {specialties.phase}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {specialties.services.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    className="flex items-center gap-3 rounded border border-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] bg-[var(--vi-surface)] p-3 transition-colors hover:border-[var(--vi-primary)]"
                  >
                    <ViIcon name={service.icon} className="text-[var(--vi-primary)]" />
                    <span className="vi-label-md">{service.label}</span>
                  </Link>
                ))}
              </div>
              <p className="vi-body-md mt-6 text-[var(--vi-on-surface-variant)]">{specialties.closing}</p>
            </section>

            <section id={winter.id} className="vi-ink-zone relative overflow-hidden rounded-lg p-8">
              <div className="relative z-10">
                <div className="mb-6 flex items-start gap-4">
                  <span className={`rounded-lg p-3 font-bold ${phaseBadgeClass(winter.tone)}`}>{winter.number}</span>
                  <div>
                    <h2 className="vi-headline-lg mb-2">{winter.title}</h2>
                    <p className={`vi-caption font-bold uppercase tracking-wider ${phaseLabelClass(winter.tone)}`}>
                      {winter.phase}
                    </p>
                  </div>
                </div>
                <p className="vi-body-md mb-4">{winter.intro}</p>
                <p className="vi-body-md mb-4">{winter.body}</p>
                <div className="flex flex-wrap gap-4 text-sm font-bold text-[var(--vi-primary-fixed)]">
                  {winter.highlights.map((item) => (
                    <span key={item.label} className="flex items-center gap-1">
                      <ViIcon name={item.icon} className="text-[18px]" />
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
              <ViIcon
                name="ac_unit"
                className="pointer-events-none absolute -right-[10%] -top-[20%] text-[300px] opacity-10"
                aria-hidden
              />
            </section>

            <section
              id={maintenance.id}
              className="rounded-lg border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-lowest)] p-8"
            >
              <div className="mb-6 flex items-start gap-4">
                <span className={`rounded-lg p-3 font-bold ${phaseBadgeClass(maintenance.tone)}`}>
                  {maintenance.number}
                </span>
                <div>
                  <h2 className="vi-headline-lg mb-2">{maintenance.title}</h2>
                  <p className={`vi-caption font-bold uppercase tracking-wider ${phaseLabelClass(maintenance.tone)}`}>
                    {maintenance.phase}
                  </p>
                </div>
              </div>
              <p className="vi-body-md mb-4 leading-relaxed text-[var(--vi-on-surface-variant)]">{maintenance.intro}</p>
              <p className="vi-body-md mb-6 leading-relaxed text-[var(--vi-on-surface-variant)]">{maintenance.body}</p>
              <div className="rounded-lg border-l-4 border-[var(--vi-primary)] bg-[var(--vi-surface)] p-6">
                <h4 className="vi-label-md mb-4">Our Maintenance Protocols</h4>
                <div className="space-y-4">
                  {maintenance.protocols.map((protocol) => (
                    <div
                      key={protocol.label}
                      className="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--vi-outline-variant)_50%,transparent)] pb-2"
                    >
                      <span className="text-sm text-[var(--vi-on-surface-variant)]">{protocol.label}</span>
                      <span className="vi-service-chip rounded px-2 py-1 text-[10px] font-bold uppercase">
                        {protocol.frequency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="lg:hidden">
            <ViArticleRelatedServices services={article.relatedServices} />
          </div>

          <ViLandscapePlanningSidebar />
        </div>

        <section className="mt-[var(--vi-stack-lg)] rounded-lg bg-[var(--vi-on-secondary-fixed)] p-12 text-center text-[var(--vi-surface-container-lowest)]">
          <h2 className="vi-display-lg mb-4">{article.cta.title}</h2>
          <p className="vi-body-md mx-auto mb-8 max-w-2xl text-[var(--vi-surface-variant)]">{article.cta.description}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={article.cta.primaryHref}
              className="vi-label-md rounded-lg bg-[var(--vi-primary)] px-8 py-4 text-[var(--vi-on-primary)] transition-transform hover:scale-105"
            >
              {article.cta.primaryLabel}
            </Link>
            <Link
              href={article.cta.secondaryHref}
              className="vi-label-md rounded-lg border-2 border-[var(--vi-surface-container-lowest)] px-8 py-4 transition-all hover:bg-white hover:text-[var(--vi-on-secondary-fixed)]"
            >
              {article.cta.secondaryLabel}
            </Link>
          </div>
        </section>
      </ViContainer>
    </main>
  );
}
