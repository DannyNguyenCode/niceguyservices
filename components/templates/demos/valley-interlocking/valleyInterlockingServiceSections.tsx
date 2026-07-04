"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { viJsonServicePath } from "./valleyInterlockingConfig";
import { VI_ALL_ASPECTS_COVERED, VI_ASPECT_ICONS, VI_CUSTOMER_TESTIMONIALS_SECTION } from "./valleyInterlockingData";
import { ViContainer, ViGoogleReviewBadge, ViIcon, ViImg, ViHeroContentPanel, VI_HERO_CTA_PRIMARY, VI_HERO_CTA_SECONDARY } from "./ValleyInterlockingShared";
import { useViFaqAccordion, useViFaqReveal } from "./useViEffects";

import type { ViServiceBodyCopyContent, ViServiceBenefitsContent, ViServiceCta } from "./valleyInterlockingServiceTypes";

export type { ViServiceBodyCopyContent, ViServiceBenefitsContent, ViServiceCta } from "./valleyInterlockingServiceTypes";

export function ViServiceBodyCopySection({
  content,
  revealClass = "vi-service-body-copy-reveal",
}: {
  content: ViServiceBodyCopyContent;
  revealClass?: string;
}) {
  return (
    <section className="bg-[var(--vi-surface)] py-[var(--vi-stack-lg)]">
      <ViContainer className={`${revealClass} grid grid-cols-1 items-start gap-[var(--vi-gutter)] lg:grid-cols-12`}>
        <div className="lg:col-span-7">
          <blockquote className="vi-body-lg mb-[var(--vi-stack-sm)] border-l-4 border-[var(--vi-secondary)] pl-8 text-[22px] font-light italic leading-[1.6] text-[var(--vi-primary)] md:text-[26px]">
            &ldquo;{content.quote}&rdquo;
          </blockquote>
          <div className="space-y-6">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph} className="vi-body-md leading-relaxed text-[var(--vi-on-surface-variant)]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <aside className="flex flex-col gap-[var(--vi-base)] lg:col-span-5">
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] bg-[var(--vi-surface-container-lowest)] p-8">
            <h2 className="vi-headline-md mb-4 text-[var(--vi-primary)]">{content.sidebar.title}</h2>
            <p className="vi-body-md mb-6 text-[var(--vi-on-surface-variant)]">{content.sidebar.description}</p>
            <Link
              href={viJsonServicePath(content.sidebar.cta.url)}
              className="vi-label-caps block w-full rounded-lg border-2 border-[var(--vi-secondary)] py-4 text-center text-[var(--vi-secondary)] uppercase transition-all duration-300 hover:bg-[var(--vi-secondary)] hover:text-white"
            >
              {content.sidebar.cta.label}
            </Link>
          </div>
        </aside>
      </ViContainer>
    </section>
  );
}

export function ViServiceBenefitsSection({
  heading,
  paragraphs,
  imageSrc,
  imageAlt,
  imagePosition,
  revealClass = "vi-service-benefits-reveal",
}: ViServiceBenefitsContent & { revealClass?: string }) {
  const imageBlock = (
    <div className="w-full lg:w-1/2">
      <div className="relative h-[min(480px,60dvh)] overflow-hidden rounded-xl vi-ambient-shadow">
        <ViImg
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  );

  const contentBlock = (
    <div className="w-full lg:w-1/2">
      <h2 className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{heading}</h2>
      <ViServiceContentParagraphs content={paragraphs} />
    </div>
  );

  return (
    <section className="bg-[var(--vi-surface)] py-[var(--vi-stack-lg)]">
      <ViContainer className={`${revealClass} flex flex-col items-center gap-12 lg:flex-row`}>
        {imagePosition === "left" ? (
          <>
            {imageBlock}
            {contentBlock}
          </>
        ) : (
          <>
            {contentBlock}
            {imageBlock}
          </>
        )}
      </ViContainer>
    </section>
  );
}

