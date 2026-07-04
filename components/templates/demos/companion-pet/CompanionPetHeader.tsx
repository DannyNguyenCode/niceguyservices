"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import {
  CP_LOYALTY,
} from "./companionPetData";
import { CP_NAV_ITEMS, CP_PATHS, CP_SITE, isCpNavActive } from "./companionPetConfig";
import { MegaMenu } from "./MegaMenu";
import type { CartItem } from "./CartDrawer";
import { CartDrawer } from "./CartDrawer";
import { useCompanionPetAuth } from "./CompanionPetAuthContext";

const MOBILE_NAV_ID = "cp-mobile-nav";

type CompanionPetHeaderProps = {
  cartItems: CartItem[];
  onUpdateCartQty: (id: string, qty: number) => void;
  cartOpen: boolean;
  onCartOpenChange: (open: boolean) => void;
};

export function CompanionPetHeader({
  cartItems,
  onUpdateCartQty,
  cartOpen,
  onCartOpenChange,
}: CompanionPetHeaderProps) {
  const pathname = usePathname();
  const { isLoggedIn } = useCompanionPetAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  const close = useCallback(() => setMenuOpen(false), []);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    close();
    setMegaOpen(false);
  }, [pathname, close]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, close]);

  return (
    <>
      <header className="relative border-b border-[var(--cp-border)] bg-[var(--cp-white)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-8">
          <Link href={CP_PATHS.home} className="flex shrink-0 items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--cp-charcoal)] text-white">
              <span className="material-symbols-outlined text-lg" aria-hidden>
                pets
              </span>
            </span>
            <span className="text-lg font-semibold tracking-tight text-[var(--cp-charcoal)]">{CP_SITE}</span>
          </Link>

          <button
            type="button"
            className="hidden items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-[var(--cp-charcoal)] hover:bg-[var(--cp-warm-gray)] lg:inline-flex"
            onMouseEnter={() => setMegaOpen(true)}
            onFocus={() => setMegaOpen(true)}
            aria-expanded={megaOpen}
          >
            Shop
            <span className="material-symbols-outlined text-base" aria-hidden>
              expand_more
            </span>
          </button>

          <div className="hidden flex-1 max-w-md lg:block">
            <label className="sr-only" htmlFor="nav-search">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--cp-slate)]" aria-hidden />
              <input
                id="nav-search"
                type="search"
                placeholder="Search products, brands, guides…"
                className="w-full rounded-2xl border border-[var(--cp-border)] bg-[var(--cp-warm-gray)]/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[var(--cp-blue)]"
              />
            </div>
          </div>

          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main">
            {CP_NAV_ITEMS.filter((i) => i.href !== CP_PATHS.home).map((item) => {
              const active = isCpNavActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[var(--cp-blue-muted)] text-[var(--cp-blue)]"
                      : "text-[var(--cp-charcoal)] hover:bg-[var(--cp-warm-gray)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href={isLoggedIn ? CP_PATHS.rewards : `${CP_PATHS.login}#register`}
              className="hidden items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-[var(--cp-orange)] sm:inline-flex"
            >
              <span className="material-symbols-outlined text-base" aria-hidden>
                military_tech
              </span>
              {isLoggedIn ? CP_LOYALTY.points.toLocaleString() : "Join rewards"}
            </Link>
            <Link
              href={isLoggedIn ? CP_PATHS.account : CP_PATHS.login}
              className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-[var(--cp-warm-gray)]"
              aria-label={isLoggedIn ? "Account" : "Sign in"}
            >
              <User className="h-5 w-5" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={() => onCartOpenChange(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-[var(--cp-warm-gray)]"
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingBag className="h-5 w-5" aria-hidden />
              {cartCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--cp-orange)] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl lg:hidden"
              aria-expanded={menuOpen}
              aria-controls={MOBILE_NAV_ID}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          onMouseLeave={() => setMegaOpen(false)}
          className="hidden lg:block"
        >
          <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
        </div>

        {menuOpen ? (
          <nav
            id={MOBILE_NAV_ID}
            className="border-t border-[var(--cp-border)] px-4 py-4 lg:hidden"
            aria-label="Mobile"
          >
            <ul className="flex flex-col gap-1">
              {CP_NAV_ITEMS.map((item) => {
                const active = isCpNavActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className={`block rounded-xl px-4 py-3 text-sm font-medium ${
                        active ? "bg-[var(--cp-blue-muted)] text-[var(--cp-blue)]" : "hover:bg-[var(--cp-warm-gray)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}
      </header>

      <CartDrawer
        open={cartOpen}
        onClose={() => onCartOpenChange(false)}
        items={cartItems}
        onUpdateQty={onUpdateCartQty}
      />
    </>
  );
}
