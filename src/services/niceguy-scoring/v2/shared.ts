import {
    GENERIC_HEADINGS,
    PLACEHOLDER_PATTERNS,
    SERVICE_KEYWORDS,
    STRONG_CTAS,
    WEAK_CTAS,
} from "@/src/services/niceguy-scoring/dictionaries";
import {
    allButtons,
    allForms,
    allVisibleText,
    getHomepage,
    getPageByType,
    hasLocationEvidence,
    hasPlaceholderContent,
    hasTrustLanguage,
    isGenericHeading,
    isGenericTitle,
    isStrongCta,
    isWeakCta,
    normalizeText,
    textSimilarity,
} from "@/src/services/niceguy-scoring/helpers";
import type { NiceGuyScoringInput, NormalizedPageResult } from "@/src/services/niceguy-scoring/types";

export const GENERIC_ADJECTIVES = [
    "quality",
    "trusted",
    "professional",
    "leading",
    "innovative",
    "best",
    "excellent",
    "premier",
    "top",
    "world-class",
];

export const AUDIENCE_PATTERNS = [
    "for homeowners",
    "for businesses",
    "for families",
    "for small business",
    "serving",
    "helping",
    "designed for",
    "ideal for",
    "whether you are",
    "if you need",
];

export const SUPERLATIVE_PATTERNS = [
    "best in",
    "#1",
    "number one",
    "lowest price",
    "guaranteed results",
    "100% satisfaction",
    "award-winning",
];

export {
    allButtons,
    allForms,
    allVisibleText,
    getHomepage,
    getPageByType,
    hasLocationEvidence,
    hasPlaceholderContent,
    hasTrustLanguage,
    isGenericHeading,
    isGenericTitle,
    isStrongCta,
    isWeakCta,
    normalizeText,
    textSimilarity,
    GENERIC_HEADINGS,
    PLACEHOLDER_PATTERNS,
    SERVICE_KEYWORDS,
    STRONG_CTAS,
    WEAK_CTAS,
};

export function getHeroText(homepage: NormalizedPageResult | null): string {
    if (!homepage) return "";
    const h1 = homepage.headings.find((heading) => heading.level === 1)?.text ?? "";
    const supporting = homepage.headings
        .filter((heading) => heading.level === 2)
        .slice(0, 2)
        .map((heading) => heading.text)
        .join(" ");
    const visible = (homepage.visibleText ?? "").slice(0, 600);
    return `${h1} ${supporting} ${visible}`.trim();
}

export function hasSpecificOffer(text: string): boolean {
    const normalized = normalizeText(text);
    if (!normalized || normalized.length < 20) return false;
    const genericOnly = GENERIC_ADJECTIVES.some(
        (adj) => normalized.includes(adj) && normalized.split(" ").length < 12,
    );
    if (genericOnly) return false;
    const serviceHit = SERVICE_KEYWORDS.some((keyword) => normalized.includes(keyword));
    const hasConcreteNoun =
        /\b(repair|installation|cleaning|design|consulting|therapy|plumbing|hvac|legal|accounting|marketing|coaching|training|development|maintenance|inspection)\b/i.test(
            normalized,
        );
    return serviceHit || hasConcreteNoun || normalized.length >= 40;
}

export function findPrimaryCta(input: NiceGuyScoringInput): {
    text: string;
    href?: string;
    pageUrl: string;
} | null {
    const homepage = getHomepage(input);
    if (!homepage) return null;
    const homepageButtons = homepage.buttons.filter((button) => normalizeText(button.text));
    if (homepageButtons.length === 0) {
        const global = allButtons(input);
        return global[0] ?? null;
    }
    const strong = homepageButtons.find((button) => isStrongCta(button.text));
    if (strong) return { ...strong, pageUrl: homepage.url };
    const nonWeak = homepageButtons.find((button) => !isWeakCta(button.text));
    return nonWeak
        ? { ...nonWeak, pageUrl: homepage.url }
        : homepageButtons[0]
          ? { ...homepageButtons[0], pageUrl: homepage.url }
          : null;
}

export function hasLabeledFormFields(
    forms: ReturnType<typeof allForms>,
): { labeled: number; unlabeled: number; placeholderOnly: number } {
    let labeled = 0;
    let unlabeled = 0;
    let placeholderOnly = 0;
    for (const form of forms) {
        for (const field of form.fields) {
            if (field.type === "submit" || field.type === "hidden") continue;
            const label = normalizeText(field.label);
            const name = normalizeText(field.name);
            if (label && label.length > 1) labeled += 1;
            else if (name && !["field", "input", "text"].includes(name)) labeled += 1;
            else if (name) placeholderOnly += 1;
            else unlabeled += 1;
        }
    }
    return { labeled, unlabeled, placeholderOnly };
}

export function imageAltCoverage(images: Array<{ alt?: string }>): {
    total: number;
    withAlt: number;
    decorative: number;
    missing: number;
} {
    let withAlt = 0;
    let decorative = 0;
    let missing = 0;
    for (const image of images) {
        const alt = image.alt;
        if (alt === "") decorative += 1;
        else if (alt && alt.trim().length > 0) withAlt += 1;
        else missing += 1;
    }
    return { total: images.length, withAlt, decorative, missing };
}

export function collectAllImages(input: NiceGuyScoringInput) {
    return input.crawl.pageResults.flatMap((page) =>
        page.images.map((image) => ({ ...image, pageUrl: page.url })),
    );
}
