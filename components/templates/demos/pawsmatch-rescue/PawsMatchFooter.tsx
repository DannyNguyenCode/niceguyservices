import Link from "next/link";
import {
  PMR_CONTACT,
  PMR_FOOTER_LINKS,
} from "./pawsMatchRescueData";
import { PmrContainer, PmrIcon, pmrDisplay } from "./PawsMatchShared";

const SOCIAL_LINKS = [
  { name: "Instagram", icon: "photo_camera", href: "#" },
  { name: "Facebook", icon: "groups", href: "#" },
  { name: "Email", icon: "mail", href: `mailto:${PMR_CONTACT.email}` },
] as const;

export function PawsMatchFooter() {
  return (
    <footer className="border-t border-[var(--pmr-line)] bg-[var(--pmr-bg-warm)] py-14">
      <PmrContainer>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p
              className="mb-3 text-xl font-bold text-[var(--pmr-brown)]"
              style={pmrDisplay}
            >
              PawsMatch Rescue
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--pmr-brown-muted)]">
              A premium matching platform with the warmth of a rescue story. Every placement
              is personal — fictional demo, all placeholder copy.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="pmr-focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pmr-line)] bg-[var(--pmr-card)] text-[var(--pmr-brown-muted)] transition-colors hover:border-[var(--pmr-terracotta)] hover:text-[var(--pmr-terracotta)]"
                  aria-label={link.name}
                >
                  <PmrIcon name={link.icon} className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="pmr-label mb-4 text-[var(--pmr-brown)]">Quick Links</h3>
            <nav aria-label="Footer">
              <ul className="flex flex-col gap-2.5">
                {PMR_FOOTER_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="pmr-focus-ring text-sm text-[var(--pmr-brown-muted)] transition-colors hover:text-[var(--pmr-terracotta)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="pmr-label mb-4 text-[var(--pmr-brown)]">Contact</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[var(--pmr-brown-muted)]">
              <li>
                <a
                  href={`mailto:${PMR_CONTACT.email}`}
                  className="pmr-focus-ring transition-colors hover:text-[var(--pmr-terracotta)]"
                >
                  {PMR_CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${PMR_CONTACT.phone.replace(/\D/g, "")}`}
                  className="pmr-focus-ring transition-colors hover:text-[var(--pmr-terracotta)]"
                >
                  {PMR_CONTACT.phone}
                </a>
              </li>
              <li>{PMR_CONTACT.address}</li>
            </ul>
          </div>

          <div>
            <h3 className="pmr-label mb-4 text-[var(--pmr-brown)]">Hours</h3>
            <p className="text-sm leading-relaxed text-[var(--pmr-brown-muted)]">
              Tue–Sat: 10am – 6pm
              <br />
              Sun: 11am – 4pm
              <br />
              Mon: Closed (foster visits by appointment)
            </p>
          </div>
        </div>

        <div className="pmr-section-divider my-8" />

        <div className="flex flex-col gap-3 text-xs text-[var(--pmr-brown-light)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PawsMatch Rescue — Template demo. Not a real shelter.</p>
          <div className="flex gap-4">
            <a href="#" className="pmr-focus-ring hover:text-[var(--pmr-brown-muted)]">
              Privacy
            </a>
            <a href="#" className="pmr-focus-ring hover:text-[var(--pmr-brown-muted)]">
              Terms
            </a>
            <a href="#" className="pmr-focus-ring hover:text-[var(--pmr-brown-muted)]">
              Accessibility
            </a>
          </div>
        </div>
      </PmrContainer>
    </footer>
  );
}
