import "server-only";

import { getAiSummaryById } from "@/src/data/ai-summaries";
import { getAuditRunById } from "@/src/data/audit-runs";
import { getCrawlById } from "@/src/data/crawls";
import { getGoogleMetricById } from "@/src/data/google-metrics";
import { getHeroSuggestionsForSummary } from "@/src/data/hero-suggestions";
import { getNiceGuyMetricById } from "@/src/data/niceguy-metrics";
import { getScreenshotById } from "@/src/data/screenshots";
import type { SerializableAiSummary } from "@/src/data/ai-summaries";
import type { SerializableCrawl } from "@/src/data/crawls";
import type { SerializableGoogleMetric } from "@/src/data/google-metrics";
import type { SerializableHeroSuggestion } from "@/src/data/hero-suggestions";
import type { SerializableNiceGuyMetric } from "@/src/data/niceguy-metrics";
import type { SerializableScreenshot } from "@/src/data/screenshots";
import type { SerializableAuditRun } from "@/src/services/audit-history/types";

export type AuditRunResources = {
    auditRun: SerializableAuditRun;
    crawl: SerializableCrawl | null;
    screenshots: SerializableScreenshot[];
    pageSpeed: {
        mobile: SerializableGoogleMetric | null;
        desktop: SerializableGoogleMetric | null;
    };
    niceGuy: SerializableNiceGuyMetric | null;
    aiSummary: SerializableAiSummary | null;
    heroSuggestions: SerializableHeroSuggestion[];
};

export async function loadAuditRunResources(input: {
    websiteId: string;
    auditRunId: string;
}): Promise<AuditRunResources | null> {
    const auditRun = await getAuditRunById(input.auditRunId);
    if (!auditRun || auditRun.websiteId !== input.websiteId) {
        return null;
    }

    const refs = auditRun.references;
    const crawlId = refs.crawlDataIds[refs.crawlDataIds.length - 1] ?? null;

    const [crawl, screenshots, googleMetrics, niceGuy, aiSummary] = await Promise.all([
        crawlId ? getCrawlById(crawlId) : Promise.resolve(null),
        Promise.all(refs.screenshotIds.map((id) => getScreenshotById(id))).then((items) =>
            items.filter((item): item is SerializableScreenshot => Boolean(item)),
        ),
        Promise.all(refs.googleMetricsIds.map((id) => getGoogleMetricById(id))).then((items) =>
            items.filter((item): item is SerializableGoogleMetric => Boolean(item)),
        ),
        refs.niceGuyMetricsId ? getNiceGuyMetricById(refs.niceGuyMetricsId) : Promise.resolve(null),
        refs.aiSummaryId ? getAiSummaryById(refs.aiSummaryId) : Promise.resolve(null),
    ]);

    const heroSuggestions = aiSummary
        ? await getHeroSuggestionsForSummary(aiSummary.id)
        : [];

    return {
        auditRun,
        crawl,
        screenshots,
        pageSpeed: {
            mobile: googleMetrics.find((metric) => metric.strategy === "mobile") ?? null,
            desktop: googleMetrics.find((metric) => metric.strategy === "desktop") ?? null,
        },
        niceGuy,
        aiSummary,
        heroSuggestions,
    };
}
