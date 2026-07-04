"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SPM_PATHS } from "./saturdayPetMarketConfig";
import { calcSpmCartTotals, formatSpmPrice } from "./saturdayPetMarketData";
import { useSpmRequireAuth } from "./SaturdayPetMarketAuthContext";
import { useSpmCart } from "./SaturdayPetMarketCartContext";
import { SpmContainer, SpmIcon, SpmImg } from "./SaturdayPetMarketShared";
import { useSpmCartAvailability } from "./useSpmCartAvailability";
import {
  buildSpmCheckoutHref,
  clearSpmCheckoutHoldId,
  getOrCreateSpmShopperSessionId,
  getSpmCheckoutHoldId,
  setSpmCheckoutHoldId,
} from "./spmCheckoutSession";
import {
  classifyPetMarketApiError,
  createPetMarketCheckoutReservation,
  releasePetMarketCheckoutReservation,
  validatePetMarketCheckoutReservation,
} from "@/lib/templates/api/pet-market";

export function SaturdayPetMarketCartBody() {
  const router = useRouter();
  const { hydrated } = useSpmRequireAuth();
  const { items, updateQty, removeFromCart } = useSpmCart();
  const { issues, checkoutBlocked, availabilityById, loading: availabilityLoading, error: availabilityError, refresh } =
    useSpmCartAvailability(items);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const { subtotal, tax, total } = calcSpmCartTotals(items);
  const itemCount = items.reduce((n, i) => n + i.qty, 0);

  useEffect(() => {
    const staleHoldId = getSpmCheckoutHoldId();
    if (!staleHoldId) return;

    void (async () => {
      try {
        const status = await validatePetMarketCheckoutReservation(staleHoldId);
        if (!status.valid || status.expired) {
          clearSpmCheckoutHoldId();
          try {
            await releasePetMarketCheckoutReservation(staleHoldId);
          } catch {
            // Hold may already be released or expired.
          }
          await refresh();
        }
      } catch {
        clearSpmCheckoutHoldId();
      }
    })();
  }, [refresh]);

  async function handleCheckout() {
    if (items.length === 0 || checkoutBlocked || checkoutLoading) return;

    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const sessionId = getOrCreateSpmShopperSessionId();
      const reservation = await createPetMarketCheckoutReservation({
        session_id: sessionId,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.qty,
        })),
      });

      setSpmCheckoutHoldId(reservation.checkout_session_id);
      router.push(buildSpmCheckoutHref(reservation.checkout_session_id));
    } catch (error) {
      const outcome = classifyPetMarketApiError(error, "Could not start checkout");
      if (outcome.type === "redirect-database") return;
      if (outcome.type === "insufficient-stock") {
        setCheckoutError(outcome.message);
        await refresh();
        return;
      }
      setCheckoutError(outcome.message);
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (!hydrated) return null;

  return (
    <main className="px-[var(--spm-margin)] py-12">
      <SpmContainer className="flex flex-col gap-6 md:flex-row">
        <section className="min-w-0 flex-grow space-y-6">
          <div className="mb-6 flex items-end gap-2">
            <h1 className="spm-headline-xl text-[var(--spm-primary)]">Your Basket</h1>
            <p className="spm-body-md mb-2 text-[var(--spm-on-surface-variant)]">({itemCount} items ready for home)</p>
          </div>

          {availabilityError ? (
            <div className="rounded-lg border border-[var(--spm-error)] bg-[var(--spm-error-container)] px-4 py-3 text-[var(--spm-on-error-container)]">
              <p className="spm-body-md">{availabilityError}</p>
              <button
                type="button"
                onClick={() => void refresh()}
                className="spm-label-sm mt-2 font-bold text-[var(--spm-primary)] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : null}

          {issues.length > 0 ? (
            <div className="rounded-lg border border-[var(--spm-error)] bg-[var(--spm-error-container)] px-4 py-3">
              <p className="spm-label-sm mb-2 font-bold text-[var(--spm-on-error-container)]">
                One or more items are no longer available in the quantity selected.
              </p>
              <ul className="space-y-1 spm-body-md text-[var(--spm-on-error-container)]">
                {issues.map((issue) => (
                  <li key={issue.productId}>
                    {issue.name}: only {issue.available} left (you have {issue.requested})
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {items.map(({ product, qty }) => {
            const available = availabilityById[product.id];
            const lowStock = typeof available === "number" && available > 0 && available <= 5;
            return (
              <div
                key={product.id}
                className="flex flex-col overflow-hidden rounded-lg border border-[var(--spm-outline)] bg-[var(--spm-surface-container-lowest)] shadow-sm transition-all hover:border-[var(--spm-primary)] sm:flex-row"
              >
                <SpmImg
                  variant="cartLine"
                  frameClassName="bg-[var(--spm-surface-container)]"
                  src={product.image}
                  alt={product.name}
                />
                <div className="flex flex-grow flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="spm-headline-md">{product.name}</h3>
                      {product.subtitle ? (
                        <p className="spm-label-sm mt-1 uppercase tracking-wider text-[var(--spm-on-surface-variant)]">
                          {product.subtitle}
                        </p>
                      ) : null}
                      {typeof available === "number" ? (
                        <p
                          className={`spm-label-sm mt-2 font-bold ${
                            available <= 0
                              ? "text-[var(--spm-error)]"
                              : lowStock
                                ? "text-[var(--spm-secondary)]"
                                : "text-[var(--spm-primary)]"
                          }`}
                        >
                          {available <= 0 ? "Out of stock" : `Only ${available} left`}
                        </p>
                      ) : null}
                    </div>
                    <div className="spm-price-tag-hole spm-label-price shrink-0 rounded-full bg-[var(--spm-secondary-container)] px-6 py-1 text-[var(--spm-on-secondary-container)]">
                      {formatSpmPrice(product.salePrice ?? product.price)}
                    </div>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
                    <div className="flex items-center rounded-full border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container)] p-1">
                      <button
                        type="button"
                        onClick={() => updateQty(product.id, qty - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--spm-primary)] transition-colors hover:bg-[var(--spm-surface-variant)]"
                        aria-label="Decrease quantity"
                      >
                        <SpmIcon name="remove" className="text-sm" />
                      </button>
                      <span className="px-4 font-bold">{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(product.id, qty + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--spm-primary)] transition-colors hover:bg-[var(--spm-surface-variant)]"
                        aria-label="Increase quantity"
                      >
                        <SpmIcon name="add" className="text-sm" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="spm-label-sm flex items-center gap-1 text-[var(--spm-on-surface-variant)] hover:text-[var(--spm-error)]"
                    >
                      <SpmIcon name="delete" className="text-lg" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-[var(--spm-outline-variant)] pt-6">
            <Link href={SPM_PATHS.shop} className="flex items-center gap-1 font-bold text-[var(--spm-primary)] hover:underline">
              <SpmIcon name="arrow_back" /> Continue Shopping
            </Link>
          </div>
        </section>

        <aside className="w-full shrink-0 md:w-[380px]">
          <div className="spm-retro-flyer relative overflow-hidden rounded-lg border-4 border-[var(--spm-secondary)] p-6 shadow-lg">
            <div className="spm-candy-stripe absolute left-0 top-0 h-4 w-full" />
            <div className="mt-4">
              <h2 className="spm-headline-md mb-6 border-b-2 border-[var(--spm-secondary)] pb-2 text-center text-[var(--spm-secondary)]">
                ORDER SUMMARY
              </h2>
              <div className="space-y-3 font-medium text-[var(--spm-on-surface)]">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} Items)</span>
                  <span className="font-bold">{formatSpmPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[var(--spm-on-surface-variant)]">
                  <span>Estimated Tax</span>
                  <span>{formatSpmPrice(tax)}</span>
                </div>
              </div>
              <div className="mt-6 flex justify-between border-t-2 border-dashed border-[var(--spm-secondary)] pt-6">
                <span className="spm-headline-md">TOTAL</span>
                <span className="spm-headline-md text-[var(--spm-secondary)]">{formatSpmPrice(total)}</span>
              </div>
              {checkoutError ? (
                <p className="spm-label-sm mt-4 rounded-lg bg-[var(--spm-error-container)] px-3 py-2 text-[var(--spm-on-error-container)]">
                  {checkoutError}
                </p>
              ) : null}
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => void handleCheckout()}
                  disabled={checkoutLoading || checkoutBlocked || availabilityLoading || items.length === 0}
                  className="spm-coupon-dashed spm-headline-md flex w-full items-center justify-center rounded-full bg-[var(--spm-secondary)] py-4 text-[var(--spm-on-secondary)] shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {checkoutLoading ? "HOLDING YOUR GOODIES..." : "CHECKOUT NOW"}
                </button>
                <p className="mt-2 px-4 text-center text-[10px] italic leading-tight text-[var(--spm-on-surface-variant)]">
                  We&apos;ll reserve your cart for 15 minutes once checkout begins.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </SpmContainer>
    </main>
  );
}
