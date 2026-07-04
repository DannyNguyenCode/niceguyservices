"use client";

import { lcSectionHref } from "./luxeCoConfig";
import {
  LC_CONTACT,
  LC_FOOTER_LEGAL,
  LC_FOOTER_NAV,
  LC_SOCIAL_LINKS,
} from "./luxeCoData";
import { useLuxeCoConsultation } from "./LuxeCoConsultation";
import { LcContainer, LcIcon, lcDisplay } from "./LuxeCoShared";

const FOOTER_COLUMNS = [
  { title: "Services", links: LC_FOOTER_NAV.services },
  { title: "Company", links: LC_FOOTER_NAV.company },
  { title: "Resources", links: LC_FOOTER_NAV.resources },
] as const;

export function LuxeCoFooter() {
  const openConsultation = useLuxeCoConsultation();

  return (
    <footer className="border-t border-white/10 bg-[var(--lc-charcoal)] text-[var(--lc-bg-elevated)]">
      <LcContainer className="py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-4">
            <p className="lc-display mb-4 text-lg tracking-[0.1em]" style={lcDisplay}>
              LUXE &amp; CO.
            </p>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-[var(--lc-beige)]">
              Premium local real estate guidance — neighborhood insight, curated listings, and
              market intelligence for confident decisions. Fictional demo placeholder copy.
            </p>
            <div className="flex gap-3">
              {LC_SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="lc-focus-ring flex h-10 w-10 items-center justify-center border border-white/15 text-[var(--lc-beige)] transition-colors hover:border-[var(--lc-gold)] hover:text-[var(--lc-gold)]"
                  aria-label={link.name}
                >
                  <LcIcon name={link.icon} className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="lg:col-span-2 lg:col-start-auto">
              <h3 className="lc-label mb-4 text-[var(--lc-gold)]">{col.title}</h3>
              <nav aria-label={col.title}>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.label === "Book Consultation" ? (
                        <button
                          type="button"
                          onClick={openConsultation}
                          className="lc-focus-ring text-sm text-[var(--lc-beige)] transition-colors hover:text-[var(--lc-bg-elevated)]"
                        >
                          {link.label}
                        </button>
                      ) : (
                        <a
                          href={lcSectionHref(link.section)}
                          className="lc-focus-ring text-sm text-[var(--lc-beige)] transition-colors hover:text-[var(--lc-bg-elevated)]"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}

          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="lc-label mb-4 text-[var(--lc-gold)]">Contact</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[var(--lc-beige)]">
              <li>
                <a
                  href={`mailto:${LC_CONTACT.email}`}
                  className="lc-focus-ring transition-colors hover:text-[var(--lc-bg-elevated)]"
                >
                  {LC_CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${LC_CONTACT.phone.replace(/\D/g, "")}`}
                  className="lc-focus-ring transition-colors hover:text-[var(--lc-bg-elevated)]"
                >
                  {LC_CONTACT.phone}
                </a>
              </li>
              <li>{LC_CONTACT.address}</li>
            </ul>
          </div>
        </div>

        <div className="lc-section-divider my-10 opacity-60" />

        <div className="flex flex-col gap-4 text-xs text-[var(--lc-beige)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} LUXE &amp; CO. — Template demo. Not a real brokerage.</p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {LC_FOOTER_LEGAL.map((link) => (
                <li key={link.label}>
                  <a
                    href={lcSectionHref(link.section)}
                    className="lc-focus-ring transition-colors hover:text-[var(--lc-bg-elevated)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </LcContainer>
    </footer>
  );
}
