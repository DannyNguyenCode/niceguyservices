import type { NiceGuyCategoryKey } from "@/src/config/niceguy-scoring";
import { CATEGORY_LABELS, scorePresentationLabel } from "@/src/config/niceguy-scoring";

const CATEGORY_INTERPRETATIONS: Record<NiceGuyCategoryKey, (score: number) => string> = {
    businessClarity: (score) =>
        score >= 75
            ? "Visitors can quickly understand what the business offers."
            : score >= 50
              ? "The business message is present but could be clearer on key pages."
              : "The website does not yet make the core service offering obvious enough.",
    trustCredibility: (score) =>
        score >= 75
            ? "The site presents credible trust signals for prospective customers."
            : score >= 50
              ? "Some trust evidence is visible, but stronger proof could be added."
              : "Trust and credibility signals need more visible support.",
    conversionReadiness: (score) =>
        score >= 75
            ? "Visitors have clear paths to take the next step."
            : score >= 50
              ? "Visitors have ways to contact the business, but the path to requesting service could be clearer and more consistent."
              : "Conversion paths are limited or inconsistent across the site.",
    userExperience: (score) =>
        score >= 75
            ? "The site is generally easy to navigate and use."
            : score >= 50
              ? "Usability is acceptable, but some friction remains for visitors."
              : "Navigation and usability issues may make the site harder to use.",
    brandingConsistency: (score) =>
        score >= 75
            ? "Branding feels consistent across reviewed pages."
            : score >= 50
              ? "Branding is mostly consistent with room for refinement."
              : "Branding and visual consistency need improvement.",
    contentQuality: (score) =>
        score >= 75
            ? "Content supports visitor understanding and decision-making."
            : score >= 50
              ? "Content is helpful in places but could be expanded or clarified."
              : "Content does not yet fully support visitor needs.",
    technicalFoundation: (score) =>
        score >= 75
            ? "Technical performance and foundations are in good shape."
            : score >= 50
              ? "Technical performance is acceptable but has room for improvement."
              : "Technical performance or foundations may be holding the site back.",
};

export function getPublicCategoryInterpretation(categoryId: string, score: number): string {
    const key = categoryId as NiceGuyCategoryKey;
    const label = CATEGORY_LABELS[key] ?? categoryId;
    const interpretation =
        CATEGORY_INTERPRETATIONS[key]?.(score) ??
        "This category reflects how well the website performs in this area.";
    return `${label}: ${score}\n\n${interpretation}`;
}

export function pagespeedPublicLabel(score: number | null | undefined): string {
    if (score === null || score === undefined) return "Not available";
    if (score >= 90) return "Strong";
    if (score >= 50) return "Needs improvement";
    return "Poor";
}

export function formatPublicScore(score: number | null | undefined): string {
    if (score === null || score === undefined) return "Not available";
    return String(score);
}

export function scorePresentation(score: number | null | undefined): string {
    return scorePresentationLabel(score);
}
