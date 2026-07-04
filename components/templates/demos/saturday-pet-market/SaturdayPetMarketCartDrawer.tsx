"use client";

import Link from "next/link";
import { useEffect } from "react";
import { SPM_IMG } from "./saturdayPetMarketImages";
import { SPM_PATHS } from "./saturdayPetMarketConfig";
import { formatSpmPrice } from "./saturdayPetMarketData";
import { useSpmCart } from "./SaturdayPetMarketCartContext";
import { SpmIcon, SpmImg } from "./SaturdayPetMarketShared";

export function SaturdayPetMarketCartDrawer() {
  const { items, subtotal, isOpen, closeCart, toggleCart, updateQty, removeFromCart } = useSpmCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div
      className="spm-mini-cart-overlay fixed inset-0 z-[100] opacity-100 transition-opacity duration-300"
      role="presentation"
      onClick={closeCart}
    >
      <div
        className="absolute right-0 top-0 flex h-full w-full max-w-[400px] translate-x-0 flex-col border-l border-[var(--spm-outline-variant)] bg-[var(--spm-background)] shadow-2xl transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-label="Quick basket"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container)] p-6">
          <div className="flex items-center gap-2">
            <SpmIcon name="shopping_bag" className="text-[var(--spm-primary)]" />
            <h2 className="spm-headline-md">Quick Basket</h2>
          </div>
          <button
            type="button"
            onClick={toggleCart}
            className="rounded-full p-1 transition-colors hover:bg-[var(--spm-surface-variant)]"
            aria-label="Close cart"
          >
            <SpmIcon name="close" />
          </button>
        </div>

        <div className="spm-candy-stripe flex-grow space-y-4 overflow-y-auto p-6">
          {items.length === 0 ? (
            <p className="spm-body-md text-center text-[var(--spm-on-surface-variant)]">Your basket is empty.</p>
          ) : null}
          {items.map(({ product, qty }) => (
            <div
              key={product.id}
              className="flex gap-3 rounded-lg border border-[var(--spm-outline)] bg-[var(--spm-surface-container-lowest)] p-3 shadow-sm"
            >
              <SpmImg
                variant="cartThumb"
                frameClassName="rounded bg-[var(--spm-surface-container)]"
                src={
                  product.id === "star-biscuits"
                    ? SPM_IMG.cart.starBiscuitsThumb
                    : product.id === "braided-rope"
                      ? SPM_IMG.cart.braidedRopeThumb
                      : product.image
                }
                alt={product.name}
              />
              <div className="min-w-0 flex-grow">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="line-clamp-2 font-bold leading-tight text-[var(--spm-on-surface)]">{product.name}</h4>
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="shrink-0 rounded-full p-1 text-[var(--spm-on-surface-variant)] transition-colors hover:bg-[var(--spm-error-container)] hover:text-[var(--spm-error)]"
                    aria-label={`Remove ${product.name}`}
                  >
                    <SpmIcon name="close" className="text-lg" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center rounded-full border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container)] p-0.5">
                    <button
                      type="button"
                      onClick={() => updateQty(product.id, qty - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--spm-primary)] transition-colors hover:bg-[var(--spm-surface-variant)]"
                      aria-label="Decrease quantity"
                    >
                      <SpmIcon name="remove" className="text-sm" />
                    </button>
                    <span className="min-w-[2rem] px-1 text-center text-sm font-bold">{qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(product.id, qty + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--spm-primary)] transition-colors hover:bg-[var(--spm-surface-variant)]"
                      aria-label="Increase quantity"
                    >
                      <SpmIcon name="add" className="text-sm" />
                    </button>
                  </div>
                  <span className="font-bold text-[var(--spm-secondary)]">
                    {formatSpmPrice((product.salePrice ?? product.price) * qty)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="spm-body-md font-bold">Subtotal</span>
            <span className="spm-headline-md text-[var(--spm-primary)]">{formatSpmPrice(subtotal)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={SPM_PATHS.cart}
              onClick={closeCart}
              className="rounded-full bg-[var(--spm-surface-container-highest)] py-2 text-center font-bold text-[var(--spm-on-surface)] transition-all hover:opacity-80"
            >
              View Full Cart
            </Link>
            <Link
              href={SPM_PATHS.checkout}
              onClick={closeCart}
              className="rounded-full bg-[var(--spm-secondary)] py-2 text-center font-bold text-[var(--spm-on-secondary)] shadow-md transition-all hover:shadow-lg active:scale-95"
            >
              Checkout
            </Link>
          </div>
          <p className="mt-4 text-center text-[11px] text-[var(--spm-on-surface-variant)]">
            Free shipping applied to your order!
          </p>
        </div>
      </div>
    </div>
  );
}
