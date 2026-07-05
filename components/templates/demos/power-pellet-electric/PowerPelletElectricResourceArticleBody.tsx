"use client";

import Link from "next/link";
import { PPE_PATHS, ppePath } from "./powerPelletElectricConfig";
import { ppeResourceArticle } from "./powerPelletElectricSiteContent";
import { PpeContainer, PpeCtaLink, PpeIcon } from "./PowerPelletElectricShared";

export function PowerPelletElectricResourceArticleBody({ slug }: { slug: string }) {
  const article = ppeResourceArticle(slug);

  if (!article) {
    return (
      <main id="ppe-main-content" className="ppe-main px-[var(--ppe-margin-mobile)] pb-24 pt-32 md:px-[var(--ppe-margin-desktop)]">
        <PpeContainer>
          <h1 className="ppe-display mb-4 text-[var(--ppe-primary-fixed)]">Resource Not Found</h1>
          <Link href={PPE_PATHS.resources} className="ppe-interactive ppe-label-caps text-[var(--ppe-secondary)]">
            ← Back to Resources
          </Link>
        </PpeContainer>
      </main>
    );
  }

  return (
    <main id="ppe-main-content" className="ppe-main px-[var(--ppe-margin-mobile)] pb-24 pt-32 md:px-[var(--ppe-margin-desktop)] md:pb-12">
      <PpeContainer className="max-w-3xl">
        <Link
          href={PPE_PATHS.resources}
          className="ppe-interactive mb-8 inline-flex items-center gap-2 ppe-label-caps text-[var(--ppe-secondary)] hover:gap-3"
        >
          <PpeIcon name="arrow_back" className="text-sm" />
          Back to Resources
        </Link>

        <span className="mb-4 inline-block ppe-label-caps uppercase text-[var(--ppe-energy-orange)]">
          {article.category}
        </span>
        <h1 className="ppe-display mb-6 uppercase text-[var(--ppe-primary-fixed)]">{article.title}</h1>
        <p className="ppe-body-lg mb-10 text-[var(--ppe-on-surface-variant)]">{article.description}</p>

        <div className="mb-10 space-y-6 border-l-4 border-[var(--ppe-primary-fixed)] pl-6">
          <p className="ppe-body-md text-[var(--ppe-on-surface-variant)]">
            This demo article summarizes key points for homeowners and business owners. For property-specific guidance,
            send details through the contact page so an electrician can review your situation.
          </p>
          <p className="ppe-body-md text-[var(--ppe-on-surface-variant)]">
            Electrical work should always follow local codes and safety standards. If you notice sparks, burning smells,
            warm outlets, or repeated breaker trips, treat the issue as urgent and request professional help.
          </p>
        </div>

        <PpeCtaLink href={ppePath("/contact")} className="rounded-full px-8 py-4 font-bold">
          Contact Power Pellet Electric
          <PpeIcon name="bolt" />
        </PpeCtaLink>
      </PpeContainer>
    </main>
  );
}