export function ViServiceHero({
  imageSrc,
  imageAlt,
  heading,
  description,
  additionalDescriptions,
  ctas,
  revealClass = "vi-service-hero-reveal",
}: {
  imageSrc: string;
  imageAlt: string;
  heading: string;
  description: string;
  additionalDescriptions?: readonly string[];
  ctas?: readonly ViServiceCta[];
  revealClass?: string;
}) {
  const [primary, secondary] = ctas ?? [];
  const introParagraphs = [description, ...(additionalDescriptions ?? [])].filter(
    (paragraph): paragraph is string => Boolean(paragraph?.trim()),
  );

  return (
    <header className="vi-service-hero vi-hero-under-nav vi-hero-under-nav--compact relative isolate overflow-hidden">
      <div className="vi-service-hero__backdrop" aria-hidden="true">
        <div className="vi-service-hero__media">
          <ViImg
            src={imageSrc}
            alt=""
            fill
            className="vi-service-hero__image object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        <div className="vi-hero-tint" aria-hidden="true" />
      </div>
      <div className="vi-service-hero__scroll relative z-10 min-h-0 overflow-y-auto">
        <ViContainer
          className={`vi-service-hero__inner ${revealClass} flex min-h-full w-full items-center`}
        >
          <ViHeroContentPanel>
            <h1 className="vi-service-hero__title vi-display-lg mb-6">{heading}</h1>
            <div className={`space-y-4 ${ctas?.length ? "mb-8" : ""}`}>
              {introParagraphs.map((paragraph, index) => (
                <p key={index} className="vi-service-hero__intro vi-body-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            {primary && secondary ? (
              <div className="flex flex-wrap gap-4">
                <Link href={viJsonServicePath(primary.url)} className={VI_HERO_CTA_PRIMARY}>
                  {primary.label}
                </Link>
                <Link href={viJsonServicePath(secondary.url)} className={VI_HERO_CTA_SECONDARY}>
                  {secondary.label}
                </Link>
              </div>
            ) : null}
          </ViHeroContentPanel>
        </ViContainer>
      </div>
      <span className="vi-sr-only">{imageAlt}</span>
    </header>
  );
}

export function ViServiceHeroIntroContinued({
  paragraphs,
  revealClass = "vi-service-hero-reveal",
}: {
  paragraphs: readonly string[];
  revealClass?: string;
}) {
  if (paragraphs.length === 0) return null;

  return (
    <section className="bg-[var(--vi-surface-container-low)] py-[var(--vi-stack-lg)]">
      <ViContainer className={`${revealClass} max-w-3xl space-y-4`}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="vi-body-md text-[var(--vi-on-surface-variant)]">
            {paragraph}
          </p>
        ))}
      </ViContainer>
    </section>
  );
}

export function ViServiceCtas({ ctas }: { ctas: readonly ViServiceCta[] }) {
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      {ctas.map((cta) => (
        <Link
          key={`${cta.label}-${cta.url}`}
          href={viJsonServicePath(cta.url)}
          className="rounded-lg border-2 border-[var(--vi-primary)] px-6 py-3 vi-label-md uppercase text-[var(--vi-primary)] transition-colors hover:bg-[var(--vi-primary)] hover:text-[var(--vi-on-primary)]"
        >
          {cta.label}
        </Link>
      ))}
    </div>
  );
}

