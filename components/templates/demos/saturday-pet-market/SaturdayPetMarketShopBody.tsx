"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { spmProductHref } from "./saturdayPetMarketConfig";
import type { SpmProduct } from "./saturdayPetMarketData";
import { mapSpmShopSortToApiSort, type SpmShopSort } from "./mapPetMarketToSpmProduct";
import { SaturdayPetMarketShopLoading } from "./SaturdayPetMarketShopLoading";
import {
  SaturdayPetMarketShopActiveFilters,
  SaturdayPetMarketShopFilters,
  SaturdayPetMarketShopMobileFilterButton,
  SaturdayPetMarketShopMobileFilterDrawer,
} from "./SaturdayPetMarketShopFilters";
import { SpmShopFiltersProvider } from "./useSpmShopFilters";
import { applySpmClientFilters, spmNeedsClientFetchAll } from "./spmClientProductFilters";
import { SaturdayPetMarketShopSearchResults } from "./SaturdayPetMarketShopSearch";
import { useSpmCart } from "./SaturdayPetMarketCartContext";
import { usePetMarketProducts } from "./usePetMarketProducts";
import { SpmContainer, SpmIcon, SpmImg, SpmPriceTag } from "./SaturdayPetMarketShared";
import { SPM_SEARCH_DEFAULT_PAGE_SIZE } from "./search/spmProductSearch";
import { SaturdayPetMarketShopPagination } from "./SaturdayPetMarketShopPagination";
import { SaturdayPetMarketSpecialistFab } from "./SaturdayPetMarketSpecialistFab";
import { parseSpmShopFilters, spmPetTypeIcon, spmPetTypeLabel, spmShopFiltersToApiFilter } from "./spmShopFilters";

const PET_ICONS: Record<SpmProduct["petType"], { icon: string; label: string; className: string }> = {
  dogs: { icon: "pets", label: "DOGS", className: "bg-[var(--spm-tertiary-container)] text-[var(--spm-on-tertiary-container)]" },
  cats: { icon: "pets", label: "CATS", className: "bg-[var(--spm-tertiary)] text-[var(--spm-on-tertiary)]" },
  birds: { icon: "flutter_dash", label: "BIRDS", className: "bg-[var(--spm-primary)] text-[var(--spm-on-primary)]" },
};

const SHOP_SORT_OPTIONS: { value: SpmShopSort; label: string }[] = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "name-asc", label: "Best Sellers" },
];

function productPetBadge(product: SpmProduct) {
  if (product.petTypeLabel) {
    return {
      icon: spmPetTypeIcon(product.petTypeLabel),
      label: spmPetTypeLabel(product.petTypeLabel).toUpperCase(),
      className: PET_ICONS[product.petType].className,
    };
  }
  return PET_ICONS[product.petType];
}

export function SaturdayPetMarketShopBody() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.trim() ?? "";

  if (searchQuery) {
    return (
      <>
        <SaturdayPetMarketShopSearchResults query={searchQuery} />
        <SaturdayPetMarketSpecialistFab expanded label="Ask a Specialist" />
      </>
    );
  }

  return <SaturdayPetMarketShopGrid />;
}

