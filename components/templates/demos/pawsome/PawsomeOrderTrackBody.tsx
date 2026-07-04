"use client";

import Link from "next/link";
import { PS_IMAGES } from "./pawsomeImages";
import { PS_PATHS } from "./pawsomeConfig";
import { PS_ORDERS } from "./pawsomeData";
import { PsIcon, PsPageWrap, PsProgressBar } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

const TIMELINE = [
  { id: "placed", label: "Order placed", detail: "Oct 10, 2024 · 9:14 AM", status: "complete" as const, icon: "receipt_long" },
  { id: "shipped", label: "Shipped from Toronto hub", detail: "Oct 11, 2024 · 2:40 PM", status: "complete" as const, icon: "local_shipping" },
  { id: "out", label: "Out for delivery", detail: "Today · ETA 2:00–4:00 PM", status: "active" as const, icon: "delivery_dining" },
  { id: "delivered", label: "Delivered", detail: "Estimated Oct 12, 2024", status: "pending" as const, icon: "home" },
];

export function PawsomeOrderTrackBody() {
  const order = PS_ORDERS[0];

  return (
    <main className="pb-8 pt-20 md:pt-24">
      <PsPageWrap className="max-w-3xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ps-secondary)]">
            Order tracking
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[var(--ps-primary)]" style={headline}>
            Order #{order?.id ?? "88219"}
          </h1>
          <p className="mt-1 text-sm text-[var(--ps-on-surface-variant)]">
            {order?.pet}&apos;s nutrition plan · {order?.eta ?? "In transit"}
          </p>
        </div>

        <div className="overflow-hidden rounded-xl shadow-[var(--ps-shadow)]">
          <div className="relative aspect-[16/10] w-full bg-[var(--ps-surface-container)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PS_IMAGES.orderMap} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ps-primary)]/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-white/80">Live route</p>
                <p className="text-lg font-semibold text-white" style={headline}>
                  Driver is 2.4 km away
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-[var(--ps-secondary)] px-3 py-1 text-xs font-semibold text-[var(--ps-on-secondary)]">
                <PsIcon name="schedule" className="text-sm" />
                On time
              </span>
            </div>
          </div>
        </div>

        {order?.progress ? (
          <div className="mt-4 rounded-xl bg-[var(--ps-surface-container-lowest)] p-4 shadow-[var(--ps-shadow)]">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold text-[var(--ps-primary)]">Shipment progress</span>
              <span className="text-[var(--ps-secondary)]">{order.progress}%</span>
            </div>
            <PsProgressBar value={order.progress} height="h-2.5" />
          </div>
        ) : null}

        <section className="mt-6 rounded-xl bg-[var(--ps-surface-container-lowest)] p-6 shadow-[var(--ps-shadow)]">
          <h2 className="text-sm font-semibold text-[var(--ps-primary)]" style={headline}>
            Delivery timeline
          </h2>
          <ol className="relative mt-5 space-y-0">
            {TIMELINE.map((step, i) => (
              <li key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
                {i < TIMELINE.length - 1 ? (
                  <span
                    className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-0.5 ${
                      step.status === "complete"
                        ? "bg-[var(--ps-secondary)]"
                        : "bg-[var(--ps-surface-container-high)]"
                    }`}
                    aria-hidden
                  />
                ) : null}
                <span
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    step.status === "complete"
                      ? "bg-[var(--ps-secondary)] text-[var(--ps-on-secondary)]"
                      : step.status === "active"
                        ? "bg-[var(--ps-primary)] text-[var(--ps-on-primary)] ring-4 ring-[color-mix(in_srgb,var(--ps-secondary-container)_40%,transparent)]"
                        : "bg-[var(--ps-surface-container-high)] text-[var(--ps-on-surface-variant)]"
                  }`}
                >
                  {step.status === "complete" ? (
                    <PsIcon name="check" className="text-base" />
                  ) : (
                    <PsIcon name={step.icon} className="text-base" />
                  )}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p
                    className={`text-sm font-medium ${
                      step.status === "pending"
                        ? "text-[var(--ps-on-surface-variant)]"
                        : "text-[var(--ps-primary)]"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-[var(--ps-on-surface-variant)]">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={PS_PATHS.review}
            className="flex-1 rounded-xl bg-[var(--ps-primary)] py-3 text-center text-sm font-semibold text-[var(--ps-on-primary)]"
          >
            Rate delivery
          </Link>
          <Link
            href={PS_PATHS.accountOrders}
            className="flex-1 rounded-xl border border-[var(--ps-outline-variant)] py-3 text-center text-sm font-semibold text-[var(--ps-primary)]"
          >
            Back to orders
          </Link>
        </div>
      </PsPageWrap>
    </main>
  );
}
