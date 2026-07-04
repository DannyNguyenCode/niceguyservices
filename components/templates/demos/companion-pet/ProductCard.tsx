"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, Star } from "lucide-react";
import type { Product } from "./companionPetData";

type ProductCardProps = {
  product: Product;
  onQuickAdd?: (product: Product) => void;
};

export function ProductCard({ product, onQuickAdd }: ProductCardProps) {
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);

  const stockLabel =
    product.stockLevel === "low" ? "Low stock" : product.inStock ? "In stock" : "Out of stock";

  return (
    <motion.article
      layout
      className="cp-product-card cp-card group relative flex flex-col overflow-hidden rounded-2xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-[var(--cp-warm-gray)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hovered ? product.hoverImage : product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.badges?.map((b) => (
            <span
              key={b}
              className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-[var(--cp-charcoal)] backdrop-blur-sm"
            >
              {b}
            </span>
          ))}
          {product.deal ? (
            <span className="rounded-full bg-[var(--cp-orange)] px-2 py-0.5 text-[10px] font-semibold text-white">
              Deal
            </span>
          ) : null}
        </div>
        <AnimatePresence>
          {hovered ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute inset-x-3 bottom-3 flex gap-2"
            >
              <button
                type="button"
                onClick={() => onQuickAdd?.(product)}
                disabled={!product.inStock}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--cp-charcoal)] py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" aria-hidden />
                Quick add
              </button>
              <button
                type="button"
                onClick={() => setSaved((s) => !s)}
                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--cp-border)] bg-white/95 backdrop-blur-sm"
              >
                <Heart
                  className={`h-4 w-4 ${saved ? "fill-[var(--cp-orange)] text-[var(--cp-orange)]" : "text-[var(--cp-slate)]"}`}
                  aria-hidden
                />
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-[var(--cp-slate)]">{product.brand}</p>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-[var(--cp-charcoal)]">{product.name}</h3>
        <div className="mt-2 flex items-center gap-1 text-xs text-[var(--cp-slate)]">
          <Star className="h-3.5 w-3.5 fill-[var(--cp-orange)] text-[var(--cp-orange)]" aria-hidden />
          <span className="font-medium text-[var(--cp-charcoal)]">{product.rating}</span>
          <span>({product.reviewCount})</span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <span className="text-lg font-semibold text-[var(--cp-charcoal)]">${product.price.toFixed(2)}</span>
            {product.originalPrice ? (
              <span className="ml-1.5 text-xs text-[var(--cp-slate)] line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            ) : null}
          </div>
          <span className="text-[10px] font-medium text-[var(--cp-green)]">+{product.loyaltyPoints} pts</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
          <span
            className={`rounded-full px-2 py-0.5 ${
              product.stockLevel === "low"
                ? "bg-[var(--cp-orange-muted)] text-[var(--cp-orange)]"
                : "bg-[var(--cp-green-muted)] text-[var(--cp-green)]"
            }`}
          >
            {stockLabel}
          </span>
          {product.subscription ? (
            <span className="rounded-full bg-[var(--cp-blue-muted)] px-2 py-0.5 text-[var(--cp-blue)]">
              Subscribe & save
            </span>
          ) : null}
          {product.recommended ? (
            <span className="rounded-full bg-[var(--cp-warm-gray)] px-2 py-0.5 text-[var(--cp-slate)]">
              For Luna
            </span>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
