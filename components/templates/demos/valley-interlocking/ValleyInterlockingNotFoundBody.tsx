"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { VI_NOT_FOUND_LINKS, VI_PATHS, VI_SITE } from "./valleyInterlockingConfig";
import { ViContainer, ViIcon } from "./ValleyInterlockingShared";
import { useViPageLoading } from "./ViPageLoadingProvider";

export function ValleyInterlockingNotFoundBody() {
  const searchStatusId = useId();
  const { hide: hidePageLoading } = useViPageLoading();
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const searchResults =
    normalizedQuery.length > 0
      ? VI_NOT_FOUND_LINKS.filter((link: any) => link.label.toLowerCase().includes(normalizedQuery))
      : [];

  const [searchMessage, setSearchMessage] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!normalizedQuery) {
      setSearchMessage("Enter a keyword to search the site.");
      hidePageLoading();
      return;
    }
    if (searchResults.length === 1) {
      window.location.href = searchResults[0].href;
      return;
    }
    if (searchResults.length > 1) {
      setSearchMessage(`Found ${searchResults.length} matches below.`);
      hidePageLoading();
      return;
    }
    setSearchMessage("No pages matched your search. Try Home, Services, or Contact.");
    hidePageLoading();
  }

  return (
    <main id="vi-main-content-fallback" className="bg-[var(--vi-background)] py-[var(--vi-stack-lg)] pt-[calc(var(--vi-nav-height)+var(--vi-stack-lg))]">
      <ViContainer className="max-w-3xl text-center">
        <p className="vi-label-md mb-4 text-[var(--vi-on-surface-variant)]">404</p>
        <h1 className="vi-display-lg mb-6 text-[var(--vi-primary)]">Oops, This Page Could Not Be Found!</h1>
        <p className="vi-body-lg mb-10 text-[var(--vi-on-surface-variant)]">
          The page you are looking for may have moved or no longer exists. Use the links below or search to find what
          you need on {VI_SITE}.
        </p>

        <form onSubmit={handleSearch} className="mx-auto mb-4 flex max-w-lg flex-col gap-3 sm:flex-row">
          <label htmlFor="vi-site-search" className="vi-sr-only">
            Search the website
          </label>
          <input
            id="vi-site-search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchMessage("");
            }}
            placeholder="Search the site…"
            className="min-h-11 flex-1 rounded-lg border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-low)] px-4 vi-body-md text-[var(--vi-on-surface)] focus-visible:outline-2 focus-visible:outline-[var(--vi-primary)]"
          />
          <button
            type="submit"
            className="inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-lg bg-[var(--vi-primary)] px-6 vi-label-md text-[var(--vi-on-primary)] transition-opacity hover:opacity-90"
          >
            <ViIcon name="search" className="text-xl" />
            Search
          </button>
        </form>
        {searchMessage ? (
          <p id={searchStatusId} className="vi-body-md mb-8 text-[var(--vi-on-surface-variant)]" role="status" aria-live="polite">
            {searchMessage}
          </p>
        ) : (
          <div className="mb-8" aria-hidden />
        )}

        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {(searchResults.length > 0 ? searchResults : VI_NOT_FOUND_LINKS).map((link: any) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-[var(--vi-outline-variant)] bg-[var(--vi-surface-container-low)] px-5 py-3 vi-label-md text-[var(--vi-primary)] transition-colors hover:border-[var(--vi-primary)] hover:bg-[var(--vi-primary-fixed)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href={VI_PATHS.home}
          className="inline-flex items-center gap-2 vi-label-md font-bold text-[var(--vi-secondary)] transition-colors hover:text-[var(--vi-primary)]"
        >
          <ViIcon name="home" />
          Back to Homepage
        </Link>
      </ViContainer>
    </main>
  );
}
