import {
    CATEGORY_LABELS_V2,
    CATEGORY_WEIGHTS_V2,
    COMPLETE_SCORE_MIN_CATEGORY_COVERAGE,
    COMPLETE_SCORE_MIN_OVERALL_COVERAGE,
    METHODOLOGY_DISCLAIMER,
    NICEGUY_APPLICABILITY_VERSION,
    NICEGUY_RUBRIC_VERSION,
    NICEGUY_SCORING_VERSION_V2,
    REQUIRED_CATEGORY_COVERAGE_KEYS,
    type NiceGuyCategoryKeyV2,
} from "@/src/config/niceguy-scoring-v2";
import { clampScore } from "@/src/services/niceguy-scoring/helpers";
import type {
    CategoryRecommendation,
    CategoryScore,
    CheckPriority,
    CheckStatus,
    MetricCheck,
    MetricEvidence,
    NiceGuyCategories,
    NiceGuyScoreResult,
    NiceGuyScoringInput,
    NiceGuySummary,
} from "@/src/services/niceguy-scoring/types";
import type { BusinessTypeDetection } from "@/src/services/niceguy-scoring/v2/business-types";

export type V2CategoryScore = CategoryScore & {
    evidenceCoverage: number;
    qualityScore: number;
    configuredWeight: number;
    effectiveWeight: number;
    limitations: string[];
};

export type V2NiceGuyCategories = Record<NiceGuyCategoryKeyV2, V2CategoryScore>;

export type ScoreCompleteness = {
    isComplete: boolean;
    label: string;
    provisionalScore: number;
    blockers: string[];
    overallEvidenceCoverage: number;
};

export type NiceGuyMethodology = {
    scoringVersion: string;
    rubricVersion: string;
    applicabilityVersion: string;
    disclaimer: string;
    businessType: BusinessTypeDetection;
    deterministicCheckCount: number;
    aiAssistedCheckCount: number;
    limitations: string[];
};

export type NiceGuyScoreResultV2 = NiceGuyScoreResult & {
    categories: V2NiceGuyCategories;
    completeness: ScoreCompleteness;
    methodology: NiceGuyMethodology;
};

const MEASURED_STATUSES = new Set<CheckStatus>([
    "passed",
    "partial",
    "failed",
    "not_detected",
]);

const POSITIVE_STATUSES = new Set<CheckStatus>(["passed"]);

export function buildV2Check(input: {
    id: string;
    label: string;
    description: string;
    status: CheckStatus;
    weight: number;
    pointsAwarded: number;
    evidence?: MetricEvidence[];
    missing?: string[];
    recommendation?: string | null;
    priority?: CheckPriority | null;
}): MetricCheck {
    const isUnavailable = input.status === "unavailable" || input.status === "not_applicable";
    return {
        id: input.id,
        label: input.label,
        description: input.description,
        status: input.status,
        weight: input.weight,
        pointsAwarded: isUnavailable ? 0 : input.pointsAwarded,
        maximumPoints: input.status === "not_applicable" ? 0 : input.weight,
        evidence: input.evidence ?? [],
        missing: input.missing ?? [],
        recommendation: input.recommendation ?? null,
        priority: input.priority ?? null,
    };
}

