"use client";

import Link from "next/link";
import { ppePath } from "./powerPelletElectricConfig";
import type { PpeServiceDetailPage } from "./powerPelletElectricSiteContent";
import { ppeServiceDetail } from "./powerPelletElectricSiteContent";
import { ppeServiceHeroImage } from "./powerPelletElectricImages";
import { PpeContainer, PpeIcon, PpeImg, PpeScanline } from "./PowerPelletElectricShared";

const FEATURE_ICONS = ["offline_bolt", "shield_spark", "visibility", "warning"] as const;
const FEATURE_COLORS = ["primary-fixed", "secondary", "tertiary-fixed-dim", "error"] as const;
const STEP_BORDERS = ["primary-fixed", "secondary", "tertiary-fixed-dim"] as const;

const featureColorClass: Record<string, { icon: string; title: string }> = {
  "primary-fixed": {
    icon: "text-[var(--ppe-primary-fixed)] group-hover:drop-shadow-[0_0_10px_#e9ea00]",
    title: "text-[var(--ppe-primary-fixed)]",
  },
  secondary: {
    icon: "text-[var(--ppe-secondary)] group-hover:drop-shadow-[0_0_10px_#ffaaf7]",
    title: "text-[var(--ppe-secondary)]",
  },
  "tertiary-fixed-dim": {
    icon: "text-[var(--ppe-tertiary-fixed-dim)] group-hover:drop-shadow-[0_0_10px_#6bd2ff]",
    title: "text-[var(--ppe-tertiary-fixed-dim)]",
  },
  error: {
    icon: "text-[var(--ppe-error)] group-hover:drop-shadow-[0_0_10px_#ffb4ab]",
    title: "text-[var(--ppe-error)]",
  },
};

const stepBorderClass: Record<string, string> = {
  "primary-fixed": "border-[var(--ppe-primary-fixed)] text-[var(--ppe-primary-fixed)]",
  secondary: "border-[var(--ppe-secondary)] text-[var(--ppe-secondary)]",
  "tertiary-fixed-dim": "border-[var(--ppe-tertiary-fixed-dim)] text-[var(--ppe-tertiary-fixed-dim)]",
};

