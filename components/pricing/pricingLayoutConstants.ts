import pricingContent from "./pricingContent.json";

/** Main content column: matches /pricing inner width (1200px + horizontal padding). */
export const sitePageContentClass =
    "mx-auto w-full max-w-[1200px] px-6 md:px-8";

export function goToContact() {
    window.location.href = pricingContent.meta.contactHref;
}

export const pricingLayoutHeadline = "font-pm-headline";
export const pricingLayoutBodyFont = "font-pm-body";

export const pricingLayoutGlassCard =
    "rounded-3xl border p-8 backdrop-blur-xl transition-all duration-300";

export type TrustAccent = "primary" | "secondary" | "tertiary";
