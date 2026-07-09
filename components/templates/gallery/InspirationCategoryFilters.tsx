"use client";

import { useMemo } from "react";
import {
  GALLERY_FILTERS,
  galleryFilterEmptyMessage,
  templateMatchesFilter,
  type GalleryFilterId,
} from "@/lib/templates/galleryConfig";
import {
  pricingLayoutHeadline as headline,
  sitePageContentClass,
} from "@/components/pricing/pricingLayoutConstants";
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
      className={`border-b border-[color:var(--ng-border)] bg-(--pm-surface) pb-8 ${sitePageContentClass}`}
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
              className={[
                `shrink-0 snap-start rounded-full border px-5 py-2.5 text-sm font-bold transition-all md:px-7 md:py-3 ${headline}`,
                isActive
                  ? "border-[color:var(--ng-btn-coral)] bg-[color:var(--ng-btn-coral)]/12 text-[color:var(--ng-heading)]"
                  : "border-[color:var(--ng-border)] bg-white/60 text-[color:var(--ng-body)] backdrop-blur hover:border-[color:var(--ng-accent)]/40 dark:bg-white/5",
              ].join(" ")}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
      {activeFilter !== "all" &&
      !EXPERIENCE_TEMPLATES.some((t) => templateMatchesFilter(t.slug, activeFilter)) ? (
        <p className="mt-6 text-sm text-[color:var(--ng-body)]">
          {galleryFilterEmptyMessage(activeFilter)}
        </p>
      ) : null}
    </section>
  );
}
