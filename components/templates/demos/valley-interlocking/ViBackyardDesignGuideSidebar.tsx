import Link from "next/link";
import { VI_BACKYARD_DESIGN_GUIDE } from "./valleyInterlockingBackyardDesignGuideContent";
import { ViIcon } from "./ValleyInterlockingShared";

const article = VI_BACKYARD_DESIGN_GUIDE;

export function ViBackyardDesignGuideSidebar() {
  return (
    <aside className="hidden lg:block">
      <nav className="sticky top-24 space-y-8 border border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)] p-8">
        <div>
          <h4 className="vi-label-md mb-6 uppercase tracking-[0.2em] text-[var(--vi-secondary)]">Article Overview</h4>
          <ul className="space-y-4">
            {article.navSections.map((section) => (
              <li key={section.href}>
                <a
                  href={section.href}
                  className="vi-body-md group flex items-center justify-between text-[var(--vi-on-surface-variant)] transition-colors hover:text-[var(--vi-primary)]"
                >
                  {section.label}
                  <ViIcon
                    name="arrow_forward"
                    className="text-sm opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <hr className="border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)]" />

        <div>
          <h4 className="vi-label-md mb-6 uppercase tracking-[0.2em] text-[var(--vi-secondary)]">Related Services</h4>
          <div className="space-y-4">
            {article.sidebarServices.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="block border border-transparent bg-[var(--vi-surface-container-low)] p-4 transition-colors hover:border-[color-mix(in_srgb,var(--vi-outline-variant)_40%,transparent)] hover:bg-[var(--vi-surface-container)]"
              >
                <span className="vi-caption uppercase tracking-widest text-[var(--vi-secondary)]">{service.subtitle}</span>
                <p className="vi-headline-sm mt-1 text-[18px] text-[var(--vi-on-surface)]">{service.title}</p>
              </Link>
            ))}
          </div>
        </div>

        <hr className="border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)]" />

        <div className="bg-[var(--vi-surface-container-high)] p-6">
          <h4 className="vi-label-md mb-4 uppercase tracking-[0.2em] text-[var(--vi-primary)]">Featured Partner</h4>
          <p className="vi-body-md mb-4 italic text-[var(--vi-on-surface-variant)]">
            &ldquo;{article.featuredPartner.quote}&rdquo;
          </p>
          <p className="vi-headline-sm mb-2 text-[var(--vi-on-surface)]">{article.featuredPartner.name}</p>
          <p className="vi-caption mb-6 leading-relaxed text-[var(--vi-on-surface-variant)]">
            {article.featuredPartner.description}
          </p>
          <Link
            href={article.featuredPartner.href}
            className="vi-label-md group inline-flex items-center gap-2 uppercase tracking-widest text-[var(--vi-secondary)] hover:underline"
          >
            Visit Website
            <ViIcon name="open_in_new" className="text-sm transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </nav>
    </aside>
  );
}
