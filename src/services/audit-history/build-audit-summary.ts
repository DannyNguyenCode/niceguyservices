import "server-only";

import { getAuditRunById } from "@/src/data/audit-runs";
import { AiSummary } from "@/src/models/AiSummary";
import { CrawlData } from "@/src/models/CrawlData";
import { GoogleMetric } from "@/src/models/GoogleMetric";
import { NiceGuyMetric } from "@/src/models/NiceGuyMetric";
import { Screenshot } from "@/src/models/Screenshot";
import { connectToDatabase } from "@/src/lib/mongodb";
import type { AuditHistorySummary } from "@/src/services/audit-history/types";

const NICEGUY_CATEGORY_LABELS: Record<string, string> = {
    businessClarity: "Business clarity",
    trustCredibility: "Trust & credibility",
    conversionReadiness: "Conversion readiness",
    userExperience: "User experience",
    brandingConsistency: "Branding consistency",
    contentQuality: "Content quality",
    technicalFoundation: "Technical foundation",
};

export async function buildAuditSummary(auditRunId: string): Promise<AuditHistorySummary> {
    await connectToDatabase();
    const auditRun = await getAuditRunById(auditRunId);
    if (!auditRun) {
        return {
            categoryScores: [],
            pageSpeed: { mobile: null, desktop: null },
            errorCount: 0,
            warningCount: 0,
        };
    }

    const refs = auditRun.references;
    const crawlId = refs.crawlDataIds[refs.crawlDataIds.length - 1] ?? null;
    const niceGuyId = refs.niceGuyMetricsId;
    const aiSummaryId = refs.aiSummaryId;

    let pagesDiscovered: number | null = null;
    let pagesCrawled: number | null = null;
    let screenshotsCaptured: number | null = null;
    let overallScore: number | null = null;
    const categoryScores: Array<{ category: string; score: number }> = [];
    let strengthCount: number | null = null;
    let weaknessCount: number | null = null;
    let recommendationCount: number | null = null;
    let errorCount = 0;
    let warningCount = 0;

    if (crawlId) {
        const crawl = await CrawlData.findById(crawlId).select("pagesDiscovered pagesCrawled status").lean();
        if (crawl) {
            pagesDiscovered = crawl.pagesDiscovered ?? null;
            pagesCrawled = crawl.pagesCrawled ?? null;
            if (crawl.status === "failed") errorCount += 1;
        }
    }

    if (refs.screenshotIds.length > 0) {
        const screenshots = await Screenshot.find({ _id: { $in: refs.screenshotIds } })
            .select("status")
            .lean();
        screenshotsCaptured = screenshots.filter((s) => s.status === "complete").length;
        warningCount += screenshots.filter((s) => s.status === "failed").length;
    }

    if (niceGuyId) {
        const metric = await NiceGuyMetric.findById(niceGuyId)
            .select("overallScore categories summary")
            .lean();
        if (metric) {
            overallScore = metric.overallScore ?? null;
            const categories = metric.categories as Record<string, { score?: number }> | undefined;
            if (categories) {
                for (const [key, value] of Object.entries(categories)) {
                    if (typeof value?.score === "number") {
                        categoryScores.push({
                            category: NICEGUY_CATEGORY_LABELS[key] ?? key,
                            score: value.score,
                        });
                    }
                }
            }
            const summary = metric.summary as {
                strengths?: unknown[];
                weaknesses?: unknown[];
                recommendations?: unknown[];
            };
            strengthCount = summary?.strengths?.length ?? null;
            weaknessCount = summary?.weaknesses?.length ?? null;
            recommendationCount = summary?.recommendations?.length ?? null;
        }
    }

    const pageSpeed: AuditHistorySummary["pageSpeed"] = { mobile: null, desktop: null };
    if (refs.googleMetricsIds.length > 0) {
        const metrics = await GoogleMetric.find({ _id: { $in: refs.googleMetricsIds } })
            .select("strategy scores status")
            .lean();
        for (const metric of metrics) {
            const strategy = metric.strategy as "mobile" | "desktop";
            const scores = metric.scores as {
                performance?: number | null;
                accessibility?: number | null;
                bestPractices?: number | null;
                seo?: number | null;
            };
            pageSpeed[strategy] = {
                performance: scores?.performance ?? null,
                accessibility: scores?.accessibility ?? null,
                bestPractices: scores?.bestPractices ?? null,
                seo: scores?.seo ?? null,
            };
            if (metric.status === "failed") warningCount += 1;
        }
    }

    if (aiSummaryId) {
        const summary = await AiSummary.findById(aiSummaryId)
            .select("strengths weaknesses recommendations status")
            .lean();
        if (summary) {
            if (strengthCount === null) strengthCount = summary.strengths?.length ?? null;
            if (weaknessCount === null) weaknessCount = summary.weaknesses?.length ?? null;
            if (recommendationCount === null) {
                const recs = summary as { recommendations?: unknown[] };
                recommendationCount = recs.recommendations?.length ?? null;
            }
            if (summary.status === "failed") warningCount += 1;
        }
    }

    return {
        pagesDiscovered,
        pagesCrawled,
        screenshotsCaptured,
        overallScore,
        categoryScores,
        pageSpeed,
        strengthCount,
        weaknessCount,
        recommendationCount,
        errorCount,
        warningCount,
    };
}
