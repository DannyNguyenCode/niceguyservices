"use client";

import Link from "next/link";
import { PS_PATHS } from "./pawsomeConfig";
import type { PsProduct } from "./pawsomeData";
import { usePawsomeCart } from "./PawsomeCartContext";
import { PsIcon } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

type PawsomeProductCardProps = {
  product: PsProduct;
  layout?: "grid" | "compact";
};

export function PawsomeProductCard({ product, layout = "grid" }: PawsomeProductCardProps) {
  const { addToCart } = usePawsomeCart();
  const href = PS_PATHS.shop;
  const badges = product.badges ?? (product.badge ? [product.badge] : []);

  if (layout === "compact") {
    return (
      <Link
        href={href}
        className="group overflow-hidden rounded-xl bg-[var(--ps-surface-container-lowest)] shadow-[var(--ps-shadow)] transition-all hover:-translate-y-1 hover:shadow-[var(--ps-shadow-lg)]"
      >
        <div className="relative aspect-square overflow-hidden bg-[var(--ps-surface-container)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.match ? (
            <div className="absolute right-3 top-3 rounded-full bg-[color-mix(in_srgb,var(--ps-primary)_90%,transparent)] px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              {product.match}% Match
            </div>
          ) : null}
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-[var(--ps-primary)]" style={headline}>
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-[var(--ps-on-surface-variant)] line-clamp-2">
            {product.description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-semibold text-[var(--ps-primary)]">${product.price.toFixed(2)}</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
              disabled={(product.availableQuantity ?? 1) <= 0}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--ps-primary)] text-[var(--ps-on-primary)] transition-colors hover:bg-[var(--ps-primary-container)] active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Add ${product.name} to cart`}
            >
              <PsIcon name="add_shopping_cart" />
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-xl bg-[var(--ps-surface-container-lowest)] shadow-[var(--ps-shadow)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--ps-shadow-lg)]">
      <Link href={href} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--ps-surface-container)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.lowStock ? (
              <span className="rounded-full bg-[var(--ps-error-container)] px-2.5 py-1 text-xs font-semibold text-[var(--ps-on-error-container)]">
                Low Stock
              </span>
            ) : null}
            {badges.map((b) => (
              <span
                key={b}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  b.includes("Subscribe")
                    ? "bg-[var(--ps-secondary-container)] text-[var(--ps-on-secondary-container)]"
                    : b === "Top Rated"
                      ? "bg-[var(--ps-tertiary-container)] text-[var(--ps-on-tertiary-container)]"
                      : "bg-[color-mix(in_srgb,var(--ps-primary)_90%,transparent)] text-white backdrop-blur-md"
                }`}
              >
                {b === "Top Rated" ? (
                  <PsIcon name="stars" filled className="text-sm" />
                ) : null}
                {b}
              </span>
            ))}
          </div>
        </div>
        <div className="p-5">
          {product.points ? (
            <span className="mb-2 inline-block rounded bg-[color-mix(in_srgb,var(--ps-secondary-container)_10%,transparent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--ps-on-secondary-container)]">
              Earn {product.points} Points
            </span>
          ) : null}
          <h3
            className="mb-1 line-clamp-1 text-base font-semibold text-[var(--ps-primary)] transition-colors group-hover:text-[var(--ps-secondary)]"
            style={headline}
          >
            {product.name}
          </h3>
          <p className="text-sm text-[var(--ps-on-surface-variant)]">
            {product.shortDescription ?? product.description}
          </p>
        </div>
      </Link>
      <div className="flex items-end justify-between px-5 pb-5">
        <div className="flex flex-col">
          {product.compareAtPrice ? (
            <span className="text-xs text-[var(--ps-on-surface-variant)] line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          ) : null}
          <span className="text-xl font-semibold text-[var(--ps-primary)]" style={headline}>
            ${product.price.toFixed(2)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => addToCart(product)}
          disabled={(product.availableQuantity ?? 1) <= 0}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--ps-primary)] text-[var(--ps-on-primary)] transition-all hover:bg-[var(--ps-primary-container)] active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Add ${product.name} to cart`}
        >
          <PsIcon name={product.id === "activeflex" ? "add_shopping_cart" : "add"} />
        </button>
      </div>
    </div>
  );
}
