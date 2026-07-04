"use client";

import Link from "next/link";
import { VI_PATIO_DESIGN_GUIDE } from "./valleyInterlockingPatioDesignGuideContent";
import { ViArticleRelatedServices } from "./ViArticleRelatedServices";
import { ViPatioDesignGuideSidebar } from "./ViPatioDesignGuideSidebar";
import { ViContainer, ViImg } from "./ValleyInterlockingShared";
import { useViNavScroll } from "./useViEffects";

const article = VI_PATIO_DESIGN_GUIDE;

function ArticleStep({
  step,
}: {
  step: (typeof article.steps)[number];
}) {
  return (
    <article id={step.id} className="group scroll-mt-28">
      <div className="flex items-start gap-6">
        <span className="vi-step-number vi-display-lg leading-none text-[var(--vi-primary-fixed-dim)] opacity-80">
          {step.number}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="vi-headline-lg mb-4 text-[var(--vi-on-surface)]">{step.title}</h2>
          <p className="vi-body-md leading-relaxed text-[var(--vi-on-surface-variant)]">{step.body}</p>
          {"proTip" in step && step.proTip ? (
            <div className="mt-6 border-l-4 border-[var(--vi-secondary)] bg-[var(--vi-surface-container-low)] p-6">
              <p className="vi-body-md italic text-[var(--vi-on-secondary-fixed-variant)]">{step.proTip}</p>
            </div>
          ) : null}
          {"materialCards" in step && step.materialCards ? (
            <div className="mt-6 grid grid-cols-1 gap-4">
              {step.materialCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded border border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)] bg-[var(--vi-surface-container)] p-4"
                >
                  <p className="vi-label-md mb-2 uppercase text-[var(--vi-primary)]">{card.title}</p>
                  <p className="vi-caption text-[var(--vi-on-surface-variant)]">{card.description}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ValleyInterlockingPatioDesignGuideBody() {
  useViNavScroll();

  const figureAfterIndex = 3;

  return (
    <main className="overflow-x-hidden pt-[var(--vi-nav-height)]">
      <section className="relative overflow-hidden py-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="grid grid-cols-1 items-center gap-[var(--vi-gutter)] md:grid-cols-12">
            <div className="z-10 md:col-span-6">
              <span className="vi-caption mb-4 block uppercase tracking-widest text-[var(--vi-secondary)]">
                {article.eyebrow}
              </span>
              <h1 className="vi-display-lg mb-6 leading-tight text-[var(--vi-on-surface)]">{article.title}</h1>
              <p className="vi-body-lg mb-8 max-w-xl text-[var(--vi-on-surface-variant)]">{article.description}</p>
              <div className="flex items-center gap-4 border-t border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)] pt-6">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <ViImg
                    src={article.author.image}
                    alt={article.author.imageAlt}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="vi-label-md text-[var(--vi-on-surface)]">{article.author.name}</p>
                  <p className="vi-caption text-[var(--vi-on-surface-variant)]">{article.author.role}</p>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] md:col-span-6 md:h-[600px]">
              <div className="absolute inset-0 overflow-hidden rounded-lg bg-[var(--vi-surface-container)]">
                <ViImg
                  src={article.heroImage}
                  alt={article.heroImageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </ViContainer>
      </section>

      <section className="pb-[var(--vi-stack-lg)]">
        <ViContainer>
          <div className="grid grid-cols-1 gap-[var(--vi-gutter)] lg:grid-cols-12">
            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
                {article.steps.slice(0, figureAfterIndex).map((step) => (
                  <ArticleStep key={step.id} step={step} />
                ))}

                <figure className="col-span-full my-[var(--vi-stack-md)]">
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)]">
                    <ViImg
                      src={article.figureBreak.image}
                      alt={article.figureBreak.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                  <figcaption className="vi-caption mt-4 text-center text-[var(--vi-on-surface-variant)]">
                    {article.figureBreak.caption}
                  </figcaption>
                </figure>

                {article.steps.slice(figureAfterIndex).map((step) => (
                  <ArticleStep key={step.id} step={step} />
                ))}

                <div className="col-span-full lg:hidden">
                  <ViArticleRelatedServices services={article.relatedServices} />
                </div>

                <div className="col-span-full mt-20 border-t border-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] pt-12 text-center">
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
              </div>
            </div>

            <div className="lg:col-span-3">
              <ViPatioDesignGuideSidebar />
            </div>
          </div>
        </ViContainer>
      </section>
    </main>
  );
}
