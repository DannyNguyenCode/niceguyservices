"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { cfhPath } from "./comfortflowHvacConfig";
import type { CfhServicePage } from "./comfortflowHvacSiteContent";
import { cfhServicePage } from "./comfortflowHvacSiteContent";
import { CfhHomeComfortMap } from "./CfhHomeComfortMap";
import { CfhSectionHeading } from "./CfhSectionHeading";
import { ServiceHeroIllustration } from "./comfort/ServiceHeroIllustration";
import { cfhThemeForAccent, CFH_SERVICE_THEMES, type CfhMapFocus } from "./cfhServiceTheme";
import { CfhContainer, CfhCtaLink, CfhIcon } from "./ComfortflowHvacShared";

function serviceMapFocus(slug: string): CfhMapFocus {
  if (slug in CFH_SERVICE_THEMES) return slug as CfhMapFocus;
  return "overview";
}

function AccentIcon({
  name,
  accent,
  className = "",
  fill,
}: {
  name: string;
  accent: string;
  className?: string;
  fill?: boolean;
}) {
  return (
    <span
      className={`inline-flex rounded-lg p-1.5 ${className}`}
      style={{ backgroundColor: `color-mix(in srgb, ${accent} 16%, white)` }}
    >
      <CfhIcon name={name} fill={fill} style={{ color: accent }} />
    </span>
  );
}

function ServiceHero({ page }: { page: CfhServicePage }) {
  const { hero } = page;
  const theme = cfhThemeForAccent(page.accent);
  const accent = theme.accent;

  return (
    <section className="mb-12">
      <div className="mb-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          {"icon" in hero && hero.icon ? (
            <AccentIcon name={hero.icon as string} accent={accent} className="mb-4 text-4xl" />
          ) : null}
          <span className="cfh-label-caps mb-2 block" style={{ color: accent }}>
            {hero.eyebrow}
          </span>
          <h1 className="cfh-display mb-4 text-[var(--cfh-primary)]">{hero.headline}</h1>
          <p className="cfh-body-lg mb-6 text-[var(--cfh-on-surface-variant)]">{hero.body}</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <CfhCtaLink href={hero.primaryCTA.href} accentColor={accent}>
              {hero.primaryCTA.label}
            </CfhCtaLink>
            <CfhCtaLink href={hero.secondaryCTA.href} variant="outline" accentColor={accent}>
              {hero.secondaryCTA.label}
            </CfhCtaLink>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl border border-[var(--cfh-outline-variant)]/40 bg-white p-3 shadow-lg sm:p-4">
            <ServiceHeroIllustration slug={page.slug} />
          </div>
        </div>
      </div>
    </section>
  );
}

type LooseSection = Record<string, unknown> & { type: string };

