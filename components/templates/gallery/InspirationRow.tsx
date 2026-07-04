"use client";

import { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { InspirationPosterCard } from "@/components/templates/gallery/InspirationPosterCard";
import { GALLERY_CARD_META, templateMatchesFilter } from "@/lib/templates/galleryConfig";
import type { InspirationRowConfig } from "@/lib/templates/inspirationsHubConfig";
import { sortTemplatesForRow } from "@/lib/templates/inspirationsHubConfig";
import type { ExperienceTemplate } from "@/lib/templates/registry";

type InspirationRowProps = {
  row: InspirationRowConfig;
  templates: ExperienceTemplate[];
  onViewAll: (rowId: InspirationRowConfig["id"]) => void;
};

export function InspirationRow({ row, templates, onViewAll }: InspirationRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const rowTemplates = sortTemplatesForRow(
    templates.filter((t) => templateMatchesFilter(t.slug, row.filterId)),
    row.featuredSlugs,
  );

  const scrollBy = (direction: "left" | "right") => {
    const node = scrollerRef.current;
    if (!node) return;
    const amount = direction === "left" ? -node.clientWidth * 0.85 : node.clientWidth * 0.85;
    node.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (rowTemplates.length === 0) return null;

  return (
    <section className="gallery-row" aria-labelledby={`inspiration-row-${row.id}`}>
      <div className="gallery-row-divider mx-[var(--spacing-gutter)]" aria-hidden />
      <div className="mb-4 flex items-end justify-between gap-4 px-[var(--spacing-gutter)] pt-8">
        <h2
          id={`inspiration-row-${row.id}`}
          className="font-[family-name:var(--font-gallery)] text-xl font-bold tracking-tight text-on-surface md:text-2xl"
        >
          {row.title}
        </h2>
        <button
          type="button"
          onClick={() => onViewAll(row.id)}
          className="shrink-0 font-[family-name:var(--font-gallery)] text-sm font-semibold text-on-surface-variant transition-colors hover:text-primary-fixed"
        >
          View All →
        </button>
      </div>

      <div className="group/row relative">
        <div
          ref={scrollerRef}
          className="scrollbar-hide relative z-0 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--spacing-gutter)] pb-4"
        >
          {rowTemplates.map((template, index) => (
            <InspirationPosterCard
              key={template.slug}
              template={template}
              meta={GALLERY_CARD_META[template.slug]}
              priority={index === 0}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollBy("left")}
          aria-label={`Scroll ${row.title} left`}
          className="inspiration-row-arrow inspiration-row-arrow--left hidden md:flex"
        >
          <span className="inspiration-row-arrow-icon" aria-hidden>
            <ChevronLeftIcon className="h-7 w-7" />
          </span>
        </button>
        <button
          type="button"
          onClick={() => scrollBy("right")}
          aria-label={`Scroll ${row.title} right`}
          className="inspiration-row-arrow inspiration-row-arrow--right hidden md:flex"
        >
          <span className="inspiration-row-arrow-icon" aria-hidden>
            <ChevronRightIcon className="h-7 w-7" />
          </span>
        </button>
      </div>
    </section>
  );
}
