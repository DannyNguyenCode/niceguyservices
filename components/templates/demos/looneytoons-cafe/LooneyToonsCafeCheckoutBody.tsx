"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LT_PATHS } from "./looneytoonsCafeConfig";
import { formatLtPrice } from "./looneytoonsCafeData";
import { getRedeemableTiers } from "./looneytoonsCafeRewardsData";
import { useLooneyToonsCart } from "./LooneyToonsCartContext";
import { calcOrderTotals } from "./looneyToonsCartUtils";
import { LooneyToonsOrderLoadingState } from "./LooneyToonsOrderLoadingState";

const STEPS = [
  { n: 1, label: "Pickup" },
  { n: 2, label: "Review" },
] as const;

export function LooneyToonsCafeCheckoutBody() {
  const router = useRouter();
  const { items, updateQty, removeFromCart, openCart, completeOrder, starBalance } =
    useLooneyToonsCart();
  const [step, setStep] = useState<1 | 2>(1);
  const [redeemStars, setRedeemStars] = useState<number | null>(null);
  const [pickupTime, setPickupTime] = useState("15 min");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const redeemableTiers = getRedeemableTiers(starBalance);
  const { subtotal, discount, total, starsEarned, starsRedeemed } = calcOrderTotals(items, {
    redeemStars,
  });

  const isEmpty = items.length === 0;

  function handlePlaceOrder() {
    setIsPlacingOrder(true);
    const order = completeOrder({ redeemStars });
    if (order) {
      router.push(LT_PATHS.checkoutSuccess);
      return;
    }
    setIsPlacingOrder(false);
  }

  if (isPlacingOrder) {
    return <LooneyToonsOrderLoadingState />;
  }

  if (isEmpty) {
    return (
      <main className="min-h-[50vh] bg-[#f9f9ff] px-4 py-20 text-[#151c28] md:px-16">
        <div className="mx-auto max-w-lg text-center">
          <span
            className="material-symbols-outlined mb-6 text-5xl text-[#d4daec]"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden
          >
            shopping_cart
          </span>
          <h1 className="font-extrabold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-3xl">
            Your cart is empty
          </h1>
          <p className="mt-3 text-sm text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
            Add items from the menu before checkout. Stars and rewards sync across the demo.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={LT_PATHS.menu}
              className="rounded-full border-2 border-[#151c28] bg-[#495E84] px-8 py-4 text-sm font-bold text-white [font-family:var(--font-lt-space),system-ui,sans-serif]"
            >
              Browse menu
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="rounded-full border-2 border-[#151c28] px-8 py-4 text-sm font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]"
            >
              Open cart
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f9f9ff] px-4 py-10 text-[#151c28] md:px-16 md:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            {STEPS.map(({ n, label }, idx) => (
              <div key={n} className="flex items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#151c28] text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] [font-family:var(--font-lt-space),system-ui,sans-serif] ${
                    step >= n ? "bg-[#495E84] text-white" : "bg-[#f9f9ff] text-[#444748]"
                  }`}
                >
                  {step > n ? (
                    <span className="material-symbols-outlined text-sm" aria-hidden>
                      check
                    </span>
                  ) : (
                    n
                  )}
                </div>
                <span
                  className={`hidden text-xs font-bold sm:inline [font-family:var(--font-lt-space),system-ui,sans-serif] ${
                    step >= n ? "text-[#151c28]" : "text-[#444748]"
                  }`}
                >
                  {label}
                </span>
                {idx < STEPS.length - 1 ? (
                  <div
                    className={`hidden h-1 w-10 sm:block md:w-16 ${step > n ? "bg-[#495E84]" : "bg-[#dde2f4]"}`}
                  />
                ) : null}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={openCart}
            className="text-xs font-bold text-[#495E84] [font-family:var(--font-lt-space),system-ui,sans-serif] hover:underline"
          >
            Edit cart ({items.reduce((s, i) => s + i.qty, 0)} items)
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {step === 1 ? (
              <div className="space-y-4 border-4 border-[#151c28] bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-2xl">
                  Pickup details
                </h2>
                <p className="text-sm text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                  Inkwell Pier kiosk · demo pickup only — no real orders placed.
                </p>
                <input
                  placeholder="Name for the order"
                  className="w-full rounded-xl border-2 border-[#151c28] bg-[#f9f9ff] px-4 py-3 text-sm font-medium [font-family:var(--font-lt-space),system-ui,sans-serif] focus:outline-none"
                  readOnly
                  defaultValue="Demo Guest"
                />
                <fieldset className="space-y-2">
                  <legend className="text-xs font-bold uppercase tracking-widest text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                    Ready in
                  </legend>
                  {["15 min", "30 min", "45 min"].map((time) => (
                    <label
                      key={time}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-[#151c28] p-4 transition-colors [font-family:var(--font-lt-space),system-ui,sans-serif] ${
                        pickupTime === time ? "bg-[#e9edff]" : "bg-[#f9f9ff]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="pickup-time"
                        checked={pickupTime === time}
                        onChange={() => setPickupTime(time)}
                        className="accent-[#495E84]"
                      />
                      <span className="text-sm font-bold">{time}</span>
                    </label>
                  ))}
                </fieldset>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full rounded-full border-2 border-[#151c28] bg-[#495E84] py-4 text-sm font-bold text-white [font-family:var(--font-lt-space),system-ui,sans-serif]"
                >
                  Continue to review
                </button>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-4 border-4 border-[#151c28] bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-2xl">
                  Review &amp; stars
                </h2>
                <div className="rounded-xl border-2 border-[#151c28] bg-[#e9edff] p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                    Pickup
                  </p>
                  <p className="mt-1 text-sm font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]">
                    Demo Guest · Inkwell Pier · {pickupTime}
                  </p>
                </div>

                {redeemableTiers.length > 0 ? (
                  <fieldset className="space-y-3">
                    <legend className="mb-1 flex items-center gap-2 text-sm font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif]">
                      <span className="material-symbols-outlined text-[#495E84]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>
                        stars
                      </span>
                      Redeem stars ({starBalance} available)
                    </legend>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-[#151c28] p-4 [font-family:var(--font-lt-space),system-ui,sans-serif]">
                      <input
                        type="radio"
                        name="redeem-stars"
                        checked={redeemStars === null}
                        onChange={() => setRedeemStars(null)}
                        className="mt-1 accent-[#495E84]"
                      />
                      <span className="text-sm">Don&apos;t redeem stars</span>
                    </label>
                    {redeemableTiers.map((tier) => (
                      <label
                        key={tier.stars}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 border-[#151c28] p-4 [font-family:var(--font-lt-space),system-ui,sans-serif] ${
                          redeemStars === tier.stars ? "bg-[#e9edff]" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="redeem-stars"
                          checked={redeemStars === tier.stars}
                          onChange={() => setRedeemStars(tier.stars)}
                          className="mt-1 accent-[#495E84]"
                        />
                        <span className="text-sm">
                          <span className="font-bold">{tier.label}</span> — {tier.items.join(", ")} (
                          {formatLtPrice(tier.discount)} off)
                        </span>
                      </label>
                    ))}
                  </fieldset>
                ) : (
                  <p className="text-sm text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                    You need at least 100 stars to redeem. Keep ordering to unlock rewards!
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-full border-2 border-[#151c28] py-3 text-sm font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="flex-1 rounded-full border-2 border-[#151c28] bg-[#151c28] py-3 text-sm font-bold text-white shadow-[4px_4px_0px_0px_rgba(212,218,236,1)] [font-family:var(--font-lt-space),system-ui,sans-serif]"
                  >
                    Place order · {formatLtPrice(total)}
                  </button>
                </div>
                <p className="text-center text-[10px] text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                  Demo checkout — no payment processed.
                </p>
              </div>
            ) : null}
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-28 border-4 border-[#151c28] bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-xl">
                Order summary
              </h2>
              <ul className="mt-4 space-y-4">
                {items.map(({ product, qty }) => (
                  <li key={product.id} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 border-2 border-[#151c28] bg-[#dde2f4]">
                      <Image src={product.image} alt="" fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif]">
                        {product.name}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(product.id, qty - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#151c28]"
                          aria-label="Decrease quantity"
                        >
                          <span className="material-symbols-outlined text-sm" aria-hidden>
                            remove
                          </span>
                        </button>
                        <span className="w-5 text-center text-xs font-bold">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(product.id, qty + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#151c28]"
                          aria-label="Increase quantity"
                        >
                          <span className="material-symbols-outlined text-sm" aria-hidden>
                            add
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="ml-auto text-xs font-bold text-[#ba1a1a] hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="shrink-0 text-sm font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]">
                      {formatLtPrice(product.price * qty)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2 border-t-2 border-[#151c28] pt-4 text-sm [font-family:var(--font-lt-space),system-ui,sans-serif]">
                <div className="flex justify-between">
                  <span className="text-[#444748]">Subtotal</span>
                  <span className="font-bold">{formatLtPrice(subtotal)}</span>
                </div>
                {starsRedeemed > 0 ? (
                  <div className="flex justify-between text-[#495E84]">
                    <span>Stars ({starsRedeemed} redeemed)</span>
                    <span>-{formatLtPrice(discount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatLtPrice(total)}</span>
                </div>
              </div>
              {starsEarned > 0 ? (
                <div className="mt-4 flex items-center gap-2 rounded-xl border-2 border-[#151c28] bg-[#e9edff] p-3">
                  <span className="material-symbols-outlined text-[#495E84]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>
                    stars
                  </span>
                  <span className="text-xs font-bold text-[#495E84] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                    Earn +{starsEarned} stars with this order
                  </span>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
