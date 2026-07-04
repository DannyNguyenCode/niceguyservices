"use client";

import { useMemo, useState } from "react";
import {
  SPM_AVAILABILITY_OPTIONS,
  SPM_PET_GROUPS,
  SPM_PRICE_MAX,
  SPM_PRICE_STEP,
  SPM_SHOP_BRANDS,
  SPM_SHOP_CATEGORIES,
  SPM_STORE_AISLES,
  SPM_TOP_BRANDS,
  type SpmAvailabilityId,
  type SpmPetGroupId,
  type SpmShopFilters,
} from "./spmShopFilters";
import { SpmIcon } from "./SaturdayPetMarketShared";
import type { ReactNode } from "react";

type FilterMode = "live" | "draft";

type SpmShopFilterHandlers = {
  filters: SpmShopFilters;
  togglePetGroup: (id: SpmPetGroupId) => void;
  toggleCategory: (value: string) => void;
  toggleBrand: (brand: string) => void;
  setPriceMax: (value?: number) => void;
  toggleAvailability: (value: SpmAvailabilityId) => void;
  setRatingMin: (value?: 3 | 4) => void;
  setSaleOnly: (value: boolean) => void;
  setVetRecommended: (value: boolean) => void;
};

function isDbCategory(value: string): boolean {
  return SPM_SHOP_CATEGORIES.some((item) => item.toLowerCase() === value.toLowerCase());
}

