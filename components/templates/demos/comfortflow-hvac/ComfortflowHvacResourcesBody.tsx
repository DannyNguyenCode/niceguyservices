"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cfhPath } from "./comfortflowHvacConfig";
import { CFH_RESOURCES } from "./comfortflowHvacSiteContent";
import { cfhImage } from "./comfortflowHvacImages";
import { CfhContainer, CfhIcon, CfhImg } from "./ComfortflowHvacShared";

function articleMatchesFilter(category: string, filterKey: string): boolean {
  if (filterKey === "all") return true;
  const normalized = category.toLowerCase().replace(/\s+/g, "-");
  return normalized === filterKey;
}

export function ComfortflowHvacResourcesBody() {
  const { hero, filters, articles, newsletter } = CFH_RESOURCES;
  const [activeFilter, setActiveFilter] = useState("all");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const filteredArticles = useMemo(
    () => articles.filter((article) => articleMatchesFilter(article.category, activeFilter)),
    [articles, activeFilter],
  );

  return (
    <main id="cfh-main-content" className="cfh-main overflow-x-hidden">
      <section className="cfh-section-py cfh-technical-pattern">
        <CfhContainer>
          <div className="mx-auto max-w-3xl text-center">
            <span className="cfh-label-caps mb-4 block text-[var(--cfh-secondary)]">{hero.eyebrow}</span>
            <h1 className="cfh-display cfh-gradient-text mb-4">{hero.title}</h1>
            <p className="cfh-body-lg text-[var(--cfh-on-surface-variant)]">{hero.body}</p>
          </div>
        </CfhContainer>
      </section>

      <section className="pb-8">
        <CfhContainer>
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter articles by category">
            {filters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                className={`cfh-interactive rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  activeFilter === filter.key
                    ? "bg-[var(--cfh-secondary)] text-[var(--cfh-on-secondary)]"
                    : "cfh-glass-card text-[var(--cfh-primary)] hover:bg-[var(--cfh-surface-container)]"
                }`}
                aria-pressed={activeFilter === filter.key}
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </CfhContainer>
      </section>

      <section className="cfh-section-py pt-0">
        <CfhContainer>
          {filteredArticles.length === 0 ? (
            <p className="cfh-body-lg text-center text-[var(--cfh-on-surface-variant)]">
              No articles in this category yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-[var(--cfh-gutter)] md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={cfhPath(`/resources/${article.slug}`)}
                  className="cfh-interactive group overflow-hidden rounded-2xl border border-[var(--cfh-outline-variant)]/40 bg-[var(--cfh-surface-container-lowest)] transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <CfhImg
                      src={cfhImage(article.imageKey)}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <span className="cfh-label-caps mb-2 block text-[var(--cfh-secondary)]">{article.category}</span>
                    <h2 className="cfh-headline-md mb-2 text-lg text-[var(--cfh-primary)] transition-colors group-hover:text-[var(--cfh-secondary)]">
                      {article.title}
                    </h2>
                    <p className="cfh-body-md mb-4 text-[var(--cfh-on-surface-variant)]">{article.excerpt}</p>
                    <span className="cfh-label-caps inline-flex items-center gap-1 text-[var(--cfh-brand-indigo)] group-hover:gap-2">
                      Read article <CfhIcon name="arrow_forward" className="text-sm" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CfhContainer>
      </section>

      <section className="cfh-section-py bg-[var(--cfh-surface-container)]">
        <CfhContainer>
          <div className="mx-auto max-w-xl rounded-2xl cfh-glass-card p-8 text-center md:p-12">
            <h2 className="cfh-headline-md mb-3 text-[var(--cfh-primary)]">{newsletter.title}</h2>
            <p className="cfh-body-md mb-6 text-[var(--cfh-on-surface-variant)]">{newsletter.body}</p>
            {subscribed ? (
              <p className="cfh-body-md font-semibold text-[var(--cfh-secondary)]" role="status">
                Thanks for subscribing! (Demo — no email was sent.)
              </p>
            ) : (
              <form
                className="flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
              >
                <label htmlFor="cfh-newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="cfh-newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={newsletter.placeholder}
                  className="min-w-0 flex-1 rounded-lg border border-[var(--cfh-outline-variant)] bg-[var(--cfh-surface-container-lowest)] px-4 py-3 cfh-body-md outline-none focus:border-[var(--cfh-secondary)]"
                />
                <button
                  type="submit"
                  className="cfh-interactive shrink-0 rounded-lg bg-[var(--cfh-primary)] px-6 py-3 font-bold text-[var(--cfh-on-primary)] hover:bg-[var(--cfh-brand-indigo)]"
                >
                  {newsletter.cta}
                </button>
              </form>
            )}
          </div>
        </CfhContainer>
      </section>
    </main>
  );
}