function SaturdayPetMarketShopGrid() {
  const searchParams = useSearchParams();
  const { addToCart } = useSpmCart();
  const [sort, setSort] = useState<SpmShopSort>("newest");
  const [page, setPage] = useState(1);

  const filters = useMemo(() => parseSpmShopFilters(searchParams), [searchParams]);
  const apiFilter = useMemo(() => spmShopFiltersToApiFilter(filters), [filters]);
  const filterKey = JSON.stringify(filters);
  const clientFetchAll = spmNeedsClientFetchAll(filters);

  const { result, products: rawProducts, loading, error } = usePetMarketProducts({
    page: clientFetchAll ? 1 : page,
    pageSize: clientFetchAll ? 200 : SPM_SEARCH_DEFAULT_PAGE_SIZE,
    sort: mapSpmShopSortToApiSort(sort),
    filter: apiFilter,
  });

  const products = useMemo(() => {
    const filtered = applySpmClientFilters(rawProducts, filters);
    if (!clientFetchAll) return filtered;
    const start = (page - 1) * SPM_SEARCH_DEFAULT_PAGE_SIZE;
    return filtered.slice(start, start + SPM_SEARCH_DEFAULT_PAGE_SIZE);
  }, [rawProducts, filters, clientFetchAll, page]);

  const total = clientFetchAll
    ? applySpmClientFilters(rawProducts, filters).length
    : (result?.total ?? 0);
  const totalPages = clientFetchAll
    ? Math.max(1, Math.ceil(total / SPM_SEARCH_DEFAULT_PAGE_SIZE))
    : (result?.totalPages ?? 1);

  useEffect(() => {
    setPage(1);
  }, [sort, filterKey]);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
  }, [page, totalPages]);

  if (loading && products.length === 0) {
    return <SaturdayPetMarketShopLoading />;
  }

  return (
    <SpmShopFiltersProvider>
      <main className="px-[var(--spm-margin)] py-12">
        <SpmContainer className="grid items-start gap-6 md:grid-cols-[288px_1fr]">
          <SaturdayPetMarketShopFilters />

          <section>
            <SaturdayPetMarketShopActiveFilters />

            <div className="mb-8 flex flex-col items-stretch justify-between gap-4 md:mb-12 md:flex-row md:items-center">
              <div>
                <h1 className="spm-headline-xl text-[var(--spm-on-surface)]">Fresh on the Shelves</h1>
                <p className="spm-body-lg text-[var(--spm-on-surface-variant)]">
                  {total} {total === 1 ? "product" : "products"} found
                </p>
                {error ? (
                  <p className="spm-body-md mt-2 text-[var(--spm-error)]">{error}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                <SaturdayPetMarketShopMobileFilterButton />
                <div className="flex items-center gap-2">
                  <span className="spm-label-sm text-[var(--spm-on-surface-variant)]">Sort by:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SpmShopSort)}
                    className="spm-label-sm cursor-pointer rounded-full border-none bg-[var(--spm-surface-container-high)] px-6 py-1 text-[var(--spm-on-surface)] focus:ring-2 focus:ring-[var(--spm-primary)]"
                  >
                    {SHOP_SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <SpmIcon name="progress_activity" className="animate-spin text-4xl text-[var(--spm-primary)]" />
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] px-8 py-16 text-center">
              <p className="spm-headline-md mb-2 text-[var(--spm-on-surface)]">No products match these filters</p>
              <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
                Try clearing a filter or choosing a different brand, category, or pet type.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => {
                const pet = productPetBadge(product);
                const inStock = (product.availableQuantity ?? product.quantity ?? 0) > 0;
                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col overflow-hidden rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-background)] shadow-md transition-all hover:border-[var(--spm-primary)] hover:shadow-lg"
                  >
                    <div className="relative">
                      <SpmImg
                        variant="productCard"
                        frameClassName="bg-[var(--spm-surface-container-lowest)]"
                        src={product.image}
                        alt={product.name}
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                      {product.badge ? (
                        <span className="spm-label-sm absolute left-3 top-3 -rotate-3 rounded-full bg-[var(--spm-secondary)] px-3 py-0.5 font-bold text-[var(--spm-on-secondary)] shadow-sm">
                          {product.badge}
                        </span>
                      ) : null}
                      {product.tag ? (
                        <span className="spm-label-sm absolute right-3 top-3 rounded-full bg-[var(--spm-tertiary)] px-3 py-0.5 font-bold text-[var(--spm-on-tertiary)] shadow-sm">
                          {product.tag}
                        </span>
                      ) : null}
                      <span className={`spm-label-sm absolute bottom-3 left-3 flex items-center gap-1 rounded-full px-3 py-0.5 font-bold shadow-sm ${pet.className}`}>
                        <SpmIcon name={pet.icon} className="text-sm" />
                        {pet.label}
                      </span>
                    </div>
                    <div className="flex flex-grow flex-col p-6">
                      <span className="spm-label-sm mb-1 uppercase tracking-tighter text-[var(--spm-on-surface-variant)]">{product.brand}</span>
                      <h3 className="spm-headline-md mb-2 leading-tight">
                        <Link href={spmProductHref(product.id)} className="hover:text-[var(--spm-primary)]">
                          {product.name}
                        </Link>
                      </h3>
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1">
                          <SpmIcon name="star" fill className="text-base text-[var(--spm-secondary)]" />
                          <span className="spm-label-sm font-bold">{product.rating}</span>
                          <span className="spm-label-sm text-[var(--spm-on-surface-variant)] opacity-60">({product.reviews} reviews)</span>
                        </div>
                        <span
                          className={`spm-label-sm rounded-full px-2 py-0.5 font-bold ${
                            inStock
                              ? "bg-[var(--spm-primary-fixed)] text-[var(--spm-on-primary-fixed)]"
                              : "bg-[var(--spm-error-container)] text-[var(--spm-on-error-container)]"
                          }`}
                        >
                          {inStock ? `${product.availableQuantity ?? product.quantity} in stock` : "Out of stock"}
                        </span>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <SpmPriceTag price={product.price} salePrice={product.salePrice} variant="cutout" />
                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          disabled={!inStock}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--spm-primary)] text-[var(--spm-on-primary)] shadow-md transition-all hover:bg-[var(--spm-on-primary-container)] active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={inStock ? `Add ${product.name} to cart` : `${product.name} is out of stock`}
                        >
                          <SpmIcon name="add_shopping_cart" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <SaturdayPetMarketShopPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            variant="shop"
          />
        </section>
      </SpmContainer>

      <SaturdayPetMarketShopMobileFilterDrawer />

      <SaturdayPetMarketSpecialistFab expanded label="Ask a Specialist" />
    </main>
    </SpmShopFiltersProvider>
  );
}
