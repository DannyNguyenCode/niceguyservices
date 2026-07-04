"use client";

import Image from "next/image";
import Link from "next/link";
import { LT_PATHS } from "./looneytoonsCafeConfig";
import { formatLtPrice } from "./looneytoonsCafeData";
import { useLooneyToonsCart } from "./LooneyToonsCartContext";
import { calcOrderTotals } from "./looneyToonsCartUtils";

export function LooneyToonsCartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeFromCart, itemCount, starBalance } =
    useLooneyToonsCart();

  const { subtotal, total, starsEarned } = calcOrderTotals(items);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal aria-label="Shopping cart">
      <button
        type="button"
        className="absolute inset-0 bg-[#151c28]/40 backdrop-blur-sm"
        onClick={closeCart}
        aria-label="Close cart"
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l-4 border-[#151c28] bg-[#f9f9ff] shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between border-b-2 border-[#151c28] p-6">
          <h2 className="text-2xl font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif]">
            Your cart
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#151c28] transition-transform hover:scale-95"
            aria-label="Close"
          >
            <span className="material-symbols-outlined" aria-hidden>
              close
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <p className="py-16 text-center text-sm text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
              Your cart is empty. Browse the menu to add kinetic brews and bites.
            </p>
          ) : (
            <ul className="space-y-6">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden border-2 border-[#151c28] bg-[#dde2f4]">
                    <Image src={product.image} alt="" fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold uppercase [font-family:var(--font-lt-bricolage),system-ui,sans-serif]">
                      {product.name}
                    </p>
                    <p className="text-xs text-[#444748] line-clamp-1 [font-family:var(--font-lt-space),system-ui,sans-serif]">
                      {product.description}
                    </p>
                    <p className="mt-1 font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]">
                      {formatLtPrice(product.price * qty)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQty(product.id, qty - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#151c28] bg-[#f9f9ff]"
                        aria-label="Decrease quantity"
                      >
                        <span className="material-symbols-outlined text-sm" aria-hidden>
                          remove
                        </span>
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(product.id, qty + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#151c28] bg-[#f9f9ff]"
                        aria-label="Increase quantity"
                      >
                        <span className="material-symbols-outlined text-sm" aria-hidden>
                          add
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="ml-auto text-xs font-bold text-[#ba1a1a] [font-family:var(--font-lt-space),system-ui,sans-serif] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t-2 border-[#151c28] p-6">
            <div className="mb-2 space-y-1 text-sm [font-family:var(--font-lt-space),system-ui,sans-serif]">
              <div className="flex justify-between">
                <span className="text-[#444748]">
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
                <span className="font-bold">{formatLtPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatLtPrice(total)}</span>
              </div>
            </div>
            {starsEarned > 0 ? (
              <p className="mb-4 flex items-center gap-1 text-xs font-bold text-[#495E84] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>
                  stars
                </span>
                Earn +{starsEarned} stars · {starBalance} available
              </p>
            ) : null}
            <Link
              href={LT_PATHS.checkout}
              onClick={closeCart}
              className="block w-full rounded-full border-2 border-[#151c28] bg-[#495E84] py-4 text-center text-sm font-bold text-white transition-transform hover:scale-[0.98] [font-family:var(--font-lt-space),system-ui,sans-serif]"
            >
              Checkout
            </Link>
            <button
              type="button"
              onClick={closeCart}
              className="mt-3 w-full py-2 text-center text-sm font-bold text-[#495E84] [font-family:var(--font-lt-space),system-ui,sans-serif] hover:underline"
            >
              Continue shopping
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
