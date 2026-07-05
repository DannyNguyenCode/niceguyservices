import Link from "next/link";
import { VI_PATIO_DESIGN_GUIDE } from "./valleyInterlockingPatioDesignGuideContent";
import { ViArticleRelatedServices } from "./ViArticleRelatedServices";
import { ViIcon, ViImg } from "./ValleyInterlockingShared";

const article = VI_PATIO_DESIGN_GUIDE;

export function ViPatioDesignGuideSidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:gap-8">
      <div className="lg:sticky lg:top-24 lg:space-y-8">
        <div className="border-b border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)] pb-8">
          <p className="vi-label-md mb-6 text-[var(--vi-on-surface)]">Article Overview</p>
          <ul className="space-y-4">
            {article.navSections.map((section: any, index: any) => (
              <li key={section.href}>
                <a
                  href={section.href}
                  className={`vi-caption block pl-4 transition-colors ${
                    index === 0
                      ? "border-l-2 border-[var(--vi-primary)] text-[var(--vi-primary)]"
                      : "text-[var(--vi-on-surface-variant)] hover:text-[var(--vi-primary)]"
                  }`}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="vi-caption mt-[var(--vi-stack-md)] border-t border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)] pt-[var(--vi-stack-md)] italic text-[var(--vi-on-surface-variant)]">
            Estimated read: {article.readTime.replace(" read", "")}
          </p>
        </div>

        <ViArticleRelatedServices services={article.relatedServices} />

        <div className="overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--vi-outline-variant)_20%,transparent)] bg-[var(--vi-surface-container-high)] p-6">
          <div className="relative mb-4 h-32 overflow-hidden rounded">
            <ViImg
              src={VI_PATIO_DESIGN_GUIDE.heroImage}
              alt={VI_PATIO_DESIGN_GUIDE.heroImageAlt}
              fill
              className="object-cover"
              sizes="300px"
            />
          </div>
          <p className="vi-caption mb-4 text-[var(--vi-on-surface-variant)]">
            Ready to turn your patio plan into a built outdoor living space? Our team handles design, base prep, and
            expert installation.
          </p>
          <Link
            href={article.closing.primaryHref}
            className="vi-label-md inline-flex items-center gap-2 text-[var(--vi-secondary)] uppercase tracking-widest hover:underline"
          >
            Schedule Consultation
            <ViIcon name="arrow_forward" className="text-sm" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
