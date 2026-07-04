"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  classifyPetMarketApiError,
  completePetMarketCheckoutReservation,
  releasePetMarketCheckoutReservation,
  validatePetMarketCheckoutReservation,
} from "@/lib/templates/api/pet-market";
import { usePetMarketCheckoutReservation } from "@/lib/templates/pet-market-checkout/usePetMarketCheckoutReservation";
import { getPetMarketShopperIdentity } from "@/lib/templates/pet-market-checkout/shopper-identity";
import { CheckoutProgress } from "./CheckoutProgress";
import { CompanionPetOrderLoadingState } from "./CompanionPetOrderLoadingState";
import { CompanionPetReservationTimer } from "./CompanionPetReservationTimer";
import { CP_LOYALTY } from "./companionPetData";
import { CP_PATHS } from "./companionPetConfig";
import { cpCheckoutSession } from "./cpCheckoutSession";
import { useCompanionPetAuth } from "./CompanionPetAuthContext";
import { useCompanionPetCart } from "./CompanionPetShell";

export function CompanionPetCheckoutBody() {
  const router = useRouter();
  const { items, clearCart } = useCompanionPetCart();
  const { isLoggedIn, user } = useCompanionPetAuth();
  const shopper = getPetMarketShopperIdentity(user);
  const {
    checkoutSessionId,
    loading: reservationLoading,
    expired,
    error: reservationError,
    expiresAt,
    setExpired,
    clearHold,
  } = usePetMarketCheckoutReservation(cpCheckoutSession, CP_PATHS.databaseError);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [chargedTotal, setChargedTotal] = useState(0);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const discount = redeemPoints ? 10 : 0;
  const total = subtotal - discount;
  const pointsEarned = items.reduce((s, i) => s + i.product.loyaltyPoints * i.qty, 0);

  useEffect(() => {
    if (user?.name) setFullName(user.name);
    if (user?.email) setEmail(user.email);
  }, [user?.name, user?.email]);

  useEffect(() => {
    if (reservationLoading) return;
    if (!checkoutSessionId && !showSuccessModal && items.length === 0) {
      router.replace(CP_PATHS.shop);
    } else if (!checkoutSessionId && !showSuccessModal) {
      router.replace(CP_PATHS.shop);
    }
  }, [reservationLoading, checkoutSessionId, router, showSuccessModal, items.length]);

  async function handleCancelCheckout() {
    if (checkoutSessionId) {
      try {
        await releasePetMarketCheckoutReservation(checkoutSessionId);
      } catch {
        // Best-effort release.
      }
    }
    clearHold();
    router.push(CP_PATHS.shop);
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

      setConfirmationNumber(result.confirmation_number);
      setChargedTotal(total);
      clearHold();
      clearCart();
      setShowSuccessModal(true);
      document.body.style.overflow = "hidden";
    } catch (error) {
      const outcome = classifyPetMarketApiError(error, "Could not place order");
      if (outcome.type === "redirect-database") {
        router.push(CP_PATHS.databaseError);
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
    router.push(CP_PATHS.shop);
  }

  if (reservationLoading) {
    return (
      <CompanionPetOrderLoadingState
        title="Loading checkout"
        message="Confirming your reservation and preparing your order summary."
      />
    );
  }

  if (!checkoutSessionId && !showSuccessModal) return null;

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-[var(--cp-charcoal)]">Checkout</h1>
          <div className="flex flex-wrap items-center gap-3">
            <p className="rounded-full bg-[var(--cp-warm-gray)] px-4 py-1.5 text-xs font-semibold text-[var(--cp-charcoal)]">
              {shopper.isGuest ? "Guest checkout" : `Ordering as ${shopper.displayName}`}
            </p>
            <button
              type="button"
              onClick={() => void handleCancelCheckout()}
              className="text-sm text-[var(--cp-slate)] hover:text-[var(--cp-charcoal)]"
            >
              Cancel order
            </button>
          </div>
        </div>

        <CheckoutProgress step={step} />

        {reservationError ? (
          <div className="mb-6 rounded-2xl border border-[var(--cp-orange)] bg-[var(--cp-orange-muted)] px-4 py-3 text-sm">
            {reservationError}
          </div>
        ) : null}

        {expiresAt ? (
          <div className="mb-6">
            <CompanionPetReservationTimer
              expiresAt={expiresAt}
              expired={expired}
              onExpired={() => setExpired(true)}
            />
          </div>
        ) : null}

        {expired ? (
          <div className="mb-6 rounded-2xl border border-[var(--cp-orange)] bg-[var(--cp-orange-muted)] px-4 py-4 text-sm">
            <p className="mb-3">Your reservation expired. Return to the shop to check availability.</p>
            <Link
              href={CP_PATHS.shop}
              onClick={clearHold}
              className="inline-block rounded-2xl bg-[var(--cp-charcoal)] px-5 py-2 text-xs font-semibold text-white"
            >
              Back to shop
            </Link>
          </div>
        ) : null}

        {orderError ? (
          <div className="mb-6 rounded-2xl border border-[var(--cp-orange)] bg-[var(--cp-orange-muted)] px-4 py-3 text-sm">
            {orderError}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="cp-card space-y-4 rounded-2xl p-6"
                >
                  <h2 className="font-semibold">Shipping</h2>
                  <input
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-[var(--cp-border)] px-4 py-3 text-sm"
                  />
                  <input
                    placeholder="Address"
                    className="w-full rounded-xl border border-[var(--cp-border)] px-4 py-3 text-sm"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      placeholder="City"
                      className="rounded-xl border border-[var(--cp-border)] px-4 py-3 text-sm"
                    />
                    <input
                      placeholder="Postal code"
                      className="rounded-xl border border-[var(--cp-border)] px-4 py-3 text-sm"
                    />
                  </div>
                  <input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[var(--cp-border)] px-4 py-3 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={expired}
                    className="w-full rounded-2xl bg-[var(--cp-charcoal)] py-3 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Continue to payment
                  </button>
                </motion.div>
              ) : null}

              {step === 2 ? (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="cp-card space-y-4 rounded-2xl p-6"
                >
                  <h2 className="font-semibold">Payment</h2>
                  <div className="rounded-xl border border-[var(--cp-border)] p-4">
                    <p className="text-sm font-medium">Visa ending in 4242</p>
                    <p className="text-xs text-[var(--cp-slate)]">Saved payment method</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-2xl border border-[var(--cp-border)] py-3 text-sm"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={expired}
                      className="flex-1 rounded-2xl bg-[var(--cp-charcoal)] py-3 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      Review order
                    </button>
                  </div>
                </motion.div>
              ) : null}

              {step === 3 ? (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="cp-card space-y-4 rounded-2xl p-6"
                >
                  <h2 className="font-semibold">Review</h2>
                  <ul className="space-y-3">
                    {items.map(({ product, qty }) => (
                      <li key={product.id} className="flex justify-between text-sm">
                        <span>
                          {product.name} × {qty}
                        </span>
                        <span>${(product.price * qty).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <label className="flex items-center gap-3 rounded-xl bg-[var(--cp-orange-muted)] p-4">
                    {isLoggedIn ? (
                      <>
                        <input
                          type="checkbox"
                          checked={redeemPoints}
                          onChange={(e) => setRedeemPoints(e.target.checked)}
                          className="h-4 w-4 accent-[var(--cp-orange)]"
                        />
                        <span className="text-sm">
                          Redeem 1,000 points for $10 off ({CP_LOYALTY.points} available)
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-[var(--cp-slate)]">
                        <Link href={CP_PATHS.login} className="font-semibold text-[var(--cp-blue)] hover:underline">
                          Sign in
                        </Link>{" "}
                        to redeem loyalty points at checkout.
                      </span>
                    )}
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 rounded-2xl border border-[var(--cp-border)] py-3 text-sm"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => void handlePlaceOrder()}
                      disabled={placingOrder || expired || !checkoutSessionId}
                      className="flex-1 rounded-2xl bg-[var(--cp-green)] py-3 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {placingOrder ? "Placing order…" : "Place order"}
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <aside className="lg:col-span-2">
            <div className="cp-card sticky top-28 rounded-2xl p-6">
              <h2 className="font-semibold">Order summary</h2>
              <p className="mt-1 text-xs text-[var(--cp-slate)]">
                {shopper.isGuest ? "Placed by Guest" : `Placed by ${shopper.displayName}`}
              </p>
              <ul className="mt-4 space-y-3 border-b border-[var(--cp-border)] pb-4">
                {items.map(({ product, qty }) => (
                  <li key={product.id} className="flex gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{product.name}</p>
                      <p className="text-xs text-[var(--cp-slate)]">Qty {qty}</p>
                    </div>
                    <p className="text-sm font-medium">${(product.price * qty).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--cp-slate)]">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 ? (
                  <div className="flex justify-between text-[var(--cp-orange)]">
                    <span>Points redeemed</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between border-t border-[var(--cp-border)] pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-[var(--cp-green)]">Earn +{pointsEarned} points on this order</p>
            </div>
          </aside>
        </div>
      </main>

      {placingOrder ? (
        <CompanionPetOrderLoadingState
          overlay
          title="Placing your order"
          message="Almost there — we're confirming your purchase and updating inventory."
        />
      ) : null}

      {showSuccessModal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeSuccessModal}
            aria-label="Close order confirmation"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="cp-card relative w-full max-w-md rounded-2xl p-8 text-center md:p-10"
            role="dialog"
            aria-labelledby="cp-order-success-title"
            aria-modal="true"
          >
            <span className="material-symbols-outlined text-5xl text-[var(--cp-green)]" aria-hidden>
              check_circle
            </span>
            <h2 id="cp-order-success-title" className="mt-4 text-2xl font-semibold">
              Order confirmed
            </h2>
            <p className="mt-2 text-sm text-[var(--cp-slate)]">
              {shopper.isGuest ? (
                <>
                  Thank you, Guest! Confirmation sent to{" "}
                  <span className="font-medium text-[var(--cp-charcoal)]">
                    {email.trim() || "the email you provided"}
                  </span>
                  .
                </>
              ) : (
                <>
                  Thank you, {shopper.displayName}! Confirmation sent to{" "}
                  <span className="font-medium text-[var(--cp-charcoal)]">
                    {email.trim() || shopper.email || "your email"}
                  </span>
                  .
                </>
              )}{" "}
              You earned +{pointsEarned} loyalty points.
            </p>
            <div className="mt-6 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-warm-gray)]/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--cp-slate)]">
                Confirmation number
              </p>
              <p className="mt-2 text-xl font-semibold tracking-wide text-[var(--cp-charcoal)]">
                {confirmationNumber}
              </p>
              <p className="mt-2 text-xs text-[var(--cp-slate)]">
                Total charged: ${chargedTotal.toFixed(2)}
              </p>
            </div>
            <button
              type="button"
              onClick={closeSuccessModal}
              className="mt-6 w-full rounded-2xl bg-[var(--cp-charcoal)] py-3.5 text-sm font-semibold text-white"
            >
              Back to shop
            </button>
          </motion.div>
        </div>
      ) : null}
    </>
  );
}
