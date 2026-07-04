"use client";

import { useMemo, useState } from "react";
import type { Product } from "./companionPetData";
import { ProductCard } from "./ProductCard";
import { FilterDrawer, EMPTY_FILTERS, type ActiveFilters } from "./FilterDrawer";
import { useCompanionPetCart } from "./CompanionPetShell";
import { useCpPetMarketProducts } from "./useCpPetMarketProducts";
import { CompanionPetShopLoading } from "./CompanionPetShopLoading";

function matchesFilters(product: Product, f: ActiveFilters): boolean {
  if (f.pet.length && !f.pet.some((p) => product.pet.includes(p as (typeof product.pet)[0]))) return false;
  if (f.category.length && !f.category.includes(product.category)) return false;
  if (f.brand.length && !f.brand.includes(product.brand)) return false;
  if (f.dietary.length && !f.dietary.some((d) => product.dietary?.includes(d))) return false;
  if (f.age.length && !f.age.some((a) => product.age?.includes(a))) return false;
  if (f.health.length && !f.health.some((h) => product.health?.includes(h))) return false;
  if (f.deals && !product.deal) return false;
  return true;
}

type SortOption = "popular" | "price-asc" | "price-desc" | "rating";

const SORT_MAP: Record<SortOption, "name-asc" | "price-asc" | "price-desc" | "newest" | undefined> = {
  popular: "newest",
  rating: "name-asc",
  "price-asc": "price-asc",
  "price-desc": "price-desc",
};

export function CompanionPetShopBody() {
  const { addToCart } = useCompanionPetCart();
  const [filters, setFilters] = useState<ActiveFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortOption>("popular");

  const { products: apiProducts, loading, error, refetch } = useCpPetMarketProducts({
    pageSize: 48,
    sort: SORT_MAP[sort],
    filter: { in_stock: false },
  });

  const filtered = useMemo(() => {
    let list = apiProducts.filter((p) => matchesFilters(p, filters));
    if (sort === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sort === "popular") {
      list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return list;
  }, [apiProducts, filters, sort]);

  if (loading) return <CompanionPetShopLoading />;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[var(--cp-charcoal)]">Shop</h1>
        <p className="mt-2 text-sm text-[var(--cp-slate)]">
          Live inventory from our pet market catalog — filter by pet, category, and more.
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl border border-[var(--cp-orange)] bg-[var(--cp-orange-muted)] px-4 py-3 text-sm">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-2 text-xs font-semibold text-[var(--cp-blue)] hover:underline"
          >
            Try again
          </button>
        </div>
      ) : null}

      <div className="flex gap-8">
        <FilterDrawer active={filters} onChange={setFilters} resultCount={filtered.length} />

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-[var(--cp-slate)]">
              <span className="font-semibold text-[var(--cp-charcoal)]">{filtered.length}</span> products
            </p>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-[var(--cp-slate)]">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="rounded-xl border border-[var(--cp-border)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--cp-blue)]"
              >
                <option value="popular">Popularity</option>
                <option value="rating">Top rated</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onQuickAdd={addToCart} />
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-[var(--cp-slate)]">
              {apiProducts.length === 0
                ? "No products in the catalog yet."
                : "No products match your filters."}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