function useFilterState(
  mode: FilterMode,
  handlers: SpmShopFilterHandlers,
  draftFilters: SpmShopFilters,
  setDraftFilters: (next: SpmShopFilters) => void,
) {
  const filters = mode === "draft" ? draftFilters : handlers.filters;

  const togglePetGroup = (id: SpmPetGroupId) => {
    if (mode === "draft") {
      setDraftFilters({ ...filters, petGroup: filters.petGroup === id ? undefined : id });
      return;
    }
    handlers.togglePetGroup(id);
  };

  const toggleCategory = (value: string) => {
    if (!isDbCategory(value)) return;
    if (mode === "draft") {
      const exists = filters.categories.some((item) => item.toLowerCase() === value.toLowerCase());
      setDraftFilters({
        ...filters,
        categories: exists
          ? filters.categories.filter((item) => item.toLowerCase() !== value.toLowerCase())
          : [...filters.categories, value],
      });
      return;
    }
    handlers.toggleCategory(value);
  };

  const toggleBrand = (brand: string) => {
    if (mode === "draft") {
      const exists = filters.brands.some((item) => item.toLowerCase() === brand.toLowerCase());
      setDraftFilters({
        ...filters,
        brands: exists
          ? filters.brands.filter((item) => item.toLowerCase() !== brand.toLowerCase())
          : [...filters.brands, brand],
      });
      return;
    }
    handlers.toggleBrand(brand);
  };

  const setPriceMax = (priceMax?: number) => {
    if (mode === "draft") {
      setDraftFilters({ ...filters, priceMax });
      return;
    }
    handlers.setPriceMax(priceMax);
  };

  const toggleAvailability = (value: SpmAvailabilityId) => {
    if (mode === "draft") {
      const exists = filters.availability.includes(value);
      setDraftFilters({
        ...filters,
        availability: exists
          ? filters.availability.filter((item) => item !== value)
          : [...filters.availability, value],
      });
      return;
    }
    handlers.toggleAvailability(value);
  };

  const setRatingMin = (ratingMin?: 3 | 4) => {
    if (mode === "draft") {
      setDraftFilters({ ...filters, ratingMin });
      return;
    }
    handlers.setRatingMin(ratingMin);
  };

  const setSaleOnly = (saleOnly: boolean) => {
    if (mode === "draft") {
      setDraftFilters({ ...filters, saleOnly });
      return;
    }
    handlers.setSaleOnly(saleOnly);
  };

  const setVetRecommended = (vetRecommended: boolean) => {
    if (mode === "draft") {
      setDraftFilters({ ...filters, vetRecommended });
      return;
    }
    handlers.setVetRecommended(vetRecommended);
  };

  return {
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
}

function ShopByPetGrid({
  filters,
  togglePetGroup,
}: {
  filters: SpmShopFilters;
  togglePetGroup: (id: SpmPetGroupId) => void;
}) {
  return (
    <section>
      <header className="spm-filter-coupon-header mb-3">
        <SpmIcon name="storefront" className="text-base" />
        <span>Shop By Pet</span>
      </header>
      <div className="grid grid-cols-2 gap-2">
        {SPM_PET_GROUPS.map((group) => {
          const active = filters.petGroup === group.id;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => togglePetGroup(group.id)}
              aria-pressed={active}
              className={`spm-pet-filter-card group ${active ? "spm-pet-filter-card-active" : ""}`}
            >
              <span
                className={`spm-pet-filter-icon ${active ? group.accent : "bg-[var(--spm-surface-container-high)] text-[var(--spm-on-surface-variant)]"}`}
              >
                <SpmIcon name={group.icon} fill={active} className="text-xl" />
              </span>
              <span className="spm-label-sm font-bold leading-tight">{group.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function StoreAislesAccordion({
  filters,
  toggleCategory,
}: {
  filters: SpmShopFilters;
  toggleCategory: (value: string) => void;
}) {
  const [openAisle, setOpenAisle] = useState<string | null>(SPM_STORE_AISLES[0]?.id ?? null);

  return (
    <section>
      <header className="spm-filter-coupon-header mb-3">
        <SpmIcon name="signpost" className="text-base" />
        <span>Store Aisles</span>
      </header>
      <div className="space-y-2">
        {SPM_STORE_AISLES.map((aisle) => {
          const open = openAisle === aisle.id;
          const selectedCount = aisle.subcategories.filter((sub) =>
            filters.categories.some((item) => item.toLowerCase() === sub.value.toLowerCase()),
          ).length;

          return (
            <div key={aisle.id} className="overflow-hidden rounded-lg border border-[var(--spm-outline-variant)]">
              <button
                type="button"
                onClick={() => setOpenAisle(open ? null : aisle.id)}
                className={`spm-aisle-sign ${aisle.signClass} flex w-full items-center justify-between gap-2 px-3 py-2 text-left`}
                aria-expanded={open}
              >
                <span className="spm-label-sm font-bold uppercase tracking-wide">{aisle.label}</span>
                <span className="flex items-center gap-1">
                  {selectedCount > 0 ? (
                    <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[var(--spm-on-surface)]">
                      {selectedCount}
                    </span>
                  ) : null}
                  <SpmIcon name={open ? "expand_less" : "expand_more"} className="text-lg" />
                </span>
              </button>
              {open ? (
                <div className="space-y-1 bg-[var(--spm-surface-container-lowest)] px-3 py-2">
                  {aisle.subcategories.map((sub) => {
                    const enabled = isDbCategory(sub.value);
                    const checked = filters.categories.some(
                      (item) => item.toLowerCase() === sub.value.toLowerCase(),
                    );
                    return (
                      <label
                        key={sub.value}
                        className={`flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 ${
                          enabled ? "hover:bg-[var(--spm-surface-container-high)]" : "cursor-not-allowed opacity-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!enabled}
                          onChange={() => toggleCategory(sub.value)}
                          className="spm-filter-checkbox"
                        />
                        <span className="spm-label-sm text-[var(--spm-on-surface)]">{sub.label}</span>
                      </label>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function BrandSearchFilter({
  filters,
  toggleBrand,
}: {
  filters: SpmShopFilters;
  toggleBrand: (brand: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const visibleBrands = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const pool = expanded || normalized ? SPM_SHOP_BRANDS : SPM_TOP_BRANDS;
    if (!normalized) return pool;
    return SPM_SHOP_BRANDS.filter((brand) => brand.toLowerCase().includes(normalized));
  }, [expanded, query]);

  return (
    <section>
      <header className="spm-filter-coupon-header mb-3">
        <SpmIcon name="loyalty" className="text-base" />
        <span>Brand Favorites</span>
      </header>
      <div className="relative mb-3">
        <SpmIcon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--spm-on-surface-variant)]"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search brands"
          className="spm-filter-input w-full rounded-full py-2 pl-10 pr-4"
        />
      </div>
      <div className="space-y-1">
        {visibleBrands.map((brand) => {
          const checked = filters.brands.some((item) => item.toLowerCase() === brand.toLowerCase());
          return (
            <label
              key={brand}
              className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 hover:bg-[var(--spm-surface-container-high)]"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleBrand(brand)}
                className="spm-filter-checkbox"
              />
              <span className="spm-label-sm text-[var(--spm-on-surface)]">{brand}</span>
            </label>
          );
        })}
      </div>
      {!query.trim() && !expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="spm-label-sm mt-2 font-bold text-[var(--spm-primary)] hover:underline"
        >
          Show more brands
        </button>
      ) : null}
    </section>
  );
}

function PriceRangeFilter({
  filters,
  setPriceMax,
}: {
  filters: SpmShopFilters;
  setPriceMax: (value?: number) => void;
}) {
  const value = filters.priceMax ?? SPM_PRICE_MAX;

  return (
    <section>
      <header className="spm-filter-coupon-header mb-3">
        <SpmIcon name="sell" className="text-base" />
        <span>Price Range</span>
      </header>
      <div className="rounded-lg bg-[var(--spm-surface-container-high)] px-3 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="spm-label-sm text-[var(--spm-on-surface-variant)]">Up to</span>
          <span className="spm-label-sm font-bold text-[var(--spm-secondary)]">
            {value >= SPM_PRICE_MAX ? "Any price" : `$${value}`}
          </span>
        </div>
        <input
          type="range"
          min={SPM_PRICE_STEP}
          max={SPM_PRICE_MAX}
          step={SPM_PRICE_STEP}
          value={value}
          onChange={(e) => {
            const next = Number.parseInt(e.target.value, 10);
            setPriceMax(next >= SPM_PRICE_MAX ? undefined : next);
          }}
          className="spm-price-slider w-full"
        />
      </div>
    </section>
  );
}

function CompactCheckboxSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: ReactNode;
}) {
  return (
    <section>
      <header className="spm-filter-coupon-header mb-3">
        <SpmIcon name={icon} className="text-base" />
        <span>{title}</span>
      </header>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

function FilterCheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 hover:bg-[var(--spm-surface-container-high)]">
      <input type="checkbox" checked={checked} onChange={onChange} className="spm-filter-checkbox" />
      <span className="spm-label-sm text-[var(--spm-on-surface)]">{label}</span>
    </label>
  );
}

export function SpmShopFilterPanel({
  mode,
  handlers,
  draftFilters,
  setDraftFilters,
}: {
  mode: FilterMode;
  handlers: SpmShopFilterHandlers;
  draftFilters: SpmShopFilters;
  setDraftFilters: (next: SpmShopFilters) => void;
}) {
  const state = useFilterState(mode, handlers, draftFilters, setDraftFilters);

  return (
    <div className="space-y-6">
      <ShopByPetGrid filters={state.filters} togglePetGroup={state.togglePetGroup} />
      <div className="spm-candy-divider opacity-30" />
      <StoreAislesAccordion filters={state.filters} toggleCategory={state.toggleCategory} />
      <div className="spm-candy-divider opacity-30" />
      <BrandSearchFilter filters={state.filters} toggleBrand={state.toggleBrand} />
      <div className="spm-candy-divider opacity-30" />
      <PriceRangeFilter filters={state.filters} setPriceMax={state.setPriceMax} />
      <div className="spm-candy-divider opacity-30" />
      <CompactCheckboxSection title="Availability" icon="inventory_2">
        {SPM_AVAILABILITY_OPTIONS.map((option) => (
          <FilterCheckboxRow
            key={option.id}
            label={option.label}
            checked={state.filters.availability.includes(option.id)}
            onChange={() => state.toggleAvailability(option.id)}
          />
        ))}
      </CompactCheckboxSection>
      <div className="spm-candy-divider opacity-30" />
      <CompactCheckboxSection title="Customer Rating" icon="star">
        <FilterCheckboxRow
          label="4 stars & up"
          checked={state.filters.ratingMin === 4}
          onChange={() => state.setRatingMin(state.filters.ratingMin === 4 ? undefined : 4)}
        />
        <FilterCheckboxRow
          label="3 stars & up"
          checked={state.filters.ratingMin === 3}
          onChange={() => state.setRatingMin(state.filters.ratingMin === 3 ? undefined : 3)}
        />
      </CompactCheckboxSection>
      <div className="spm-candy-divider opacity-30" />
      <CompactCheckboxSection title="Special Finds" icon="local_offer">
        <FilterCheckboxRow
          label="Sale Items"
          checked={Boolean(state.filters.saleOnly)}
          onChange={() => state.setSaleOnly(!state.filters.saleOnly)}
        />
        <FilterCheckboxRow
          label="Vet Recommended"
          checked={Boolean(state.filters.vetRecommended)}
          onChange={() => state.setVetRecommended(!state.filters.vetRecommended)}
        />
      </CompactCheckboxSection>
    </div>
  );
}
