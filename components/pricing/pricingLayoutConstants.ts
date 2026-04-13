import pricingContent from "./pricingContent.json";

export function goToContact() {
    window.location.href = pricingContent.meta.contactHref;
}

export const pricingLayoutHeadline = "font-pm-headline";
export const pricingLayoutBodyFont = "font-pm-body";

export const pricingLayoutGlassCard =
    "rounded-3xl border p-8 backdrop-blur-xl transition-all duration-300";

export type TrustAccent = "primary" | "secondary" | "tertiary";
