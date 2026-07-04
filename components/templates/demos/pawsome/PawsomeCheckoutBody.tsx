"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  classifyPetMarketApiError,
  completePetMarketCheckoutReservation,
  releasePetMarketCheckoutReservation,
  validatePetMarketCheckoutReservation,
} from "@/lib/templates/api/pet-market";
import { usePetMarketCheckoutReservation } from "@/lib/templates/pet-market-checkout/usePetMarketCheckoutReservation";
import { getPetMarketShopperIdentity } from "@/lib/templates/pet-market-checkout/shopper-identity";
import { PS_PATHS } from "./pawsomeConfig";
import { psCheckoutSession } from "./psCheckoutSession";
import {
  buildPsCompletedOrder,
  usePawsomeCart,
} from "./PawsomeCartContext";
import { usePawsomeAuth } from "./PawsomeAuthContext";
import {
  calcOrderTotals,
  FREE_SHIPPING_THRESHOLD,
  POINTS_REDEEM_COST,
  POINTS_REDEEM_VALUE,
} from "./pawsomeCartUtils";
import { PawsomeOrderLoadingState } from "./PawsomeOrderLoadingState";
import { PawsomeReservationTimer } from "./PawsomeReservationTimer";
import { PsIcon, PsPageWrap } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

const STEPS = [
  { n: 1, label: "Shipping" },
  { n: 2, label: "Payment" },
  { n: 3, label: "Review" },
] as const;

