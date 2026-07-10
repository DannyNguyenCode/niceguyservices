import pricingContent from "./pricingContent.json";

export const sitePageContentClass =
    "mx-auto w-full max-w-[1200px] px-6 md:px-8";

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

export const pricingLayoutGlassCard =
    "rounded-3xl border p-8 backdrop-blur-xl transition-all duration-300";

export type TrustAccent = "primary" | "secondary" | "tertiary";
