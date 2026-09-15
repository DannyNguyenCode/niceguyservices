import pricingContent from "@/components/pricing/pricingContent.json";

export const PRICING_CURRENCY = "CAD" as const;

export type PublicPricingBillingInterval = "one_time" | "month";

export type PublicPricingOffer = {
    id: string;
    name: string;
    price: string;
    priceCurrency: typeof PRICING_CURRENCY;
    billingInterval: PublicPricingBillingInterval;
    description: string;
};

function parsePriceAmount(raw: string): string {
    const amount = raw.replace(/[^0-9.]/g, "");
    if (!amount) {
        throw new Error(`Pricing package is missing a numeric price: ${raw}`);
    }
    return amount;
}

function billingIntervalFromEyebrow(eyebrow: string): PublicPricingBillingInterval {
    const normalized = eyebrow.trim().toLowerCase();
    if (normalized.includes("month")) {
        return "month";
    }
    return "one_time";
}

export const publicPricingOffers: readonly PublicPricingOffer[] = pricingContent.packages.map(
    (pkg) => ({
        id: pkg.id,
        name: pkg.name,
        price: parsePriceAmount(pkg.upfront),
        priceCurrency: PRICING_CURRENCY,
        billingInterval: billingIntervalFromEyebrow(pkg.upfrontEyebrow),
        description: pkg.tagline,
    }),
);

export function schemaOffersFromPublicPricing() {
    return publicPricingOffers.map((offer) => ({
        "@type": "Offer" as const,
        name: offer.name,
        price: offer.price,
        priceCurrency: offer.priceCurrency,
        description: offer.description,
        ...(offer.billingInterval === "month" ? { unitText: "month" } : {}),
    }));
}
