import { HR_SECTIONS, hrSectionHref } from "./homeRestorationConfig";
import { HR_CONTACT, HR_FOOTER_NAV, HR_SOCIAL_LINKS } from "./homeRestorationData";
import { HrArchDecoration, HrContainer, HrIcon, hrDisplay } from "./HomeRestorationShared";

export function HomeRestorationFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--hr-line)] bg-[var(--hr-bg-warm)] text-[var(--hr-charcoal-muted)]">
      <HrArchDecoration className="right-0 top-0 h-64 w-48 -translate-y-1/4 translate-x-1/4" />
      <HrArchDecoration className="bottom-0 left-0 h-48 w-36 translate-y-1/3 -translate-x-1/4" />

      <HrContainer className="relative py-16">
        <div className="mb-12 text-center">
          <p className="hr-display mb-3 text-lg tracking-[0.1em] text-[var(--hr-charcoal)]" style={hrDisplay}>
            Home Restoration
          </p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {HR_FOOTER_NAV.map((link) => (
                <li key={link.label}>
                  <a
                    href={hrSectionHref(link.section)}
                    className="hr-focus-ring text-sm transition-colors hover:text-[var(--hr-charcoal)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="hr-label mb-4 text-[var(--hr-gold)]">Contact</h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${HR_CONTACT.email}`}
                  className="hr-focus-ring transition-colors hover:text-[var(--hr-charcoal)]"
                >
                  {HR_CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${HR_CONTACT.phone.replace(/\D/g, "")}`}
                  className="hr-focus-ring transition-colors hover:text-[var(--hr-charcoal)]"
                >
                  {HR_CONTACT.phone}
                </a>
              </li>
              <li>{HR_CONTACT.address}</li>
            </ul>
          </div>

          <div>
            <h3 className="hr-label mb-4 text-[var(--hr-gold)]">Service Areas</h3>
            <ul className="flex flex-col gap-2 text-sm">
              {HR_CONTACT.serviceAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="hr-label mb-4 text-[var(--hr-gold)]">Follow</h3>
            <div className="flex gap-3">
              {HR_SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="hr-focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-[var(--hr-line)] text-[var(--hr-charcoal-muted)] transition-colors hover:border-[var(--hr-gold)] hover:text-[var(--hr-gold)]"
                  aria-label={link.name}
                >
                  <HrIcon name={link.icon} className="text-lg" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="hr-section-divider my-10" />

        <div className="flex flex-col gap-3 text-center text-xs sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Home Restoration — Template demo. Fictional placeholder copy.</p>
          <p>
            <a href={hrSectionHref(HR_SECTIONS.contact)} className="hr-focus-ring hover:text-[var(--hr-charcoal)]">
              Begin Your Restoration
            </a>
          </p>
        </div>
      </HrContainer>
    </footer>
  );
}
