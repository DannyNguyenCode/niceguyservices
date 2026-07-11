import pricingContent from "./pricingContent.json";

export const sitePageContentClass =
    "mx-auto w-full min-w-0 max-w-[1200px] px-4 sm:px-6 md:px-8";

/** Fluid page hero titles — scales from ~360px phones to large desktop without overflow. */
export const responsivePageHeroTitleClass =
    "text-[clamp(2.25rem,7vw,3.5rem)] leading-[1.05] sm:text-[clamp(2.5rem,6vw,4rem)] md:text-[clamp(2.75rem,5vw,4.5rem)]";

/** Homepage hero — slightly smaller floor for narrow viewports. */
export const responsiveHomeHeroTitleClass =
    "text-[clamp(1.85rem,8.5vw,2.75rem)] leading-[1.02] sm:text-[clamp(2.25rem,7vw,3.375rem)] lg:text-[4rem]";

export const responsiveHeroBodyClass =
    "text-base leading-relaxed sm:text-[17px] md:text-lg";

export function goToContact() {
    window.location.href = pricingContent.meta.contactHref;
}

export const pricingLayoutHeadline = "font-pm-headline";

export const pricingLayoutHeroHeadline = "font-pixel";

export const pricingLayoutPixelLabel = "font-pixel";

export const pricingLayoutDisplayNumber = "font-pixel";

export const pricingLayoutBodyFont = "font-pm-body";

export const pixelPageHeading = "text-[color:var(--ng-heading)] capitalize";

export const pixelPageEyebrow =
    "text-[color:var(--ng-heading)] capitalize";

export const pixelKeywordHighlight = "pixel-word ng-pixel-word-highlight";

export const pixelKeywordBase = "pixel-word ng-pixel-word-base";

export const siteNavLinkClass =
    "rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ng-primary)]";

/** Shared focus ring for text fields and selects on business pages. */
export const siteFieldFocusClass =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ng-primary)]";

export const siteDisclosureSummaryClass =
    "rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ng-primary)]";

export const pricingLayoutGlassCard =
    "rounded-3xl border p-8 backdrop-blur-xl transition-all duration-300";

export type TrustAccent = "primary" | "secondary" | "tertiary";
