import Link from "next/link";
import { SparkLogo } from "./SparkLogo";
import { LAS_CONTACT, LAS_FOOTER, LAS_SITE, LAS_SOCIAL } from "./leaveASparkSiteContent";
import { lasPath } from "./leaveASparkConfig";
import { TextureOverlay } from "./TextureOverlays";

export function LasFooter() {
  return (
    <footer className="relative bg-[var(--las-bg-secondary)]">
      <div className="las-footer-circuit" aria-hidden />
      <TextureOverlay className="las-section-py" grain ink grid>
        <div className="las-container">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            <div className="sm:col-span-2 lg:col-span-4">
              <SparkLogo />
              <p className="las-body mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-[var(--las-muted)]">
                {LAS_FOOTER.statement}
              </p>
              <p className="las-label mt-4 text-[var(--las-muted)]">{LAS_SITE.license}</p>
            </div>
            {LAS_FOOTER.columns.map((col) => (
              <div key={col.title} className="lg:col-span-2">
                <p className="las-label mb-4 text-[var(--las-muted)]">{col.title}</p>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href.startsWith("/") ? lasPath(link.href) : link.href}
                        className={`las-body las-focus-ring text-[0.9375rem] transition-colors hover:text-[var(--las-red-bright)] ${
                          link.highlight ? "font-semibold text-[var(--las-red)]" : "text-[var(--las-muted)]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="lg:col-span-4">
              <p className="las-label mb-4 text-[var(--las-muted)]">Service Area</p>
              <p className="las-body text-[0.9375rem] leading-relaxed text-[var(--las-muted)]">{LAS_SITE.serviceArea}</p>
              <p className="las-body mt-4 text-[0.9375rem] text-[var(--las-muted)]">{LAS_CONTACT.address}</p>
              <p className="las-body mt-2 text-[0.9375rem] text-[var(--las-muted)]">{LAS_CONTACT.hours}</p>
              <div className="mt-6 flex flex-wrap gap-4">
                {LAS_SOCIAL.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    className="las-focus-ring las-label text-[var(--las-muted)] hover:text-[var(--las-red)]"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <p className="las-body mt-12 border-t border-[var(--las-divider)] pt-8 text-center text-[0.8125rem] text-[var(--las-muted)]">
            {LAS_SITE.copyright}
          </p>
        </div>
      </TextureOverlay>
    </footer>
  );
}
