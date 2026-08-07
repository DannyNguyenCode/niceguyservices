import "server-only";

import {
    completeAiSummaryRecord,
    createAiSummaryRecord,
    getAiSummariesForCrawl,
    type SerializableAiSummary,
} from "@/src/data/ai-summaries";
import { getAuditRunById } from "@/src/data/audit-runs";
import { loadAuditRunResources } from "@/src/services/audit-history/load-audit-run-resources";
import { registerAuditReference } from "@/src/services/audit-history/register-audit-reference";
import type { AiSummaryOutput } from "@/src/services/ai/types";
import type { CursorAuditResult } from "@/src/services/cursor-analysis/schemas";
import { CURSOR_ANALYSIS_DEFAULT_PROMPT_VERSION } from "@/src/services/cursor-analysis/constants";

const CURSOR_COMPAT_ANALYSIS_VERSION = "cursor-analysis-v1.1";

function mapSeverityToPriority(
    severity: CursorAuditResult["issues"][number]["severity"],
): "high" | "medium" | "low" {
    if (severity === "critical" || severity === "high") return "high";
    if (severity === "medium") return "medium";
    return "low";
}

function mapImpact(
    severity: CursorAuditResult["issues"][number]["severity"],
): "high" | "medium" | "low" {
    return mapSeverityToPriority(severity);
}

/**
 * Maps the canonical Cursor analysis result into the AiSummary resource shape
 * expected by report draft generation. Cursor remains the single source of AI
 * interpretation; Nice Guy Metrics overallScore stays authoritative.
 */
export function mapCursorResultToAiSummaryOutput(
    result: CursorAuditResult,
): AiSummaryOutput {
    const strengths: AiSummaryOutput["strengths"] = result.strengths.slice(0, 5).map((item) => ({
        title: item.title,
        description: item.description,
        category: item.category ?? null,
        evidenceCheckIds: item.sources.slice(0, 5),
    }));

    while (strengths.length < 2) {
        strengths.push({
            title: "Evidence-backed strength unavailable",
            description:
                "Cursor analysis did not return enough distinct strengths for this audit package.",
            category: null,
            evidenceCheckIds: ["cursor-analysis"],
        });
    }

    const weaknesses: AiSummaryOutput["weaknesses"] = result.issues.slice(0, 6).map((item) => ({
        title: item.title,
        description: item.description,
        category: item.category,
        priority: mapSeverityToPriority(item.severity),
        evidenceCheckIds: item.sources.slice(0, 5),
    }));

    while (weaknesses.length < 2) {
        weaknesses.push({
            title: "Additional weakness evidence unavailable",
            description:
                "Cursor analysis did not return enough distinct issues for this audit package.",
            category: "general",
            priority: "low",
            evidenceCheckIds: ["cursor-analysis"],
        });
    }

    const quickWins: AiSummaryOutput["quickWins"] = result.issues.slice(0, 6).map((item) => ({
        title: item.title,
        description: item.recommendation,
        expectedImpact: mapImpact(item.severity),
        estimatedEffort: "medium",
        category: item.category,
        evidenceCheckIds: item.sources.slice(0, 5),
    }));

    while (quickWins.length < 3) {
        quickWins.push({
            title: "Review remaining audit findings",
            description:
                "Use the Nice Guy Metrics checks and crawl evidence to prioritize remaining improvements.",
            expectedImpact: "medium",
            estimatedEffort: "medium",
            category: "general",
            evidenceCheckIds: ["niceguy-metrics"],
        });
    }

    const longTermRecommendations: AiSummaryOutput["longTermRecommendations"] = result.issues
        .slice(0, 5)
        .map((item) => ({
            title: item.title,
            description: item.recommendation,
            priority: mapSeverityToPriority(item.severity),
            estimatedEffort: "high",
            category: item.category,
            evidenceCheckIds: item.sources.slice(0, 5),
        }));

    while (longTermRecommendations.length < 2) {
        longTermRecommendations.push({
            title: "Sustain measurement and iteration",
            description:
                "Continue monitoring PageSpeed, crawl evidence, and Nice Guy Metrics after implementing priority fixes.",
            priority: "medium",
            estimatedEffort: "medium",
            category: "general",
            evidenceCheckIds: ["niceguy-metrics"],
        });
    }

    const priorityOrder: AiSummaryOutput["priorityOrder"] = result.issues.slice(0, 7).map(
        (item, index) => ({
            rank: index + 1,
            title: item.title,
            reason: item.recommendation,
            priority: mapSeverityToPriority(item.severity),
            evidenceCheckIds: item.sources.slice(0, 5),
        }),
    );

    while (priorityOrder.length < 3) {
        priorityOrder.push({
            rank: priorityOrder.length + 1,
            title: "Continue with deterministic audit priorities",
            reason: "Official Nice Guy Metrics and crawl evidence remain authoritative for measurable gaps.",
            priority: "medium",
            evidenceCheckIds: ["niceguy-metrics"],
        });
    }

    return {
        executiveSummary: result.executiveSummary,
        businessImpactSummary: result.assessment.summary,
        strengths,
        weaknesses,
        quickWins,
        longTermRecommendations,
        priorityOrder,
        disclaimers: result.limitations.slice(0, 4),
    };
}

