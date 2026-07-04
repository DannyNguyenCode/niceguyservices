"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import {
  classifyPetMarketApiError,
  createPetMarketCheckoutReservation,
  releasePetMarketCheckoutReservation,
  validatePetMarketCheckoutReservation,
} from "@/lib/templates/api/pet-market";
import { usePetMarketCartAvailability } from "@/lib/templates/pet-market-checkout/usePetMarketCartAvailability";
import { getPetMarketShopperIdentity } from "@/lib/templates/pet-market-checkout/shopper-identity";
import type { Product } from "./companionPetData";
import { CP_PATHS } from "./companionPetConfig";
import { useCompanionPetAuth } from "./CompanionPetAuthContext";
import { CompanionPetOrderLoadingState } from "./CompanionPetOrderLoadingState";
import {
  cpCheckoutSession,
} from "./cpCheckoutSession";

export type CartItem = { product: Product; qty: number };

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
};

export function CartDrawer({ open, onClose, items, onUpdateQty }: CartDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { issues, checkoutBlocked, availabilityById, loading: availabilityLoading, error: availabilityError, refresh } =
    usePetMarketCartAvailability(items, CP_PATHS.databaseError);
  const { user } = useCompanionPetAuth();
  const shopper = getPetMarketShopperIdentity(user);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const points = items.reduce((s, i) => s + i.product.loyaltyPoints * i.qty, 0);

  useEffect(() => {
    const staleHoldId = cpCheckoutSession.getCheckoutHoldId();
    if (!staleHoldId) return;

    void (async () => {
      try {
        const status = await validatePetMarketCheckoutReservation(staleHoldId);
        if (!status.valid || status.expired) {
          cpCheckoutSession.clearCheckoutHoldId();
          try {
            await releasePetMarketCheckoutReservation(staleHoldId);
          } catch {
            // Hold may already be released or expired.
          }
          await refresh();
        }
      } catch {
        cpCheckoutSession.clearCheckoutHoldId();
      }
    })();
  }, [refresh]);

  useEffect(() => {
    if (!checkoutLoading) return;
    if (pathname.startsWith(CP_PATHS.checkout) || pathname === CP_PATHS.databaseError) {
      setCheckoutLoading(false);
    }
  }, [pathname, checkoutLoading]);

  async function handleCheckout() {
    if (items.length === 0 || checkoutBlocked || checkoutLoading) return;

    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const sessionId = cpCheckoutSession.getOrCreateShopperSessionId();
      const reservation = await createPetMarketCheckoutReservation({
        session_id: sessionId,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.qty,
        })),
      });

      cpCheckoutSession.setCheckoutHoldId(reservation.checkout_session_id);
      onClose();
      router.push(cpCheckoutSession.buildCheckoutHref(reservation.checkout_session_id));
    } catch (error) {
      setCheckoutLoading(false);
      const outcome = classifyPetMarketApiError(error, "Could not start checkout");
      if (outcome.type === "redirect-database") {
        router.push(CP_PATHS.databaseError);
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
        <CompanionPetOrderLoadingState
          overlay
          title="Preparing checkout"
          message="Reserving your items for the next 15 minutes. Hang tight while we get everything ready."
        />
      ) : null}
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/30"
            onClick={() => {
              if (!checkoutLoading) onClose();
            }}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col bg-[var(--cp-white)] shadow-2xl"
          >
            <div className="border-b border-[var(--cp-border)] px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" aria-hidden />
                  <h2 className="text-lg font-semibold">Your cart</h2>
                  <span className="rounded-full bg-[var(--cp-warm-gray)] px-2 py-0.5 text-xs">
                    {items.reduce((s, i) => s + i.qty, 0)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={checkoutLoading}
                  className="disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {items.length > 0 ? (
                <p className="mt-2 text-xs text-[var(--cp-slate)]">
                  {shopper.isGuest ? (
                    <>
                      Shopping as <span className="font-semibold text-[var(--cp-charcoal)]">Guest</span>
                    </>
                  ) : (
                    <>
                      Shopping as{" "}
                      <span className="font-semibold text-[var(--cp-charcoal)]">{shopper.displayName}</span>
                    </>
                  )}
                </p>
              ) : null}
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {availabilityLoading ? (
                <p className="mb-4 flex items-center gap-2 text-xs text-[var(--cp-slate)]">
                  <span className="material-symbols-outlined animate-spin text-base" aria-hidden>
                    progress_activity
                  </span>
                  Checking stock availability…
                </p>
              ) : null}
              {availabilityError ? (
                <p className="mb-4 rounded-xl bg-[var(--cp-orange-muted)] px-3 py-2 text-xs text-[var(--cp-orange)]">
                  {availabilityError}
                </p>
              ) : null}

              {issues.length > 0 ? (
                <div className="mb-4 rounded-xl border border-[var(--cp-orange)] bg-[var(--cp-orange-muted)] px-3 py-2 text-xs text-[var(--cp-charcoal)]">
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
                <p className="py-12 text-center text-sm text-[var(--cp-slate)]">Your cart is empty</p>
              ) : (
                <ul className="space-y-4">
                  {items.map(({ product, qty }) => {
                    const available = availabilityById[product.id];
                    return (
                      <li key={product.id} className="flex gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={product.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-[var(--cp-slate)]">{product.brand}</p>
                          <p className="mt-1 text-sm font-semibold">${product.price.toFixed(2)}</p>
                          {typeof available === "number" ? (
                            <p
                              className={`mt-1 text-[10px] font-medium ${
                                available <= 0 ? "text-[var(--cp-orange)]" : "text-[var(--cp-green)]"
                              }`}
                            >
                              {available <= 0 ? "Out of stock" : `${available} available`}
                            </p>
                          ) : null}
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(product.id, Math.max(0, qty - 1))}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--cp-border)]"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm">{qty}</span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(product.id, qty + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--cp-border)]"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
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
              <div className="border-t border-[var(--cp-border)] p-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--cp-slate)]">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <p className="mt-1 text-xs text-[var(--cp-green)]">Earn +{points} loyalty points</p>
                {checkoutError ? (
                  <p className="mt-3 rounded-xl bg-[var(--cp-orange-muted)] px-3 py-2 text-xs text-[var(--cp-orange)]">
                    {checkoutError}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => void handleCheckout()}
                  disabled={checkoutLoading || checkoutBlocked || availabilityLoading}
                  className="mt-4 block w-full rounded-2xl bg-[var(--cp-charcoal)] py-3.5 text-center text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {checkoutLoading ? "Reserving items…" : "Checkout"}
                </button>
                <p className="mt-2 text-center text-[10px] text-[var(--cp-slate)]">
                  Items are reserved for 15 minutes once checkout begins.
                </p>
              </div>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
    </>
  );
}
