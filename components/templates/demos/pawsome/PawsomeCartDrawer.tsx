"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  classifyPetMarketApiError,
  createPetMarketCheckoutReservation,
  releasePetMarketCheckoutReservation,
  validatePetMarketCheckoutReservation,
} from "@/lib/templates/api/pet-market";
import { usePetMarketCartAvailability } from "@/lib/templates/pet-market-checkout/usePetMarketCartAvailability";
import { getPetMarketShopperIdentity } from "@/lib/templates/pet-market-checkout/shopper-identity";
import { PS_PATHS } from "./pawsomeConfig";
import { psCheckoutSession } from "./psCheckoutSession";
import { usePawsomeAuth } from "./PawsomeAuthContext";
import { usePawsomeCart } from "./PawsomeCartContext";
import { calcOrderTotals } from "./pawsomeCartUtils";
import { PawsomeOrderLoadingState } from "./PawsomeOrderLoadingState";
import { PsIcon } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

export function PawsomeCartDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const { items, isOpen, closeCart, updateQty, removeFromCart, itemCount } = usePawsomeCart();
  const { issues, checkoutBlocked, availabilityById, loading: availabilityLoading, error: availabilityError, refresh } =
    usePetMarketCartAvailability(items, PS_PATHS.databaseError);
  const { user } = usePawsomeAuth();
  const shopper = getPetMarketShopperIdentity(user);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const { subtotal, shipping, total, pointsEarned } = calcOrderTotals(items);

  useEffect(() => {
    const staleHoldId = psCheckoutSession.getCheckoutHoldId();
    if (!staleHoldId) return;

    void (async () => {
      try {
        const status = await validatePetMarketCheckoutReservation(staleHoldId);
        if (!status.valid || status.expired) {
          psCheckoutSession.clearCheckoutHoldId();
          try {
            await releasePetMarketCheckoutReservation(staleHoldId);
          } catch {
            // Hold may already be released or expired.
          }
          await refresh();
        }
      } catch {
        psCheckoutSession.clearCheckoutHoldId();
      }
    })();
  }, [refresh]);

  useEffect(() => {
    if (!checkoutLoading) return;
    if (pathname.startsWith(PS_PATHS.checkout) || pathname === PS_PATHS.databaseError) {
      setCheckoutLoading(false);
    }
  }, [pathname, checkoutLoading]);

  async function handleCheckout() {
    if (items.length === 0 || checkoutBlocked || checkoutLoading) return;

    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const sessionId = psCheckoutSession.getOrCreateShopperSessionId();
      const reservation = await createPetMarketCheckoutReservation({
        session_id: sessionId,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.qty,
        })),
      });

      psCheckoutSession.setCheckoutHoldId(reservation.checkout_session_id);
      closeCart();
      router.push(psCheckoutSession.buildCheckoutHref(reservation.checkout_session_id));
    } catch (error) {
      setCheckoutLoading(false);
      const outcome = classifyPetMarketApiError(error, "Could not start checkout");
      if (outcome.type === "redirect-database") {
        router.push(PS_PATHS.databaseError);
        return;
      }
      if (outcome.type === "insufficient-stock") {
        setCheckoutError(outcome.message);
        await refresh();
        return;
      }
      setCheckoutError(outcome.message);
    }
  }

  return (
    <>
      {checkoutLoading ? (
        <PawsomeOrderLoadingState
          overlay
          title="Preparing checkout"
          message="Reserving your items for the next 15 minutes. Hang tight while we get everything ready."
        />
      ) : null}
      {isOpen ? (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal aria-label="Shopping cart">
      <button
        type="button"
        className="absolute inset-0 bg-[var(--ps-primary)]/20 backdrop-blur-sm"
        onClick={() => {
          if (!checkoutLoading) closeCart();
        }}
        aria-label="Close cart"
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-[var(--ps-surface-container-lowest)] shadow-2xl">
        <div className="border-b border-[var(--ps-outline-variant)] px-6 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--ps-primary)]" style={headline}>
              Your Cart
            </h2>
            <button
              type="button"
              onClick={closeCart}
              disabled={checkoutLoading}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--ps-surface-container-high)] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close"
            >
              <PsIcon name="close" />
            </button>
          </div>
          {items.length > 0 ? (
            <p className="mt-2 text-xs text-[var(--ps-on-surface-variant)]">
              {shopper.isGuest ? (
                <>
                  Shopping as <span className="font-semibold text-[var(--ps-primary)]">Guest</span>
                </>
              ) : (
                <>
                  Shopping as{" "}
                  <span className="font-semibold text-[var(--ps-primary)]">{shopper.displayName}</span>
                </>
              )}
            </p>
          ) : null}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {availabilityLoading ? (
            <p className="mb-4 flex items-center gap-2 text-xs text-[var(--ps-on-surface-variant)]">
              <PsIcon name="progress_activity" className="animate-spin text-base" />
              Checking stock availability…
            </p>
          ) : null}
          {availabilityError ? (
            <p className="mb-4 rounded-xl bg-[var(--ps-error-container)] px-3 py-2 text-xs text-[var(--ps-on-error-container)]">
              {availabilityError}
            </p>
          ) : null}

          {issues.length > 0 ? (
            <div className="mb-4 rounded-xl border border-[var(--ps-error)] bg-[var(--ps-error-container)] px-3 py-2 text-xs text-[var(--ps-on-error-container)]">
              <p className="font-semibold">Some items exceed available stock.</p>
              <ul className="mt-1 space-y-0.5">
                {issues.map((issue) => (
                  <li key={issue.productId}>
                    {issue.name}: only {issue.available} left
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {items.length === 0 ? (
            <p className="py-16 text-center text-sm text-[var(--ps-on-surface-variant)]">
              Your cart is empty. Browse the shop to add essentials for Luna and Max.
            </p>
          ) : (
            <ul className="space-y-6">
              {items.map(({ product, qty }) => {
                const available = availabilityById[product.id];
                return (
                  <li key={product.id} className="flex gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[var(--ps-surface-container)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--ps-primary)]">{product.name}</p>
                      <p className="text-xs text-[var(--ps-on-surface-variant)] line-clamp-1">
                        {product.shortDescription ?? product.description}
                      </p>
                      <p className="mt-1 font-bold text-[var(--ps-primary)]">
                        ${(product.price * qty).toFixed(2)}
                      </p>
                      {typeof available === "number" ? (
                        <p
                          className={`mt-1 text-[10px] font-semibold ${
                            available <= 0 ? "text-[var(--ps-error)]" : "text-[var(--ps-secondary)]"
                          }`}
                        >
                          {available <= 0 ? "Out of stock" : `${available} available`}
                        </p>
                      ) : null}
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(product.id, qty - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--ps-surface-container-high)]"
                          aria-label="Decrease quantity"
                        >
                          <PsIcon name="remove" className="text-base" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(product.id, qty + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--ps-surface-container-high)]"
                          aria-label="Increase quantity"
                        >
                          <PsIcon name="add" className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="ml-auto text-xs font-semibold text-[var(--ps-error)]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-[var(--ps-outline-variant)] p-6">
            <div className="mb-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--ps-on-surface-variant)]">
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
                <span className="font-semibold text-[var(--ps-primary)]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ps-on-surface-variant)]">Shipping</span>
                <span className="font-semibold text-[var(--ps-primary)]">
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-[var(--ps-primary)]">Estimated total</span>
                <span className="text-[var(--ps-primary)]">${total.toFixed(2)}</span>
              </div>
            </div>
            {pointsEarned > 0 ? (
              <p className="mb-4 text-xs font-semibold text-[var(--ps-secondary)]">
                Earn +{pointsEarned} Pawsome Points with this order
              </p>
            ) : null}
            {checkoutError ? (
              <p className="mb-3 rounded-xl bg-[var(--ps-error-container)] px-3 py-2 text-xs text-[var(--ps-on-error-container)]">
                {checkoutError}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => void handleCheckout()}
              disabled={checkoutLoading || checkoutBlocked || availabilityLoading}
              className="block w-full rounded-xl bg-[var(--ps-primary)] py-4 text-center text-sm font-semibold text-[var(--ps-on-primary)] transition-all hover:bg-[var(--ps-primary-container)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {checkoutLoading ? "Reserving items…" : "Checkout"}
            </button>
            <p className="mt-2 text-center text-[10px] text-[var(--ps-on-surface-variant)]">
              Items are reserved for 15 minutes once checkout begins.
            </p>
            <button
              type="button"
              onClick={closeCart}
              disabled={checkoutLoading}
              className="mt-3 w-full py-2 text-center text-sm font-semibold text-[var(--ps-secondary)] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue shopping
            </button>
          </div>
        ) : null}
      </aside>
    </div>
      ) : null}
    </>
  );
}
