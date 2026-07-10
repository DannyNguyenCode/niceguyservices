import pricingContent from "./pricingContent.json";

/** Main content column: matches /pricing inner width (1200px + horizontal padding). */
export const sitePageContentClass =
    "mx-auto w-full max-w-[1200px] px-6 md:px-8";

export function goToContact() {
    window.location.href = pricingContent.meta.contactHref;
}

/** Pixel / JetBrains Mono — use for headings & CTAs site-wide. */
export const pricingLayoutHeadline = "font-pixel";

/** Inter — body copy. */
export const pricingLayoutBodyFont = "font-pm-body";

export const pixelPageHeading = "text-[color:var(--ng-heading)] capitalize";
export const pixelPageEyebrow = "text-[color:var(--ng-accent)] capitalize";
export const pixelKeywordHighlight = "pixel-word ng-pixel-word-highlight";
export const pixelKeywordBase = "pixel-word ng-pixel-word-base";

export const pricingLayoutGlassCard =
    "rounded-3xl border p-8 backdrop-blur-xl transition-all duration-300";

export type TrustAccent = "primary" | "secondary" | "tertiary";
