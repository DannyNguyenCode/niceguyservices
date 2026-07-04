"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { VI_PATHS } from "./valleyInterlockingConfig";
import {
  VI_FEATURED_RESOURCE,
  VI_RESOURCE_ARTICLES,
  VI_RESOURCE_CATEGORIES,
  type ViResourceArticle,
  type ViResourceCategory,
} from "./valleyInterlockingResourcesData";
import { ViContainer, ViIcon, ViImg } from "./ValleyInterlockingShared";
import { useViNavScroll } from "./useViEffects";

function categoryMatches(article: ViResourceArticle, category: ViResourceCategory): boolean {
  if (category === "All Resources") return true;
  return article.category === category;
}

function ResourceCard({ article }: { article: ViResourceArticle }) {
  const inner = (
    <>
      <div className="relative aspect-video overflow-hidden">
        <ViImg
          src={article.image}
          alt={article.imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-grow flex-col p-6">
        <div className="mb-4 flex items-start justify-between">
          <span className="bg-[var(--vi-tertiary-fixed)] px-2 py-1 text-[10px] font-black uppercase tracking-tighter text-[var(--vi-on-tertiary-fixed-variant)]">
            {article.category}
          </span>
          <span className="vi-caption flex items-center gap-1 text-[var(--vi-outline)]">
            <ViIcon name="schedule" className="text-[14px]" />
            {article.readTime}
          </span>
        </div>
        <h3 className="vi-label-md mb-3 text-lg transition-colors group-hover:text-[var(--vi-primary)]">
          {article.title}
        </h3>
        <p className="vi-body-md mb-6 flex-grow text-sm text-[var(--vi-on-surface-variant)]">{article.excerpt}</p>
        <span className="vi-label-md flex items-center gap-2 text-sm text-[var(--vi-primary)]">
          View Article
          <ViIcon name="east" className="text-sm" />
        </span>
      </div>
    </>
  );

  if (article.href) {
    return (
      <Link
        href={article.href}
        className="group flex flex-col border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-lowest)]"
      >
        {inner}
      </Link>
    );
  }

  return (
    <article className="group flex flex-col border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-lowest)]">
      {inner}
    </article>
  );
}

function FeaturedResourcePanel() {
  return (
    <>
      <div className="relative h-[400px] overflow-hidden lg:col-span-7 lg:h-auto">
        <ViImg
          src={VI_FEATURED_RESOURCE.image}
          alt={VI_FEATURED_RESOURCE.imageAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 58vw"
          priority
        />
        <div className="absolute left-6 top-6">
          <span className="vi-caption bg-[var(--vi-primary)] px-4 py-2 font-bold uppercase tracking-widest text-[var(--vi-on-primary)]">
            Featured Technical Guide
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-center p-8 lg:col-span-5 lg:p-12">
        <div className="mb-4 flex items-center gap-2">
          <ViIcon name="verified" className="scale-75 text-[var(--vi-primary)]" fill />
          <span className="vi-label-md text-[var(--vi-primary)]">Installation Mastery</span>
        </div>
        <h2 className="vi-headline-lg mb-6 text-[var(--vi-on-surface)]">{VI_FEATURED_RESOURCE.title}</h2>
        <p className="vi-body-md mb-8 leading-relaxed text-[var(--vi-on-surface-variant)]">
          {VI_FEATURED_RESOURCE.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="vi-label-md inline-flex items-center gap-3 bg-[var(--vi-primary)] px-8 py-4 text-[var(--vi-on-primary)] transition-all group-hover:bg-[var(--vi-primary-container)]">
            Read Full Guide
            <ViIcon name="arrow_forward" className="text-sm" />
          </span>
          <div className="vi-caption flex items-center gap-1 text-[var(--vi-outline)]">
            <ViIcon name="schedule" className="text-sm" />
            {VI_FEATURED_RESOURCE.readTime}
          </div>
        </div>
      </div>
    </>
  );
}

export function ValleyInterlockingResourcesBody() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ViResourceCategory>("All Resources");

  useViNavScroll();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const showingFeatured = category === "All Resources" && !normalized;
    return VI_RESOURCE_ARTICLES.filter((article) => {
      if (showingFeatured && article.featured) return false;
      const matchesCategory = categoryMatches(article, category);
      const matchesQuery =
        !normalized ||
        article.title.toLowerCase().includes(normalized) ||
        article.excerpt.toLowerCase().includes(normalized) ||
        article.category.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const showFeatured = category === "All Resources" && !query.trim();

  return (
    <main className="pt-[var(--vi-nav-height)]">
      <ViContainer className="py-[var(--vi-stack-lg)]">
        <section className="mb-[var(--vi-stack-lg)]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h1 className="vi-display-lg mb-4 text-[var(--vi-on-surface)]">
                Landscape Knowledge &amp; Technical Guides
              </h1>
              <p className="vi-body-md text-lg leading-relaxed text-[var(--vi-on-surface-variant)]">
                Industry-leading insights for residential and commercial landscape engineering. From precision
                interlocking to sustainable site development.
              </p>
            </div>
            <div className="relative w-full md:hidden">
              <ViIcon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--vi-outline)]"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-full rounded border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-lowest)] py-4 pl-10 pr-4 focus:border-[var(--vi-primary)] focus:outline-none"
              />
            </div>
            <div className="relative hidden w-full md:block md:max-w-xs">
              <ViIcon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--vi-outline)]"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search guides..."
                className="vi-body-md w-full rounded border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-low)] py-2 pl-10 pr-4 transition-all focus:border-[var(--vi-primary)] focus:outline-none"
              />
            </div>
          </div>
        </section>

        {showFeatured ? (
          <section className="mb-[var(--vi-stack-lg)]">
            {VI_FEATURED_RESOURCE.href ? (
              <Link
                href={VI_FEATURED_RESOURCE.href}
                className="group grid grid-cols-1 gap-8 overflow-hidden border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-lowest)] lg:grid-cols-12"
              >
                <FeaturedResourcePanel />
              </Link>
            ) : (
              <div className="group grid grid-cols-1 gap-8 overflow-hidden border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-lowest)] lg:grid-cols-12">
                <FeaturedResourcePanel />
              </div>
            )}
          </section>
        ) : null}

        <section className="mb-[var(--vi-stack-lg)] border-y border-[var(--vi-outline-variant)] py-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="vi-label-md mr-4 text-[var(--vi-on-surface)]">Filter by Category:</span>
            {VI_RESOURCE_CATEGORIES.map((item) => {
              const active = category === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`vi-label-md rounded-full border border-[var(--vi-outline-variant)] px-6 py-2 transition-all hover:border-[var(--vi-primary)] ${
                    active
                      ? "bg-[var(--vi-primary)] text-[var(--vi-on-primary)]"
                      : "bg-[var(--vi-surface-container)] text-[var(--vi-on-surface)]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-[var(--vi-stack-lg)] grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.length > 0 ? (
            filtered.map((article) => <ResourceCard key={article.id} article={article} />)
          ) : (
            <p className="vi-body-md col-span-full text-[var(--vi-on-surface-variant)]">
              No resources match your search. Try a different category or keyword.
            </p>
          )}
        </section>

        <section className="vi-ink-zone flex flex-col items-center justify-between gap-8 border border-[var(--vi-on-surface-variant)] px-[var(--vi-gutter)] py-16 md:flex-row">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="vi-headline-lg mb-4">Need Expert Help with Your Project?</h2>
            <p className="vi-body-md text-[var(--vi-surface-variant)]">
              Our team of landscape specialists is ready to provide technical consultation and precision installation
              for your next major development.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href={VI_PATHS.contact}
              className="vi-label-md bg-[var(--vi-primary)] px-10 py-5 text-center text-[var(--vi-on-primary)] transition-all hover:bg-[var(--vi-primary-container)]"
            >
              Get a Professional Quote
            </Link>
            <Link
              href={VI_PATHS.contact}
              className="vi-label-md border-2 border-white px-10 py-5 text-center text-white transition-all hover:bg-white hover:text-[var(--vi-on-surface)]"
            >
              Contact Engineering
            </Link>
          </div>
        </section>
      </ViContainer>
    </main>
  );
}
