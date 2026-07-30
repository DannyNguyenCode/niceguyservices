import { PAGESPEED_PARSER_LIMITS } from "@/src/lib/pagespeed-rules";
import {
    assignFailedAuditSeverity,
    assignOpportunityPriority,
    isApplicableAuditScoreDisplayMode,
    isFailedAuditScore,
    normalizeLighthouseScore,
} from "@/src/lib/pagespeed-rules";
import type { PageSpeedStrategy } from "@/src/schemas/enums";
import type { LabMetricValue, NormalizedPageSpeedResult } from "@/src/types/pagespeed";

const OPPORTUNITY_AUDIT_IDS = new Set([
    "render-blocking-resources",
    "unused-javascript",
    "unused-css-rules",
    "modern-image-formats",
    "uses-responsive-images",
    "uses-optimized-images",
    "offscreen-images",
    "uses-text-compression",
    "efficient-animated-content",
    "unminified-css",
    "unminified-javascript",
    "server-response-time",
    "redirects",
    "total-byte-weight",
    "mainthread-work-breakdown",
    "bootup-time",
    "third-party-summary",
]);

const DIAGNOSTIC_AUDIT_IDS = new Set([
    "dom-size",
    "critical-request-chains",
    "network-requests",
    "network-rtt",
    "network-server-latency",
    "mainthread-work-breakdown",
    "bootup-time",
    "third-party-summary",
    "largest-contentful-paint-element",
    "layout-shift-elements",
    "long-tasks",
    "resource-summary",
]);

const CATEGORY_KEYS = [
    "performance",
    "accessibility",
    "best-practices",
    "seo",
] as const;

function asRecord(value: unknown): Record<string, unknown> | null {
    return typeof value === "object" && value !== null
        ? (value as Record<string, unknown>)
        : null;
}

