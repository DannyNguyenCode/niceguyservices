"use client";

import { useSpmShopFilters } from "./useSpmShopFilters";
import { SpmShopFilterPanel } from "./SpmShopFilterPanel";
import { SpmIcon } from "./SaturdayPetMarketShared";

type SaturdayPetMarketShopFiltersProps = {
  className?: string;
  /** Shop grid sidebar (sticky). Set false for search results layout. */
  sticky?: boolean;
};

export function SaturdayPetMarketShopFilters({
  className = "",
  sticky = true,
}: SaturdayPetMarketShopFiltersProps) {
  const {
    filters,
    hasActiveFilters,
    clearFilters,
    togglePetGroup,
    toggleCategory,
    toggleBrand,
    setPriceMax,
    toggleAvailability,
    setRatingMin,
    setSaleOnly,
    setVetRecommended,
    draftFilters,
    setDraftFilters,
  } = useSpmShopFilters();

  const handlers = {
    filters,
    togglePetGroup,
    toggleCategory,
    toggleBrand,
    setPriceMax,
    toggleAvailability,
    setRatingMin,
    setSaleOnly,
    setVetRecommended,
  };

  const layoutClass = sticky
    ? "sticky top-[100px] hidden h-[calc(100vh-140px)] overflow-y-auto pr-2 md:block"
    : "hidden shrink-0 md:block md:w-72";

  return (
    <aside className={`spm-custom-scrollbar ${layoutClass} ${className}`}>
      <div className="spm-filter-sidebar rounded-xl border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] p-4 shadow-md">
        <header className="mb-4 flex items-start justify-between gap-3 border-b border-dashed border-[var(--spm-outline-variant)] pb-3">
          <div>
            <h2 className="spm-headline-md text-[var(--spm-secondary)]">Store Directory</h2>
            <p className="spm-label-sm text-[var(--spm-on-surface-variant)] opacity-80">
              Browse aisles &amp; brands
            </p>
          </div>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="spm-label-sm shrink-0 font-bold text-[var(--spm-primary)] hover:underline"
            >
              Clear
            </button>
          ) : null}
        </header>

        <SpmShopFilterPanel
          mode="live"
          handlers={handlers}
          draftFilters={draftFilters}
          setDraftFilters={setDraftFilters}
        />
      </div>
    </aside>
  );
}

export function SaturdayPetMarketShopMobileFilterButton() {
  const { openMobileDrawer, hasActiveFilters } = useSpmShopFilters();

  return (
    <button
      type="button"
      onClick={openMobileDrawer}
      className="spm-label-sm inline-flex items-center gap-2 rounded-full border-2 border-[var(--spm-primary)] bg-[var(--spm-surface-container-lowest)] px-4 py-2 font-bold text-[var(--spm-primary)] shadow-sm md:hidden"
    >
      <SpmIcon name="tune" />
      Filter Products
      {hasActiveFilters ? (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--spm-secondary)] px-1 text-[10px] text-[var(--spm-on-secondary)]">
          •
        </span>
      ) : null}
    </button>
  );
}

export function SaturdayPetMarketShopMobileFilterDrawer() {
  const {
    mobileOpen,
    closeMobileDrawer,
    applyDraftFilters,
    clearDraftFilters,
    draftFilters,
    setDraftFilters,
    filters,
    togglePetGroup,
    toggleCategory,
    toggleBrand,
    setPriceMax,
    toggleAvailability,
    setRatingMin,
    setSaleOnly,
    setVetRecommended,
    draftHasChanges,
  } = useSpmShopFilters();

  if (!mobileOpen) return null;

  const handlers = {
    filters,
    togglePetGroup,
    toggleCategory,
    toggleBrand,
    setPriceMax,
    toggleAvailability,
    setRatingMin,
    setSaleOnly,
    setVetRecommended,
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        className="spm-mini-cart-overlay absolute inset-0"
        onClick={closeMobileDrawer}
        aria-label="Close filters"
      />
      <div className="absolute inset-0 flex flex-col bg-[var(--spm-background)]">
        <header className="flex items-center justify-between border-b border-[var(--spm-outline-variant)] px-4 py-4">
          <div>
            <h2 className="spm-headline-md text-[var(--spm-secondary)]">Filter Products</h2>
            <p className="spm-label-sm text-[var(--spm-on-surface-variant)]">Find your aisle</p>
          </div>
          <button
            type="button"
            onClick={closeMobileDrawer}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--spm-surface-container-high)]"
            aria-label="Close"
          >
            <SpmIcon name="close" />
          </button>
        </header>

        <div className="spm-custom-scrollbar flex-1 overflow-y-auto px-4 py-4">
          <SpmShopFilterPanel
            mode="draft"
            handlers={handlers}
            draftFilters={draftFilters}
            setDraftFilters={setDraftFilters}
          />
        </div>

        <footer className="grid grid-cols-2 gap-3 border-t border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] p-4">
          <button
            type="button"
            onClick={clearDraftFilters}
            className="spm-label-sm rounded-full border-2 border-[var(--spm-outline-variant)] py-3 font-bold text-[var(--spm-on-surface-variant)]"
          >
            Clear Filters
          </button>
          <button
            type="button"
            onClick={applyDraftFilters}
            className={`spm-label-sm rounded-full py-3 font-bold text-[var(--spm-on-primary)] ${
              draftHasChanges
                ? "bg-[var(--spm-primary)]"
                : "bg-[var(--spm-primary-container)] text-[var(--spm-on-primary-container)]"
            }`}
          >
            Apply Filters
          </button>
        </footer>
      </div>
    </div>
  );
}

export function SaturdayPetMarketShopActiveFilters() {
  const { hasActiveFilters, activeChips, clearFilters } = useSpmShopFilters();

  if (!hasActiveFilters) return null;

  return (
    <div className="spm-active-filter-bar sticky top-[72px] z-20 -mx-[var(--spm-margin)] mb-6 border-y border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)]/95 px-[var(--spm-margin)] py-3 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="spm-label-sm mr-1 uppercase tracking-wider text-[var(--spm-on-surface-variant)]">
          Active:
        </span>
        {activeChips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={chip.onRemove}
            className="spm-filter-chip spm-label-sm inline-flex items-center gap-1"
          >
            {chip.label}
            <SpmIcon name="close" className="text-sm" />
          </button>
        ))}
        <button
          type="button"
          onClick={clearFilters}
          className="spm-label-sm ml-auto font-bold text-[var(--spm-primary)] hover:underline"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
