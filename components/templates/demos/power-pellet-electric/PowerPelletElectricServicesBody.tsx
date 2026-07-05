"use client";

import Link from "next/link";
import { ppePath } from "./powerPelletElectricConfig";
import { PPE_SERVICES } from "./powerPelletElectricSiteContent";
import { PPE_IMG } from "./powerPelletElectricImages";
import { PpeContainer, PpeIcon, PpeImg } from "./PowerPelletElectricShared";

export function PowerPelletElectricServicesBody() {
  const { pageTitle, statusBadge, intro, items, bento } = PPE_SERVICES;

  return (
    <main id="ppe-main-content" className="ppe-main relative px-[var(--ppe-margin-mobile)] pb-20 pt-32 md:px-[var(--ppe-margin-desktop)] lg:pb-12">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-20">
        <div className="h-full w-full ppe-pellet-path-bg" />
      </div>

      <PpeContainer className="relative z-10">
        <div className="mb-20 text-center md:text-left">
          <div className="mb-6 inline-block border-2 border-[var(--ppe-tertiary-fixed-dim)] px-4 py-1">
            <span className="ppe-label-caps text-[var(--ppe-tertiary-fixed-dim)]">{statusBadge}</span>
          </div>
          <h1 className="ppe-display mb-6 uppercase tracking-tighter text-[var(--ppe-primary-fixed)]">
            {pageTitle}
          </h1>
          <p className="ppe-body-lg max-w-3xl text-[var(--ppe-on-surface-variant)]">{intro}</p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 hidden h-full w-1 -translate-x-1/2 border-4 border-dotted border-[var(--ppe-tertiary-fixed-dim)] opacity-30 md:block" />
          <div className="relative grid grid-cols-1 gap-[var(--ppe-gutter)] md:grid-cols-2">
            {items.map((service, index) => (
              <div key={service.title} className={`group relative ${index % 2 === 1 ? "md:mt-24" : ""}`}>
                <div
                  className={`flex h-full flex-col rounded-lg border-2 p-8 transition-colors duration-500 ${
                    service.emergency
                      ? "border-[var(--ppe-error-container)] ppe-neon-glow-pink hover:border-[var(--ppe-error)]"
                      : "border-[var(--ppe-tertiary-fixed-dim)] bg-[var(--ppe-surface-container)] hover:border-[var(--ppe-primary-fixed)]"
                  }`}
                >
                  <div className="mb-6 flex items-start justify-between">
                    <PpeIcon
                      name={service.icon}
                      className={`text-4xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg] ${
                        service.emergency ? "text-[var(--ppe-error)]" : "text-[var(--ppe-primary-fixed)]"
                      }`}
                      fill={service.emergency}
                    />
                    <span
                      className={`ppe-label-caps border px-3 py-1 text-xs ${
                        service.emergency
                          ? "border-[var(--ppe-error)] bg-[var(--ppe-error-container)] text-white"
                          : "border-[var(--ppe-outline-variant)] bg-[var(--ppe-surface-container-highest)] text-[var(--ppe-on-surface-variant)]"
                      }`}
                    >
                      {service.badge}
                    </span>
                  </div>
                  <h3
                    className={`ppe-headline-md mb-4 uppercase ${
                      service.emergency ? "text-[var(--ppe-error)]" : "text-[var(--ppe-primary-fixed)]"
                    }`}
                  >
                    <Link href={ppePath(service.cta.href)} className="ppe-interactive hover:underline">
                      {service.title}
                    </Link>
                  </h3>
                  <p className="ppe-body-md mb-8 flex-grow text-[var(--ppe-on-surface-variant)]">
                    {service.description}
                  </p>
                  <Link
                    href={ppePath(service.cta.href)}
                    className={`ppe-interactive w-full rounded-full py-3 text-center ppe-label-caps font-bold uppercase tracking-widest transition-all active:scale-95 ${
                      service.emergency
                        ? "border-2 border-[var(--ppe-secondary)] text-[var(--ppe-secondary)] hover:bg-[color-mix(in_srgb,var(--ppe-secondary)_10%,transparent)]"
                        : "bg-[var(--ppe-primary-fixed)] text-[var(--ppe-on-primary)] ppe-neon-glow-yellow hover:opacity-95"
                    }`}
                  >
                    {service.cta.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="my-20 h-1 w-full border-4 border-dotted border-[var(--ppe-tertiary-fixed-dim)] opacity-50" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="relative h-64 overflow-hidden rounded-lg border-2 border-[var(--ppe-tertiary-fixed-dim)] bg-[var(--ppe-surface-container)] p-8 md:col-span-2">
            <PpeImg
              src={PPE_IMG.servicesBento}
              alt="Futuristic electrical laboratory with glowing blue cables and professional technical equipment"
              fill
              className="object-cover opacity-40"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
            <div className="relative z-10">
              <h4 className="ppe-headline-md mb-2 text-[var(--ppe-primary-fixed)]">{bento.title}</h4>
              <p className="max-w-md text-[var(--ppe-on-surface-variant)]">{bento.description}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg bg-[var(--ppe-primary-fixed)] p-8 text-center text-[var(--ppe-on-primary)]">
            <span className="ppe-display leading-none">{bento.stat}</span>
            <span className="ppe-label-caps font-bold">{bento.statLabel}</span>
          </div>
        </div>
      </PpeContainer>
    </main>
  );
}
