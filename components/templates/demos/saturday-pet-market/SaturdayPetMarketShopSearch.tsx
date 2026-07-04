"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SPM_PATHS, spmProductHref } from "./saturdayPetMarketConfig";
import { type SpmProduct } from "./saturdayPetMarketData";
import { mapSpmShopSortToApiSort } from "./mapPetMarketToSpmProduct";
import { SPM_SEARCH_DEFAULT_PAGE_SIZE, type SpmProductSort } from "./search/spmProductSearch";
import { SPM_IMG } from "./saturdayPetMarketImages";
import { useSpmCart } from "./SaturdayPetMarketCartContext";
import { SaturdayPetMarketShopLoading } from "./SaturdayPetMarketShopLoading";
import {
  SaturdayPetMarketShopActiveFilters,
  SaturdayPetMarketShopFilters,
  SaturdayPetMarketShopMobileFilterButton,
  SaturdayPetMarketShopMobileFilterDrawer,
} from "./SaturdayPetMarketShopFilters";
import { SpmShopFiltersProvider } from "./useSpmShopFilters";
import { applySpmClientFilters, spmNeedsClientFetchAll } from "./spmClientProductFilters";
import { SpmContainer, SpmIcon, SpmImg, SPM_IMAGE_SIZES } from "./SaturdayPetMarketShared";
import { usePetMarketProducts } from "./usePetMarketProducts";
import { SaturdayPetMarketShopPagination } from "./SaturdayPetMarketShopPagination";
import { parseSpmShopFilters, spmShopFiltersToApiFilter } from "./spmShopFilters";

const SEARCH_PAGE_SIZE = SPM_SEARCH_DEFAULT_PAGE_SIZE;

function productDescription(product: SpmProduct): string {
  return product.description ?? "Quality treats and supplies from our neighborhood market.";
}