export function ViServiceContentParagraphs({ content }: { content: readonly string[] }) {
  return (
    <div className="space-y-4">
      {content.map((paragraph) => (
        <p key={paragraph} className="vi-body-md text-[var(--vi-on-surface-variant)]">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function ViServiceTextSection({
  heading,
  headingLevel,
  altBg,
  content,
  bullets,
  ctas,
  children,
}: {
  heading: string;
  headingLevel: "h1" | "h2";
  altBg: boolean;
  content?: readonly string[];
  bullets?: readonly string[];
  ctas?: readonly ViServiceCta[];
  children?: ReactNode;
}) {
  const Heading = headingLevel;
  return (
    <section className={`py-[var(--vi-stack-lg)] ${altBg ? "bg-[var(--vi-surface-container-low)]" : "bg-[var(--vi-background)]"}`}>
      <ViContainer>
        <Heading className="vi-headline-lg mb-6 text-[var(--vi-primary)]">{heading}</Heading>
        {content ? <ViServiceContentParagraphs content={content} /> : null}
        {children}
        {bullets ? (
          <ul className="mt-6 list-disc space-y-2 pl-6 vi-body-md text-[var(--vi-on-surface-variant)]">
            {bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        ) : null}
        {ctas ? <ViServiceCtas ctas={ctas} /> : null}
      </ViContainer>
    </section>
  );
}

export function ViCustomerTestimonialsSection({ revealClass }: { revealClass?: string }) {
  const { heading, description, testimonials } = VI_CUSTOMER_TESTIMONIALS_SECTION;

  return (
    <section className="px-[var(--vi-margin-mobile)] py-[var(--vi-stack-lg)] md:px-[var(--vi-margin-desktop)]">
      <ViContainer className={`!px-0 ${revealClass ?? ""}`}>
        <div className="mb-12 text-center">
          <h2 className="vi-headline-lg mb-3 text-[var(--vi-primary)]">{heading}</h2>
          <p className="vi-body-md mx-auto max-w-2xl text-[var(--vi-on-surface-variant)]">{description}</p>
          <div className="mt-6 flex justify-center">
            <ViGoogleReviewBadge light />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <blockquote
              key={testimonial.name}
              className="flex h-full flex-col rounded-xl border border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)] bg-white p-8 vi-ambient-shadow"
            >
              <div className="mb-4 flex" aria-hidden>
                {Array.from({ length: 5 }).map((_, index) => (
                  <ViIcon key={index} name="star" className="text-[var(--vi-secondary)]" fill />
                ))}
              </div>
              <p className="vi-body-md flex-1 leading-relaxed text-[var(--vi-on-surface-variant)]">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer className="mt-6 border-t border-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] pt-6">
                <cite className="not-italic">
                  <span className="vi-label-md block text-[var(--vi-primary)]">{testimonial.name}</span>
                  <span className="vi-label-sm text-[var(--vi-on-surface-variant)]">{testimonial.location}</span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </ViContainer>
    </section>
  );
}

export function ViAllAspectsCoveredSection({ revealClass }: { revealClass?: string }) {
  const { heading, items } = VI_ALL_ASPECTS_COVERED;

  return (
    <section className="bg-[var(--vi-surface-container-low)] py-[var(--vi-stack-lg)]">
      <ViContainer className={revealClass}>
        <h2 className="vi-headline-lg mb-12 text-center text-[var(--vi-primary)]">{heading}</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item} className="flex gap-6 rounded-xl bg-[var(--vi-background)] p-6 shadow-sm">
              <ViIcon name={VI_ASPECT_ICONS[item] ?? "check_circle"} className="shrink-0 text-3xl text-[var(--vi-tertiary)]" />
              <div>
                <h4 className="vi-label-md mb-2 font-bold uppercase text-[var(--vi-primary)]">{item}</h4>
              </div>
            </div>
          ))}
        </div>
      </ViContainer>
    </section>
  );
}

export function ViServiceAspectsList({ heading, items, ctas, altBg }: { heading: string; items: readonly string[]; ctas?: readonly ViServiceCta[]; altBg: boolean }) {
  return (
    <section className={`py-[var(--vi-stack-lg)] ${altBg ? "bg-[var(--vi-surface-container-low)]" : "bg-[var(--vi-background)]"}`}>
      <ViContainer>
        <h2 className="vi-headline-lg mb-8 text-[var(--vi-primary)]">{heading}</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-lg bg-white p-6 vi-ambient-shadow vi-body-md text-[var(--vi-on-surface-variant)]"
            >
              <ViIcon name="check_circle" className="shrink-0 text-[var(--vi-tertiary)]" fill />
              {item}
            </li>
          ))}
        </ul>
        {ctas ? <ViServiceCtas ctas={ctas} /> : null}
      </ViContainer>
    </section>
  );
}

export function ViServiceCtaBanner({ heading }: { heading: string }) {
  return (
    <section className="bg-[var(--vi-primary)] py-[var(--vi-stack-lg)] text-center text-[var(--vi-on-primary)]">
      <ViContainer>
        <Link
          href={viJsonServicePath("/get-a-quote/")}
          className="vi-headline-lg inline-block transition-opacity hover:opacity-90"
        >
          {heading}
        </Link>
      </ViContainer>
    </section>
  );
}

