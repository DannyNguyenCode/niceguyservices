export type OpportunityPriority = "high" | "medium" | "low";
export type FailedAuditSeverity = "critical" | "high" | "medium" | "low";

export const PAGESPEED_PARSER_LIMITS = {
    maxOpportunities: 20,
    maxDiagnostics: 20,
    maxFailedAudits: 50,
} as const;

export function normalizeLighthouseScore(score: unknown): number | null {
    if (typeof score !== "number" || Number.isNaN(score)) {
        return null;
    }
    return Math.round(score * 100);
}

export function assignOpportunityPriority(input: {
    score?: number | null;
    estimatedSavingsMs?: number | null;
    estimatedSavingsBytes?: number | null;
}): OpportunityPriority {
    const savingsMs = input.estimatedSavingsMs ?? 0;
    const savingsBytes = input.estimatedSavingsBytes ?? 0;
    const score = input.score ?? 1;

    if (savingsMs >= 1_000 || savingsBytes >= 500_000 || score < 0.25) {
        return "high";
    }
    if (savingsMs >= 300 || savingsBytes >= 100_000 || score < 0.5) {
        return "medium";
    }
    return "low";
}

export function assignFailedAuditSeverity(input: {
    score?: number | null;
    category: string;
}): FailedAuditSeverity {
    const score = input.score;
    const category = input.category;

    if (score === 0) return "critical";

    if (score !== null && score !== undefined) {
        if (score < 0.5) return "high";
        if (score < 0.9) return "medium";
        if (score < 1) return "low";
    }

    if (["accessibility", "seo", "best-practices"].includes(category)) {
        return "high";
    }

    return "medium";
}

export function scoreDisplayLabel(score: number | null | undefined): string {
    if (score === null || score === undefined) return "Not available";
    if (score >= 90) return "Strong";
    if (score >= 50) return "Needs improvement";
    return "Poor";
}

export function isApplicableAuditScoreDisplayMode(mode: string | undefined): boolean {
    if (!mode) return false;
    return !["notApplicable", "manual", "informative", "error"].includes(mode);
}

export function isFailedAuditScore(
    score: unknown,
    scoreDisplayMode: string | undefined,
): boolean {
    if (!isApplicableAuditScoreDisplayMode(scoreDisplayMode)) {
        return false;
    }
    if (typeof score !== "number" || Number.isNaN(score)) {
        return false;
    }
    return score < 1;
}
