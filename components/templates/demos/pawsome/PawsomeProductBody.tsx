"use client";

import { useState } from "react";
import Link from "next/link";
import { PS_PATHS } from "./pawsomeConfig";
import { PS_PRODUCTS } from "./pawsomeData";
import { usePawsomeCart } from "./PawsomeCartContext";
import { PsIcon, PsPageWrap } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

const PRODUCT = PS_PRODUCTS.find((p) => p.id === "artisan-salmon")!;

const GALLERY = [PRODUCT.image, PRODUCT.image, PRODUCT.image, PRODUCT.image];

export function PawsomeProductBody() {
  const { addToCart } = usePawsomeCart();
  const [purchaseType, setPurchaseType] = useState<"once" | "subscribe">("subscribe");
  const [qty, setQty] = useState(1);
  const displayPrice =
    purchaseType === "subscribe" ? PRODUCT.price * 0.85 : PRODUCT.price;

  return (
    <main className="py-8 md:py-12">
      <PsPageWrap>
        <nav className="mb-10 flex items-center gap-2 text-xs text-[var(--ps-on-surface-variant)]">
          <Link href={PS_PATHS.shop} className="hover:text-[var(--ps-primary)]">
            Shop
          </Link>
          <PsIcon name="chevron_right" className="text-base" />
          <span>Dog Food</span>
          <PsIcon name="chevron_right" className="text-base" />
          <span className="font-semibold text-[var(--ps-primary)]">{PRODUCT.name}</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-12">
          <div className="grid grid-cols-4 gap-4 md:col-span-7">
            <div className="col-span-4 aspect-square overflow-hidden rounded-xl bg-[var(--ps-surface-container-lowest)] shadow-[var(--ps-shadow)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={GALLERY[0]} alt="" className="h-full w-full object-cover" />
            </div>
            {GALLERY.slice(1, 4).map((src, i) => (
              <div
                key={i}
                className="col-span-1 aspect-square cursor-pointer overflow-hidden rounded-xl bg-[var(--ps-surface-container-lowest)] transition-shadow hover:shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            <div className="col-span-1 flex aspect-square items-center justify-center rounded-xl border border-[var(--ps-outline-variant)]">
              <PsIcon name="play_circle" className="text-[var(--ps-on-surface-variant)]" />
            </div>
          </div>

          <div className="flex flex-col gap-6 md:col-span-5">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-[color-mix(in_srgb,var(--ps-on-tertiary-container)_10%,transparent)] px-3 py-1 text-xs font-medium text-[var(--ps-on-tertiary-container)]">
                  {PRODUCT.badge}
                </span>
                <div className="flex items-center gap-0.5 text-[var(--ps-secondary)]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <PsIcon key={i} name="star" filled className="text-lg" />
                  ))}
                  <span className="ml-1 text-sm text-[var(--ps-on-surface-variant)]">(482 reviews)</span>
                </div>
              </div>
              <h1 className="mb-2 text-2xl font-semibold text-[var(--ps-primary)] md:text-3xl" style={headline}>
                {PRODUCT.name}
              </h1>
              <p className="text-[var(--ps-on-surface-variant)]">{PRODUCT.description}</p>
            </div>

            <div className="flex items-center gap-4 border-y border-[color-mix(in_srgb,var(--ps-outline-variant)_30%,transparent)] py-4">
              <span className="text-4xl font-bold text-[var(--ps-primary)]" style={headline}>
                ${PRODUCT.price.toFixed(2)}
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--ps-secondary-fixed)] bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(243,243,243,0.8))] px-3 py-1.5 shadow-sm">
                <PsIcon name="military_tech" filled className="text-[var(--ps-secondary)]" />
                <span className="text-sm font-semibold tracking-wide text-[var(--ps-secondary)]">
                  Earn {PRODUCT.points} Points
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-[var(--ps-primary)]">Purchase options</p>
              <div className="grid grid-cols-2 gap-3">
                {(["once", "subscribe"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPurchaseType(type)}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      purchaseType === type
                        ? "border-[var(--ps-primary)] bg-[var(--ps-surface-container-lowest)] shadow-[var(--ps-shadow)]"
                        : "border-[var(--ps-outline-variant)]"
                    }`}
                  >
                    <p className="text-sm font-semibold capitalize text-[var(--ps-primary)]">
                      {type === "once" ? "One-time" : "Subscribe"}
                    </p>
                    {type === "subscribe" ? (
                      <p className="mt-1 text-xs text-[var(--ps-secondary)]">Save 10% · Every 4 weeks</p>
                    ) : null}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl bg-[var(--ps-surface-container-high)]">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-4 py-3 text-[var(--ps-primary)]"
                  >
                    <PsIcon name="remove" />
                  </button>
                  <span className="w-8 text-center font-semibold">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    className="px-4 py-3 text-[var(--ps-primary)]"
                  >
                    <PsIcon name="add" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => addToCart({ ...PRODUCT, price: displayPrice }, qty)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--ps-primary)] py-4 text-sm font-semibold text-[var(--ps-on-primary)] transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  Add to Cart
                  <PsIcon name="add_shopping_cart" />
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--ps-surface-container-low)] p-4">
              <div className="flex items-start gap-3">
                <PsIcon name="pets" className="text-[var(--ps-secondary)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--ps-primary)]">Matched for Luna</p>
                  <p className="text-xs text-[var(--ps-on-surface-variant)]">
                    98% compatibility based on her health profile
                  </p>
                  <Link href={PS_PATHS.shopLuna} className="mt-2 inline-block text-xs font-semibold text-[var(--ps-secondary)] hover:underline">
                    View Luna&apos;s shop →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PsPageWrap>
    </main>
  );
}
