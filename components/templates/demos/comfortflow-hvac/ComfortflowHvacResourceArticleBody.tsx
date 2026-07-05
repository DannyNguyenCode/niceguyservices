"use client";

import Link from "next/link";
import { CFH_PATHS, cfhPath } from "./comfortflowHvacConfig";
import { cfhResourceArticle } from "./comfortflowHvacSiteContent";
import { CfhContainer, CfhCtaLink, CfhIcon } from "./ComfortflowHvacShared";

export function ComfortflowHvacResourceArticleBody({ slug }: { slug: string }) {
  const article = cfhResourceArticle(slug);

  if (!article) {
    return (
      <main id="cfh-main-content" className="cfh-main overflow-x-hidden">
        <CfhContainer className="cfh-section-py">
          <h1 className="cfh-display mb-4 text-[var(--cfh-primary)]">Article Not Found</h1>
          <Link
            href={CFH_PATHS.resources}
            className="cfh-interactive cfh-label-caps inline-flex items-center gap-2 text-[var(--cfh-secondary)]"
          >
            <CfhIcon name="arrow_back" className="text-sm" />
            Back to Resources
          </Link>
        </CfhContainer>
      </main>
    );
  }

  return (
    <main id="cfh-main-content" className="cfh-main overflow-x-hidden">
      <CfhContainer className="cfh-section-py max-w-3xl">
        <Link
          href={CFH_PATHS.resources}
          className="cfh-interactive cfh-label-caps mb-8 inline-flex items-center gap-2 text-[var(--cfh-secondary)] hover:gap-3"
        >
          <CfhIcon name="arrow_back" className="text-sm" />
          Back to Resources
        </Link>

        <span className="cfh-label-caps mb-4 block text-[var(--cfh-brand-indigo)]">{article.category}</span>
        <h1 className="cfh-display cfh-gradient-text mb-8">{article.title}</h1>

        <div className="space-y-6 border-l-4 border-[var(--cfh-secondary)] pl-6">
          {article.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="cfh-body-lg text-[var(--cfh-on-surface-variant)]">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-12 rounded-2xl cfh-glass-card p-8">
          <p className="cfh-body-md mb-6 text-[var(--cfh-on-surface-variant)]">
            Need property-specific guidance? Our engineers can review your system and recommend the right next step.
          </p>
          <CfhCtaLink href={cfhPath("/contact")}>
            Book a Consultation
            <CfhIcon name="arrow_forward" className="text-sm" />
          </CfhCtaLink>
        </div>
      </CfhContainer>
    </main>
  );
}
