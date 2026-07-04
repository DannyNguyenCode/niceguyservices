"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PS_PATHS } from "./pawsomeConfig";
import { usePawsomeCart } from "./PawsomeCartContext";
import { PawsomeOrderLoadingState } from "./PawsomeOrderLoadingState";
import { PsIcon, PsPageWrap, PsPrimaryButton, PsSecondaryButton } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

function formatDeliveryWindow() {
  const start = new Date();
  start.setDate(start.getDate() + 3);
  const end = new Date();
  end.setDate(end.getDate() + 5);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function PawsomeOrderSuccessBody() {
  const router = useRouter();
  const { completedOrder } = usePawsomeCart();

  useEffect(() => {
    if (!completedOrder) {
      router.replace(PS_PATHS.shop);
    }
  }, [completedOrder, router]);

  if (!completedOrder) {
    return (
      <PawsomeOrderLoadingState
        title="Loading confirmation"
        message="Retrieving your order details and confirmation number."
      />
    );
  }

  const { confirmationNumber, items, total, pointsEarned, orderedBy, isGuest } = completedOrder;

  return (
    <main className="pb-12 pt-24 md:pt-28">
      <PsPageWrap className="max-w-3xl">
        <section className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--ps-secondary-container)_25%,transparent)]">
            <PsIcon name="check_circle" filled className="text-4xl text-[var(--ps-secondary)]" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--ps-primary)] md:text-4xl" style={headline}>
            Order confirmed
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[var(--ps-on-surface-variant)]">
            {isGuest
              ? "Thank you, Guest! We're preparing your selection for shipment — fictional demo confirmation."
              : `Thank you, ${orderedBy}! We're preparing your selection for shipment — fictional demo confirmation.`}
          </p>
        </section>

        {pointsEarned > 0 ? (
          <div className="mb-8 rounded-xl bg-[color-mix(in_srgb,var(--ps-secondary-container)_12%,transparent)] p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ps-secondary)]">
              You earned +{pointsEarned} Pawsome Points
            </p>
            <p className="mt-1 text-sm text-[var(--ps-on-surface-variant)]">
              Points apply to your rewards balance after delivery.
            </p>
          </div>
        ) : null}

        <div className="overflow-hidden rounded-xl bg-[var(--ps-surface-container-lowest)] shadow-[var(--ps-shadow)]">
          <div className="flex flex-col gap-4 border-b border-[var(--ps-outline-variant)] p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ps-on-surface-variant)]">
                Order details
              </p>
              <p className="mt-1 text-xl font-semibold text-[var(--ps-primary)]" style={headline}>
                {confirmationNumber}
              </p>
              <p className="mt-1 text-xs text-[var(--ps-on-surface-variant)]">
                {isGuest ? "Ordered by Guest" : `Ordered by ${orderedBy}`}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ps-on-surface-variant)]">
                Estimated delivery
              </p>
              <p className="mt-1 text-lg font-semibold text-[var(--ps-secondary)]" style={headline}>
                {formatDeliveryWindow()}
              </p>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <h2 className="mb-4 text-sm font-semibold text-[var(--ps-primary)]">Items ordered</h2>
            <ul className="space-y-4">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--ps-primary)]">{product.name}</p>
                    <p className="text-sm text-[var(--ps-on-surface-variant)]">
                      Qty {qty} · ${(product.price * qty).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between border-t border-[var(--ps-outline-variant)] pt-4 text-sm font-bold text-[var(--ps-primary)]">
              <span>Total paid</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <p className="mt-2 text-xs text-[var(--ps-on-surface-variant)]">
              Pawsome Express · 123 Pet Lane, Toronto ON
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <PsPrimaryButton href={PS_PATHS.orderTrack} className="w-full sm:w-auto">
            Track order
          </PsPrimaryButton>
          <PsSecondaryButton href={PS_PATHS.shop} className="w-full sm:w-auto">
            Continue shopping
          </PsSecondaryButton>
        </div>
        <div className="mt-6 text-center">
          <Link
            href={PS_PATHS.review}
            className="text-sm font-semibold text-[var(--ps-secondary)] hover:underline"
          >
            Rate your experience →
          </Link>
        </div>
      </PsPageWrap>
    </main>
  );
}
