"use client";

import { useState } from "react";
import { PawsomeProductCard } from "./PawsomeProductCard";
import { usePsPetMarketProducts } from "./usePsPetMarketProducts";
import { PawsomeShopLoading } from "./PawsomeShopLoading";
import { PsIcon, PsPageWrap } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

const FILTER_CHIPS = ["Brand", "Price", "Dietary", "Age Group"] as const;

const ACTIVE_FILTERS = ["High Protein", "Senior"] as const;

const DIETARY_OPTIONS = ["Grain-Free", "Hypoallergenic", "High Protein"] as const;

const AGE_OPTIONS = ["Puppy", "Adult", "Senior"] as const;

export function PawsomeShopBody() {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([...ACTIVE_FILTERS]);
  const [dietary, setDietary] = useState<Set<string>>(new Set(["Grain-Free"]));
  const [age, setAge] = useState("Senior");
  const [dietaryOpen, setDietaryOpen] = useState(true);
  const [ageOpen, setAgeOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);

  const { products, loading, error, refetch } = usePsPetMarketProducts({
    pageSize: 48,
    filter: { pet_type: "dog" },
  });

  const clearFilters = () => setActiveFilters([]);

  const removeFilter = (f: string) => {
    setActiveFilters((prev) => prev.filter((x) => x !== f));
  };

  const toggleDietary = (opt: string) => {
    setDietary((prev) => {
      const next = new Set(prev);
      if (next.has(opt)) next.delete(opt);
      else next.add(opt);
      return next;
    });
  };

  if (loading) return <PawsomeShopLoading />;

  return (
    <main className="py-8">
      <PsPageWrap>
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--ps-secondary)]">
            Premium Selection
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--ps-primary)] md:text-5xl" style={headline}>
            Dog Supplies
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--ps-on-surface-variant)]">
            Live inventory from our pet market catalog — curated nutrition and essentials for your
            canine companion.
          </p>
        </div>

        {error ? (
          <div className="mb-6 rounded-xl border border-[var(--ps-error)] bg-[var(--ps-error-container)] px-4 py-3 text-sm text-[var(--ps-on-error-container)]">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-2 text-xs font-semibold underline"
            >
              Try again
            </button>
          </div>
        ) : null}

        <div className="sticky top-16 z-40 -mx-[var(--ps-margin-mobile)] mb-8 bg-[color-mix(in_srgb,var(--ps-surface)_95%,transparent)] px-[var(--ps-margin-mobile)] py-4 backdrop-blur-md md:-mx-[var(--ps-margin-desktop)] md:px-[var(--ps-margin-desktop)]">
          <div className="flex items-center gap-3 overflow-x-auto ps-hide-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-[var(--ps-primary)] px-5 py-2.5 text-sm font-semibold tracking-wide text-[var(--ps-on-primary)] shadow-lg transition-all active:scale-[0.98]"
            >
              <PsIcon name="tune" className="text-lg" />
              Filters
            </button>
            <div className="mx-2 h-8 w-px shrink-0 bg-[var(--ps-outline-variant)]" />
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                className="shrink-0 rounded-xl bg-[var(--ps-surface-container-low)] px-5 py-2.5 text-sm font-semibold tracking-wide text-[var(--ps-on-surface)] transition-colors hover:bg-[var(--ps-surface-container-high)]"
              >
                {chip}
              </button>
            ))}
          </div>
          {activeFilters.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 overflow-x-auto ps-hide-scrollbar">
              {activeFilters.map((f) => (
                <span
                  key={f}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--ps-secondary-container)_20%,transparent)] bg-[color-mix(in_srgb,var(--ps-secondary-container)_10%,transparent)] px-3 py-1.5 text-xs font-medium text-[var(--ps-on-secondary-container)]"
                >
                  {f}
                  <button
                    type="button"
                    onClick={() => removeFilter(f)}
                    aria-label={`Remove ${f} filter`}
                  >
                    <PsIcon name="close" className="text-sm" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={clearFilters}
                className="shrink-0 px-2 text-xs font-semibold text-[var(--ps-secondary)] underline underline-offset-4"
              >
                Clear All
              </button>
            </div>
          ) : null}
        </div>

        <div className="mb-20 grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <PawsomeProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && !error ? (
          <p className="py-16 text-center text-sm text-[var(--ps-on-surface-variant)]">
            No products in the catalog yet.
          </p>
        ) : null}
      </PsPageWrap>

      {showFilters ? (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--ps-primary)_20%,transparent)] backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
            aria-label="Close filters"
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-[var(--ps-surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--ps-outline-variant)] p-6">
              <h2 className="text-2xl font-semibold text-[var(--ps-primary)]" style={headline}>
                Filters
              </h2>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--ps-surface-container-high)]"
              >
                <PsIcon name="close" />
              </button>
            </div>
            <div className="flex-1 space-y-8 overflow-y-auto p-6">
              <div>
                <button
                  type="button"
                  onClick={() => setDietaryOpen(!dietaryOpen)}
                  className="mb-4 flex w-full items-center justify-between"
                >
                  <span className="font-semibold text-[var(--ps-primary)]">Dietary Needs</span>
                  <PsIcon
                    name="expand_more"
                    className={`transition-transform ${dietaryOpen ? "" : "-rotate-90"}`}
                  />
                </button>
                {dietaryOpen ? (
                  <div className="space-y-3">
                    {DIETARY_OPTIONS.map((opt) => (
                      <label key={opt} className="flex cursor-pointer items-center gap-3">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                            dietary.has(opt)
                              ? "border-[var(--ps-secondary)] bg-[var(--ps-secondary)]"
                              : "border-[var(--ps-outline-variant)]"
                          }`}
                        >
                          {dietary.has(opt) ? (
                            <span className="h-2.5 w-2.5 rounded-sm bg-white" />
                          ) : null}
                        </span>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={dietary.has(opt)}
                          onChange={() => toggleDietary(opt)}
                        />
                        <span className="text-[var(--ps-on-surface-variant)]">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setAgeOpen(!ageOpen)}
                  className="mb-4 flex w-full items-center justify-between"
                >
                  <span className="font-semibold text-[var(--ps-primary)]">Pet Age</span>
                  <PsIcon
                    name="expand_more"
                    className={`transition-transform ${ageOpen ? "" : "-rotate-90"}`}
                  />
                </button>
                {ageOpen ? (
                  <div className="grid grid-cols-2 gap-3">
                    {AGE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAge(opt)}
                        className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                          age === opt
                            ? "border-[var(--ps-secondary)] bg-[color-mix(in_srgb,var(--ps-secondary)_5%,transparent)] text-[var(--ps-secondary)]"
                            : "border-[var(--ps-outline-variant)] text-[var(--ps-on-surface-variant)] hover:border-[var(--ps-secondary)]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setRatingOpen(!ratingOpen)}
                  className="mb-4 flex w-full items-center justify-between"
                >
                  <span className="font-semibold text-[var(--ps-primary)]">Rating</span>
                  <PsIcon
                    name="expand_more"
                    className={`transition-transform ${ratingOpen ? "" : "-rotate-90"}`}
                  />
                </button>
                {ratingOpen ? (
                  <div className="flex items-center gap-2 text-[var(--ps-secondary)]">
                    {[1, 2, 3, 4].map((i) => (
                      <PsIcon key={i} name="star" filled className="text-xl" />
                    ))}
                    <PsIcon name="star" className="text-xl" />
                    <span className="ml-2 text-sm text-[var(--ps-on-surface-variant)]">& Up</span>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-[var(--ps-outline-variant)] p-6">
              <button
                type="button"
                onClick={() => {
                  setDietary(new Set());
                  setAge("Adult");
                  clearFilters();
                }}
                className="rounded-xl bg-[var(--ps-surface-container-low)] py-3 text-sm font-semibold text-[var(--ps-on-surface)]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="rounded-xl bg-[var(--ps-primary)] py-3 text-sm font-semibold text-[var(--ps-on-primary)]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
