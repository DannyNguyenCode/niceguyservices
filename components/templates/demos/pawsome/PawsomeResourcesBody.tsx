"use client";

import { useState } from "react";
import { PS_IMAGES } from "./pawsomeImages";
import { PS_RESOURCES } from "./pawsomeData";
import { PsBadge, PsIcon, PsPageWrap } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

const CATEGORIES = ["All", "Nutrition Lab", "Expert Training", "Behavior"];

export function PawsomeResourcesBody() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = PS_RESOURCES.filter((r) => {
    const matchCat = category === "All" || r.category === category;
    const matchQuery =
      !query || r.title.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <main className="py-8 md:py-12">
      <PsPageWrap>
        <section className="mb-16 mx-auto max-w-3xl text-center">
          <h1
            className="text-3xl font-bold tracking-tight text-[var(--ps-primary)] md:text-5xl"
            style={headline}
          >
            The Pawsome Knowledge Base
          </h1>
          <p className="mt-4 text-lg text-[var(--ps-on-surface-variant)]">
            Expert-vetted guides for your pet&apos;s long-term wellness. Search across nutrition,
            health, and behavior resources.
          </p>
          <div className="group relative mt-8 w-full">
            <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-[var(--ps-on-surface-variant)]">
              <PsIcon name="search" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, e.g. 'Raw diet vs Kibble'..."
              className="h-16 w-full rounded-full border-none bg-[var(--ps-surface-container-low)] pl-14 pr-6 text-base shadow-sm transition-all focus:ring-2 focus:ring-[var(--ps-secondary-container)] group-hover:shadow-md"
            />
          </div>
        </section>

        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-colors ${
                category === c
                  ? "bg-[var(--ps-primary)] text-[var(--ps-on-primary)]"
                  : "bg-[var(--ps-surface-container-high)] text-[var(--ps-on-surface-variant)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <section className="mb-12 overflow-hidden rounded-2xl bg-[var(--ps-surface-container-lowest)] shadow-[var(--ps-shadow-lg)] md:grid md:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PS_IMAGES.resourceFeatured}
            alt=""
            className="aspect-video w-full object-cover md:aspect-auto md:h-full"
          />
          <div className="flex flex-col justify-center p-8 md:p-12">
            <PsBadge variant="secondary">Featured</PsBadge>
            <h2 className="mt-4 text-2xl font-semibold text-[var(--ps-primary)]" style={headline}>
              {PS_RESOURCES[0].title}
            </h2>
            <p className="mt-2 text-sm text-[var(--ps-on-surface-variant)]">
              {PS_RESOURCES[0].readTime} · Earn {PS_RESOURCES[0].points} points
            </p>
            <button
              type="button"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--ps-primary)] px-6 py-3 text-sm font-semibold text-[var(--ps-on-primary)]"
            >
              Read article <PsIcon name="arrow_forward" className="text-sm" />
            </button>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-white/40 bg-[color-mix(in_srgb,var(--ps-surface-container-lowest)_70%,transparent)] p-8 backdrop-blur-md">
          <div className="flex items-start gap-4">
            <PsIcon name="military_tech" filled className="text-3xl text-[var(--ps-secondary)]" />
            <div>
              <h3 className="font-semibold text-[var(--ps-primary)]" style={headline}>
                Read &amp; Earn Program
              </h3>
              <p className="mt-1 text-sm text-[var(--ps-on-surface-variant)]">
                Complete articles to earn loyalty points. Fictional demo — no real rewards.
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <article
              key={r.title}
              className="overflow-hidden rounded-xl bg-[var(--ps-surface-container-lowest)] shadow-[var(--ps-shadow)] transition-all hover:-translate-y-1 hover:shadow-[var(--ps-shadow-lg)]"
            >
              <div className="aspect-video overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.image} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <PsBadge variant="secondary">{r.category}</PsBadge>
                <h3 className="mt-2 font-semibold text-[var(--ps-primary)]" style={headline}>
                  {r.title}
                </h3>
                <p className="mt-2 text-xs text-[var(--ps-on-surface-variant)]">
                  {r.readTime} · +{r.points} pts
                </p>
              </div>
            </article>
          ))}
        </div>
      </PsPageWrap>
    </main>
  );
}