function ServiceDetailContent({ detail }: { detail: PpeServiceDetailPage }) {
  const isEmergency = detail.slug === "emergency-electrical-support";

  return (
    <>
      <PpeScanline />
      <main id="ppe-main-content" className="ppe-main px-[var(--ppe-margin-mobile)] pb-24 pt-24 md:px-[var(--ppe-margin-desktop)] lg:pb-12">
        <PpeContainer>
          <section className="mb-16">
            <div className="mb-8 flex flex-col items-end justify-between gap-4 md:flex-row">
              <div>
                <span
                  className={`mb-2 inline-block border px-3 py-1 ppe-label-caps text-[10px] uppercase ${
                    isEmergency
                      ? "border-[var(--ppe-error)] bg-[var(--ppe-error-container)] text-[var(--ppe-on-error-container)]"
                      : "border-[var(--ppe-secondary)] bg-[var(--ppe-secondary-container)] text-[var(--ppe-on-secondary-container)]"
                  }`}
                >
                  {detail.levelLabel}
                </span>
                <h1 className="ppe-display uppercase leading-tight text-[var(--ppe-primary-fixed)]">
                  {detail.title} |{" "}
                  <span className={isEmergency ? "text-[var(--ppe-error)]" : "text-[var(--ppe-secondary)]"}>
                    {detail.powerLabel}
                  </span>
                </h1>
              </div>
              <div className="ppe-label-caps flex items-center gap-2 text-[var(--ppe-on-tertiary-container)]">
                <PpeIcon name="bolt" className="text-[var(--ppe-primary-fixed)]" />
                Status: {detail.status}
              </div>
            </div>
            <div className="group relative aspect-[21/9] w-full overflow-hidden ppe-maze-border">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--ppe-surface)] to-transparent opacity-60" />
              <PpeImg
                src={ppeServiceHeroImage(detail.slug)}
                alt={detail.heroImageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="100vw"
                priority
              />
              <div className="absolute bottom-8 left-8 z-20 max-w-2xl">
                <p className="ppe-headline-md border-l-4 border-[var(--ppe-primary-fixed)] bg-[color-mix(in_srgb,var(--ppe-surface)_80%,transparent)] p-4 text-[var(--ppe-tertiary-fixed-dim)] backdrop-blur-md">
                  {detail.heroCaption}
                </p>
              </div>
            </div>
          </section>

          <section className="mb-20 grid grid-cols-1 gap-[var(--ppe-gutter)] lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-4">
              <h2 className="ppe-headline-lg border-b-2 border-dotted border-[var(--ppe-on-tertiary-container)] pb-4 uppercase text-[var(--ppe-secondary)]">
                {detail.missionTitle}
              </h2>
              <p className="ppe-body-lg leading-relaxed text-[var(--ppe-on-surface-variant)]">{detail.mission}</p>
              <div className="relative border-[color-mix(in_srgb,var(--ppe-secondary)_30%,transparent)] bg-[var(--ppe-surface-container-low)] p-6 ppe-maze-border">
                <div className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center bg-[var(--ppe-secondary)]">
                  <PpeIcon name="star" className="text-sm text-[var(--ppe-on-secondary)]" fill />
                </div>
                <p className="ppe-label-caps mb-2 text-xs uppercase text-[var(--ppe-secondary)]">Technical Spec</p>
                <p className="ppe-body-md text-[var(--ppe-on-surface)]">{detail.technicalSpec.join(" / ")}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-8">
              {detail.featureCards.map((feature, index) => {
                const color = FEATURE_COLORS[index % FEATURE_COLORS.length];
                const colors = featureColorClass[color];
                return (
                  <div
                    key={feature.title}
                    className="group bg-[var(--ppe-surface-container)] p-8 ppe-maze-border transition-colors hover:bg-[var(--ppe-surface-container-high)]"
                  >
                    <PpeIcon name={FEATURE_ICONS[index % FEATURE_ICONS.length]} className={`mb-6 text-4xl ${colors.icon}`} />
                    <h3 className={`ppe-headline-md mb-4 uppercase ${colors.title}`}>{feature.title}</h3>
                    <p className="ppe-body-md text-[var(--ppe-on-surface-variant)]">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mb-24 flex flex-col items-stretch justify-center gap-6 md:flex-row">
            <Link
              href={ppePath(detail.primaryCTA.href)}
              className="ppe-interactive group relative flex flex-1 items-center justify-center gap-4 overflow-hidden bg-[var(--ppe-primary-container)] px-12 py-8 uppercase ppe-headline-md font-bold text-[var(--ppe-on-primary-container)] ppe-neon-glow-yellow"
            >
              <span className="relative z-10">{detail.primaryCTA.label}</span>
              <PpeIcon name="arrow_forward" className="relative z-10 transition-transform group-hover:translate-x-2" />
              <div className="absolute inset-0 translate-x-[-100%] bg-white/10 transition-transform duration-500 group-hover:translate-x-[100%]" />
            </Link>
            <Link
              href={ppePath(detail.secondaryCTA.href)}
              className="ppe-interactive group relative flex flex-1 items-center justify-center gap-4 border-2 border-[var(--ppe-error)] px-12 py-8 uppercase ppe-headline-md font-bold text-[var(--ppe-error)] transition-all ppe-neon-glow-red hover:bg-[color-mix(in_srgb,var(--ppe-error-container)_20%,transparent)]"
            >
              <PpeIcon name="emergency" className="ppe-animate-pulse-glow" />
              <span>{detail.secondaryCTA.label}</span>
            </Link>
          </section>

          <section className="relative overflow-hidden">
            <div className="absolute inset-0 -z-10 opacity-20 ppe-pellet-path-bg" />
            <h2 className="ppe-headline-lg mb-12 text-center uppercase text-[var(--ppe-primary-fixed)]">
              Execution Sequence
            </h2>
            <div className="relative grid grid-cols-1 gap-0 md:grid-cols-3">
              <div className="absolute left-0 top-1/2 hidden h-[2px] w-full -translate-y-1/2 bg-[var(--ppe-on-tertiary-container)] md:block" />
              {detail.executionSequence.map((step, index) => {
                const borderKey = STEP_BORDERS[index % STEP_BORDERS.length];
                return (
                  <div
                    key={step.step}
                    className="group relative z-10 flex flex-col items-center bg-[var(--ppe-surface)] p-8 text-center"
                  >
                    <div
                      className={`mb-6 flex h-16 w-16 items-center justify-center bg-[var(--ppe-surface-container)] ppe-maze-border ppe-label-caps text-2xl transition-transform group-hover:scale-110 ${stepBorderClass[borderKey]}`}
                    >
                      {step.step}
                    </div>
                    <h4 className={`ppe-headline-md mb-2 uppercase ${stepBorderClass[borderKey]?.split(" ").pop() ?? ""}`}>
                      {step.title}
                    </h4>
                    <p className="ppe-body-md text-[var(--ppe-on-surface-variant)]">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </PpeContainer>
      </main>
    </>
  );
}

export function PowerPelletElectricServiceDetailBody({ slug }: { slug: string }) {
  const detail = ppeServiceDetail(slug);
  if (!detail) return null;
  return <ServiceDetailContent detail={detail} />;
}
