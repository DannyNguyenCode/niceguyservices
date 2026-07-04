"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { InspirationCategoryFilters } from "@/components/templates/gallery/InspirationCategoryFilters";
import { InspirationFilteredGrid } from "@/components/templates/gallery/InspirationFilteredGrid";
import { InspirationPosterCard } from "@/components/templates/gallery/InspirationPosterCard";
import { InspirationRow } from "@/components/templates/gallery/InspirationRow";
import { InspirationsBackToTopFab } from "@/components/templates/gallery/InspirationsBackToTopFab";
import {
  GALLERY_CARD_META,
  templateMatchesFilter,
  type GalleryFilterId,
} from "@/lib/templates/galleryConfig";
import {
  INSPIRATION_ROWS,
  sortTemplatesForRow,
  type InspirationRowId,
} from "@/lib/templates/inspirationsHubConfig";
import { EXPERIENCE_TEMPLATES } from "@/lib/templates/registry";

export function TemplateGallery() {
  const [activeFilter, setActiveFilter] = useState<GalleryFilterId>("all");
  const [expandedRow, setExpandedRow] = useState<InspirationRowId | null>(null);
  const expandedRefs = useRef<Partial<Record<InspirationRowId, HTMLElement | null>>>({});
  const contentRef = useRef<HTMLDivElement | null>(null);

  const isBrowseAll = activeFilter === "all";

  const handleFilterChange = useCallback((filter: GalleryFilterId) => {
    setActiveFilter(filter);
    setExpandedRow(null);
    requestAnimationFrame(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const handleViewAll = useCallback((rowId: InspirationRowId) => {
    setExpandedRow(rowId);
    requestAnimationFrame(() => {
      expandedRefs.current[rowId]?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const hasFilteredResults = useMemo(
    () =>
      isBrowseAll ||
      EXPERIENCE_TEMPLATES.some((template) => templateMatchesFilter(template.slug, activeFilter)),
    [activeFilter, isBrowseAll],
  );

  return (
    <div className="gallery-root min-h-dvh overflow-x-hidden pb-16">
      <main>
        <section className="relative overflow-hidden px-[var(--spacing-gutter)] pt-16 pb-6 md:pt-20">
          <div className="glow-node -left-20 top-0" aria-hidden />
          <div className="relative z-10 mx-auto max-w-[var(--spacing-container-max)]">
            <h1 className="font-[family-name:var(--font-gallery)] text-[length:var(--text-headline-xl-mobile)] leading-[var(--text-headline-xl-mobile--line-height)] font-[number:var(--text-headline-xl-mobile--font-weight)] tracking-[var(--text-headline-xl-mobile--letter-spacing)] text-on-surface uppercase md:text-[length:var(--text-headline-xl)] md:leading-[var(--text-headline-xl--line-height)] md:tracking-[var(--text-headline-xl--letter-spacing)] md:font-[number:var(--text-headline-xl--font-weight)]">
              Website{" "}
              <span className="bg-linear-to-r from-primary-fixed to-secondary-container bg-clip-text text-transparent">
                Inspirations
              </span>
            </h1>
            <p className="mt-4 max-w-2xl font-[family-name:var(--font-gallery)] text-[length:var(--text-body-lg)] leading-[var(--text-body-lg--line-height)] font-[number:var(--text-body-lg--font-weight)] text-on-surface-variant">
              Explore professionally designed website concepts organized by website type. Every concept is
              fully customizable and serves as a starting point—not a one-size-fits-all template.
            </p>
            <div className="gallery-row-divider mt-8" aria-hidden />
          </div>
        </section>

        <InspirationCategoryFilters activeFilter={activeFilter} onFilterChange={handleFilterChange} />

        <div ref={contentRef} className="scroll-mt-24">
          {isBrowseAll ? (
            <>
              {hasFilteredResults
                ? INSPIRATION_ROWS.map((row) => (
                    <InspirationRow
                      key={row.id}
                      row={row}
                      templates={EXPERIENCE_TEMPLATES}
                      onViewAll={handleViewAll}
                    />
                  ))
                : null}

              {INSPIRATION_ROWS.map((row) => {
                const rowTemplates = sortTemplatesForRow(
                  EXPERIENCE_TEMPLATES.filter((template) =>
                    templateMatchesFilter(template.slug, row.filterId),
                  ),
                  row.featuredSlugs,
                );

                if (rowTemplates.length === 0) return null;

                const isExpanded = expandedRow === row.id;

                return (
                  <section
                    key={`expanded-${row.id}`}
                    id={`inspiration-category-${row.id}`}
                    ref={(node) => {
                      expandedRefs.current[row.id] = node;
                    }}
                    className={`scroll-mt-24 px-[var(--spacing-gutter)] transition-all duration-500 ${
                      isExpanded
                        ? "py-10 opacity-100"
                        : "pointer-events-none max-h-0 overflow-hidden py-0 opacity-0"
                    }`}
                    aria-hidden={!isExpanded}
                  >
                    <div className="gallery-row-divider mb-8" aria-hidden />
                    <div className="mb-6 flex items-end justify-between gap-4">
                      <div>
                        <p className="font-[family-name:var(--font-gallery)] text-[length:var(--text-label-caps)] leading-[var(--text-label-caps--line-height)] font-[number:var(--text-label-caps--font-weight)] tracking-[var(--text-label-caps--letter-spacing)] uppercase text-primary-fixed">
                          View All
                        </p>
                        <h2 className="mt-1 font-[family-name:var(--font-gallery)] text-2xl font-bold text-on-surface">
                          {row.title}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedRow(null)}
                        className="font-[family-name:var(--font-gallery)] text-sm font-semibold text-on-surface-variant transition-colors hover:text-primary-fixed"
                      >
                        Close
                      </button>
                    </div>
                    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {rowTemplates.map((template, index) => (
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
              })}
            </>
          ) : hasFilteredResults ? (
            <InspirationFilteredGrid activeFilter={activeFilter} />
          ) : null}
        </div>
      </main>
      <InspirationsBackToTopFab />
    </div>
  );
}
