import { LUMINA_NAV_ITEMS, LUMINA_SECTIONS, luminaSectionHref } from "./luminaConfig";
import { luminaDisplay, luminaLabel } from "./LuminaShared";

export function LuminaFooter() {
  return (
    <footer className="border-t border-[var(--lumina-line)] bg-[var(--lumina-bg)] px-5 py-12 md:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[var(--lumina-container)] flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p
            className="lumina-display mb-3 text-lg text-[var(--lumina-cream)]"
            style={luminaDisplay}
          >
            Lumina Landscapes
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--lumina-cream-muted)]">
            A design-led landscape architecture studio crafting private outdoor retreats with
            architectural precision. Fictional demo — all projects and contact details are
            placeholder.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {LUMINA_NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={luminaSectionHref(item.id)}
                  className="lumina-label text-[var(--lumina-cream-muted)] transition-colors hover:text-[var(--lumina-bronze)]"
                  style={luminaLabel}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={luminaSectionHref(LUMINA_SECTIONS.consultation)}
          className="lumina-label shrink-0 border-b border-[var(--lumina-bronze)] pb-0.5 text-[var(--lumina-bronze)] transition-opacity hover:opacity-80"
          style={luminaLabel}
        >
          Begin My Landscape Plan
        </a>
      </div>

      <div className="mx-auto mt-10 max-w-[var(--lumina-container)] lumina-section-divider" />

      <p className="mx-auto mt-6 max-w-[var(--lumina-container)] text-xs text-[var(--lumina-cream-muted)]/60">
        © {new Date().getFullYear()} Lumina Landscapes — Template demo. Not a real business.
      </p>
    </footer>
  );
}