export async function materializeAiSummaryFromCursorResult(input: {
    auditRunId: string;
    result: CursorAuditResult;
}): Promise<SerializableAiSummary> {
    const auditRun = await getAuditRunById(input.auditRunId);
    if (!auditRun) {
        throw new Error("Audit run not found for Cursor AI summary materialization.");
    }

    const resources = await loadAuditRunResources({
        websiteId: auditRun.websiteId,
        auditRunId: input.auditRunId,
    });
    if (!resources?.crawl || !resources.niceGuy) {
        throw new Error("Deterministic audit resources are required before report materialization.");
    }

    if (resources.aiSummary?.status === "complete") {
        return resources.aiSummary;
    }

    const existingForCrawl = await getAiSummariesForCrawl(resources.crawl.id);
    const existingComplete = existingForCrawl.find(
        (summary) =>
            summary.auditRunId === input.auditRunId && summary.status === "complete",
    );
    if (existingComplete) {
        if (!auditRun.references.aiSummaryId) {
            await registerAuditReference({
                auditRunId: input.auditRunId,
                resourceType: "ai-summary",
                resourceId: existingComplete.id,
            });
        }
        return existingComplete;
    }

    const categoryScores: Record<string, number | null> = {};
    const categories = resources.niceGuy.categories ?? {};
    for (const [categoryId, category] of Object.entries(categories)) {
        const score =
            category && typeof category === "object" && "score" in category
                ? Number((category as { score?: number | null }).score ?? null)
                : null;
        categoryScores[categoryId] = Number.isFinite(score) ? score : null;
    }

    const pageSpeed = resources.pageSpeed;
    const mobileDone = pageSpeed.mobile?.status === "complete";
    const desktopDone = pageSpeed.desktop?.status === "complete";

    const record =
        existingForCrawl.find((summary) => summary.auditRunId === input.auditRunId) ??
        (await createAiSummaryRecord({
            websiteId: auditRun.websiteId,
            crawlId: resources.crawl.id,
            niceGuyMetricId: resources.niceGuy.id,
            auditRunId: input.auditRunId,
            analysisVersion: CURSOR_COMPAT_ANALYSIS_VERSION,
            promptVersion: CURSOR_ANALYSIS_DEFAULT_PROMPT_VERSION,
            status: "processing",
            visuallyAnalyzed: true,
            inputModalities: ["text", "dom", "screenshot"],
            screenshotIds: resources.screenshots.map((shot) => shot.id),
            sourceSnapshot: {
                scoringVersion: resources.niceGuy.scoringVersion,
                overallScore: resources.niceGuy.overallScore ?? 0,
                categoryScores,
                mobilePageSpeedAvailable: mobileDone,
                desktopPageSpeedAvailable: desktopDone,
                screenshotCount: resources.screenshots.length,
                pageCount: resources.crawl.pagesCrawled ?? 0,
            },
        }));

    const mapped = mapCursorResultToAiSummaryOutput(input.result);
    const completed = await completeAiSummaryRecord(record.id, {
        ...mapped,
        homepageChanges: input.result.homepageChanges ?? null,
        durationMs: 0,
        promptVersion: CURSOR_ANALYSIS_DEFAULT_PROMPT_VERSION,
        analysisVersion: CURSOR_COMPAT_ANALYSIS_VERSION,
        visuallyAnalyzed: true,
        inputModalities: ["text", "dom", "screenshot"],
        screenshotIds: resources.screenshots.map((shot) => shot.id),
    });

    await registerAuditReference({
        auditRunId: input.auditRunId,
        resourceType: "ai-summary",
        resourceId: completed.id,
    });

    return completed;
}
