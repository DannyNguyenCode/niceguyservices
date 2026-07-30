import {
    CATEGORY_LABELS,
    CATEGORY_WEIGHTS,
    type NiceGuyCategoryKey,
} from "@/src/config/niceguy-scoring";
import {
    ACTION_CTAS,
    GENERIC_HEADINGS,
    GENERIC_TITLES,
    PLACEHOLDER_PATTERNS,
    SERVICE_AREA_PATTERNS,
    SERVICE_KEYWORDS,
    STRONG_CTAS,
    TRUST_KEYWORDS,
    WEAK_CTAS,
} from "@/src/services/niceguy-scoring/dictionaries";
import type {
    CategoryRecommendation,
    CategoryScore,
    CheckPriority,
    CheckStatus,
    MetricCheck,
    MetricEvidence,
    NiceGuyCategories,
    NiceGuyScoringInput,
    NiceGuyScoreResult,
    NiceGuySummary,
    NormalizedPageResult,
} from "@/src/services/niceguy-scoring/types";

export function clampScore(value: number): number {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(100, Math.round(value)));
}

export function normalizeText(value: string | null | undefined): string {
    return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

export function getHomepage(input: NiceGuyScoringInput): NormalizedPageResult | null {
    return (
        input.crawl.pageResults.find((page) => page.pageType === "home") ??
        input.crawl.pageResults[0] ??
        null
    );
}

export function getPageByType(
    input: NiceGuyScoringInput,
    pageType: string,
): NormalizedPageResult | null {
    return input.crawl.pageResults.find((page) => page.pageType === pageType) ?? null;
}

export function allVisibleText(input: NiceGuyScoringInput): string {
    return input.crawl.pageResults
        .map((page) => page.visibleText ?? "")
        .join(" ")
        .toLowerCase();
}

export function allButtons(input: NiceGuyScoringInput): Array<{ text: string; href?: string; pageUrl: string }> {
    return input.crawl.pageResults.flatMap((page) =>
        page.buttons.map((button) => ({
            text: button.text,
            href: button.href,
            pageUrl: page.url,
        })),
    );
}

export function allForms(input: NiceGuyScoringInput) {
    return input.crawl.pageResults.flatMap((page) =>
        page.forms.map((form) => ({ ...form, pageUrl: page.url })),
    );
}

export function isGenericTitle(title: string): boolean {
    const normalized = normalizeText(title);
    if (!normalized) return true;
    if (GENERIC_TITLES.has(normalized)) return true;
    if (normalized.length <= 10 && GENERIC_TITLES.has(normalized.split("|")[0]?.trim() ?? "")) {
        return true;
    }
    return false;
}

export function containsCta(text: string, dictionary: string[]): boolean {
    const normalized = normalizeText(text);
    return dictionary.some((cta) => normalized.includes(cta));
}

export function findStrongCtas(input: NiceGuyScoringInput): string[] {
    return allButtons(input)
        .map((button) => normalizeText(button.text))
        .filter((text) => text && STRONG_CTAS.some((cta) => text.includes(cta)));
}

export function findActionCtas(input: NiceGuyScoringInput): string[] {
    return allButtons(input)
        .map((button) => normalizeText(button.text))
        .filter((text) => text && ACTION_CTAS.some((cta) => text.includes(cta)));
}

export function hasServiceOffering(input: NiceGuyScoringInput): boolean {
    if (input.crawl.hasServicesPage) return true;
    if (input.crawl.pageResults.some((page) => page.pageType === "service-detail")) return true;

    const homepage = getHomepage(input);
    const headingText = (homepage?.headings ?? [])
        .map((heading) => normalizeText(heading.text))
        .join(" ");
    const linkText = input.crawl.internalLinks.join(" ").toLowerCase();
    const visible = allVisibleText(input);

    const serviceHits = SERVICE_KEYWORDS.filter(
        (keyword) =>
            headingText.includes(keyword) ||
            linkText.includes(keyword) ||
            visible.includes(keyword),
    );
    return serviceHits.length >= 2;
}

export function hasLocationEvidence(input: NiceGuyScoringInput): {
    found: boolean;
    partial: boolean;
    evidence: MetricEvidence[];
} {
    const evidence: MetricEvidence[] = [];
    const storedLocation = normalizeText(input.website.location);
    const visible = allVisibleText(input);

    if (storedLocation && visible.includes(storedLocation)) {
        evidence.push({
            type: "content",
            label: "Stored location found in visible text",
            value: input.website.location ?? null,
        });
        return { found: true, partial: false, evidence };
    }

    const areaHit = SERVICE_AREA_PATTERNS.find((pattern) => visible.includes(pattern));
    if (areaHit) {
        evidence.push({ type: "content", label: "Service area wording detected", value: areaHit });
        return { found: true, partial: false, evidence };
    }

    if (storedLocation) {
        evidence.push({
            type: "derived",
            label: "Stored location exists but was not confirmed in visible text",
            value: input.website.location ?? null,
        });
        return { found: false, partial: true, evidence };
    }

    return { found: false, partial: false, evidence };
}

export function hasTrustLanguage(input: NiceGuyScoringInput): {
    hits: string[];
    evidence: MetricEvidence[];
} {
    const visible = allVisibleText(input);
    const hits = TRUST_KEYWORDS.filter((keyword) => visible.includes(keyword));
    return {
        hits,
        evidence: hits.map((hit) => ({
            type: "content",
            label: "Trust language detected",
            value: hit,
        })),
    };
}

export function hasPlaceholderContent(input: NiceGuyScoringInput): string[] {
    const visible = allVisibleText(input);
    return PLACEHOLDER_PATTERNS.filter((pattern) => visible.includes(pattern));
}

export function textSimilarity(a: string, b: string): number {
    const wordsA = new Set(normalizeText(a).split(" ").filter((word) => word.length > 3));
    const wordsB = new Set(normalizeText(b).split(" ").filter((word) => word.length > 3));
    if (wordsA.size === 0 || wordsB.size === 0) return 0;
    let intersection = 0;
    for (const word of wordsA) {
        if (wordsB.has(word)) intersection += 1;
    }
    return intersection / Math.max(wordsA.size, wordsB.size);
}

export function mapPerformancePoints(score: number | null | undefined, maxPoints: number): number {
    if (score === null || score === undefined) return 0;
    if (score >= 90) return maxPoints;
    if (score >= 75) return Math.round(maxPoints * 0.85);
    if (score >= 60) return Math.round(maxPoints * 0.65);
    if (score >= 50) return Math.round(maxPoints * 0.45);
    if (score >= 30) return Math.round(maxPoints * 0.25);
    return 0;
}

export function mapAccessibilityPoints(score: number | null | undefined, maxPoints: number): number {
    if (score === null || score === undefined) return 0;
    if (score >= 90) return maxPoints;
    if (score >= 75) return Math.round(maxPoints * 0.85);
    if (score >= 60) return Math.round(maxPoints * 0.65);
    if (score >= 50) return Math.round(maxPoints * 0.45);
    return 0;
}

export function mapClsPoints(cls: number | null | undefined, maxPoints: number): number {
    if (cls === null || cls === undefined) return 0;
    if (cls <= 0.1) return maxPoints;
    if (cls <= 0.25) return Math.round(maxPoints * 0.5);
    return 0;
}

export function mapTbtPoints(tbtMs: number | null | undefined, maxPoints: number): number {
    if (tbtMs === null || tbtMs === undefined) return 0;
    if (tbtMs <= 200) return maxPoints;
    if (tbtMs <= 600) return Math.round(maxPoints * 0.5);
    return 0;
}

export function assignCheckPriority(checkId: string, status: CheckStatus): CheckPriority | null {
    if (status === "passed" || status === "unavailable") return null;

    const highPriority = new Set([
        "business-clear-next-step",
        "conversion-primary-cta",
        "conversion-contact-methods",
        "trust-phone-visible",
        "trust-email-visible",
        "ux-mobile-performance",
        "technical-https",
        "technical-crawl-health",
    ]);
    const lowPriority = new Set([
        "trust-terms",
        "content-freshness",
        "branding-logo-evidence",
        "business-meta-description",
    ]);

    if (highPriority.has(checkId)) return "high";
    if (lowPriority.has(checkId)) return "low";
    return "medium";
}

export function buildCheck(input: {
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
    const priority =
        input.priority !== undefined
            ? input.priority
            : assignCheckPriority(input.id, input.status);

    return {
        id: input.id,
        label: input.label,
        description: input.description,
        status: input.status,
        weight: input.weight,
        pointsAwarded: input.status === "unavailable" ? 0 : input.pointsAwarded,
        maximumPoints: input.weight,
        evidence: input.evidence ?? [],
        missing: input.missing ?? [],
        recommendation: input.recommendation ?? null,
        priority,
    };
}

export function finalizeCategory(checks: MetricCheck[]): CategoryScore {
    const totalMaximum = checks.reduce((sum, check) => sum + check.maximumPoints, 0);
    const availableChecks = checks.filter((check) => check.status !== "unavailable");
    const availableMaximum = availableChecks.reduce((sum, check) => sum + check.maximumPoints, 0);
    const awarded = availableChecks.reduce((sum, check) => sum + check.pointsAwarded, 0);

    const score =
        availableMaximum > 0 ? clampScore((awarded / availableMaximum) * 100) : 0;
    const confidence =
        totalMaximum > 0 ? clampScore((availableMaximum / totalMaximum) * 100) : 0;

    const strengths = checks
        .filter((check) => check.status === "passed")
        .map((check) => check.label);

    const issues = checks
        .filter((check) => check.status === "failed" || check.status === "partial")
        .map((check) => check.label);

    const recommendations: CategoryRecommendation[] = [];
    const seen = new Set<string>();

    for (const check of checks) {
        if (
            (check.status === "failed" || check.status === "partial") &&
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

    const priorityOrder: Record<CheckPriority, number> = { high: 0, medium: 1, low: 2 };
    recommendations.sort((a, b) => {
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        const checkA = checks.find((check) => check.id === a.checkId);
        const checkB = checks.find((check) => check.id === b.checkId);
        return (checkB?.weight ?? 0) - (checkA?.weight ?? 0);
    });

    return {
        score,
        maximumScore: 100,
        confidence,
        checks,
        strengths,
        issues,
        recommendations,
    };
}

export function calculateOverallScore(categories: NiceGuyCategories): number {
    let weightedSum = 0;
    let weightTotal = 0;

    for (const key of Object.keys(CATEGORY_WEIGHTS) as NiceGuyCategoryKey[]) {
        const category = categories[key];
        if (!category || category.confidence <= 0) continue;
        const weight = CATEGORY_WEIGHTS[key];
        weightedSum += category.score * weight;
        weightTotal += weight;
    }

    if (weightTotal <= 0) return 0;
    return clampScore(weightedSum / weightTotal);
}

export function buildSummary(categories: NiceGuyCategories): NiceGuySummary {
    const categoryEntries = Object.entries(categories) as Array<[NiceGuyCategoryKey, CategoryScore]>;
    const availableCategories = categoryEntries.filter(([, category]) => category.confidence > 0);

    let strongestCategory: string | null = null;
    let weakestCategory: string | null = null;
    let strongestScore = -1;
    let weakestScore = 101;

    for (const [key, category] of availableCategories) {
        if (category.score > strongestScore) {
            strongestScore = category.score;
            strongestCategory = CATEGORY_LABELS[key];
        }
        if (category.score < weakestScore) {
            weakestScore = category.score;
            weakestCategory = CATEGORY_LABELS[key];
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
            else if (check.status === "unavailable") checksUnavailable += 1;
            else checksFailed += 1;

            if (check.status === "failed" || check.status === "partial") {
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

export function isWeakCta(text: string): boolean {
    const normalized = normalizeText(text);
    return WEAK_CTAS.some((cta) => normalized === cta || normalized === `${cta}`);
}

export function isStrongCta(text: string): boolean {
    const normalized = normalizeText(text);
    return STRONG_CTAS.some((cta) => normalized.includes(cta));
}

export function isGenericHeading(text: string): boolean {
    return GENERIC_HEADINGS.has(normalizeText(text));
}

export type NiceGuyScoreBundle = NiceGuyScoreResult;
