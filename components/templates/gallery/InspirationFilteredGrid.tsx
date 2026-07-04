"use client";

import { useMemo } from "react";
import { InspirationPosterCard } from "@/components/templates/gallery/InspirationPosterCard";
import {
  GALLERY_CARD_META,
  GALLERY_FILTERS,
  templateMatchesFilter,
  type GalleryFilterId,
} from "@/lib/templates/galleryConfig";
import { INSPIRATION_ROWS, sortTemplatesForRow } from "@/lib/templates/inspirationsHubConfig";
import { EXPERIENCE_TEMPLATES } from "@/lib/templates/registry";

type InspirationFilteredGridProps = {
  activeFilter: GalleryFilterId;
};

export function InspirationFilteredGrid({ activeFilter }: InspirationFilteredGridProps) {
  const categoryLabel =
    GALLERY_FILTERS.find((filter) => filter.id === activeFilter)?.label ?? "Inspirations";

  const filteredTemplates = useMemo(() => {
    const row = INSPIRATION_ROWS.find((entry) => entry.filterId === activeFilter);
    const templates = EXPERIENCE_TEMPLATES.filter((template) =>
      templateMatchesFilter(template.slug, activeFilter),
    );
    return sortTemplatesForRow(templates, row?.featuredSlugs ?? []);
  }, [activeFilter]);

  if (filteredTemplates.length === 0) return null;

  return (
    <section
      className="scroll-mt-24 px-[var(--spacing-gutter)] pb-[var(--spacing-section-padding)]"
      aria-labelledby="inspiration-filtered-heading"
    >
      <div className="gallery-row-divider mb-8" aria-hidden />
      <div className="mb-6">
        <p className="font-[family-name:var(--font-gallery)] text-[length:var(--text-label-caps)] leading-[var(--text-label-caps--line-height)] font-[number:var(--text-label-caps--font-weight)] tracking-[var(--text-label-caps--letter-spacing)] uppercase text-primary-fixed">
          Category
        </p>
        <h2
          id="inspiration-filtered-heading"
          className="mt-1 font-[family-name:var(--font-gallery)] text-2xl font-bold text-on-surface"
        >
          {categoryLabel}
        </h2>
      </div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTemplates.map((template, index) => (
          <li key={template.slug}>
            <InspirationPosterCard
              template={template}
              meta={GALLERY_CARD_META[template.slug]}
              priority={index < 4}
              layout="grid"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
