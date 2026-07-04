"use client";

import Image from "next/image";
import { useState } from "react";
import { formatLtPrice } from "./looneytoonsCafeData";
import { useLooneyToonsCart } from "./LooneyToonsCartContext";
import { useLooneyTunesMenuProducts } from "./useLooneyTunesMenuProducts";

export function LooneyToonsMenuOrderSection() {
  const { addToCart } = useLooneyToonsCart();
  const { products, loading, error } = useLooneyTunesMenuProducts();
  const [qtyById, setQtyById] = useState<Record<string, number>>({});

  function getQty(id: string) {
    return qtyById[id] ?? 1;
  }

  function setQty(id: string, qty: number) {
    setQtyById((prev) => ({ ...prev, [id]: Math.max(1, qty) }));
  }

  if (loading) {
    return (
      <p className="text-center text-base text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
        Loading menu…
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-base text-[#ba1a1a] [font-family:var(--font-lt-space),system-ui,sans-serif]">
        {error}
      </p>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-center text-base text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
        No menu items available right now.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {products.map((item) => {
        const qty = getQty(item.id);
        return (
          <div
            key={item.id}
            className="group relative border-4 border-[#151c28] bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            {item.badge ? (
              <div
                className={`absolute z-10 border-2 border-black px-4 py-1 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] [font-family:var(--font-lt-space),system-ui,sans-serif] ${item.badge.className} ${item.badge.rotate ?? ""} ${item.badge.side === "left" ? "-left-4 -top-4" : "-right-4 -top-4"}`}
              >
                {item.badge.text}
              </div>
            ) : null}
            <div className="lt-retro-tv-menu relative mb-6 h-64 w-full border-2 border-[#151c28] bg-[#dde2f4]">
              <div className="lt-halftone absolute inset-0" aria-hidden />
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className={`object-cover transition-transform duration-500 group-hover:scale-110 ${item.name.toLowerCase().includes("flat white") ? "grayscale-[20%]" : ""}`}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="mb-2 flex items-start justify-between">
              <h3 className="font-bold uppercase tracking-tight text-[#151c28] [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-2xl">
                {item.name}
              </h3>
              <span className="text-xl font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]">
                {formatLtPrice(item.price)}
              </span>
            </div>
            <p className="mb-6 h-12 overflow-hidden text-base text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
              {item.description}
            </p>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center rounded-full border-2 border-[#151c28] bg-[#f9f9ff] px-3 py-1">
                <button
                  type="button"
                  className="material-symbols-outlined text-sm"
                  aria-label="Decrease quantity"
                  onClick={() => setQty(item.id, qty - 1)}
                >
                  remove
                </button>
                <span className="mx-4 font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]">
                  {qty}
                </span>
                <button
                  type="button"
                  className="material-symbols-outlined text-sm"
                  aria-label="Increase quantity"
                  onClick={() => setQty(item.id, qty + 1)}
                >
                  add
                </button>
              </div>
              <button
                type="button"
                className="flex-1 rounded-full border-2 border-[#151c28] bg-[#495E84] py-3 font-bold text-white transition-transform [font-family:var(--font-lt-space),system-ui,sans-serif] hover:scale-95 active:scale-90"
                onClick={() => addToCart(item, qty)}
              >
                Add to cart
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
