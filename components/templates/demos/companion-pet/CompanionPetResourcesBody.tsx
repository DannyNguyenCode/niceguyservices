"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ResourceCard } from "./ResourceCard";
import { FAQAccordion } from "./FAQAccordion";
import { CP_FAQS, CP_RESOURCES } from "./companionPetData";

const CATEGORIES = ["All", "Nutrition", "Wellness", "Health", "Education"] as const;

export function CompanionPetResourcesBody() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(() => {
    return CP_RESOURCES.filter((r) => {
      const matchCat = category === "All" || r.category === category;
      const matchQuery =
        !query ||
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.excerpt.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [query, category]);

  const featured = CP_RESOURCES.filter((r) => r.trending);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--cp-green)]">Resource center</p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--cp-charcoal)]">Pet care knowledge hub</h1>
        <p className="mt-2 text-sm leading-7 text-[var(--cp-slate)]">
          Expert guides, wellness resources, and nutrition systems — designed like a premium knowledge base.
        </p>
      </div>

      <div className="relative mb-8 max-w-xl">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--cp-slate)]" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles, guides, experts…"
          className="w-full rounded-2xl border border-[var(--cp-border)] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[var(--cp-blue)]"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`cp-chip rounded-full border px-4 py-2 text-sm ${
              category === c ? "cp-chip-active" : "border-[var(--cp-border)] bg-white text-[var(--cp-slate)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {category === "All" && !query ? (
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-[var(--cp-charcoal)]">Featured</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {featured.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="text-lg font-semibold text-[var(--cp-charcoal)]">
          {query ? `Results for "${query}"` : "All resources"}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-lg font-semibold text-[var(--cp-charcoal)]">FAQ</h2>
        <div className="mt-4">
          <FAQAccordion items={CP_FAQS.slice(0, 3)} />
        </div>
      </section>
    </main>
  );
}
