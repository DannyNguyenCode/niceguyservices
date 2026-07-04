"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SPM_PATHS } from "./saturdayPetMarketConfig";
import { SPM_IMG } from "./saturdayPetMarketImages";
import { calcSpmCartTotals, formatSpmPrice } from "./saturdayPetMarketData";
import { useSpmRequireAuth } from "./SaturdayPetMarketAuthContext";
import { useSpmCart } from "./SaturdayPetMarketCartContext";
import { SaturdayPetMarketReservationTimer } from "./SaturdayPetMarketReservationTimer";
import { useSpmCheckoutReservation } from "./useSpmCheckoutReservation";
import { SpmContainer, SpmIcon, SpmImg } from "./SaturdayPetMarketShared";
import {
  classifyPetMarketApiError,
  completePetMarketCheckoutReservation,
  releasePetMarketCheckoutReservation,
  validatePetMarketCheckoutReservation,
} from "@/lib/templates/api/pet-market";

const STEPS = ["Contact", "Delivery", "Payment", "Review"] as const;
const STEP_TITLES = ["Delivery", "Payment", "Review Order"];

const DELIVERY_OPTIONS = [
  {
    id: "local",
    icon: "delivery_dining",
    title: "Local Delivery",
    desc: "Arrives Today by 5pm. Our shop van brings it to your porch!",
    price: 4.99,
  },
  {
    id: "pickup",
    icon: "store",
    title: "Store Pickup",
    desc: "Ready in 2 hours at the corner of 5th and Main St.",
    price: 0,
    free: true,
  },
  {
    id: "ship",
    icon: "package_2",
    title: "Standard Ship",
    desc: "Delivered via Pet-Mail in 3-5 business days.",
    price: 8.5,
  },
] as const;

