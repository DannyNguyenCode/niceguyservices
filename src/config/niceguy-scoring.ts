export const NICEGUY_SCORING_VERSION = "niceguy-v1";

export const CATEGORY_WEIGHTS = {
    businessClarity: 0.15,
    trustCredibility: 0.15,
    conversionReadiness: 0.2,
    userExperience: 0.15,
    brandingConsistency: 0.1,
    contentQuality: 0.1,
    technicalFoundation: 0.15,
} as const;

export type NiceGuyCategoryKey = keyof typeof CATEGORY_WEIGHTS;

export const CATEGORY_LABELS: Record<NiceGuyCategoryKey, string> = {
    businessClarity: "Business Clarity",
    trustCredibility: "Trust and Credibility",
    conversionReadiness: "Conversion Readiness",
    userExperience: "User Experience",
    brandingConsistency: "Branding and Visual Consistency",
    contentQuality: "Content Quality",
    technicalFoundation: "Technical Foundation",
};

const weightTotal = Object.values(CATEGORY_WEIGHTS).reduce((sum, w) => sum + w, 0);
if (Math.abs(weightTotal - 1) > 0.0001) {
    throw new Error(`Nice Guy category weights must total 1.0 (got ${weightTotal})`);
}

export const SCORE_PRESENTATION_LABELS = {
    excellent: { min: 90, label: "Excellent" },
    strong: { min: 75, label: "Strong" },
    fair: { min: 60, label: "Fair" },
    weak: { min: 40, label: "Weak" },
    critical: { min: 0, label: "Critical" },
} as const;

export function scorePresentationLabel(score: number | null | undefined): string {
    if (score === null || score === undefined || Number.isNaN(score)) {
        return "Not available";
    }
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Strong";
    if (score >= 60) return "Fair";
    if (score >= 40) return "Weak";
    return "Critical";
}