export function PawsomeCheckoutBody() {
  const router = useRouter();
  const { items, updateQty, removeFromCart, openCart, clearCart, setCompletedOrder } = usePawsomeCart();
  const { isLoggedIn, user } = usePawsomeAuth();
  const shopper = getPetMarketShopperIdentity(user);
  const {
    checkoutSessionId,
    loading: reservationLoading,
    expired,
    error: reservationError,
    expiresAt,
    setExpired,
    clearHold,
  } = usePetMarketCheckoutReservation(psCheckoutSession, PS_PATHS.databaseError);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [orderError, setOrderError] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (user?.name) setFullName(user.name);
  }, [user?.name]);

  const { subtotal, shipping, discount, total, pointsEarned } = calcOrderTotals(items, {
    redeemPoints,
  });

  const isEmpty = items.length === 0;

  useEffect(() => {
    if (reservationLoading || showSuccessModal) return;
    if (!checkoutSessionId && !isEmpty) {
      router.replace(PS_PATHS.shop);
    }
  }, [reservationLoading, checkoutSessionId, router, showSuccessModal, isEmpty]);

  async function handleCancelCheckout() {
    if (checkoutSessionId) {
      try {
        await releasePetMarketCheckoutReservation(checkoutSessionId);
      } catch {
        // Best-effort release.
      }
    }
    clearHold();
    router.push(PS_PATHS.shop);
  }

  async function handlePlaceOrder() {
    if (!checkoutSessionId || placingOrder || expired) return;

    setPlacingOrder(true);
    setOrderError(null);

    try {
      const validation = await validatePetMarketCheckoutReservation(checkoutSessionId);
      if (!validation.valid || validation.expired) {
        setExpired(true);
        setOrderError("Your reserved items have expired. Please return to your cart.");
        return;
      }

      const result = await completePetMarketCheckoutReservation(checkoutSessionId);
      const order = buildPsCompletedOrder(items, result.confirmation_number, {
        redeemPoints,
        shopper,
      });

      setConfirmationNumber(result.confirmation_number);
      setCompletedOrder(order);
      clearHold();
      clearCart();
      setShowSuccessModal(true);
      document.body.style.overflow = "hidden";
    } catch (error) {
      const outcome = classifyPetMarketApiError(error, "Could not place order");
      if (outcome.type === "redirect-database") {
        router.push(PS_PATHS.databaseError);
        return;
      }
      if (outcome.type === "reservation-expired" || outcome.type === "insufficient-stock") {
        setExpired(true);
        setOrderError(outcome.message);
        return;
      }
      setOrderError(outcome.message);
    } finally {
      setPlacingOrder(false);
    }
  }

  function closeSuccessModal() {
    setShowSuccessModal(false);
    document.body.style.overflow = "";
    router.push(PS_PATHS.checkoutSuccess);
  }

  if (reservationLoading) {
    return (
      <PawsomeOrderLoadingState
        title="Loading checkout"
        message="Confirming your reservation and preparing your order summary."
      />
    );
  }

  if (isEmpty && !showSuccessModal) {
    return (
      <main className="py-16 md:py-24">
        <PsPageWrap className="max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ps-surface-container-high)]">
            <PsIcon name="shopping_bag" className="text-3xl text-[var(--ps-on-surface-variant)]" />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--ps-primary)]" style={headline}>
            Your cart is empty
          </h1>
          <p className="mt-3 text-sm text-[var(--ps-on-surface-variant)]">
            Add items from the shop before checkout.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={PS_PATHS.shop}
              className="rounded-xl bg-[var(--ps-primary)] px-8 py-4 text-sm font-semibold text-[var(--ps-on-primary)]"
            >
              Browse shop
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="rounded-xl border border-[var(--ps-outline-variant)] px-8 py-4 text-sm font-semibold text-[var(--ps-primary)]"
            >
              Open cart
            </button>
          </div>
        </PsPageWrap>
      </main>
    );
  }

  if (!checkoutSessionId && !showSuccessModal) return null;

  return (
    <>
      <main className="py-8 md:py-12">
        <PsPageWrap>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-[var(--ps-primary)]" style={headline}>
              Checkout
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <p className="rounded-full bg-[var(--ps-surface-container-high)] px-4 py-1.5 text-xs font-semibold text-[var(--ps-primary)]">
                {shopper.isGuest ? "Guest checkout" : `Ordering as ${shopper.displayName}`}
              </p>
              <button
                type="button"
                onClick={() => void handleCancelCheckout()}
                className="text-sm font-semibold text-[var(--ps-on-surface-variant)] hover:text-[var(--ps-primary)]"
              >
                Cancel order
              </button>
            </div>
          </div>

          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-4">
              {STEPS.map(({ n, label }, idx) => (
                <div key={n} className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      step >= n
                        ? "bg-[var(--ps-secondary)] text-[var(--ps-on-secondary)]"
                        : "bg-[var(--ps-surface-container-high)] text-[var(--ps-on-surface-variant)]"
                    }`}
                  >
                    {step > n ? <PsIcon name="check" className="text-sm" /> : n}
                  </div>
                  <span
                    className={`hidden text-xs font-semibold sm:inline ${
                      step >= n ? "text-[var(--ps-primary)]" : "text-[var(--ps-on-surface-variant)]"
                    }`}
                  >
                    {label}
                  </span>
                  {idx < STEPS.length - 1 ? (
                    <div
                      className={`hidden h-0.5 w-8 sm:block md:w-12 ${step > n ? "bg-[var(--ps-secondary)]" : "bg-[var(--ps-surface-container-high)]"}`}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {reservationError ? (
            <div className="mb-6 rounded-xl border border-[var(--ps-error)] bg-[var(--ps-error-container)] px-4 py-3 text-sm text-[var(--ps-on-error-container)]">
              {reservationError}
            </div>
          ) : null}

          {expiresAt ? (
            <div className="mb-6">
              <PawsomeReservationTimer
                expiresAt={expiresAt}
                expired={expired}
                onExpired={() => setExpired(true)}
              />
            </div>
          ) : null}

          {expired ? (
            <div className="mb-6 rounded-xl border border-[var(--ps-error)] bg-[var(--ps-error-container)] px-4 py-4 text-sm text-[var(--ps-on-error-container)]">
              <p className="mb-3">Your reservation expired. Return to the shop to check availability.</p>
              <Link
                href={PS_PATHS.shop}
                onClick={clearHold}
                className="inline-block rounded-xl bg-[var(--ps-primary)] px-5 py-2 text-xs font-semibold text-[var(--ps-on-primary)]"
              >
                Back to shop
              </Link>
            </div>
          ) : null}

          {orderError ? (
            <div className="mb-6 rounded-xl border border-[var(--ps-error)] bg-[var(--ps-error-container)] px-4 py-3 text-sm text-[var(--ps-on-error-container)]">
              {orderError}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {step === 1 ? (
                <div className="space-y-4 rounded-xl bg-[var(--ps-surface-container-lowest)] p-6 shadow-[var(--ps-shadow)]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold text-[var(--ps-primary)]" style={headline}>
                      Shipping details
                    </h2>
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-[var(--ps-secondary)]">
                        <PsIcon name="local_shipping" className="text-sm" />
                        Free priority shipping applied
                      </span>
                    ) : null}
                  </div>
                  <input
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-[var(--ps-outline-variant)] px-4 py-3 text-sm"
                  />
                  <input
                    placeholder="Address line 1"
                    className="w-full rounded-xl border border-[var(--ps-outline-variant)] px-4 py-3 text-sm"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      placeholder="City"
                      className="rounded-xl border border-[var(--ps-outline-variant)] px-4 py-3 text-sm"
                    />
                    <input
                      placeholder="Postal code"
                      className="rounded-xl border border-[var(--ps-outline-variant)] px-4 py-3 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={expired}
                    className="w-full rounded-xl bg-[var(--ps-primary)] py-4 text-sm font-semibold text-[var(--ps-on-primary)] disabled:opacity-50"
                  >
                    Continue to payment
                  </button>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-4 rounded-xl bg-[var(--ps-surface-container-lowest)] p-6 shadow-[var(--ps-shadow)]">
                  <h2 className="text-lg font-semibold text-[var(--ps-primary)]" style={headline}>
                    Payment method
                  </h2>
                  <div className="rounded-xl border border-[var(--ps-outline-variant)] p-4">
                    <p className="text-sm font-semibold">Visa ending in 4242</p>
                    <p className="text-xs text-[var(--ps-on-surface-variant)]">Saved payment method</p>
                  </div>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-[var(--ps-surface-container-low)] p-4">
                  {isLoggedIn ? (
                    <>
                      <input
                        type="checkbox"
                        checked={redeemPoints}
                        onChange={(e) => setRedeemPoints(e.target.checked)}
                        className="accent-[var(--ps-secondary)]"
                      />
                      <span className="text-sm">
                        Redeem {POINTS_REDEEM_COST.toLocaleString()} points (${POINTS_REDEEM_VALUE} off)
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-[var(--ps-on-surface-variant)]">
                      <Link href={PS_PATHS.login} className="font-semibold text-[var(--ps-secondary)] hover:underline">
                        Sign in
                      </Link>{" "}
                      to redeem Pawsome Points at checkout.
                    </span>
                  )}
                </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-xl border border-[var(--ps-outline-variant)] py-4 text-sm font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={expired}
                      className="flex-1 rounded-xl bg-[var(--ps-primary)] py-4 text-sm font-semibold text-[var(--ps-on-primary)] disabled:opacity-50"
                    >
                      Review order
                    </button>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-4 rounded-xl bg-[var(--ps-surface-container-lowest)] p-6 shadow-[var(--ps-shadow)]">
                  <h2 className="text-lg font-semibold text-[var(--ps-primary)]" style={headline}>
                    Review &amp; confirm
                  </h2>
                  <button
                    type="button"
                    onClick={() => void handlePlaceOrder()}
                    disabled={placingOrder || expired || !checkoutSessionId}
                    className="w-full rounded-xl bg-[var(--ps-secondary)] py-4 text-sm font-semibold text-[var(--ps-on-secondary)] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                  >
                    {placingOrder ? "Placing order…" : `Place order · $${total.toFixed(2)}`}
                  </button>
                </div>
              ) : null}
            </div>

            <aside className="lg:col-span-5">
              <div className="sticky top-24 rounded-xl bg-[var(--ps-surface-container-lowest)] p-6 shadow-[var(--ps-shadow)]">
                <h2 className="text-lg font-semibold text-[var(--ps-primary)]" style={headline}>
                  Order summary
                </h2>
                <p className="mt-1 text-xs text-[var(--ps-on-surface-variant)]">
                  {shopper.isGuest ? "Placed by Guest" : `Placed by ${shopper.displayName}`}
                </p>
                <ul className="mt-4 space-y-4">
                  {items.map(({ product, qty }) => (
                    <li key={product.id} className="flex gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[var(--ps-primary)]">{product.name}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQty(product.id, qty - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--ps-surface-container-high)]"
                            aria-label="Decrease quantity"
                          >
                            <PsIcon name="remove" className="text-sm" />
                          </button>
                          <span className="w-5 text-center text-xs font-semibold">{qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(product.id, qty + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--ps-surface-container-high)]"
                            aria-label="Increase quantity"
                          >
                            <PsIcon name="add" className="text-sm" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="ml-auto text-xs font-semibold text-[var(--ps-error)] hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="shrink-0 text-sm font-semibold">
                        ${(product.price * qty).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 space-y-2 border-t border-[var(--ps-outline-variant)] pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--ps-on-surface-variant)]">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--ps-on-surface-variant)]">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {redeemPoints ? (
                    <div className="flex justify-between text-[var(--ps-secondary)]">
                      <span>Points discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                {pointsEarned > 0 ? (
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-[color-mix(in_srgb,var(--ps-secondary-container)_15%,transparent)] p-3">
                    <PsIcon name="military_tech" filled className="text-[var(--ps-secondary)]" />
                    <span className="text-xs font-semibold text-[var(--ps-secondary)]">
                      Earn +{pointsEarned} points with this order
                    </span>
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        </PsPageWrap>
      </main>

      {placingOrder ? (
        <PawsomeOrderLoadingState
          overlay
          title="Placing your order"
          message="Almost there — we're confirming your purchase and updating inventory."
        />
      ) : null}

      {showSuccessModal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-[var(--ps-primary)]/30 backdrop-blur-sm"
            onClick={closeSuccessModal}
            aria-label="Close order confirmation"
          />
          <div
            className="relative w-full max-w-md rounded-xl bg-[var(--ps-surface-container-lowest)] p-8 text-center shadow-2xl md:p-10"
            role="dialog"
            aria-labelledby="ps-order-success-title"
            aria-modal="true"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--ps-secondary-container)_25%,transparent)]">
              <PsIcon name="check_circle" filled className="text-3xl text-[var(--ps-secondary)]" />
            </div>
            <h2 id="ps-order-success-title" className="text-2xl font-bold text-[var(--ps-primary)]" style={headline}>
              Order confirmed
            </h2>
            <p className="mt-2 text-sm text-[var(--ps-on-surface-variant)]">
              {shopper.isGuest
                ? "Thank you, Guest! Your order has been placed and inventory updated."
                : `Thank you, ${shopper.displayName}! Your order has been placed and inventory updated.`}
            </p>
            <div className="mt-6 rounded-xl bg-[var(--ps-surface-container-low)] p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ps-on-surface-variant)]">
                Confirmation number
              </p>
              <p className="mt-2 text-xl font-bold tracking-wide text-[var(--ps-primary)]" style={headline}>
                {confirmationNumber}
              </p>
              <p className="mt-2 text-xs text-[var(--ps-on-surface-variant)]">
                Total charged: ${total.toFixed(2)}
              </p>
            </div>
            <button
              type="button"
              onClick={closeSuccessModal}
              className="mt-6 w-full rounded-xl bg-[var(--ps-primary)] py-4 text-sm font-semibold text-[var(--ps-on-primary)]"
            >
              View order details
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
