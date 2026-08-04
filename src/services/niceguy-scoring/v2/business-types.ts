import "server-only";

import {
    ACTION_CTAS,
    SERVICE_KEYWORDS,
} from "@/src/services/niceguy-scoring/dictionaries";
import { allButtons, allVisibleText, normalizeText } from "@/src/services/niceguy-scoring/helpers";
import type { NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

export const BUSINESS_TYPES = [
    "local_service",
    "professional_service",
    "ecommerce",
    "restaurant_hospitality",
    "healthcare",
    "portfolio",
    "nonprofit",
    "saas",
    "informational_publisher",
    "unknown",
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];

export type BusinessTypeDetection = {
    detected: BusinessType;
    confidence: "high" | "medium" | "low";
    evidence: string[];
    applied: BusinessType;
};

const LOCAL_KEYWORDS = [
    "plumbing",
    "hvac",
    "electrician",
    "cleaning",
    "landscaping",
    "roofing",
    "serving",
    "service area",
    "locally owned",
];
const ECOMMERCE_KEYWORDS = ["cart", "checkout", "shop", "store", "add to cart", "buy now"];
const SAAS_KEYWORDS = ["saas", "software", "platform", "subscription", "free trial", "sign up"];
const HEALTHCARE_KEYWORDS = ["clinic", "dental", "medical", "physician", "patient", "healthcare"];
const RESTAURANT_KEYWORDS = ["restaurant", "menu", "reservation", "dining", "catering", "hours"];
const PORTFOLIO_KEYWORDS = ["portfolio", "case study", "our work", "projects", "gallery"];
const NONPROFIT_KEYWORDS = ["donate", "nonprofit", "charity", "volunteer", "mission"];
const PUBLISHER_KEYWORDS = ["blog", "article", "news", "editorial", "subscribe"];

function countKeywordHits(text: string, keywords: string[]): string[] {
    return keywords.filter((keyword) => text.includes(keyword));
}

export function detectBusinessType(input: NiceGuyScoringInput): BusinessTypeDetection {
    const visible = allVisibleText(input);
    const buttons = allButtons(input)
        .map((button) => normalizeText(button.text))
        .join(" ");
    const combined = `${visible} ${buttons}`;
    const industry = normalizeText(input.website.industry);

    const scores: Array<{ type: BusinessType; hits: string[]; weight: number }> = [
        { type: "ecommerce", hits: countKeywordHits(combined, ECOMMERCE_KEYWORDS), weight: 2 },
        { type: "saas", hits: countKeywordHits(combined, SAAS_KEYWORDS), weight: 2 },
        { type: "healthcare", hits: countKeywordHits(combined, HEALTHCARE_KEYWORDS), weight: 2 },
        {
            type: "restaurant_hospitality",
            hits: countKeywordHits(combined, RESTAURANT_KEYWORDS),
            weight: 2,
        },
        { type: "portfolio", hits: countKeywordHits(combined, PORTFOLIO_KEYWORDS), weight: 2 },
        { type: "nonprofit", hits: countKeywordHits(combined, NONPROFIT_KEYWORDS), weight: 2 },
        {
            type: "informational_publisher",
            hits: countKeywordHits(combined, PUBLISHER_KEYWORDS),
            weight: 2,
        },
        { type: "local_service", hits: countKeywordHits(combined, LOCAL_KEYWORDS), weight: 1.5 },
    ];

    if (industry.includes("plumb") || industry.includes("hvac") || industry.includes("clean")) {
        scores.push({ type: "local_service", hits: [industry], weight: 3 });
    }

    const serviceHits = SERVICE_KEYWORDS.filter((keyword) => combined.includes(keyword));
    if (serviceHits.length >= 2 && input.crawl.hasServicesPage) {
        scores.push({ type: "professional_service", hits: serviceHits, weight: 1.5 });
    }

    const ranked = scores
        .map((entry) => ({
            ...entry,
            score: entry.hits.length * entry.weight,
        }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score);

    if (ranked.length === 0) {
        const hasCta = ACTION_CTAS.some((cta) => combined.includes(cta));
        return {
            detected: hasCta ? "professional_service" : "unknown",
            confidence: "low",
            evidence: hasCta ? ["Conversion-oriented language without clear industry match"] : [],
            applied: hasCta ? "professional_service" : "unknown",
        };
    }

    const top = ranked[0];
    const confidence =
        top.score >= 4 ? "high" : top.score >= 2 ? "medium" : ("low" as const);

    return {
        detected: top.type,
        confidence,
        evidence: top.hits,
        applied: top.type,
    };
}

export function requiresLocation(type: BusinessType): boolean {
    return (
        type === "local_service" ||
        type === "healthcare" ||
        type === "restaurant_hospitality" ||
        type === "professional_service"
    );
}

export function isUniversalOffer(type: BusinessType): boolean {
    return type === "saas" || type === "ecommerce" || type === "informational_publisher";
}

export function requiresCredentials(type: BusinessType): boolean {
    return type === "healthcare" || type === "professional_service";
}

export function requiresCheckoutPolicies(type: BusinessType): boolean {
    return type === "ecommerce";
}
