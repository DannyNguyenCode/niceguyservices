"use client";

import { useState } from "react";
import Link from "next/link";
import { PS_PATHS } from "./pawsomeConfig";
import { PS_ORDERS } from "./pawsomeData";
import { PsIcon, PsPageWrap, PsProgressBar } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

const STATUS_FILTERS = ["All", "In Transit", "Delivered"];

export function PawsomeAccountOrdersBody() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const filtered = PS_ORDERS.filter((o) => {
    const matchStatus = status === "All" || o.status === status;
    const matchQuery =
      !query ||
      o.id.includes(query) ||
      o.pet.toLowerCase().includes(query.toLowerCase());
    return matchStatus && matchQuery;
  });

  return (
    <main className="py-8 md:py-12">
      <PsPageWrap>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--ps-primary)] md:text-3xl" style={headline}>
            Order History
          </h1>
          <p className="mt-1 text-sm text-[var(--ps-on-surface-variant)]">
            Search and filter your past orders — fictional demo data.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <PsIcon
              name="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ps-on-surface-variant)]"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order # or pet name..."
              className="w-full rounded-xl border border-[var(--ps-outline-variant)] bg-[var(--ps-surface-container-lowest)] py-3 pl-12 pr-4 text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto ps-hide-scrollbar">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${
                  status === s
                    ? "bg-[var(--ps-primary)] text-[var(--ps-on-primary)]"
                    : "bg-[var(--ps-surface-container-high)] text-[var(--ps-on-surface-variant)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <ul className="space-y-4">
          {filtered.map((order) => (
            <li
              key={order.id}
              className="overflow-hidden rounded-xl bg-[var(--ps-surface-container-lowest)] shadow-[var(--ps-shadow)]"
            >
              <div className="flex flex-wrap items-center gap-4 p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={order.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-[var(--ps-primary)]">Order #{order.id}</p>
                    <span className="rounded-full bg-[color-mix(in_srgb,var(--ps-secondary-container)_15%,transparent)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--ps-secondary)]">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--ps-on-surface-variant)]">
                    {order.pet} · {order.date} · +{order.points} pts
                  </p>
                  {order.eta ? (
                    <p className="mt-1 text-xs font-semibold text-[var(--ps-secondary)]">{order.eta}</p>
                  ) : null}
                  {order.deliveredTo ? (
                    <p className="mt-1 text-xs text-[var(--ps-on-surface-variant)]">
                      Delivered to {order.deliveredTo}
                    </p>
                  ) : null}
                </div>
                {order.status === "In Transit" ? (
                  <Link
                    href={PS_PATHS.orderTrack}
                    className="rounded-xl bg-[var(--ps-secondary)] px-4 py-2 text-sm font-semibold text-[var(--ps-on-secondary)]"
                  >
                    Track
                  </Link>
                ) : (
                  <Link
                    href={PS_PATHS.review}
                    className="rounded-xl border border-[var(--ps-outline-variant)] px-4 py-2 text-sm font-semibold text-[var(--ps-primary)]"
                  >
                    Review
                  </Link>
                )}
              </div>
              {order.progress ? (
                <div className="border-t border-[var(--ps-outline-variant)] px-5 py-3">
                  <PsProgressBar value={order.progress} />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </PsPageWrap>
    </main>
  );
}
