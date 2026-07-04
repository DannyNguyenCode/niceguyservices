"use client";

import { useMemo } from "react";
import {
  GALLERY_FILTERS,
  galleryFilterEmptyMessage,
  templateMatchesFilter,
  type GalleryFilterId,
} from "@/lib/templates/galleryConfig";
import { EXPERIENCE_TEMPLATES } from "@/lib/templates/registry";

type InspirationCategoryFiltersProps = {
  activeFilter: GalleryFilterId;
  onFilterChange: (filter: GalleryFilterId) => void;
};

export function InspirationCategoryFilters({
  activeFilter,
  onFilterChange,
}: InspirationCategoryFiltersProps) {
  const visibleFilters = useMemo(() => {
    return GALLERY_FILTERS.filter((chip) => {
      if (chip.id === "all") return true;
      return EXPERIENCE_TEMPLATES.some((t) => templateMatchesFilter(t.slug, chip.id));
    });
  }, []);

  return (
    <section
      className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-gutter)] pb-8"
      aria-label="Filter inspirations by category"
    >
      <div className="scrollbar-hide flex snap-x gap-3 overflow-x-auto pb-1">
        {visibleFilters.map((chip) => {
          const isActive = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onFilterChange(chip.id)}
              className={`shrink-0 snap-start rounded-full border border-white/5 px-6 py-2.5 font-[family-name:var(--font-gallery)] text-[length:var(--text-body-md)] leading-[var(--text-body-md--line-height)] text-on-surface transition-all hover:border-primary-fixed/50 md:px-8 md:py-3 ${
                isActive ? "filter-chip--active border-primary-fixed/50" : "bg-[#1A1A1A]"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
      {activeFilter !== "all" &&
      !EXPERIENCE_TEMPLATES.some((t) => templateMatchesFilter(t.slug, activeFilter)) ? (
        <p className="mt-6 font-[family-name:var(--font-gallery)] text-on-surface-variant">
          {galleryFilterEmptyMessage(activeFilter)}
        </p>
      ) : null}
    </section>
  );
}
