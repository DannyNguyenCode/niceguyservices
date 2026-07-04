"use client";

import Link from "next/link";
import { VI_PATHS } from "./valleyInterlockingConfig";
import { VI_BACKYARD_DESIGN_GUIDE } from "./valleyInterlockingBackyardDesignGuideContent";
import { ViArticleRelatedServices } from "./ViArticleRelatedServices";
import { ViBackyardDesignGuideSidebar } from "./ViBackyardDesignGuideSidebar";
import { ViContainer, ViIcon, ViImg } from "./ValleyInterlockingShared";
import { useViNavScroll } from "./useViEffects";

const article = VI_BACKYARD_DESIGN_GUIDE;

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

export function ValleyInterlockingBackyardDesignGuideBody() {
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
            <section id={article.lifestyle.id} className="scroll-mt-28">
              <SectionHeading number={article.lifestyle.number} title={article.lifestyle.title} />
              <p className="vi-body-md leading-relaxed text-[var(--vi-on-surface-variant)]">{article.lifestyle.body}</p>
            </section>

            <div className="grid grid-cols-1 gap-[var(--vi-gutter)] md:grid-cols-2">
              <section
                id={article.lifestyleCard.id}
                className="scroll-mt-28 border border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)] bg-[var(--vi-surface-container-lowest)] p-8"
              >
                <h3 className="vi-headline-sm mb-4 text-[var(--vi-on-surface)]">{article.lifestyleCard.title}</h3>
                <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{article.lifestyleCard.body}</p>
              </section>
              <section
                id={article.investmentCard.id}
                className="scroll-mt-28 border border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)] bg-[var(--vi-surface-container-lowest)] p-8"
              >
                <h3 className="vi-headline-sm mb-4 text-[var(--vi-on-surface)]">{article.investmentCard.title}</h3>
                <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{article.investmentCard.body}</p>
              </section>
            </div>

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

            <section id={article.frontBack.id} className="scroll-mt-28">
              <SectionHeading number={article.frontBack.number} title={article.frontBack.title} />
              <p className="vi-body-md mb-6 leading-relaxed text-[var(--vi-on-surface-variant)]">{article.frontBack.body}</p>
              <ul className="space-y-4">
                {article.frontBack.items.map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <ViIcon name="check_circle" className="mt-1 shrink-0 text-[var(--vi-secondary)]" />
                    <span className="vi-body-md text-[var(--vi-on-surface-variant)]">
                      <strong className="text-[var(--vi-on-surface)]">{item.label}:</strong> {item.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section id={article.entertainment.id} className="scroll-mt-28">
              <SectionHeading number={article.entertainment.number} title={article.entertainment.title} />
              <p className="vi-body-md mb-6 leading-relaxed text-[var(--vi-on-surface-variant)]">
                {article.entertainment.body}
              </p>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {article.entertainment.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <ViIcon name="check" className="mt-1 shrink-0 text-[var(--vi-tertiary)]" />
                    <span className="vi-body-md text-[var(--vi-on-surface-variant)]">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id={article.lowMaintenance.id} className="scroll-mt-28">
              <SectionHeading number={article.lowMaintenance.number} title={article.lowMaintenance.title} />
              <p className="vi-body-md mb-6 leading-relaxed text-[var(--vi-on-surface-variant)]">
                {article.lowMaintenance.body}
              </p>
              <ul className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {article.lowMaintenance.options.map((option) => (
                  <li key={option} className="flex items-start gap-3">
                    <ViIcon name="check" className="mt-1 shrink-0 text-[var(--vi-tertiary)]" />
                    <span className="vi-body-md text-[var(--vi-on-surface-variant)]">{option}</span>
                  </li>
                ))}
              </ul>
              <p className="vi-body-md leading-relaxed text-[var(--vi-on-surface-variant)]">
                {article.lowMaintenance.materialsNote}
              </p>
            </section>

            <section
              id={article.smallBackyards.id}
              className="scroll-mt-28 rounded-lg bg-[var(--vi-primary)] p-10 text-[var(--vi-on-primary)]"
            >
              <SectionHeading number={article.smallBackyards.number} title={article.smallBackyards.title} />
              <p className="vi-body-md mb-6 leading-relaxed opacity-90">{article.smallBackyards.body}</p>
              <h3 className="vi-headline-sm mb-4 text-white">Small Backyard Ideas</h3>
              <ul className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {article.smallBackyards.ideas.map((idea) => (
                  <li key={idea} className="flex items-start gap-3">
                    <ViIcon name="check" className="mt-1 shrink-0 opacity-80" />
                    <span className="vi-body-md opacity-90">{idea}</span>
                  </li>
                ))}
              </ul>
              <h3 className="vi-headline-sm mb-4 text-white">Planning Tips</h3>
              <ul className="mb-8 space-y-3">
                {article.smallBackyards.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <ViIcon name="lightbulb" className="mt-1 shrink-0 opacity-80" />
                    <span className="vi-body-md opacity-90">{tip}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={article.smallBackyards.ctaHref}
                className="vi-label-md inline-flex items-center gap-3 rounded bg-[var(--vi-secondary-fixed)] px-8 py-3 uppercase tracking-widest text-[var(--vi-on-secondary-fixed)] transition-opacity hover:opacity-90"
              >
                {article.smallBackyards.ctaLabel}
              </Link>
            </section>

            <section id={article.professional.id} className="scroll-mt-28">
              <h2 className="vi-headline-md mb-4 text-[var(--vi-on-surface)]">{article.professional.title}</h2>
              <p className="vi-body-md leading-relaxed text-[var(--vi-on-surface-variant)]">{article.professional.body}</p>
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
            <ViBackyardDesignGuideSidebar />
          </div>
        </div>
      </ViContainer>
    </main>
  );
}