export function finalizeCategoryV2(
    checks: MetricCheck[],
    categoryKey: NiceGuyCategoryKeyV2,
): V2CategoryScore {
    const applicableChecks = checks.filter((check) => check.status !== "not_applicable");
    const applicablePossiblePoints = applicableChecks.reduce(
        (sum, check) => sum + check.maximumPoints,
        0,
    );
    const measuredChecks = applicableChecks.filter((check) => MEASURED_STATUSES.has(check.status));
    const applicableMeasuredPoints = measuredChecks.reduce(
        (sum, check) => sum + check.maximumPoints,
        0,
    );
    const earnedPoints = measuredChecks.reduce((sum, check) => sum + check.pointsAwarded, 0);

    const qualityScore =
        applicableMeasuredPoints > 0
            ? clampScore((earnedPoints / applicableMeasuredPoints) * 100)
            : 0;
    const evidenceCoverage =
        applicablePossiblePoints > 0
            ? clampScore((applicableMeasuredPoints / applicablePossiblePoints) * 100)
            : 0;

    const configuredWeight = CATEGORY_WEIGHTS_V2[categoryKey];
    const effectiveWeight = configuredWeight * (evidenceCoverage / 100);

    const strengths = checks
        .filter(
            (check) =>
                POSITIVE_STATUSES.has(check.status) &&
                check.pointsAwarded > 0 &&
                check.maximumPoints > 0,
        )
        .map((check) => check.label);

    const issues = checks
        .filter(
            (check) =>
                check.status === "failed" ||
                check.status === "partial" ||
                check.status === "not_detected",
        )
        .map((check) => check.label);

    const limitations = checks
        .filter((check) => check.status === "unavailable")
        .map((check) => `${check.label}: could not be evaluated during this audit.`);

    const recommendations: CategoryRecommendation[] = [];
    const seen = new Set<string>();
    for (const check of checks) {
        if (
            (check.status === "failed" ||
                check.status === "partial" ||
                check.status === "not_detected") &&
            check.recommendation &&
            !seen.has(check.recommendation)
        ) {
            seen.add(check.recommendation);
            recommendations.push({
                checkId: check.id,
                priority: check.priority ?? "medium",
                title: check.label,
                description: check.recommendation,
            });
        }
    }

    return {
        score: qualityScore,
        maximumScore: 100,
        confidence: evidenceCoverage,
        checks,
        strengths,
        issues,
        recommendations,
        evidenceCoverage,
        qualityScore,
        configuredWeight,
        effectiveWeight,
        limitations,
    };
}

export function calculateOverallScoreV2(categories: V2NiceGuyCategories): number {
    let weightedSum = 0;
    let weightTotal = 0;

    for (const key of Object.keys(CATEGORY_WEIGHTS_V2) as NiceGuyCategoryKeyV2[]) {
        const category = categories[key];
        if (!category || category.evidenceCoverage <= 0) continue;
        weightedSum += category.qualityScore * category.configuredWeight;
        weightTotal += category.configuredWeight;
    }

    if (weightTotal <= 0) return 0;
    return clampScore(weightedSum / weightTotal);
}

export function calculateOverallEvidenceCoverage(categories: V2NiceGuyCategories): number {
    let weightedCoverage = 0;
    let weightTotal = 0;

    for (const key of Object.keys(CATEGORY_WEIGHTS_V2) as NiceGuyCategoryKeyV2[]) {
        const category = categories[key];
        const weight = CATEGORY_WEIGHTS_V2[key];
        weightedCoverage += category.evidenceCoverage * weight;
        weightTotal += weight;
    }

    if (weightTotal <= 0) return 0;
    return clampScore(weightedCoverage / weightTotal);
}

export function evaluateScoreCompleteness(
    categories: V2NiceGuyCategories,
    input: NiceGuyScoringInput,
    hasScreenshots: boolean,
): ScoreCompleteness {
    const blockers: string[] = [];
    const overallEvidenceCoverage = calculateOverallEvidenceCoverage(categories);
    const provisionalScore = calculateOverallScoreV2(categories);

    if (overallEvidenceCoverage < COMPLETE_SCORE_MIN_OVERALL_COVERAGE) {
        blockers.push(
            `Overall evidence coverage is ${overallEvidenceCoverage}% (minimum ${COMPLETE_SCORE_MIN_OVERALL_COVERAGE}% required).`,
        );
    }

    for (const key of REQUIRED_CATEGORY_COVERAGE_KEYS) {
        const category = categories[key];
        if (category.evidenceCoverage < COMPLETE_SCORE_MIN_CATEGORY_COVERAGE) {
            blockers.push(
                `${CATEGORY_LABELS_V2[key]} evidence coverage is ${category.evidenceCoverage}% (minimum ${COMPLETE_SCORE_MIN_CATEGORY_COVERAGE}% required).`,
            );
        }
    }

    const homepage = input.crawl.pageResults.find((page) => page.pageType === "home");
    const homepageOk =
        homepage && (homepage.statusCode ?? 200) < 400 && !homepage.errorMessage;
    if (!homepageOk) {
        blockers.push("Homepage crawl did not complete successfully.");
    }

    if (!hasScreenshots) {
        blockers.push("Primary screenshots were not available for visual scoring checks.");
    }

    const isComplete = blockers.length === 0;
    return {
        isComplete,
        label: isComplete
            ? "Complete score"
            : "Preliminary result — insufficient evidence for a complete score",
        provisionalScore,
        blockers,
        overallEvidenceCoverage,
    };
}

