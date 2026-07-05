"use client";

import Link from "next/link";
import { VI_HOW_TO_LAY_INTERLOCKING } from "./valleyInterlockingHowToLayInterlockingContent";
import { ViArticleRelatedServices } from "./ViArticleRelatedServices";
import { ViContainer, ViIcon, ViImg } from "./ValleyInterlockingShared";
import { useViNavScroll } from "./useViEffects";

const article = VI_HOW_TO_LAY_INTERLOCKING;
const [stepOne, stepTwo, stepThree, stepFour] = article.steps;

export function ValleyInterlockingHowToLayInterlockingBody() {
  useViNavScroll();

  return (
    <main className="overflow-x-hidden pt-[var(--vi-nav-height)]">
      <ViContainer className="py-[var(--vi-stack-lg)]">
        <section className="mb-[var(--vi-stack-lg)] border-b-2 border-[var(--vi-outline-variant)] pb-[var(--vi-stack-md)]">
          <div className="flex flex-col items-end justify-between gap-[var(--vi-stack-md)] md:flex-row">
            <div className="max-w-3xl">
              <h1 className="vi-display-lg mb-[var(--vi-stack-sm)] text-[var(--vi-on-surface)]">{article.title}</h1>
              <p className="vi-body-md max-w-2xl text-[var(--vi-secondary)]">{article.summary}</p>
            </div>
            <div className="flex gap-4">
              <div className="flex min-w-[120px] flex-col items-center border border-[var(--vi-outline-variant)] p-4 text-center">
                <span className="vi-label-md text-[var(--vi-secondary)]">Difficulty</span>
                <span className="vi-headline-lg text-[var(--vi-primary)]">{article.difficulty}</span>
              </div>
              <div className="flex min-w-[120px] flex-col items-center border border-[var(--vi-outline-variant)] p-4 text-center">
                <span className="vi-label-md text-[var(--vi-secondary)]">Duration</span>
                <span className="vi-headline-lg text-[var(--vi-primary)]">{article.duration}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-12 lg:col-span-8">
            <div className="grid grid-cols-1 gap-8 border-l-4 border-[var(--vi-primary)] py-4 pl-8 md:grid-cols-12">
              <div className="flex flex-col gap-4 md:col-span-4">
                <div className="flex items-baseline gap-2">
                  <span className="vi-step-number vi-display-lg text-[var(--vi-outline-variant)] opacity-50">
                    {stepOne.number}
                  </span>
                  <h2 className="vi-headline-lg text-[var(--vi-on-surface)]">{stepOne.title}</h2>
                </div>
                <p className="vi-body-md text-[var(--vi-secondary)]">{stepOne.content}</p>
                <div className="border-2 border-dashed border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container)] p-4">
                  <span className="vi-label-md mb-1 block text-[var(--vi-primary)]">PRO TIP:</span>
                  <p className="vi-caption">{stepOne.proTip}</p>
                </div>
              </div>
              <div className="md:col-span-8">
                <div className="group relative aspect-video overflow-hidden">
                  <ViImg
                    src={stepOne.image}
                    alt={stepOne.imageAlt}
                    fill
                    className="object-cover grayscale-[20%] transition-all duration-500 group-hover:grayscale-0"
                    sizes="(max-width: 768px) 100vw, 66vw"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 border-[16px] border-[color-mix(in_srgb,var(--vi-surface)_10%,transparent)]" />
                </div>
              </div>
            </div>

            <div className="relative grid grid-cols-1 gap-8 border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-low)] p-8 md:grid-cols-12">
              <div className="absolute -left-4 -top-4 flex h-12 w-12 items-center justify-center bg-[var(--vi-primary)] font-bold text-[var(--vi-on-primary)] vi-headline-lg">
                {stepTwo.number}
              </div>
              <div className="order-2 md:order-1 md:col-span-8">
                <div className="relative aspect-video overflow-hidden">
                  <ViImg
                    src={stepTwo.image}
                    alt={stepTwo.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                  {stepTwo.badge ? (
                    <div className="vi-caption absolute right-4 top-4 bg-[color-mix(in_srgb,var(--vi-inverse-surface)_80%,transparent)] px-3 py-1 uppercase tracking-widest text-[var(--vi-inverse-on-surface)] backdrop-blur-sm">
                      {stepTwo.badge}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="order-1 flex flex-col justify-center md:order-2 md:col-span-4">
                <h2 className="vi-headline-lg mb-4 text-[var(--vi-on-surface)]">{stepTwo.title}</h2>
                <p className="vi-body-md mb-6 text-[var(--vi-secondary)]">{stepTwo.content}</p>
                <ul className="space-y-2">
                  {stepTwo.bullets?.map((bullet: any) => (
                    <li key={bullet} className="vi-caption flex items-start gap-2">
                      <ViIcon name="check_circle" className="text-sm text-[var(--vi-primary)]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <section>
              <div className="group relative aspect-[21/9] overflow-hidden border-2 border-[var(--vi-primary-container)]">
                <ViImg
                  src={article.layeringImage}
                  alt={article.layeringImageAlt}
                  fill
                  className="object-cover grayscale-[30%] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  sizes="100vw"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[color-mix(in_srgb,var(--vi-on-secondary-fixed)_80%,transparent)] to-transparent p-[var(--vi-stack-md)]">
                  <h3 className="vi-headline-lg mb-2 text-[var(--vi-surface)]">{article.layeringTitle}</h3>
                  <p className="vi-body-md max-w-xl text-[var(--vi-tertiary-fixed)]">{article.layeringCaption}</p>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {[stepThree, stepFour].map((step: any) => (
                <article
                  key={step.number}
                  className="flex flex-col gap-4 border border-[var(--vi-outline-variant)] p-6 transition-colors hover:border-[var(--vi-primary)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="vi-headline-lg text-[var(--vi-primary)] opacity-30">{step.number}</span>
                    {"icon" in step && step.icon ? (
                      <ViIcon name={step.icon} className="text-[var(--vi-secondary)]" />
                    ) : null}
                  </div>
                  <h3 className="vi-headline-lg">{step.title}</h3>
                  <p className="vi-body-md text-[var(--vi-secondary)]">{step.content}</p>
                  <div className="h-40 overflow-hidden">
                    <ViImg
                      src={step.image}
                      alt={step.imageAlt}
                      width={600}
                      height={320}
                      className="h-full w-full object-cover"
                      sizes="300px"
                    />
                  </div>
                </article>
              ))}
            </div>

            <div className="lg:hidden">
              <ViArticleRelatedServices services={article.relatedServices} />
            </div>

            <div className="border-l-8 border-[var(--vi-primary)] bg-[var(--vi-primary-container)] p-[var(--vi-stack-md)] text-[var(--vi-on-primary-container)]">
              <h2 className="vi-display-lg mb-4">{article.beddingSand.title}</h2>
              <div className="flex flex-col items-center gap-8 md:flex-row">
                <div className="flex-1">
                  {article.beddingSand.content.map((paragraph: any) => (
                    <p key={paragraph} className="vi-body-md mb-4 leading-relaxed last:mb-6">
                      {paragraph}
                    </p>
                  ))}
                  <Link
                    href={article.beddingSand.ctaHref}
                    className="vi-label-md inline-flex bg-[var(--vi-on-tertiary-container)] px-8 py-4 uppercase tracking-widest text-[var(--vi-primary)] transition-colors hover:bg-[var(--vi-surface)]"
                  >
                    {article.beddingSand.ctaLabel}
                  </Link>
                </div>
                <div className="flex aspect-square w-full items-center justify-center border border-[color-mix(in_srgb,var(--vi-surface)_20%,transparent)] bg-[color-mix(in_srgb,var(--vi-surface)_10%,transparent)] md:w-1/3">
                  <ViIcon name="grain" className="text-8xl opacity-40" fill />
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-8 lg:col-span-4">
            <div className="border-2 border-[var(--vi-on-secondary-fixed)] bg-[var(--vi-surface-bright)] p-6">
              <h4 className="vi-headline-lg mb-6 flex items-center gap-2 text-[var(--vi-on-surface)]">
                <ViIcon name="architecture" className="text-[var(--vi-primary)]" />
                Tech Specs
              </h4>
              <div className="space-y-4">
                {article.techSpecs.map((spec: any) => (
                  <div key={spec.label} className="vi-blueprint-dashed flex justify-between pb-2">
                    <span className="vi-caption font-bold uppercase text-[var(--vi-secondary)]">{spec.label}</span>
                    <span className="vi-label-md text-[var(--vi-on-surface)]">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <ViArticleRelatedServices services={article.relatedServices} />
            </div>

            <div className="relative flex aspect-square flex-col items-center justify-center overflow-hidden border border-[var(--vi-outline-variant)] p-8 text-center">
              <div className="absolute inset-0 z-0 bg-[color-mix(in_srgb,var(--vi-surface-variant)_50%,transparent)]" />
              <div className="relative z-10">
                <ViIcon name="construction" className="mb-4 text-5xl text-[var(--vi-primary)]" />
                <h4 className="vi-headline-lg mb-4">Too complex for DIY?</h4>
                <p className="vi-body-md mb-6 text-[var(--vi-secondary)]">
                  Our teams can handle the engineering, excavation, and artistic finish for you.
                </p>
                <Link
                  href={article.beddingSand.ctaHref}
                  className="vi-label-md block w-full bg-[var(--vi-primary)] py-4 uppercase tracking-widest text-[var(--vi-on-primary)] transition-all hover:shadow-xl"
                >
                  Hire the Experts
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </ViContainer>
    </main>
  );
}
