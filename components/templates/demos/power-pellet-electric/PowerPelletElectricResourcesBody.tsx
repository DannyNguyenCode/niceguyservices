"use client";

import Link from "next/link";
import { ppePath } from "./powerPelletElectricConfig";
import { PPE_RESOURCES } from "./powerPelletElectricSiteContent";
import { PpeContainer, PpeCtaLink, PpeIcon } from "./PowerPelletElectricShared";

export function PowerPelletElectricResourcesBody() {
  const { pageTitle, heroBadge, intro, articles, resourceCTA } = PPE_RESOURCES;

  return (
    <main id="ppe-main-content" className="ppe-main px-[var(--ppe-margin-mobile)] pb-24 pt-32 md:px-[var(--ppe-margin-desktop)] md:pb-12">
      <PpeContainer className="max-w-screen-xl">
        <div className="relative mb-20 overflow-hidden border-2 border-[var(--ppe-on-tertiary-container)] bg-[var(--ppe-surface-container)] p-8 md:p-12">
          <div className="relative z-10 max-w-3xl">
            <span className="mb-4 inline-block border border-[var(--ppe-tertiary-container)] bg-[var(--ppe-on-tertiary-container)] px-3 py-1 ppe-label-caps text-[10px] text-[var(--ppe-tertiary-container)]">
              {heroBadge}
            </span>
            <h1 className="ppe-display mb-6 uppercase tracking-tight text-[var(--ppe-primary-fixed)]">
              {pageTitle}
            </h1>
            <p className="ppe-body-lg max-w-2xl leading-relaxed text-[var(--ppe-on-surface-variant)]">{intro}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-[var(--ppe-gutter)] md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.href}
              className="group relative flex flex-col border-2 border-[var(--ppe-on-tertiary-container)] bg-[var(--ppe-surface-container-low)] p-6 transition-colors duration-300 hover:border-[var(--ppe-primary-fixed)]"
            >
              <div className="mb-6 flex items-start justify-between">
                <span className="ppe-label-caps uppercase text-[var(--ppe-energy-orange)]">{article.category}</span>
                <PpeIcon name={article.icon} className="text-[var(--ppe-primary-fixed)]" />
              </div>
              <h3 className="ppe-headline-md mb-4 uppercase text-[var(--ppe-on-surface)] transition-colors group-hover:text-[var(--ppe-primary-fixed)]">
                {article.title}
              </h3>
              <p className="ppe-body-md mb-8 flex-grow text-[var(--ppe-on-surface-variant)]">{article.description}</p>
              <div className="mb-6 w-full border-2 border-dotted border-[var(--ppe-on-tertiary-container)]" />
              <Link
                href={ppePath(article.href)}
                className="ppe-interactive flex items-center gap-2 ppe-label-caps text-[var(--ppe-secondary)] transition-all group-hover:gap-4"
              >
                READ LOG <PpeIcon name="arrow_forward" className="text-sm" />
              </Link>
            </article>
          ))}
        </div>

        <section className="relative mt-20 flex flex-col items-center justify-between gap-12 overflow-hidden border-2 border-[var(--ppe-on-tertiary-container)] bg-[var(--ppe-surface-container)] p-12 md:flex-row">
          <div className="pointer-events-none absolute inset-0 bg-[color-mix(in_srgb,var(--ppe-secondary)_5%,transparent)]" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="ppe-headline-lg mb-4 uppercase tracking-tighter text-[var(--ppe-secondary)]">
              {resourceCTA.title}
            </h2>
            <p className="ppe-body-lg text-[var(--ppe-on-surface-variant)]">{resourceCTA.description}</p>
          </div>
          <PpeCtaLink
            href={resourceCTA.href}
            className="relative z-10 shrink-0 rounded-full bg-[var(--ppe-secondary)] px-8 py-4 text-[var(--ppe-on-secondary)] ppe-glow-pink hover:scale-105 active:scale-95"
          >
            {resourceCTA.label}
            <PpeIcon name="call" />
          </PpeCtaLink>
        </section>
      </PpeContainer>
    </main>
  );
}