export function SaturdayPetMarketCheckoutBody() {
  const router = useRouter();
  const { hydrated } = useSpmRequireAuth();
  const { items, clearCart } = useSpmCart();
  const {
    checkoutSessionId,
    loading: reservationLoading,
    expired,
    error: reservationError,
    expiresAt,
    setExpired,
    clearHold,
  } = useSpmCheckoutReservation();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [deliveryId, setDeliveryId] = useState<(typeof DELIVERY_OPTIONS)[number]["id"]>("local");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [chargedTotal, setChargedTotal] = useState(0);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const deliveryOption = DELIVERY_OPTIONS.find((opt) => opt.id === deliveryId) ?? DELIVERY_OPTIONS[0];
  const { subtotal, tax, total: merchandiseTotal } = calcSpmCartTotals(items);
  const delivery = deliveryOption.price;
  const total = Math.round((merchandiseTotal + delivery) * 100) / 100;

  useEffect(() => {
    if (!hydrated || reservationLoading) return;
    if (!checkoutSessionId && !showSuccessModal) {
      router.replace(SPM_PATHS.cart);
    }
  }, [hydrated, reservationLoading, checkoutSessionId, router, showSuccessModal]);

  async function handleCancelCheckout() {
    if (checkoutSessionId) {
      try {
        await releasePetMarketCheckoutReservation(checkoutSessionId);
      } catch {
        // Best-effort release when shopper leaves checkout.
      }
    }
    clearHold();
    router.push(SPM_PATHS.cart);
  }

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goPrev = () => setStep((s) => Math.max(s - 1, 0));

  async function handlePlaceOrder() {
    if (!checkoutSessionId || placingOrder || expired) return;

    setPlacingOrder(true);
    setOrderError(null);

    try {
      const validation = await validatePetMarketCheckoutReservation(checkoutSessionId);
      if (!validation.valid || validation.expired) {
        setExpired(true);
        setOrderError(
          "Your reserved items have expired. Please return to your cart to check availability.",
        );
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
      if (outcome.type === "redirect-database") return;
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
  }

  const confirmationEmail = email.trim() || "your email address";
  const receiptLines = useMemo(
    () =>
      items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        qty: item.qty,
        unit: item.product.salePrice ?? item.product.price,
      })),
    [items],
  );

  if (!hydrated || reservationLoading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center px-[var(--spm-margin)] py-16">
        <SpmIcon name="progress_activity" className="animate-spin text-5xl text-[var(--spm-primary)]" />
      </main>
    );
  }

  if (!checkoutSessionId && !showSuccessModal) return null;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--spm-outline-variant)] bg-[var(--spm-background)] px-[var(--spm-margin)] py-2 shadow-sm">
        <SpmContainer className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SpmIcon name="pets" className="spm-headline-lg text-[var(--spm-secondary)]" />
            <h1 className="spm-headline-lg text-[var(--spm-secondary)]">Pet Market</h1>
          </div>
          <button
            type="button"
            onClick={() => void handleCancelCheckout()}
            className="spm-label-sm flex items-center gap-1 text-[var(--spm-on-surface-variant)] hover:text-[var(--spm-primary)]"
          >
            <SpmIcon name="close" />
            Cancel Order
          </button>
        </SpmContainer>
      </header>

      <main className="px-[var(--spm-margin)] py-16">
        <SpmContainer className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-8">
            <nav className="relative flex items-center justify-between px-2">
              <div className="absolute left-0 top-1/2 -z-10 h-0.5 w-full -translate-y-1/2 bg-[var(--spm-outline-variant)]" />
              {STEPS.map((label, i) => (
                <div
                  key={label}
                  className={`flex flex-col items-center gap-1 bg-[var(--spm-background)] px-2 ${i <= step ? "spm-step-active" : "spm-step-inactive"}`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                      i <= step
                        ? "bg-[var(--spm-primary)] text-[var(--spm-on-primary)] shadow-md"
                        : "bg-[var(--spm-surface-container-highest)] text-[var(--spm-on-surface-variant)]"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`spm-label-sm ${i <= step ? "text-[var(--spm-primary)]" : ""}`}>{label}</span>
                </div>
              ))}
            </nav>

            {reservationError ? (
              <div className="rounded-lg border border-[var(--spm-error)] bg-[var(--spm-error-container)] px-4 py-3 text-[var(--spm-on-error-container)]">
                {reservationError}
              </div>
            ) : null}

            {expiresAt ? (
              <SaturdayPetMarketReservationTimer
                expiresAt={expiresAt}
                expired={expired}
                onExpired={() => setExpired(true)}
              />
            ) : null}

            {expired ? (
              <div className="rounded-lg border border-[var(--spm-error)] bg-[var(--spm-error-container)] px-4 py-4">
                <p className="spm-body-md mb-4 text-[var(--spm-on-error-container)]">
                  Your reserved items have expired. Please return to your cart to check availability.
                </p>
                <Link
                  href={SPM_PATHS.cart}
                  onClick={clearHold}
                  className="spm-label-sm inline-flex items-center gap-2 rounded-full bg-[var(--spm-primary)] px-5 py-2 font-bold text-[var(--spm-on-primary)]"
                >
                  Return to Cart
                </Link>
              </div>
            ) : null}

            {orderError ? (
              <div className="rounded-lg border border-[var(--spm-error)] bg-[var(--spm-error-container)] px-4 py-3 text-[var(--spm-on-error-container)]">
                {orderError}
              </div>
            ) : null}

            {step === 0 ? (
              <section className="rounded-lg border border-[var(--spm-outline-variant)] bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-2">
                  <SpmIcon name="contact_page" className="text-[var(--spm-tertiary)]" />
                  <h2 className="spm-headline-md">Contact Information</h2>
                </div>
                <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[
                    { label: "First Name", placeholder: "e.g. Buster" },
                    { label: "Last Name", placeholder: "e.g. Barkington" },
                  ].map((f) => (
                    <div key={f.label} className="flex flex-col gap-1">
                      <label className="spm-label-sm ml-2 text-[var(--spm-on-surface-variant)]">{f.label}</label>
                      <input
                        className="spm-input-focus-ring spm-body-md rounded-full border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] px-4 py-2"
                        placeholder={f.placeholder}
                        type="text"
                      />
                    </div>
                  ))}
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="spm-label-sm ml-2 text-[var(--spm-on-surface-variant)]">Email Address</label>
                    <input
                      className="spm-input-focus-ring spm-body-md rounded-full border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] px-4 py-2"
                      placeholder="buster@goodboy.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </form>
              </section>
            ) : null}

            {step === 1 ? (
              <section className="rounded-lg border border-[var(--spm-outline-variant)] bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-2">
                  <SpmIcon name="local_shipping" className="text-[var(--spm-tertiary)]" />
                  <h2 className="spm-headline-md">Delivery Method</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {DELIVERY_OPTIONS.map((opt) => {
                    const selected = deliveryId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDeliveryId(opt.id)}
                        className={`group flex cursor-pointer flex-col gap-3 rounded-lg border-2 p-6 text-left transition-all hover:shadow-md ${
                          selected
                            ? "border-[var(--spm-primary)] bg-[var(--spm-primary-container)]/10"
                            : "border-[var(--spm-outline-variant)] hover:border-[var(--spm-tertiary)] hover:bg-[var(--spm-tertiary-fixed)]/20"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <SpmIcon name={opt.icon} className="spm-headline-lg text-[var(--spm-primary)]" />
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                              selected ? "border-[var(--spm-primary)]" : "border-[var(--spm-outline-variant)]"
                            }`}
                          >
                            {selected ? <div className="h-2.5 w-2.5 rounded-full bg-[var(--spm-primary)]" /> : null}
                          </div>
                        </div>
                        <h3 className="font-bold text-[var(--spm-on-surface)]">{opt.title}</h3>
                        <p className="spm-label-sm text-[var(--spm-on-surface-variant)]">{opt.desc}</p>
                        <span className={`spm-label-price mt-auto ${opt.price === 0 ? "text-[var(--spm-tertiary)]" : "text-[var(--spm-primary)]"}`}>
                          {opt.price === 0 ? "FREE" : formatSpmPrice(opt.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {step === 2 ? (
              <section className="rounded-lg border border-[var(--spm-outline-variant)] bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-2">
                  <SpmIcon name="payments" className="text-[var(--spm-tertiary)]" />
                  <h2 className="spm-headline-md">Payment Details</h2>
                </div>
                <div className="mb-6 flex items-center justify-between rounded-lg bg-[var(--spm-surface-container-low)] p-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-sm border border-[var(--spm-outline-variant)] bg-white p-1">
                      <Image src={SPM_IMG.checkout.visa} alt="Visa" width={32} height={16} className="h-4 w-auto" />
                    </div>
                    <p className="spm-body-md">Ending in **** 1234</p>
                  </div>
                  <button type="button" className="spm-label-sm text-[var(--spm-primary)] underline">
                    Change Card
                  </button>
                </div>
              </section>
            ) : null}

            {step === 3 ? (
              <section className="rounded-lg border border-[var(--spm-outline-variant)] bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-2">
                  <SpmIcon name="verified" className="text-[var(--spm-tertiary)]" />
                  <h2 className="spm-headline-md">Final Review</h2>
                </div>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-start gap-4 border-b border-[var(--spm-outline-variant)]/30 p-2">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--spm-surface-container)]">
                        <SpmImg
                          variant="productThumb"
                          src={item.product.image}
                          alt={item.product.name}
                          frameClassName="h-16 w-16"
                        />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <h4 className="font-bold">{item.product.name}</h4>
                        <p className="spm-label-sm text-[var(--spm-on-surface-variant)]">
                          Qty: {item.qty} • {formatSpmPrice(item.product.salePrice ?? item.product.price)} ea
                        </p>
                      </div>
                      <span className="spm-label-price">
                        {formatSpmPrice((item.product.salePrice ?? item.product.price) * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="flex items-center justify-between pt-4">
              {step > 0 ? (
                <button type="button" onClick={goPrev} className="spm-label-sm flex items-center gap-1 text-[var(--spm-on-surface-variant)] hover:text-[var(--spm-primary)]">
                  <SpmIcon name="arrow_back" />
                  Back
                </button>
              ) : (
                <span />
              )}
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={expired}
                  className="spm-coupon-button flex items-center gap-4 rounded-lg bg-[var(--spm-primary)] px-8 py-4 font-bold text-[var(--spm-on-primary)] shadow-[4px_4px_0px_#003636] hover:shadow-[2px_2px_0px_#003636] disabled:opacity-50"
                >
                  Next: {STEP_TITLES[step]}
                  <SpmIcon name="arrow_forward" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void handlePlaceOrder()}
                  disabled={placingOrder || expired || !checkoutSessionId}
                  className="spm-coupon-button flex items-center gap-4 rounded-lg bg-[var(--spm-secondary)] px-8 py-4 font-bold text-[var(--spm-on-secondary)] shadow-[4px_4px_0px_#410007] hover:shadow-[2px_2px_0px_#410007] disabled:opacity-60"
                >
                  {placingOrder ? "Placing Order..." : "Place Order"}
                  <SpmIcon name="celebration" />
                </button>
              )}
            </div>
          </div>

          <aside className="h-fit lg:col-span-4">
            <div className="spm-receipt-jagged relative flex min-h-[500px] flex-col overflow-hidden border border-[var(--spm-outline-variant)] bg-white p-6 font-mono shadow-lg">
              <div className="mb-6 space-y-1 text-center">
                <h3 className="spm-headline-md tracking-tighter text-[var(--spm-primary)]">SATURDAY MORNING</h3>
                <p className="spm-label-sm uppercase tracking-widest text-[var(--spm-on-surface-variant)]">Pet Market &amp; Provisions</p>
              </div>
              <div className="spm-stripe-divider mb-6 h-0.5 w-full" />
              <div className="mb-6 flex-grow space-y-2 spm-body-md">
                {receiptLines.map((item) => (
                  <div key={item.id} className="flex justify-between gap-2">
                    <span className="uppercase">{item.name.slice(0, 22)} (x{item.qty})</span>
                    <span>{formatSpmPrice(item.unit * item.qty)}</span>
                  </div>
                ))}
                <div className="flex justify-between italic text-[var(--spm-on-surface-variant)]">
                  <span>{deliveryOption.title.toUpperCase()}</span>
                  <span>{formatSpmPrice(delivery)}</span>
                </div>
              </div>
              <div className="space-y-1 border-t border-dashed border-[var(--spm-outline-variant)] py-4">
                <div className="flex justify-between spm-body-md">
                  <span>SUBTOTAL</span>
                  <span>{formatSpmPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between spm-body-md">
                  <span>SALES TAX</span>
                  <span>{formatSpmPrice(tax)}</span>
                </div>
                <div className="spm-headline-md mt-4 flex justify-between border-t border-double border-[var(--spm-outline)] pt-4 font-bold text-[var(--spm-secondary)]">
                  <span>TOTAL DUE</span>
                  <span>{formatSpmPrice(total)}</span>
                </div>
              </div>
            </div>
          </aside>
        </SpmContainer>
      </main>

      {showSuccessModal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-[var(--spm-margin)]">
          <button
            type="button"
            className="absolute inset-0 bg-[var(--spm-on-background)]/40 backdrop-blur-sm"
            onClick={closeSuccessModal}
            aria-label="Close order confirmation"
          />
          <div
            className="spm-sticker-shadow relative w-full max-w-md rounded-lg border-4 border-[var(--spm-secondary)] bg-[var(--spm-background)] p-8 text-center md:p-12"
            role="dialog"
            aria-labelledby="spm-order-success-title"
            aria-modal="true"
          >
            <h2 id="spm-order-success-title" className="spm-headline-xl mb-4 text-[var(--spm-secondary)]">
              Thanks for Your Order!
            </h2>
            <p className="spm-body-lg mb-6 text-[var(--spm-on-surface-variant)]">
              Inventory updated — your treats are on the way. Confirmation sent to{" "}
              <span className="font-semibold text-[var(--spm-primary)]">{confirmationEmail}</span>.
            </p>
            <div className="spm-receipt-jagged mb-8 rounded-lg border border-[var(--spm-outline-variant)] bg-white p-6 font-mono">
              <p className="spm-label-sm mb-2 uppercase tracking-widest text-[var(--spm-on-surface-variant)]">
                Confirmation Number
              </p>
              <p className="spm-headline-lg tracking-wider text-[var(--spm-primary)]">{confirmationNumber}</p>
              <p className="spm-label-sm mt-3 text-[var(--spm-on-surface-variant)]">
                Total charged: {formatSpmPrice(chargedTotal)}
              </p>
            </div>
            <Link
              href={SPM_PATHS.shop}
              onClick={closeSuccessModal}
              className="spm-sticker-shadow block w-full rounded-full bg-[var(--spm-primary)] py-4 font-headline-md text-white transition-all active:translate-y-1"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
