"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LT_PATHS } from "./looneytoonsCafeConfig";
import { formatLtPrice } from "./looneytoonsCafeData";
import type { LtCompletedOrder } from "./LooneyToonsCartContext";
import { useLooneyToonsCart } from "./LooneyToonsCartContext";
import { LooneyToonsOrderLoadingState } from "./LooneyToonsOrderLoadingState";
import { readCompletedOrderFromSession } from "./looneyToonsCartUtils";

const ORDER_RESOLVE_TIMEOUT_MS = 4000;

export function LooneyToonsCafeOrderSuccessBody() {
  const router = useRouter();
  const { completedOrder: contextOrder } = useLooneyToonsCart();
  const [order, setOrder] = useState<LtCompletedOrder | null>(null);

  useEffect(() => {
    if (contextOrder) {
      setOrder(contextOrder);
      return;
    }

    const storedOrder = readCompletedOrderFromSession();
    if (storedOrder) {
      setOrder(storedOrder);
      return;
    }

    const timer = window.setTimeout(() => {
      router.replace(LT_PATHS.menu);
    }, ORDER_RESOLVE_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [contextOrder, router]);

  if (!order) {
    return <LooneyToonsOrderLoadingState />;
  }

  const { id, items, total, starsEarned, starsRedeemed, starBalanceAfter } = order;

  return (
    <main className="bg-[#f9f9ff] px-4 py-16 text-[#151c28] md:px-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <section className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#151c28] bg-[#e9edff] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="material-symbols-outlined text-4xl text-[#495E84]" aria-hidden>
              check_circle
            </span>
          </div>
          <h1 className="font-extrabold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl md:text-5xl">
            Order confirmed!
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
            Your kinetic brews are being prepped at Inkwell Pier. Fictional demo confirmation only.
          </p>
        </section>

        <div className="mb-8 rounded-xl border-4 border-[#151c28] bg-[#e9edff] p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#495E84] [font-family:var(--font-lt-space),system-ui,sans-serif]">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>
              stars
            </span>
            {starsRedeemed > 0 ? (
              <>
                {starsRedeemed} stars redeemed · +{starsEarned} earned · {starBalanceAfter} total
              </>
            ) : (
              <>+{starsEarned} stars earned · {starBalanceAfter} total balance</>
            )}
          </p>
          <p className="mt-2 text-sm text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
            Stars update your rewards progress — check the Rewards page to see your tier.
          </p>
        </div>

        <div className="overflow-hidden border-4 border-[#151c28] bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col gap-4 border-b-2 border-[#151c28] p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                Order number
              </p>
              <p className="mt-1 text-xl font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif]">
                #{id}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-bold uppercase tracking-widest text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                Pickup
              </p>
              <p className="mt-1 text-lg font-bold text-[#495E84] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                Inkwell Pier kiosk
              </p>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <h2 className="mb-4 text-sm font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif]">
              Items ordered
            </h2>
            <ul className="space-y-4">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4">
                  <div className="relative h-16 w-16 shrink-0 border-2 border-[#151c28] bg-[#dde2f4]">
                    <Image src={product.image} alt="" fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif]">
                      {product.name}
                    </p>
                    <p className="text-sm text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                      Qty {qty} · {formatLtPrice(product.price * qty)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between border-t-2 border-[#151c28] pt-4 text-sm font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]">
              <span>Total</span>
              <span>{formatLtPrice(total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={LT_PATHS.rewards}
            className="rounded-full border-2 border-[#151c28] bg-[#495E84] px-8 py-4 text-center text-sm font-bold text-white [font-family:var(--font-lt-space),system-ui,sans-serif]"
          >
            View rewards
          </Link>
          <Link
            href={LT_PATHS.menu}
            className="rounded-full border-2 border-[#151c28] px-8 py-4 text-center text-sm font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]"
          >
            Order again
          </Link>
        </div>
      </div>
    </main>
  );
}
