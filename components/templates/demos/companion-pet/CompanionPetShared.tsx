import Link from "next/link";
import { CP_EMAIL, CP_PATHS, CP_PHONE, CP_PHONE_HREF, CP_SITE } from "./companionPetConfig";

export function CompanionPetFooter() {
  return (
    <footer className="border-t border-[var(--cp-border)] bg-[var(--cp-warm-gray)]">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-lg font-semibold text-[var(--cp-charcoal)]">{CP_SITE}</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--cp-slate)]">
              Premium pet supply ecosystem — fictional demo. All products, rewards, and contact details are
              placeholders.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--cp-slate)]">Shop</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href={CP_PATHS.shop} className="text-[var(--cp-charcoal)] hover:text-[var(--cp-blue)]">
                  All Products
                </Link>
              </li>
              <li>
                <Link href={CP_PATHS.rewards} className="text-[var(--cp-charcoal)] hover:text-[var(--cp-blue)]">
                  Rewards
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--cp-slate)]">Support</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--cp-charcoal)]">
              <li>
                <a href={CP_PHONE_HREF} className="hover:text-[var(--cp-blue)]">
                  {CP_PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${CP_EMAIL}`} className="hover:text-[var(--cp-blue)]">
                  {CP_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-[var(--cp-border)] pt-6 text-center text-xs text-[var(--cp-slate)]">
          © {new Date().getFullYear()} {CP_SITE} — Fictional demo · Nice Guy Web Design
        </p>
      </div>
    </footer>
  );
}