function ServiceSection({
  section,
  accent,
  mapFocus,
}: {
  section: LooseSection;
  accent: string;
  mapFocus: CfhMapFocus;
}) {
  switch (section.type) {
    case "tiers": {
      const data = section as LooseSection & {
        id: string;
        title: string;
        subtitle: string;
        items: {
          tier: string;
          name: string;
          price: string;
          period: string;
          description: string;
          highlight?: boolean;
          features: { text: string; included: boolean }[];
          cta: { label: string; href: string };
        }[];
      };
      return (
        <section id={data.id} className="cfh-section-py border-t border-[var(--cfh-outline-variant)]/40">
          <div className="mb-12 text-center">
            <CfhSectionHeading accent={accent} className="justify-center">
              {data.title}
            </CfhSectionHeading>
            <p className="cfh-body-lg text-[var(--cfh-on-surface-variant)]">{data.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-[var(--cfh-gutter)] md:grid-cols-3">
            {data.items.map((tier) => (
              <div
                key={String(tier.name)}
                className={`cfh-glass-card flex flex-col rounded-2xl p-6 ${tier.highlight ? "ring-2" : ""}`}
                style={tier.highlight ? ({ "--tw-ring-color": accent } as CSSProperties) : undefined}
              >
                <span className="cfh-label-caps mb-1" style={{ color: accent }}>
                  {tier.tier}
                </span>
                <h3 className="cfh-headline-md mb-2 text-[var(--cfh-primary)]">{tier.name}</h3>
                <div className="mb-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold" style={{ color: accent }}>
                    {tier.price}
                  </span>
                  <span className="cfh-body-md text-[var(--cfh-on-surface-variant)]">{tier.period}</span>
                </div>
                <p className="cfh-body-md mb-6 text-[var(--cfh-on-surface-variant)]">{tier.description}</p>
                <ul className="mb-8 flex-grow space-y-2">
                  {tier.features.map((feature: { text: string; included: boolean }) => (
                    <li key={feature.text} className="flex items-center gap-2 cfh-body-md">
                      {feature.included ? (
                        <AccentIcon name="check_circle" accent={accent} className="text-lg" />
                      ) : (
                        <CfhIcon name="cancel" className="text-lg opacity-40" />
                      )}
                      <span className={feature.included ? "" : "text-[var(--cfh-outline)] line-through"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <CfhCtaLink href={tier.cta.href} className="w-full text-center" accentColor={accent}>
                  {tier.cta.label}
                </CfhCtaLink>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "inspection": {
      const data = section as LooseSection & {
        eyebrow: string;
        title: string;
        subtitle: string;
        body: string;
        items: { icon: string; title: string; description: string }[];
      };
      return (
        <section className="cfh-section-py border-t border-[var(--cfh-outline-variant)]/40">
          <div className="mb-12 max-w-2xl">
            <span className="cfh-label-caps mb-2 block" style={{ color: accent }}>
              {data.eyebrow}
            </span>
            <CfhSectionHeading accent={accent}>{data.title}</CfhSectionHeading>
            <p className="cfh-label-caps mb-4 text-[var(--cfh-secondary)]">{data.subtitle}</p>
            <p className="cfh-body-lg text-[var(--cfh-on-surface-variant)]">{data.body}</p>
          </div>
          <div className="grid grid-cols-1 gap-[var(--cfh-gutter)] md:grid-cols-3">
            {data.items.map((item) => (
              <div key={item.title} className="cfh-glass-card rounded-2xl p-6">
                <AccentIcon name={item.icon} accent={accent} className="mb-4 block text-3xl" />
                <h3 className="cfh-headline-md mb-2 text-lg text-[var(--cfh-primary)]">{item.title}</h3>
                <p className="cfh-body-md text-[var(--cfh-on-surface-variant)]">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "benefits": {
      const data = section as LooseSection & {
        id: string;
        icon: string;
        title: string;
        body: string;
        tags: string[];
      };
      return (
        <section id={data.id} className="cfh-section-py border-t border-[var(--cfh-outline-variant)]/40">
          <div className="cfh-glass-card rounded-2xl p-8 md:p-12">
            <AccentIcon name={data.icon} accent={accent} className="mb-4 block text-4xl" />
            <h2 className="cfh-headline-md mb-4 text-[var(--cfh-primary)]">{data.title}</h2>
            <p className="cfh-body-lg mb-6 text-[var(--cfh-on-surface-variant)]">{data.body}</p>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--cfh-on-secondary)]"
                  style={{ backgroundColor: accent }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "diagnostics": {
      const data = section as LooseSection & {
        title: string;
        subtitle?: string;
        items: {
          code?: string;
          icon?: string;
          label?: string;
          title: string;
          description: string;
          link?: { label: string; href: string };
        }[];
      };
      return (
        <section className="cfh-section-py border-t border-[var(--cfh-outline-variant)]/40">
          <div className="mb-12">
            <CfhSectionHeading accent={accent}>{data.title}</CfhSectionHeading>
            {data.subtitle ? (
              <p className="cfh-body-lg text-[var(--cfh-on-surface-variant)]">{data.subtitle}</p>
            ) : null}
          </div>
          <div className="grid grid-cols-1 gap-[var(--cfh-gutter)] md:grid-cols-2">
            {data.items.map((item) => (
              <div key={item.title} className="cfh-glass-card rounded-2xl p-6">
                <div className="mb-3 flex items-center gap-3">
                  {item.code ? (
                    <span className="cfh-label-caps" style={{ color: accent }}>
                      {item.code}
                    </span>
                  ) : null}
                  {item.icon ? <AccentIcon name={item.icon} accent={accent} /> : null}
                  {item.label ? (
                    <span className="cfh-label-caps text-[var(--cfh-outline)]">{item.label}</span>
                  ) : null}
                </div>
                <h3 className="cfh-headline-md mb-2 text-lg text-[var(--cfh-primary)]">{item.title}</h3>
                <p className="cfh-body-md mb-4 text-[var(--cfh-on-surface-variant)]">{item.description}</p>
                {item.link ? (
                  <Link
                    href={cfhPath(item.link.href)}
                    className="cfh-interactive cfh-label-caps inline-flex items-center gap-1"
                    style={{ color: accent }}
                  >
                    {item.link.label} <CfhIcon name="arrow_forward" className="text-sm" />
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "network": {
      const data = section as LooseSection & {
        eyebrow: string;
        title: string;
        body: string;
        features: { icon: string; title: string; description: string }[];
      };
      return (
        <section className="cfh-section-py border-t border-[var(--cfh-outline-variant)]/40">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="cfh-label-caps mb-2 block" style={{ color: accent }}>
                {data.eyebrow}
              </span>
              <CfhSectionHeading accent={accent}>{data.title}</CfhSectionHeading>
              <p className="cfh-body-lg mb-8 text-[var(--cfh-on-surface-variant)]">{data.body}</p>
              <ul className="space-y-4">
                {data.features.map((feature) => (
                  <li key={feature.title} className="flex gap-3">
                    <AccentIcon name={feature.icon} accent={accent} />
                    <div>
                      <p className="font-bold text-[var(--cfh-primary)]">{feature.title}</p>
                      <p className="cfh-body-md text-[var(--cfh-on-surface-variant)]">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <CfhHomeComfortMap
              focus={mapFocus}
              accentColor={accent}
              glow
              showLegend
              className="min-h-[300px] shadow-lg lg:min-h-[380px]"
            />
          </div>
        </section>
      );
    }

    case "modules": {
      const data = section as LooseSection & {
        title: string;
        subtitle: string;
        items: string[];
      };
      return (
        <section className="cfh-section-py border-t border-[var(--cfh-outline-variant)]/40">
          <div className="mb-12 text-center">
            <CfhSectionHeading accent={accent} className="justify-center">
              {data.title}
            </CfhSectionHeading>
            <p className="cfh-body-lg text-[var(--cfh-on-surface-variant)]">{data.subtitle}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {data.items.map((item) => (
              <span
                key={item}
                className="cfh-glass-card rounded-full px-6 py-3 font-semibold text-[var(--cfh-primary)] transition-colors hover:text-white"
                style={{ borderColor: `color-mix(in srgb, ${accent} 30%, transparent)` }}
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      );
    }

    case "gallery": {
      const secondaryFocus: CfhMapFocus =
        mapFocus === "cooling" ? "smart-thermostats" : mapFocus === "heating" ? "air-quality" : mapFocus;
      return (
        <section className="cfh-section-py border-t border-[var(--cfh-outline-variant)]/40">
          <div className="mb-8 text-center">
            <CfhSectionHeading accent={accent} className="justify-center">
              System Diagram Views
            </CfhSectionHeading>
            <p className="cfh-body-md text-[var(--cfh-on-surface-variant)]">
              Zoomed views from the same Home Comfort Network illustration.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-[var(--cfh-gutter)] md:grid-cols-2">
            <CfhHomeComfortMap
              focus={mapFocus}
              accentColor={accent}
              glow
              showLegend
              className="min-h-[240px] shadow-md"
            />
            <CfhHomeComfortMap
              focus={secondaryFocus}
              accentColor={accent}
              glow
              showLegend
              className="min-h-[240px] shadow-md"
            />
          </div>
        </section>
      );
    }

    case "ecosystem": {
      const data = section as LooseSection & {
        id: string;
        title: string;
        subtitle: string;
        items: {
          icon: string;
          title: string;
          description: string;
          specs?: string[];
          cta?: { label: string; href: string };
        }[];
      };
      return (
        <section id={data.id} className="cfh-section-py border-t border-[var(--cfh-outline-variant)]/40">
          <div className="mb-12 text-center">
            <CfhSectionHeading accent={accent} className="justify-center">
              {data.title}
            </CfhSectionHeading>
            <p className="cfh-body-lg text-[var(--cfh-on-surface-variant)]">{data.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-[var(--cfh-gutter)] md:grid-cols-3">
            {data.items.map((item) => (
              <div key={item.title} className="cfh-glass-card rounded-2xl p-6">
                <AccentIcon name={item.icon} accent={accent} className="mb-4 block text-3xl" />
                <h3 className="cfh-headline-md mb-2 text-lg text-[var(--cfh-primary)]">{item.title}</h3>
                <p className="cfh-body-md mb-4 text-[var(--cfh-on-surface-variant)]">{item.description}</p>
                {item.specs ? (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {item.specs.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-md px-2 py-1 text-xs font-bold text-[var(--cfh-on-secondary)]"
                        style={{ backgroundColor: accent }}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                ) : null}
                {item.cta ? (
                  <Link
                    href={cfhPath(item.cta.href)}
                    className="cfh-interactive cfh-label-caps inline-flex items-center gap-1"
                    style={{ color: accent }}
                  >
                    {item.cta.label} <CfhIcon name="arrow_forward" className="text-sm" />
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "process": {
      const data = section as LooseSection & {
        title: string;
        subtitle: string;
        steps: { title: string; description: string }[];
      };
      return (
        <section className="cfh-section-py border-t border-[var(--cfh-outline-variant)]/40">
          <div className="mb-12 text-center">
            <CfhSectionHeading accent={accent} className="justify-center">
              {data.title}
            </CfhSectionHeading>
            <p className="cfh-body-lg text-[var(--cfh-on-surface-variant)]">{data.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {data.steps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full font-bold text-[var(--cfh-on-secondary)]"
                  style={{ backgroundColor: accent }}
                >
                  {index + 1}
                </div>
                <h3 className="cfh-headline-md mb-2 text-lg text-[var(--cfh-primary)]">{step.title}</h3>
                <p className="cfh-body-md text-[var(--cfh-on-surface-variant)]">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "faq":
      return (
        <FaqSection
          section={section as LooseSection & { title: string; items: { question: string; answer: string }[] }}
          accent={accent}
        />
      );

    case "options": {
      const data = section as LooseSection & {
        title: string;
        subtitle: string;
        items: { icon: string; title: string; description: string }[];
      };
      return (
        <section className="cfh-section-py border-t border-[var(--cfh-outline-variant)]/40">
          <div className="mb-12 text-center">
            <CfhSectionHeading accent={accent} className="justify-center">
              {data.title}
            </CfhSectionHeading>
            <p className="cfh-body-lg text-[var(--cfh-on-surface-variant)]">{data.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-[var(--cfh-gutter)] md:grid-cols-3">
            {data.items.map((item) => (
              <div key={item.title} className="cfh-glass-card rounded-2xl p-6 text-center">
                <AccentIcon name={item.icon} accent={accent} className="mb-4 block text-3xl" />
                <h3 className="cfh-headline-md mb-2 text-lg text-[var(--cfh-primary)]">{item.title}</h3>
                <p className="cfh-body-md text-[var(--cfh-on-surface-variant)]">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "pillars": {
      const data = section as LooseSection & {
        id: string;
        title: string;
        subtitle: string;
        items: {
          icon: string;
          category: string;
          title: string;
          description: string;
          features: string[];
        }[];
      };
      return (
        <section id={data.id} className="cfh-section-py border-t border-[var(--cfh-outline-variant)]/40">
          <div className="mb-12 text-center">
            <CfhSectionHeading accent={accent} className="justify-center">
              {data.title}
            </CfhSectionHeading>
            <p className="cfh-body-lg text-[var(--cfh-on-surface-variant)]">{data.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-[var(--cfh-gutter)] md:grid-cols-3">
            {data.items.map((item) => (
              <div key={item.title} className="cfh-glass-card rounded-2xl p-6">
                <span className="cfh-label-caps mb-2 block" style={{ color: accent }}>
                  {item.category}
                </span>
                <AccentIcon name={item.icon} accent={accent} className="mb-4 text-3xl" />
                <h3 className="cfh-headline-md mb-2 text-lg text-[var(--cfh-primary)]">{item.title}</h3>
                <p className="cfh-body-md mb-4 text-[var(--cfh-on-surface-variant)]">{item.description}</p>
                <ul className="space-y-1">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-[var(--cfh-on-surface-variant)]">
                      <AccentIcon name="check" accent={accent} className="text-sm" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "dashboard": {
      const data = section as LooseSection & {
        title: string;
        status: string;
        metrics: { icon?: string; value: string; label: string }[];
      };
      return (
        <section className="cfh-section-py border-t border-[var(--cfh-outline-variant)]/40">
          <div className="cfh-glass-card cfh-technical-pattern rounded-2xl p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="cfh-headline-md text-[var(--cfh-primary)]">{data.title}</h2>
              <span
                className="cfh-label-caps rounded-full px-3 py-1 text-[var(--cfh-on-secondary)]"
                style={{ backgroundColor: accent }}
              >
                {data.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {data.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl bg-[var(--cfh-surface-container-lowest)] p-4 text-center"
                >
                  {metric.icon ? (
                    <AccentIcon name={metric.icon} accent={accent} className="mb-2 block text-2xl" />
                  ) : null}
                  <p className="text-2xl font-bold" style={{ color: accent }}>
                    {metric.value}
                  </p>
                  <p className="cfh-label-caps text-[var(--cfh-on-surface-variant)]">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "cta": {
      const data = section as LooseSection & {
        title: string;
        body: string;
        cta?: { label: string; href: string };
        primaryCTA?: { label: string; href: string };
        secondaryCTA?: { label: string; href: string };
      };
      return (
        <section className="cfh-section-py border-t border-[var(--cfh-outline-variant)]/40">
          <div
            className="rounded-3xl p-8 text-center text-[var(--cfh-on-primary)] md:p-12"
            style={{ backgroundColor: "var(--cfh-primary)" }}
          >
            <h2 className="cfh-headline-md mb-4">{data.title}</h2>
            <p className="cfh-body-lg mx-auto mb-8 max-w-2xl text-[var(--cfh-on-primary)]/80">{data.body}</p>
            {data.primaryCTA ? (
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <CfhCtaLink href={data.primaryCTA.href} variant="secondary">
                  {data.primaryCTA.label}
                </CfhCtaLink>
                {data.secondaryCTA ? (
                  <CfhCtaLink href={data.secondaryCTA.href} variant="outlineOnDark">
                    {data.secondaryCTA.label}
                  </CfhCtaLink>
                ) : null}
              </div>
            ) : data.cta ? (
              <CfhCtaLink href={data.cta.href} variant="secondary">
                {data.cta.label}
              </CfhCtaLink>
            ) : null}
          </div>
        </section>
      );
    }

    default:
      return null;
  }
}

function FaqSection({
  section,
  accent,
}: {
  section: { title: string; items: { question: string; answer: string }[] };
  accent: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="cfh-section-py border-t border-[var(--cfh-outline-variant)]/40">
      <h2 className="cfh-headline-md mb-8 flex items-center justify-center gap-3 text-center text-[var(--cfh-primary)]">
        <span className="h-8 w-1 rounded-full" style={{ backgroundColor: accent }} aria-hidden />
        {section.title}
      </h2>
      <div className="mx-auto max-w-3xl space-y-3">
        {section.items.map((item: { question: string; answer: string }, index: number) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question} className="cfh-glass-card overflow-hidden rounded-xl">
              <button
                type="button"
                className="cfh-interactive flex w-full items-center justify-between gap-4 p-5 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="font-semibold text-[var(--cfh-primary)]">{item.question}</span>
                <AccentIcon name={isOpen ? "expand_less" : "expand_more"} accent={accent} />
              </button>
              {isOpen ? (
                <div className="border-t border-[var(--cfh-outline-variant)]/40 px-5 pb-5 pt-3">
                  <p className="cfh-body-md text-[var(--cfh-on-surface-variant)]">{item.answer}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ServiceDetailContent({ page }: { page: CfhServicePage }) {
  const theme = cfhThemeForAccent(page.accent);
  const accent = theme.accent;
  const mapFocus = serviceMapFocus(page.slug);

  return (
    <>
      <ServiceHero page={page} />
      {page.sections.map((section, index) => (
        <ServiceSection
          key={`${section.type}-${index}`}
          section={section as LooseSection}
          accent={accent}
          mapFocus={mapFocus}
        />
      ))}
    </>
  );
}

export function ComfortflowHvacServiceDetailBody({ slug }: { slug: string }) {
  const page = cfhServicePage(slug);

  if (!page) {
    return (
      <main id="cfh-main-content" className="cfh-main overflow-x-hidden">
        <CfhContainer className="cfh-section-py">
          <h1 className="cfh-display mb-4 text-[var(--cfh-primary)]">Service Not Found</h1>
          <Link
            href={cfhPath("/services/maintenance-plans")}
            className="cfh-interactive cfh-label-caps text-[var(--cfh-secondary)]"
          >
            View all services
          </Link>
        </CfhContainer>
      </main>
    );
  }

  return (
    <main id="cfh-main-content" className="cfh-main overflow-x-hidden">
      <CfhContainer className="cfh-section-py">
        <ServiceDetailContent page={page} />
      </CfhContainer>
    </main>
  );
}
