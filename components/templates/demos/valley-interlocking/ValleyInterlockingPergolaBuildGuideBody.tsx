"use client";

import Link from "next/link";
import { VI_PATHS } from "./valleyInterlockingConfig";
import { VI_PERGOLA_BUILD_GUIDE } from "./valleyInterlockingPergolaBuildGuideContent";
import { ViArticleRelatedServices } from "./ViArticleRelatedServices";
import { ViPergolaBuildGuideSidebar } from "./ViPergolaBuildGuideSidebar";
import { ViContainer, ViIcon, ViImg } from "./ValleyInterlockingShared";
import { useViNavScroll } from "./useViEffects";

const article = VI_PERGOLA_BUILD_GUIDE;

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-4">
      <span className="vi-display-lg text-4xl text-[color-mix(in_srgb,var(--vi-secondary)_20%,transparent)]">
        {number}
      </span>
      <h2 className="vi-headline-md text-[var(--vi-on-surface)]">{title}</h2>
    </div>
  );
}

export function ValleyInterlockingPergolaBuildGuideBody() {
  useViNavScroll();

  return (
    <main className="overflow-x-hidden pt-[var(--vi-nav-height)]">
      <ViContainer className="py-[var(--vi-stack-md)] lg:py-[var(--vi-stack-lg)]">
        <div className="mb-[var(--vi-stack-md)] grid grid-cols-1 items-end gap-[var(--vi-gutter)] lg:mb-[var(--vi-stack-lg)] lg:grid-cols-12">
          <div className="lg:col-span-7">
            <nav
              className="vi-label-md mb-4 flex items-center gap-2 uppercase tracking-widest text-[var(--vi-secondary)]"
              aria-label="Breadcrumb"
            >
              <Link href={VI_PATHS.resources} className="hover:text-[var(--vi-primary)]">
                {article.categoryLabel}
              </Link>
              <ViIcon name="chevron_right" className="text-[12px]" />
              <span>{article.subcategoryLabel}</span>
            </nav>
            <h1 className="vi-display-lg mb-6 leading-tight text-[var(--vi-on-surface)]">{article.title}</h1>
            <p className="vi-body-lg max-w-2xl text-[var(--vi-on-surface-variant)]">{article.description}</p>
          </div>
          <div className="flex justify-start lg:col-span-5 lg:justify-end">
            <div className="flex flex-col items-start gap-2 lg:items-end lg:text-right">
              <span className="vi-label-md uppercase tracking-widest text-[var(--vi-on-surface-variant)]">Words by</span>
              <span className="vi-headline-sm text-[var(--vi-on-surface)]">{article.author.name}</span>
              <span className="vi-caption text-[var(--vi-secondary)]">{article.author.role}</span>
            </div>
          </div>
        </div>

        <div className="group relative mb-[var(--vi-stack-lg)] h-[min(614px,70dvh)] w-full overflow-hidden">
          <ViImg
            src={article.heroImage}
            alt={article.heroImageAlt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="100vw"
            priority
          />
          <div className="absolute bottom-6 right-6 border border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)] bg-[color-mix(in_srgb,var(--vi-background)_90%,transparent)] p-4 backdrop-blur-sm">
            <p className="vi-caption italic text-[var(--vi-on-surface-variant)]">{article.heroCaption}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-[var(--vi-gutter)] lg:grid-cols-12">
          <article className="space-y-[var(--vi-stack-md)] lg:col-span-8 lg:pr-12">
            <section id={article.location.id} className="scroll-mt-28">
              <SectionHeading number={article.location.number} title={article.location.title} />
              <p className="vi-body-md leading-relaxed text-[var(--vi-on-surface-variant)]">{article.location.body}</p>
            </section>

            <div className="aspect-video w-full overflow-hidden border border-[color-mix(in_srgb,var(--vi-outline-variant)_10%,transparent)]">
              <ViImg
                src={article.figureBreak.image}
                alt={article.figureBreak.alt}
                width={1200}
                height={675}
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>

            <section id={article.attachedVsFreestanding.id} className="scroll-mt-28">
              <h3 className="vi-headline-sm mb-4 text-[var(--vi-on-surface)]">{article.attachedVsFreestanding.title}</h3>
              <p className="vi-body-md leading-relaxed text-[var(--vi-on-surface-variant)]">
                {article.attachedVsFreestanding.body}
              </p>
            </section>

            <div className="grid grid-cols-1 gap-[var(--vi-gutter)] md:grid-cols-2">
              <section
                id={article.sizeCard.id}
                className="scroll-mt-28 border border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)] bg-[var(--vi-surface-container-lowest)] p-8"
              >
                <h3 className="vi-headline-sm mb-4 text-[var(--vi-on-surface)]">{article.sizeCard.title}</h3>
                <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{article.sizeCard.body}</p>
              </section>
              <section
                id={article.visualizationCard.id}
                className="scroll-mt-28 border border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)] bg-[var(--vi-surface-container-lowest)] p-8"
              >
                <h3 className="vi-headline-sm mb-4 text-[var(--vi-on-surface)]">{article.visualizationCard.title}</h3>
                <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{article.visualizationCard.body}</p>
              </section>
            </div>

            <section
              id={article.permits.id}
              className="scroll-mt-28 rounded-lg bg-[var(--vi-primary)] p-10 text-[var(--vi-on-primary)]"
            >
              <SectionHeading number={article.permits.number} title={article.permits.title} />
              <p className="vi-body-md mb-6 leading-relaxed opacity-90">{article.permits.body}</p>
              <Link
                href={article.permits.ctaHref}
                className="vi-label-md inline-flex items-center gap-3 rounded bg-[var(--vi-secondary-fixed)] px-8 py-3 uppercase tracking-widest text-[var(--vi-on-secondary-fixed)] transition-opacity hover:opacity-90"
              >
                {article.permits.ctaLabel}
              </Link>
            </section>

            <section id={article.materials.id} className="scroll-mt-28">
              <SectionHeading number={article.materials.number} title={article.materials.title} />
              <p className="vi-body-md mb-6 leading-relaxed text-[var(--vi-on-surface-variant)]">{article.materials.body}</p>
              <ul className="space-y-4">
                {article.materials.items.map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <ViIcon name="check_circle" className="mt-1 shrink-0 text-[var(--vi-secondary)]" />
                    <span className="vi-body-md text-[var(--vi-on-surface-variant)]">
                      <strong className="text-[var(--vi-on-surface)]">{item.label}:</strong> {item.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section id={article.roofing.id} className="scroll-mt-28">
              <SectionHeading number={article.roofing.number} title={article.roofing.title} />
              <p className="vi-body-md mb-6 leading-relaxed text-[var(--vi-on-surface-variant)]">{article.roofing.body}</p>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {article.roofing.options.map((option) => (
                  <li key={option} className="flex items-start gap-3">
                    <ViIcon name="check" className="mt-1 shrink-0 text-[var(--vi-tertiary)]" />
                    <span className="vi-body-md text-[var(--vi-on-surface-variant)]">{option}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id={article.futurePlanning.id} className="scroll-mt-28">
              <SectionHeading number={article.futurePlanning.number} title={article.futurePlanning.title} />
              <p className="vi-body-md mb-6 leading-relaxed text-[var(--vi-on-surface-variant)]">
                {article.futurePlanning.body}
              </p>
              <div className="rounded-xl bg-[var(--vi-surface-container-low)] p-8">
                <h3 className="vi-headline-sm mb-6 text-[var(--vi-on-surface)]">Planning Checklist</h3>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {article.futurePlanning.planningConsiderations.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <ViIcon name="check" className="shrink-0 text-[var(--vi-tertiary)]" />
                      <span className="vi-body-md text-[var(--vi-on-surface-variant)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <div className="border-t border-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] pt-12 lg:hidden">
              <ViArticleRelatedServices services={article.relatedServices} className="mb-8" />
            </div>

            <div className="border-t border-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] pt-12 text-center">
              <p className="vi-headline-lg mx-auto mb-8 max-w-2xl text-[var(--vi-on-surface)]">{article.conclusion}</p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href={article.closing.primaryHref}
                  className="vi-label-md rounded-lg bg-[var(--vi-primary)] px-8 py-4 uppercase tracking-widest text-[var(--vi-on-primary)] transition-all hover:opacity-90"
                >
                  {article.closing.primaryLabel}
                </Link>
                <Link
                  href={article.closing.secondaryHref}
                  className="vi-label-md rounded-lg border border-[var(--vi-secondary)] px-8 py-4 uppercase tracking-widest text-[var(--vi-secondary)] transition-all hover:bg-[var(--vi-secondary)] hover:text-[var(--vi-on-secondary)]"
                >
                  {article.closing.secondaryLabel}
                </Link>
              </div>
            </div>
          </article>

          <div className="lg:col-span-4">
            <ViPergolaBuildGuideSidebar />
          </div>
        </div>
      </ViContainer>
    </main>
  );
}