function asString(value: unknown): string | undefined {
    return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown): number | null {
    return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

function mapFieldCategory(
    category: string | undefined,
): "good" | "needs-improvement" | "poor" | "unavailable" {
    switch (category) {
        case "FAST":
            return "good";
        case "AVERAGE":
            return "needs-improvement";
        case "SLOW":
            return "poor";
        default:
            return "unavailable";
    }
}

function parseLabMetric(
    audits: Record<string, unknown>,
    auditId: string,
    useMs = true,
): LabMetricValue | undefined {
    const audit = asRecord(audits[auditId]);
    if (!audit) return undefined;

    const numericValue = asNumber(audit.numericValue);
    return {
        valueMs: useMs ? numericValue : undefined,
        value: useMs ? undefined : numericValue,
        displayValue: asString(audit.displayValue) ?? null,
        score: normalizeLighthouseScore(audit.score),
    };
}

function parseFieldMetric(
    metrics: Record<string, unknown> | null,
    key: string,
): { percentile?: number | null; category?: string | null } | undefined {
    if (!metrics) return undefined;
    const metric = asRecord(metrics[key]);
    if (!metric) return undefined;
    return {
        percentile: asNumber(metric.percentile),
        category: asString(metric.category) ?? null,
    };
}

function parseFieldData(
    pageExperience: Record<string, unknown> | null,
    originExperience: Record<string, unknown> | null,
): NormalizedPageSpeedResult["fieldData"] {
    const pageMetrics = pageExperience ? asRecord(pageExperience.metrics) : null;
    const originMetrics = originExperience ? asRecord(originExperience.metrics) : null;

    const hasPageMetrics = Boolean(
        pageMetrics &&
            Object.keys(pageMetrics).some((key) => parseFieldMetric(pageMetrics, key)),
    );

    const sourceMetrics = hasPageMetrics ? pageMetrics : originMetrics;
    const available = Boolean(
        sourceMetrics &&
            Object.keys(sourceMetrics).some((key) => parseFieldMetric(sourceMetrics, key)),
    );

    return {
        available,
        overallCategory:
            (asString(pageExperience?.overall_category) as
                | "FAST"
                | "AVERAGE"
                | "SLOW"
                | "NONE"
                | null) ??
            (asString(originExperience?.overall_category) as
                | "FAST"
                | "AVERAGE"
                | "SLOW"
                | "NONE"
                | null) ??
            null,
        originFallback: available && !hasPageMetrics,
        firstContentfulPaint: parseFieldMetric(sourceMetrics, "FIRST_CONTENTFUL_PAINT_MS"),
        largestContentfulPaint: parseFieldMetric(sourceMetrics, "LARGEST_CONTENTFUL_PAINT_MS"),
        interactionToNextPaint: parseFieldMetric(sourceMetrics, "INTERACTION_TO_NEXT_PAINT"),
        cumulativeLayoutShift: parseFieldMetric(
            sourceMetrics,
            "CUMULATIVE_LAYOUT_SHIFT_SCORE",
        ),
        timeToFirstByte: parseFieldMetric(
            sourceMetrics,
            "EXPERIMENTAL_TIME_TO_FIRST_BYTE",
        ),
    };
}

function parseCoreWebVitals(
    fieldData: NormalizedPageSpeedResult["fieldData"],
): NormalizedPageSpeedResult["coreWebVitals"] {
    if (!fieldData.available) {
        return { assessment: "unavailable" };
    }

    const lcp = fieldData.largestContentfulPaint;
    const inp = fieldData.interactionToNextPaint;
    const cls = fieldData.cumulativeLayoutShift;

    const ratings = [lcp?.category, inp?.category, cls?.category]
        .filter(Boolean)
        .map((category) => mapFieldCategory(category ?? undefined));

    const hasMetrics = ratings.some((rating) => rating !== "unavailable");
    if (!hasMetrics) {
        return { assessment: "unavailable" };
    }

    const assessment = ratings.some((rating) => rating === "poor")
        ? "failed"
        : "passed";

    return {
        assessment,
        largestContentfulPaint: {
            value: lcp?.percentile ?? null,
            rating: mapFieldCategory(lcp?.category ?? undefined),
        },
        interactionToNextPaint: {
            value: inp?.percentile ?? null,
            rating: mapFieldCategory(inp?.category ?? undefined),
        },
        cumulativeLayoutShift: {
            value: cls?.percentile ?? null,
            rating: mapFieldCategory(cls?.category ?? undefined),
        },
    };
}

function collectOpportunities(
    audits: Record<string, unknown>,
): NormalizedPageSpeedResult["opportunities"] {
    const opportunities: NormalizedPageSpeedResult["opportunities"] = [];

    for (const [auditId, rawAudit] of Object.entries(audits)) {
        const audit = asRecord(rawAudit);
        if (!audit) continue;

        const score = asNumber(audit.score);
        const scoreDisplayMode = asString(audit.scoreDisplayMode);
        if (!isFailedAuditScore(score, scoreDisplayMode)) continue;

        const details = asRecord(audit.details);
        const estimatedSavingsMs = asNumber(details?.overallSavingsMs);
        const estimatedSavingsBytes = asNumber(details?.overallSavingsBytes);
        const title = asString(audit.title);
        if (!title) continue;

        const isKnownOpportunity =
            OPPORTUNITY_AUDIT_IDS.has(auditId) ||
            estimatedSavingsMs !== null ||
            estimatedSavingsBytes !== null;

        if (!isKnownOpportunity && scoreDisplayMode === "informative") {
            continue;
        }

        opportunities.push({
            auditId,
            title,
            description: asString(audit.description) ?? null,
            score,
            scoreDisplayMode: scoreDisplayMode ?? null,
            displayValue: asString(audit.displayValue) ?? null,
            estimatedSavingsMs,
            estimatedSavingsBytes,
            priority: assignOpportunityPriority({
                score,
                estimatedSavingsMs,
                estimatedSavingsBytes,
            }),
        });
    }

    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return opportunities
        .sort((a, b) => {
            const savingsDiff =
                (b.estimatedSavingsMs ?? 0) - (a.estimatedSavingsMs ?? 0);
            if (savingsDiff !== 0) return savingsDiff;
            const bytesDiff =
                (b.estimatedSavingsBytes ?? 0) - (a.estimatedSavingsBytes ?? 0);
            if (bytesDiff !== 0) return bytesDiff;
            return (a.score ?? 1) - (b.score ?? 1);
        })
        .slice(0, PAGESPEED_PARSER_LIMITS.maxOpportunities)
        .sort(
            (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
        );
}

function collectDiagnostics(
    audits: Record<string, unknown>,
): NormalizedPageSpeedResult["diagnostics"] {
    const diagnostics: NormalizedPageSpeedResult["diagnostics"] = [];

    for (const auditId of DIAGNOSTIC_AUDIT_IDS) {
        const audit = asRecord(audits[auditId]);
        if (!audit) continue;
        const title = asString(audit.title);
        if (!title) continue;

        const details = asRecord(audit.details);
        diagnostics.push({
            auditId,
            title,
            description: asString(audit.description) ?? null,
            score: asNumber(audit.score),
            scoreDisplayMode: asString(audit.scoreDisplayMode) ?? null,
            displayValue: asString(audit.displayValue) ?? null,
            detailsType: asString(details?.type) ?? null,
        });
    }

    return diagnostics.slice(0, PAGESPEED_PARSER_LIMITS.maxDiagnostics);
}

function collectFailedAudits(
    categories: Record<string, unknown>,
    audits: Record<string, unknown>,
): NormalizedPageSpeedResult["failedAudits"] {
    const failed: NormalizedPageSpeedResult["failedAudits"] = [];

    for (const categoryKey of CATEGORY_KEYS) {
        const category = asRecord(categories[categoryKey]);
        const auditRefs = Array.isArray(category?.auditRefs) ? category.auditRefs : [];

        for (const rawRef of auditRefs) {
            const ref = asRecord(rawRef);
            const auditId = asString(ref?.id);
            if (!auditId) continue;

            const audit = asRecord(audits[auditId]);
            if (!audit) continue;

            const score = asNumber(audit.score);
            const scoreDisplayMode = asString(audit.scoreDisplayMode);
            if (!isFailedAuditScore(score, scoreDisplayMode)) continue;

            const title = asString(audit.title);
            if (!title) continue;

            failed.push({
                auditId,
                category: categoryKey,
                title,
                description: asString(audit.description) ?? null,
                score,
                scoreDisplayMode: scoreDisplayMode ?? null,
                displayValue: asString(audit.displayValue) ?? null,
                severity: assignFailedAuditSeverity({ score, category: categoryKey }),
            });
        }
    }

    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return failed
        .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
        .slice(0, PAGESPEED_PARSER_LIMITS.maxFailedAudits);
}

function countAudits(audits: Record<string, unknown>): {
    passed: number;
    failed: number;
    notApplicable: number;
} {
    let passed = 0;
    let failed = 0;
    let notApplicable = 0;

    for (const rawAudit of Object.values(audits)) {
        const audit = asRecord(rawAudit);
        if (!audit) continue;
        const score = audit.score;
        const mode = asString(audit.scoreDisplayMode);

        if (mode === "notApplicable" || mode === "manual") {
            notApplicable += 1;
            continue;
        }

        if (typeof score === "number") {
            if (score < 1) failed += 1;
            else passed += 1;
            continue;
        }

        notApplicable += 1;
    }

    return { passed, failed, notApplicable };
}

export function parsePageSpeedResponse(
    response: unknown,
    _strategy: PageSpeedStrategy,
): NormalizedPageSpeedResult {
    const root = asRecord(response);
    if (!root) {
        throw new Error("PAGESPEED_INVALID_RESPONSE");
    }

    const lighthouse = asRecord(root.lighthouseResult);
    if (!lighthouse) {
        throw new Error("PAGESPEED_INVALID_RESPONSE");
    }

    const categories = asRecord(lighthouse.categories) ?? {};
    const audits = asRecord(lighthouse.audits) ?? {};
    const auditCounts = countAudits(audits);

    const pageExperience = asRecord(root.loadingExperience);
    const originExperience = asRecord(root.originLoadingExperience);
    const fieldData = parseFieldData(pageExperience, originExperience);

    const fetchTimeRaw = asString(lighthouse.fetchTime);
    const analysisTimestamp = asString(root.analysisUTCTimestamp);

    return {
        finalUrl: asString(lighthouse.finalUrl) ?? asString(root.id) ?? null,
        fetchTime: fetchTimeRaw ? new Date(fetchTimeRaw) : null,
        lighthouseVersion: asString(lighthouse.lighthouseVersion) ?? null,
        userAgent: asString(lighthouse.userAgent) ?? null,
        scores: {
            performance: normalizeLighthouseScore(
                asRecord(categories.performance)?.score,
            ),
            accessibility: normalizeLighthouseScore(
                asRecord(categories.accessibility)?.score,
            ),
            bestPractices: normalizeLighthouseScore(
                asRecord(categories["best-practices"])?.score,
            ),
            seo: normalizeLighthouseScore(asRecord(categories.seo)?.score),
        },
        labMetrics: {
            firstContentfulPaint: parseLabMetric(audits, "first-contentful-paint"),
            largestContentfulPaint: parseLabMetric(audits, "largest-contentful-paint"),
            totalBlockingTime: parseLabMetric(audits, "total-blocking-time"),
            cumulativeLayoutShift: parseLabMetric(
                audits,
                "cumulative-layout-shift",
                false,
            ),
            speedIndex: parseLabMetric(audits, "speed-index"),
            interactive: parseLabMetric(audits, "interactive"),
            timeToFirstByte: parseLabMetric(audits, "server-response-time"),
            maxPotentialFirstInputDelay: parseLabMetric(audits, "max-potential-fid"),
        },
        fieldData,
        coreWebVitals: parseCoreWebVitals(fieldData),
        opportunities: collectOpportunities(audits),
        diagnostics: collectDiagnostics(audits),
        failedAudits: collectFailedAudits(categories, audits),
        passedAuditCount: auditCounts.passed,
        failedAuditCount: auditCounts.failed,
        notApplicableAuditCount: auditCounts.notApplicable,
        apiMetadata: {
            responseId: asString(root.id) ?? null,
            analysisUTCTimestamp: analysisTimestamp
                ? new Date(analysisTimestamp)
                : null,
        },
    };
}