export function buildSummaryV2(categories: V2NiceGuyCategories): NiceGuySummary {
    const categoryEntries = Object.entries(categories) as Array<[NiceGuyCategoryKeyV2, V2CategoryScore]>;
    const availableCategories = categoryEntries.filter(([, category]) => category.evidenceCoverage > 0);

    let strongestCategory: string | null = null;
    let weakestCategory: string | null = null;
    let strongestScore = -1;
    let weakestScore = 101;

    for (const [key, category] of availableCategories) {
        if (category.qualityScore > strongestScore) {
            strongestScore = category.qualityScore;
            strongestCategory = CATEGORY_LABELS_V2[key];
        }
        if (category.qualityScore < weakestScore) {
            weakestScore = category.qualityScore;
            weakestCategory = CATEGORY_LABELS_V2[key];
        }
    }

    let checksPassed = 0;
    let checksFailed = 0;
    let checksUnavailable = 0;
    let highPriorityIssueCount = 0;
    let mediumPriorityIssueCount = 0;
    let lowPriorityIssueCount = 0;

    for (const [, category] of categoryEntries) {
        for (const check of category.checks) {
            if (check.status === "passed") checksPassed += 1;
            else if (check.status === "unavailable" || check.status === "not_applicable")
                checksUnavailable += 1;
            else checksFailed += 1;

            if (
                check.status === "failed" ||
                check.status === "partial" ||
                check.status === "not_detected"
            ) {
                if (check.priority === "high") highPriorityIssueCount += 1;
                else if (check.priority === "low") lowPriorityIssueCount += 1;
                else mediumPriorityIssueCount += 1;
            }
        }
    }

    return {
        strongestCategory,
        weakestCategory,
        highPriorityIssueCount,
        mediumPriorityIssueCount,
        lowPriorityIssueCount,
        checksPassed,
        checksFailed,
        checksUnavailable,
    };
}

export function buildMethodology(
    categories: V2NiceGuyCategories,
    businessType: BusinessTypeDetection,
    completeness: ScoreCompleteness,
): NiceGuyMethodology {
    let deterministicCheckCount = 0;
    let aiAssistedCheckCount = 0;
    const limitations = [...completeness.blockers];

    for (const [, category] of Object.entries(categories) as Array<
        [NiceGuyCategoryKeyV2, V2CategoryScore]
    >) {
        limitations.push(...category.limitations);
        deterministicCheckCount += category.checks.filter(
            (check) => check.status !== "unavailable" && check.status !== "not_applicable",
        ).length;
    }

    return {
        scoringVersion: NICEGUY_SCORING_VERSION_V2,
        rubricVersion: NICEGUY_RUBRIC_VERSION,
        applicabilityVersion: NICEGUY_APPLICABILITY_VERSION,
        disclaimer: METHODOLOGY_DISCLAIMER,
        businessType,
        deterministicCheckCount,
        aiAssistedCheckCount,
        limitations: [...new Set(limitations)],
    };
}

export function toLegacyCategories(categories: V2NiceGuyCategories): NiceGuyCategories {
    return categories as unknown as NiceGuyCategories;
}