function focusNavSearch() {
  const input = document.getElementById("spm-nav-search") as HTMLInputElement | null;
  input?.focus();
  input?.select();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function SearchFilterSidebar() {
  return <SaturdayPetMarketShopFilters sticky={false} />;
}

function ProductSticker({ product, index }: { product: SpmProduct; index: number }) {
  const rotate = index % 2 === 0 ? "spm-sticker-rotate-left" : "spm-sticker-rotate-right";

  if (product.subtitle?.toLowerCase().includes("organic")) {
    return (
      <span
        className={`absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[var(--spm-tertiary)] px-3 py-1 text-[var(--spm-on-tertiary)] shadow-sm spm-label-sm ${rotate}`}
      >
        <SpmIcon name="eco" fill className="text-sm" />
        Organic
      </span>
    );
  }

  if (product.subtitle?.toLowerCase().includes("grain-free")) {
    return (
      <span
        className={`absolute bottom-2 right-2 rounded-full border border-[var(--spm-tertiary)]/20 bg-[var(--spm-tertiary-container)] px-3 py-1 text-[var(--spm-on-tertiary-container)] shadow-sm spm-label-sm ${rotate}`}
      >
        Grain-Free
      </span>
    );
  }

  if (product.badge === "SALE!") {
    return (
      <span
        className={`absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[var(--spm-primary)] px-3 py-1 text-[var(--spm-on-primary)] shadow-sm spm-label-sm ${rotate}`}
      >
        <SpmIcon name="star" fill className="text-sm" />
        Special Price
      </span>
    );
  }

  if (product.badge) {
    const isBestSeller = product.badge.toLowerCase().includes("best");
    return (
      <span
        className={`absolute left-2 top-2 rounded-full px-3 py-1 shadow-sm spm-label-sm ${rotate} ${
          isBestSeller
            ? "bg-[var(--spm-primary)] text-[var(--spm-on-primary)]"
            : "bg-[var(--spm-secondary)] text-[var(--spm-on-secondary)]"
        }`}
      >
        {product.badge}
      </span>
    );
  }

  if (product.tag) {
    return (
      <span
        className={`absolute right-2 top-2 rounded-full bg-[var(--spm-tertiary)] px-3 py-1 font-bold text-[var(--spm-on-tertiary)] shadow-sm spm-label-sm ${rotate}`}
      >
        {product.tag}
      </span>
    );
  }

  return null;
}

function SpmSearchProductCard({
  product,
  index,
  onAdd,
}: {
  product: SpmProduct;
  index: number;
  onAdd: () => void;
}) {
  const displayPrice = product.salePrice ?? product.price;

  return (
    <div className="group relative rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-lowest)] p-3 transition-all hover:border-[var(--spm-primary)] hover:shadow-lg">
      <div className="relative mb-4">
        <SpmImg
          variant="productCard"
          frameClassName="rounded-md bg-[var(--spm-surface-variant)]"
          src={product.image}
          alt={product.name}
          className="transition-transform duration-500 group-hover:scale-110"
        />
        <ProductSticker product={product} index={index} />
      </div>
      <div className="flex flex-col gap-1 px-1">
        <span className="spm-label-sm uppercase tracking-widest text-[var(--spm-secondary)]">{product.brand}</span>
        <h3 className="spm-headline-md text-[var(--spm-on-surface)] transition-colors group-hover:text-[var(--spm-primary)]">
          <Link href={spmProductHref(product.id)}>{product.name}</Link>
        </h3>
        <p className="spm-body-md line-clamp-2 text-[var(--spm-on-surface-variant)]">{productDescription(product)}</p>
        <div className="mt-4 flex items-end justify-between">
          {product.salePrice ? (
            <div className="flex flex-col">
              <span className="spm-body-md text-xs text-[var(--spm-outline)] line-through">${product.price.toFixed(2)}</span>
              <div className="spm-price-tag-hole spm-label-price relative flex items-center rounded-full bg-[var(--spm-secondary)] px-6 py-1 text-[var(--spm-on-secondary)] shadow-md">
                ${displayPrice.toFixed(2)}
              </div>
            </div>
          ) : (
            <div className="spm-price-tag-hole spm-label-price relative flex items-center rounded-full bg-[var(--spm-secondary)] px-6 py-1 text-[var(--spm-on-secondary)] shadow-md">
              ${displayPrice.toFixed(2)}
            </div>
          )}
          <button
            type="button"
            onClick={onAdd}
            className="spm-btn-press flex h-10 w-10 items-center justify-center rounded-full bg-[var(--spm-primary)] text-[var(--spm-on-primary)] shadow-sm transition-colors hover:bg-[var(--spm-primary-container)]"
            aria-label={`Add ${product.name} to cart`}
          >
            <SpmIcon name="add_shopping_cart" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SpmRecommendationCard({ product, onAdd }: { product: SpmProduct; onAdd: () => void }) {
  const displayPrice = product.salePrice ?? product.price;

  return (
    <div className="group rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] p-3 shadow-sm transition-all duration-300 hover:border-[var(--spm-primary)] hover:shadow-md">
      <div className="relative mb-3">
        <SpmImg
          variant="recommendation"
          frameClassName="rounded-md border border-[var(--spm-surface-variant)] bg-white"
          src={product.image}
          alt={product.name}
          className="transition-transform group-hover:scale-105"
        />
        {product.badge ? (
          <span
            className={`spm-label-sm absolute top-2 rounded-full px-3 py-1 text-white ${
              product.badge.includes("Sale")
                ? "right-2 bg-[var(--spm-tertiary-container)] text-[var(--spm-on-tertiary-container)]"
                : "left-2 bg-[var(--spm-secondary)] text-[var(--spm-on-secondary)]"
            }`}
          >
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="px-1">
        <h4 className="spm-headline-md mb-1 text-[var(--spm-on-surface)]">{product.name}</h4>
        <p className="spm-body-md mb-4 line-clamp-2 text-[var(--spm-on-surface-variant)]">{productDescription(product)}</p>
        <div className="flex items-center justify-between">
          <div className="spm-price-tag-cutout spm-label-price rounded-full bg-[var(--spm-primary-container)] px-4 py-1 text-[var(--spm-on-primary-container)] shadow-sm">
            ${displayPrice.toFixed(2)}
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--spm-primary)] text-[var(--spm-on-primary)] transition-transform hover:scale-110 active:scale-95"
            aria-label={`Add ${product.name} to cart`}
          >
            <SpmIcon name="add_shopping_cart" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SpmShopPromoBanner() {
  return (
    <section className="relative mt-16 overflow-hidden">
      <div className="spm-wavy-divider h-10 w-full rotate-180 bg-[var(--spm-tertiary-container)]/30" />
      <div className="bg-[var(--spm-tertiary-container)]/10 px-[var(--spm-margin)] py-16">
        <SpmContainer>
          <div className="relative flex flex-col items-center justify-between gap-8 rounded-lg border-2 border-dashed border-[var(--spm-tertiary)]/40 bg-[var(--spm-surface-container-lowest)] p-8 md:flex-row md:p-12">
            <div className="pointer-events-none absolute right-0 top-0 p-6 opacity-10">
              <SpmIcon name="loyalty" className="text-[120px]" />
            </div>
            <div className="relative z-10 flex flex-col gap-1 text-center md:text-left">
              <span className="spm-label-sm font-bold uppercase tracking-[0.2em] text-[var(--spm-tertiary)]">
                Limited Time Offer
              </span>
              <h2 className="spm-headline-xl max-w-xl text-[var(--spm-on-surface)]">
                Stock up on Organic Chews &amp; Save 20%
              </h2>
              <p className="spm-body-lg mt-1 text-[var(--spm-on-surface-variant)]">
                Use code{" "}
                <span className="rounded bg-[var(--spm-tertiary)] px-2 py-0.5 font-mono font-bold text-[var(--spm-on-tertiary)]">
                  FRESH20
                </span>{" "}
                at checkout.
              </p>
            </div>
            <Link
              href={SPM_PATHS.rewards}
              className="spm-btn-press relative z-10 whitespace-nowrap rounded-full bg-[var(--spm-secondary)] px-12 py-4 text-[var(--spm-on-secondary)] shadow-lg spm-headline-md"
            >
              Claim Reward
            </Link>
          </div>
        </SpmContainer>
      </div>
      <div className="spm-wavy-divider h-10 w-full bg-[var(--spm-tertiary-container)]/30" />
    </section>
  );
}

export function SaturdayPetMarketShopSearchResults({ query }: { query: string }) {
  const searchParams = useSearchParams();
  const { addToCart } = useSpmCart();
  const [sort, setSort] = useState<SpmProductSort>("relevant");
  const [page, setPage] = useState(1);

  const filters = useMemo(() => parseSpmShopFilters(searchParams), [searchParams]);
  const apiFilter = useMemo(() => spmShopFiltersToApiFilter(filters), [filters]);
  const filterKey = JSON.stringify(filters);
  const clientFetchAll = spmNeedsClientFetchAll(filters);

  const { result, products: rawProducts, loading, error } = usePetMarketProducts({
    q: query,
    page: clientFetchAll ? 1 : page,
    pageSize: clientFetchAll ? 200 : SEARCH_PAGE_SIZE,
    sort: mapSpmShopSortToApiSort(sort),
    filter: apiFilter,
  });

  const pageProducts = useMemo(() => {
    const filtered = applySpmClientFilters(rawProducts, filters);
    if (!clientFetchAll) return filtered;
    const start = (page - 1) * SEARCH_PAGE_SIZE;
    return filtered.slice(start, start + SEARCH_PAGE_SIZE);
  }, [rawProducts, filters, clientFetchAll, page]);

  const total = clientFetchAll
    ? applySpmClientFilters(rawProducts, filters).length
    : (result?.total ?? 0);
  const totalPages = clientFetchAll
    ? Math.max(1, Math.ceil(total / SEARCH_PAGE_SIZE))
    : (result?.totalPages ?? 1);

  useEffect(() => {
    setPage(1);
  }, [query, sort, filterKey]);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
  }, [page, totalPages]);

  if (loading && pageProducts.length === 0) {
    return <SaturdayPetMarketShopLoading message="Searching the shelves..." />;
  }

  if (!loading && total === 0) {
    return <SaturdayPetMarketShopNoResults query={query} />;
  }

  return (
    <SpmShopFiltersProvider>
      <main className="px-[var(--spm-margin)] py-12">
        <SpmContainer className="flex flex-col gap-6 md:flex-row">
          <SearchFilterSidebar />
          <section className="min-w-0 flex-1">
            <SaturdayPetMarketShopActiveFilters />
            <header className="mb-8 flex flex-col items-start justify-between gap-4 md:mb-12 md:flex-row md:items-end">
              <div>
                <nav className="spm-label-sm mb-1 flex gap-1 text-[var(--spm-on-surface-variant)] opacity-70">
                  <Link href={SPM_PATHS.shop} className="hover:text-[var(--spm-secondary)]">
                    Shop
                  </Link>
                  <span>/</span>
                  <span className="text-[var(--spm-on-surface)]">Search Results</span>
                </nav>
                <h1 className="spm-headline-lg text-[var(--spm-primary)]">
                  {total} {total === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
                </h1>
                {error ? (
                  <p className="spm-body-md mt-2 text-[var(--spm-error)]">{error}</p>
                ) : null}
              </div>
              <div className="flex w-full flex-wrap items-center justify-end gap-3 md:w-auto">
                <SaturdayPetMarketShopMobileFilterButton />
                <div className="flex flex-1 items-center gap-4 md:flex-none">
                  <label className="spm-label-sm whitespace-nowrap text-[var(--spm-on-surface-variant)]">Sort By:</label>
                  <div className="relative flex-1 md:flex-none">
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SpmProductSort)}
                      className="spm-body-md min-w-[160px] w-full cursor-pointer appearance-none rounded-full border-2 border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-lowest)] py-2 pl-6 pr-10 text-[var(--spm-on-surface)] outline-none focus:border-[var(--spm-primary-container)] md:w-auto"
                    >
                      <option value="relevant">Most Relevant</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                    <SpmIcon
                      name="expand_more"
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--spm-outline)]"
                    />
                  </div>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div className="col-span-full flex justify-center py-12">
                  <SpmIcon name="progress_activity" className="animate-spin text-4xl text-[var(--spm-primary)]" />
                </div>
              ) : null}
              {pageProducts.map((product, index) => (
                <SpmSearchProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onAdd={() => addToCart(product)}
                />
              ))}
            </div>

            <SaturdayPetMarketShopPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              variant="search"
            />
          </section>
        </SpmContainer>
      </main>
      <SaturdayPetMarketShopMobileFilterDrawer />
      <SpmShopPromoBanner />
    </SpmShopFiltersProvider>
  );
}

