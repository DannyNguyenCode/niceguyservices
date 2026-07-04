import { EvergreenSectionLink } from "@/components/templates/demos/evergreen-alpine/EvergreenSectionLink";
import {
  EVERGREEN_FOOTER_COMPANY,
  EVERGREEN_FOOTER_SERVICES,
} from "@/components/templates/demos/evergreen-alpine/evergreenConfig";

const footerLinkClass =
  "text-[#414844] transition-colors hover:text-[#012d1d]";

export function EvergreenFooter() {
  return (
    <footer className="border-t border-[#c1c8c2]/40 bg-[#e4e2e1] py-16 pb-24 md:py-24 md:pb-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 md:grid-cols-4 md:gap-6 md:px-16">
        <div className="md:col-span-2">
          <p className="font-[family-name:var(--font-eg-headline)] text-xl font-bold text-[#012d1d]">
            EverGreen &amp; Alpine Stewardship
          </p>
          <p className="mt-4 max-w-md text-[#414844]">
            Your property&apos;s partner through every season. Landscaping, maintenance, and snow
            removal for homeowners who expect consistency and care.
          </p>
        </div>

        <div>
          <p className="mb-4 font-bold text-[#1b1c1c]">Services</p>
          <nav className="flex flex-col gap-3" aria-label="Seasonal services">
            {EVERGREEN_FOOTER_SERVICES.map((item) => (
              <EvergreenSectionLink key={item.href} href={item.href} className={footerLinkClass}>
                {item.label}
              </EvergreenSectionLink>
            ))}
          </nav>
        </div>

        <div>
          <p className="mb-4 font-bold text-[#1b1c1c]">Company</p>
          <nav className="flex flex-col gap-3" aria-label="Company">
            {EVERGREEN_FOOTER_COMPANY.map((item) => (
              <EvergreenSectionLink key={item.href} href={item.href} className={footerLinkClass}>
                {item.label}
              </EvergreenSectionLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-7xl flex-col items-start justify-between gap-4 border-t border-[#c1c8c2]/30 px-5 pt-8 text-sm text-[#414844] md:flex-row md:px-16">
        <p>© {new Date().getFullYear()} EverGreen &amp; Alpine Stewardship. All rights reserved.</p>
        <p className="font-bold text-[#012d1d]">Year-round property care.</p>
      </div>
    </footer>
  );
}
