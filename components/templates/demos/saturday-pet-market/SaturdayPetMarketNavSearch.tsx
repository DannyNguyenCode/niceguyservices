"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SPM_PATHS, spmShopSearchHref } from "./saturdayPetMarketConfig";

export function SaturdayPetMarketNavSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const path = pathname.replace(/\/$/, "") || "/";
    if (path === SPM_PATHS.shop) {
      setQuery(searchParams.get("q") ?? "");
    }
  }, [pathname, searchParams]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(spmShopSearchHref(query));
  }

  return (
    <form className="relative hidden sm:block" onSubmit={handleSubmit} role="search">
      <input
        id="spm-nav-search"
        className="spm-body-md w-48 rounded-full border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] py-1 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[var(--spm-primary)] md:w-64"
        placeholder="Search for treats..."
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search products"
      />
      <button
        type="submit"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--spm-on-surface-variant)] transition-colors hover:text-[var(--spm-primary)]"
        aria-label="Submit search"
      >
        <span className="material-symbols-outlined" aria-hidden>
          search
        </span>
      </button>
    </form>
  );
}
