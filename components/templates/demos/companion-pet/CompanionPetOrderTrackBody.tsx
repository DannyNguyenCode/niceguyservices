"use client";

import { CP_PATHS } from "./companionPetConfig";

const ORDER_ID = "88219";

const TIMELINE = [
  {
    id: "placed",
    label: "Order placed",
    detail: "May 22, 2026 · 9:14 AM",
    status: "complete" as const,
    icon: "receipt_long",
  },
  {
    id: "shipped",
    label: "Shipped from Toronto hub",
    detail: "May 23, 2026 · 2:40 PM",
    status: "complete" as const,
    icon: "local_shipping",
  },
  {
    id: "out",
    label: "Out for delivery",
    detail: "Today · ETA 2:00–4:00 PM",
    status: "active" as const,
    icon: "delivery_dining",
  },
  {
    id: "delivered",
    label: "Delivered",
    detail: "Estimated May 24, 2026",
    status: "pending" as const,
    icon: "home",
  },
];

export function CompanionPetOrderTrackBody() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-4 pb-32 pt-8 md:px-8 md:pb-24">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--cp-blue)]">Order tracking</p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--cp-charcoal)]">Order #{ORDER_ID}</h1>
          <p className="mt-1 text-sm text-[var(--cp-slate)]">2 items · Premium Grain-Free Salmon, Calming Hemp Chews</p>
        </div>

        <div className="cp-card overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/10] w-full bg-[var(--cp-warm-gray)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=500&fit=crop&q=80"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--cp-charcoal)]/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-white/80">Live route</p>
                <p className="text-lg font-semibold text-white">Driver is 2.4 km away</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-[var(--cp-green)] px-3 py-1 text-xs font-semibold text-white">
                <span className="material-symbols-outlined text-sm" aria-hidden>
                  schedule
                </span>
                On time
              </span>
            </div>
          </div>
        </div>

        <section className="cp-card mt-6 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-[var(--cp-charcoal)]">Delivery timeline</h2>
          <ol className="mt-5 space-y-0">
            {TIMELINE.map((step, i) => (
              <li key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
                {i < TIMELINE.length - 1 ? (
                  <span
                    className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-0.5 ${
                      step.status === "complete" ? "bg-[var(--cp-green)]" : "bg-[var(--cp-warm-gray)]"
                    }`}
                    aria-hidden
                  />
                ) : null}
                <span
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    step.status === "complete"
                      ? "bg-[var(--cp-green)] text-white"
                      : step.status === "active"
                        ? "bg-[var(--cp-charcoal)] text-white ring-4 ring-[var(--cp-blue-muted)]"
                        : "bg-[var(--cp-warm-gray)] text-[var(--cp-slate)]"
                  }`}
                >
                  {step.status === "complete" ? (
                    <span className="material-symbols-outlined text-base" aria-hidden>
                      check
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-base" aria-hidden>
                      {step.icon}
                    </span>
                  )}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p
                    className={`text-sm font-medium ${
                      step.status === "pending" ? "text-[var(--cp-slate)]" : "text-[var(--cp-charcoal)]"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-[var(--cp-slate)]">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="cp-card mt-6 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-[var(--cp-charcoal)]">Shipment details</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-[var(--cp-slate)]">Carrier</dt>
              <dd className="mt-0.5 text-sm font-medium text-[var(--cp-charcoal)]">Pawsome Express</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--cp-slate)]">Tracking number</dt>
              <dd className="mt-0.5 text-sm font-medium text-[var(--cp-charcoal)]">PX-{ORDER_ID}-CA</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--cp-slate)]">Delivery address</dt>
              <dd className="mt-0.5 text-sm font-medium text-[var(--cp-charcoal)]">
                420 Wellness Way, Toronto, ON M5V 3K2
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--cp-slate)]">Delivery instructions</dt>
              <dd className="mt-0.5 text-sm font-medium text-[var(--cp-charcoal)]">Leave at front door · Ring bell</dd>
            </div>
          </dl>
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-[var(--cp-orange-muted)] p-4">
            <span className="material-symbols-outlined text-[var(--cp-orange)]" aria-hidden>
              loyalty
            </span>
            <p className="text-sm text-[var(--cp-charcoal)]">
              You&apos;ll earn <strong>+84 points</strong> when this order is delivered.
            </p>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--cp-border)] bg-[var(--cp-white)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl gap-3 px-4 py-4 md:px-8">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--cp-charcoal)] py-3.5 text-sm font-semibold text-white"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden>
              edit_location_alt
            </span>
            Manage delivery
          </button>
          <a
            href={CP_PATHS.resources}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--cp-border)] py-3.5 text-sm font-semibold text-[var(--cp-charcoal)]"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden>
              support_agent
            </span>
            Help center
          </a>
        </div>
      </div>
    </>
  );
}
