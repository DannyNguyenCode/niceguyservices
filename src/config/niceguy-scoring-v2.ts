/** Nice Guy Metrics v2 — category weights, labels, and versioning. */

export const NICEGUY_SCORING_VERSION_V1 = "niceguy-v1";
export const NICEGUY_SCORING_VERSION_V2 = "niceguy-v2";
export const NICEGUY_RUBRIC_VERSION = "2026-08-04";
export const NICEGUY_APPLICABILITY_VERSION = "2026-08-04";

export const CATEGORY_WEIGHTS_V2 = {
    businessClarity: 0.15,
    trustCredibility: 0.1,
    conversionReadiness: 0.2,
    userExperience: 0.2,
    brandingConsistency: 0.1,
    contentQuality: 0.1,
    technicalFoundation: 0.15,
} as const;

export type NiceGuyCategoryKeyV2 = keyof typeof CATEGORY_WEIGHTS_V2;

export const CATEGORY_LABELS_V2: Record<NiceGuyCategoryKeyV2, string> = {
    businessClarity: "Business Clarity",
    trustCredibility: "Trust and Credibility Signals",
    conversionReadiness: "Conversion Readiness",
    userExperience: "Usability and Accessibility",
    brandingConsistency: "Brand and Visual Consistency",
    contentQuality: "Content Completeness and Usefulness",
    technicalFoundation: "Technical Foundation",
};

const weightTotal = Object.values(CATEGORY_WEIGHTS_V2).reduce((sum, w) => sum + w, 0);
if (Math.abs(weightTotal - 1) > 0.0001) {
    throw new Error(`Nice Guy v2 category weights must total 1.0 (got ${weightTotal})`);
}

/** Categories required to meet minimum coverage for a complete score. */
export const REQUIRED_CATEGORY_COVERAGE_KEYS: NiceGuyCategoryKeyV2[] = [
    "businessClarity",
    "conversionReadiness",
    "technicalFoundation",
];

export const COMPLETE_SCORE_MIN_OVERALL_COVERAGE = 70;
export const COMPLETE_SCORE_MIN_CATEGORY_COVERAGE = 60;

export const METHODOLOGY_DISCLAIMER =
    "Nice Guy Metrics is a deterministic and evidence-based website screening system. Some visual observations may be AI-assisted and are labelled separately. Results reflect the pages and resources successfully inspected during this audit and are not a guarantee of accessibility, legal compliance, search ranking, business credibility, or conversion performance.";
