"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Gift, ShoppingBag, User } from "lucide-react";
import { CP_PATHS } from "./companionPetConfig";

const ITEMS = [
  { href: CP_PATHS.home, label: "Home", icon: Home },
  { href: CP_PATHS.shop, label: "Shop", icon: ShoppingBag },
  { href: CP_PATHS.rewards, label: "Rewards", icon: Gift },
  { href: CP_PATHS.resources, label: "Learn", icon: BookOpen },
  { href: CP_PATHS.account, label: "Account", icon: User },
] as const;

type CompanionPetBottomNavProps = {
  cartCount?: number;
  onCartClick?: () => void;
};

export function CompanionPetBottomNav({ cartCount = 0, onCartClick }: CompanionPetBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--cp-border)] bg-[var(--cp-white)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      aria-label="Mobile bottom navigation"
    >
      <ul className="flex items-stretch justify-around px-2 py-2">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.replace(/\/$/, "") === href.replace(/\/$/, "");
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium ${
                  active ? "text-[var(--cp-blue)]" : "text-[var(--cp-slate)]"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
      {cartCount > 0 && onCartClick ? (
        <button
          type="button"
          onClick={onCartClick}
          className="absolute -top-14 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cp-charcoal)] text-white shadow-lg"
          aria-label={`Open cart, ${cartCount} items`}
        >
          <ShoppingBag className="h-5 w-5" aria-hidden />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--cp-orange)] text-[10px] font-bold">
            {cartCount}
          </span>
        </button>
      ) : null}
    </nav>
  );
}