export function ViServiceTitleContentGrid({
  heading,
  items,
  ctas,
  altBg,
}: {
  heading: string;
  items: readonly { title: string; content: string }[];
  ctas?: readonly ViServiceCta[];
  altBg: boolean;
}) {
  return (
    <section className={`py-[var(--vi-stack-lg)] ${altBg ? "bg-[var(--vi-surface-container-low)]" : "bg-[var(--vi-background)]"}`}>
      <ViContainer>
        <h2 className="vi-headline-lg mb-8 text-[var(--vi-primary)]">{heading}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.title} className="rounded-lg bg-white p-6 vi-ambient-shadow">
              <h3 className="vi-headline-md mb-3 text-[var(--vi-primary)]">{item.title}</h3>
              <p className="vi-body-md text-[var(--vi-on-surface-variant)]">{item.content}</p>
            </article>
          ))}
        </div>
        {ctas ? <ViServiceCtas ctas={ctas} /> : null}
      </ViContainer>
    </section>
  );
}

export type ViFaqItem = {
  question: string;
  answer: readonly string[];
  category: string;
};

export type ViFaqAccordionVariant = "default" | "bordered" | "compact";

export function ViFaqAccordion({
  faqs,
  variant = "default",
  defaultOpenIndex = 0,
  columns = 1,
}: {
  faqs: readonly ViFaqItem[];
  variant?: ViFaqAccordionVariant;
  defaultOpenIndex?: number | null;
  columns?: 1 | 2;
}) {
  useViFaqAccordion();
  useViFaqReveal();

  const wrapperClass =
    columns === 2 ? "grid grid-cols-1 gap-3 md:grid-cols-2" : variant === "bordered" ? "space-y-2" : "space-y-3";

  const itemClass =
    variant === "bordered"
      ? "vi-faq-accordion--bordered border-b border-[var(--vi-outline-variant)] py-6"
      : variant === "compact"
        ? "vi-faq-accordion--compact rounded-lg border border-[color-mix(in_srgb,var(--vi-outline-variant)_30%,transparent)] bg-[var(--vi-background)] p-4"
        : "vi-faq-accordion--default rounded-lg border border-[color-mix(in_srgb,var(--vi-outline-variant)_10%,transparent)] bg-[var(--vi-surface-container-low)] p-6";

  const iconName = variant === "compact" ? "add" : "expand_more";
  const iconClass =
    variant === "compact"
      ? "vi-faq-accordion-icon vi-faq-accordion-icon--add shrink-0 text-[var(--vi-primary-fixed-dim)]"
      : "vi-faq-accordion-icon vi-faq-accordion-icon--expand mt-1 shrink-0 text-[var(--vi-primary)]";

  const contentClass =
    variant === "bordered"
      ? "vi-faq-answer-content mt-4 space-y-3"
      : variant === "compact"
        ? "vi-faq-answer-content mt-4 space-y-3 border-t border-[var(--vi-outline-variant)] pt-4"
        : "vi-faq-answer-content mt-6 space-y-4";

  return (
    <div className={wrapperClass} role="region" aria-label="Frequently asked questions">
      {faqs.map((item, index) => (
        <details
          key={item.question}
          className={`vi-faq-accordion vi-faq-item vi-reveal group cursor-pointer ${itemClass}`}
          style={{ ["--vi-faq-delay" as string]: `${index * 70}ms` }}
          open={defaultOpenIndex === index}
        >
          <summary
            className={`flex list-none items-start justify-between gap-4 ${variant === "compact" ? "items-center" : ""}`}
          >
            <span className="vi-headline-md text-[var(--vi-primary)]">{item.question}</span>
            <ViIcon name={iconName} className={iconClass} aria-hidden />
          </summary>
          <div className="vi-faq-answer-shell">
            <div className="vi-faq-answer-inner">
              <div className={contentClass}>
                {item.answer.map((paragraph) => (
                  <p key={paragraph} className="vi-body-md text-[var(--vi-on-surface-variant)]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
