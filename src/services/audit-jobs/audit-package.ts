import "server-only";

import type { SerializableAiSummary } from "@/src/data/ai-summaries";
import type { SerializableCrawl } from "@/src/data/crawls";
import type { SerializableGoogleMetric } from "@/src/data/google-metrics";
import type { SerializableNiceGuyMetric } from "@/src/data/niceguy-metrics";
import type { SerializableScreenshot } from "@/src/data/screenshots";
import type { SerializableWebsite } from "@/src/data/websites";

export const AUDIT_PACKAGE_VERSION = "audit-package-v1";

export type AuditPackage = {
    packageVersion: typeof AUDIT_PACKAGE_VERSION;
    websiteId: string;
    auditRunId: string | null;
    crawlId: string | null;
    createdAt: string;
    updatedAt: string;
    crawl: SerializableCrawl | null;
    screenshots: SerializableScreenshot[];
    pageSpeed: SerializableGoogleMetric[];
    niceGuyMetric: SerializableNiceGuyMetric | null;
    aiSummary: SerializableAiSummary | null;
    analysisMetadata: {
        visuallyAnalyzed: boolean;
        analysisVersion: string | null;
        inputModalities: string[];
        screenshotIds: string[];
    };
};

export function buildAuditPackage(input: {
    website: SerializableWebsite;
    auditRunId?: string | null;
    crawl?: SerializableCrawl | null;
    screenshots?: SerializableScreenshot[];
    pageSpeed?: SerializableGoogleMetric[];
    niceGuyMetric?: SerializableNiceGuyMetric | null;
    aiSummary?: SerializableAiSummary | null;
}): AuditPackage {
    const now = new Date().toISOString();
    return {
        packageVersion: AUDIT_PACKAGE_VERSION,
        websiteId: input.website.id,
        auditRunId: input.auditRunId ?? input.crawl?.auditRunId ?? input.aiSummary?.auditRunId ?? null,
        crawlId: input.crawl?.id ?? input.aiSummary?.crawlId ?? null,
        createdAt: input.crawl?.createdAt ?? now,
        updatedAt: now,
        crawl: input.crawl ?? null,
        screenshots: input.screenshots ?? [],
        pageSpeed: input.pageSpeed ?? [],
        niceGuyMetric: input.niceGuyMetric ?? null,
        aiSummary: input.aiSummary ?? null,
        analysisMetadata: {
            visuallyAnalyzed: input.aiSummary?.visuallyAnalyzed ?? false,
            analysisVersion: input.aiSummary?.analysisVersion ?? null,
            inputModalities: input.aiSummary?.inputModalities ?? ["text", "dom"],
            screenshotIds: input.aiSummary?.screenshotIds ?? [],
        },
    };
}