export function SaturdayPetMarketShopNoResults({ query }: { query: string }) {
  const { addToCart } = useSpmCart();
  const { products: recommendations, loading: recommendationsLoading } = usePetMarketProducts({
    page: 1,
    pageSize: 4,
    sort: "name-asc",
  });

  return (
    <main className="px-[var(--spm-margin)] py-16">
      <SpmContainer>
        <div className="mb-12">
          <nav className="spm-label-sm mb-4 flex items-center gap-1 text-[var(--spm-outline)]">
            <span>Search</span>
            <SpmIcon name="chevron_right" className="text-sm" />
            <span className="font-bold text-[var(--spm-primary)]">&ldquo;{query}&rdquo;</span>
          </nav>
          <h1 className="spm-headline-xl text-[var(--spm-on-surface)]">
            No results for <span className="italic text-[var(--spm-secondary)]">&ldquo;{query}&rdquo;</span>
          </h1>
        </div>

        <section className="spm-soft-checkers relative mb-16 flex flex-col items-center overflow-hidden rounded-lg border border-[var(--spm-outline-variant)] p-12 text-center">
          <div className="absolute left-0 top-0 h-16 w-16 rounded-tl-lg border-l-4 border-t-4 border-[var(--spm-tertiary)] opacity-20" />
          <div className="absolute bottom-0 right-0 h-16 w-16 rounded-br-lg border-b-4 border-r-4 border-[var(--spm-secondary)] opacity-20" />
          <div className="relative mb-6 h-64 w-64">
            <div
              className="h-full w-full animate-bounce overflow-hidden rounded-full border-4 border-[var(--spm-primary-container)] bg-white p-1 shadow-md"
              style={{ animationDuration: "3s" }}
            >
              <SpmImg
                src={SPM_IMG.search.mascot}
                alt="Detective puppy searching for treats"
                width={256}
                height={256}
                sizes={SPM_IMAGE_SIZES.mascot}
              />
            </div>
            <div className="absolute -right-4 top-1/2 rotate-12 rounded-full bg-yellow-400 p-3 text-[var(--spm-on-primary-container)] shadow-lg">
              <SpmIcon name="manage_search" className="text-[32px]" />
            </div>
          </div>
          <div className="max-w-xl">
            <h2 className="spm-headline-lg mb-4 text-[var(--spm-secondary)]">Sniffed everywhere, but found no matches.</h2>
            <p className="spm-body-lg mb-8 text-[var(--spm-on-surface-variant)]">
              Our four-legged detectives checked the backroom, the high shelves, and even under the welcome mat, but
              &ldquo;{query}&rdquo; seems to be avoiding us today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={SPM_PATHS.shop}
                className="spm-coupon-button spm-btn-press rounded-full bg-[var(--spm-primary)] px-12 py-3 text-[var(--spm-on-primary)] shadow-[0_4px_0_0_#003636] spm-headline-md hover:shadow-none"
              >
                Back to Shop
              </Link>
              <button
                type="button"
                onClick={focusNavSearch}
                className="rounded-full border-2 border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-high)] px-12 py-3 text-[var(--spm-on-surface-variant)] transition-all hover:bg-[var(--spm-surface-container-highest)] spm-headline-md"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>

        <div className="spm-candy-wrapper-divider mb-16 rounded-full" />

        <section>
          <div className="mb-12 flex items-end justify-between border-b-4 border-dotted border-[var(--spm-outline-variant)] pb-4">
            <div>
              <span className="spm-label-sm mb-2 inline-block rounded-full bg-[var(--spm-tertiary-fixed)] px-3 py-1 uppercase tracking-widest text-[var(--spm-tertiary)]">
                Local Favorites
              </span>
              <h3 className="spm-headline-lg text-[var(--spm-on-surface)]">Neighborly Recommendations</h3>
            </div>
            <Link href={SPM_PATHS.shop} className="spm-body-md font-bold text-[var(--spm-primary)] hover:underline">
              See all Best-Sellers
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {recommendationsLoading ? (
              <div className="col-span-full flex justify-center py-8">
                <SpmIcon name="progress_activity" className="animate-spin text-3xl text-[var(--spm-primary)]" />
              </div>
            ) : (
              recommendations.map((product) => (
                <SpmRecommendationCard key={product.id} product={product} onAdd={() => addToCart(product)} />
              ))
            )}
          </div>
        </section>

        <section className="mt-16 flex flex-col items-center justify-between gap-8 rounded-lg border-2 border-[var(--spm-primary-container)] bg-[var(--spm-surface-container-highest)] p-8 md:flex-row">
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--spm-primary)] text-[var(--spm-on-primary)]">
              <SpmIcon name="pets" className="text-[32px]" />
            </div>
            <div>
              <h3 className="spm-headline-md text-[var(--spm-on-surface)]">Can&apos;t find it? Ask our staff!</h3>
              <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
                We source unique items from local makers every week.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
            <input
              className="min-w-[280px] rounded-full border-none px-6 py-2 outline-none focus:ring-2 focus:ring-[var(--spm-primary)]"
              placeholder="Your email address"
              type="email"
            />
            <button
              type="button"
              className="spm-coupon-button spm-btn-press rounded-full bg-[var(--spm-secondary)] px-12 py-2 font-bold text-[var(--spm-on-secondary)] shadow-[0_4px_0_0_#410007]"
            >
              Join the Pack
            </button>
          </div>
        </section>
      </SpmContainer>
    </main>
  );
}
