"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { RestorationSpace } from "./homeRestorationData";
import { HR_SECTIONS, hrSectionHref } from "./homeRestorationConfig";
import { HrButton, HrIcon, HrSectionLabel, hrDisplay } from "./HomeRestorationShared";

type HomeRestorationSpaceModalProps = {
  space: RestorationSpace | null;
  onClose: () => void;
};

export function HomeRestorationSpaceModal({ space, onClose }: HomeRestorationSpaceModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!space) return;
    previousFocus.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previousFocus.current?.focus();
    };
  }, [space, onClose]);

  if (!space) return null;

  const sections = [
    { title: "Common Issues", items: space.commonIssues },
    { title: "Restoration Focus", items: space.restorationFocus },
    { title: "Services Included", items: space.servicesIncluded },
    { title: "Results Delivered", items: space.resultsDelivered },
  ];

  return (
    <div
      className="hr-modal-backdrop fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hr-space-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close restoration details"
        onClick={onClose}
        tabIndex={-1}
      />

      <div className="hr-modal-panel relative z-10 max-h-[94dvh] w-full max-w-4xl overflow-y-auto rounded-t-2xl sm:rounded-2xl">
        <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]">
          <Image
            src={space.image}
            alt={space.imageAlt}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-[var(--hr-charcoal)]/60 via-transparent to-transparent" />
          <button
            ref={closeRef}
            type="button"
            className="hr-focus-ring absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm"
            aria-label="Close"
            onClick={onClose}
          >
            <HrIcon name="close" className="text-xl" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <HrSectionLabel>{space.title}</HrSectionLabel>
            <h2
              id="hr-space-modal-title"
              className="hr-display text-2xl text-white sm:text-3xl"
              style={hrDisplay}
            >
              Restoration Feature
            </h2>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="hr-display mb-4 text-lg text-[var(--hr-charcoal)]" style={hrDisplay}>
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--hr-charcoal-muted)]"
                  >
                    <HrIcon name="check_circle" className="hr-check-icon mt-0.5 shrink-0 text-base" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--hr-line)] p-6 sm:p-8">
          <p className="hr-label mb-4 text-[var(--hr-gold)]">Before &amp; After</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={space.beforeImage}
                alt={`${space.title} before restoration`}
                fill
                sizes="(max-width: 640px) 100vw, 400px"
                className="object-cover"
              />
              <span className="hr-label absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-white backdrop-blur-sm">
                Before
              </span>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={space.afterImage}
                alt={`${space.title} after restoration`}
                fill
                sizes="(max-width: 640px) 100vw, 400px"
                className="object-cover"
              />
              <span className="hr-label absolute left-3 top-3 rounded-full bg-[var(--hr-gold)]/90 px-3 py-1 text-white">
                After
              </span>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <HrButton href={hrSectionHref(HR_SECTIONS.contact)} className="sm:min-w-[240px]">
              Book Consultation
            </HrButton>
          </div>
        </div>
      </div>
    </div>
  );
}
