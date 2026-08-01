import "server-only";

import crypto from "node:crypto";
import { getAuditRunById } from "@/src/data/audit-runs";
import { getAiSummaryById } from "@/src/data/ai-summaries";
import { getCrawlById } from "@/src/data/crawls";
import { getGoogleMetricById } from "@/src/data/google-metrics";
import { getNiceGuyMetricById } from "@/src/data/niceguy-metrics";
import { getScreenshotById } from "@/src/data/screenshots";
import { getWebsiteById } from "@/src/data/websites";
import { AUDIT_PACKAGE_VERSION } from "@/src/services/audit-jobs/audit-package";
import type { AuditExecutionContext } from "@/src/services/audit-pipeline/types";

export const IMMUTABLE_AUDIT_PACKAGE_SCHEMA_VERSION = "1.0";

export type ImmutableAuditPackage = {
    schemaVersion: typeof IMMUTABLE_AUDIT_PACKAGE_SCHEMA_VERSION;
    website: {
        id: string;
        submittedUrl: string;
        finalUrl: string;
        normalizedDomain: string;
    };
    audit: {
        auditRunId: string;
        jobId: string;
        configuration: AuditExecutionContext["configuration"];
        startedAt: string;
    };
    crawl: Record<string, unknown> | null;
    screenshots: Array<Record<string, unknown>>;
    pageSpeed: {
        mobile: Record<string, unknown> | null;
        desktop: Record<string, unknown> | null;
    };
    niceGuyMetrics: Record<string, unknown> | null;
    analysisMetadata: {
        visuallyAnalyzed: boolean;
        inputModalities: string[];
        analysisVersion: string | null;
    };
};

export type BuiltAuditPackage = {
    package: ImmutableAuditPackage;
    packageVersion: string;
    contentHash: string;
};

function stableStringify(value: unknown): string {
    return JSON.stringify(value, (_key, item) => {
        if (item && typeof item === "object" && !Array.isArray(item)) {
            return Object.keys(item)
                .sort()
                .reduce<Record<string, unknown>>((acc, key) => {
                    acc[key] = (item as Record<string, unknown>)[key];
                    return acc;
                }, {});
        }
        return item;
    });
}

export async function buildImmutableAuditPackage(
    context: AuditExecutionContext,
): Promise<BuiltAuditPackage | null> {
    const [website, auditRun] = await Promise.all([
        getWebsiteById(context.websiteId),
        getAuditRunById(context.auditRunId),
    ]);
    if (!website || !auditRun) {
        return null;
    }

    const refs = auditRun.references;
    const crawlId = refs.crawlDataIds[refs.crawlDataIds.length - 1] ?? null;

    const [crawl, screenshots, googleMetrics, niceGuy, aiSummary] = await Promise.all([
        crawlId ? getCrawlById(crawlId) : Promise.resolve(null),
        Promise.all(refs.screenshotIds.map((id) => getScreenshotById(id))).then((items) =>
            items.filter(Boolean),
        ),
        Promise.all(refs.googleMetricsIds.map((id) => getGoogleMetricById(id))).then((items) =>
            items.filter(Boolean),
        ),
        refs.niceGuyMetricsId ? getNiceGuyMetricById(refs.niceGuyMetricsId) : Promise.resolve(null),
        refs.aiSummaryId ? getAiSummaryById(refs.aiSummaryId) : Promise.resolve(null),
    ]);

    const mobile = googleMetrics.find((metric) => metric?.strategy === "mobile") ?? null;
    const desktop = googleMetrics.find((metric) => metric?.strategy === "desktop") ?? null;

    const auditPackage: ImmutableAuditPackage = {
        schemaVersion: IMMUTABLE_AUDIT_PACKAGE_SCHEMA_VERSION,
        website: {
            id: website.id,
            submittedUrl: auditRun.source.websiteUrl,
            finalUrl: crawl?.finalUrl ?? auditRun.source.websiteUrl,
            normalizedDomain: auditRun.source.normalizedUrl,
        },
        audit: {
            auditRunId: context.auditRunId,
            jobId: context.jobId,
            configuration: context.configuration,
            startedAt: auditRun.startedAt ?? auditRun.createdAt,
        },
        crawl: crawl ? { ...crawl } : null,
        screenshots: screenshots.map((shot) => ({ ...shot })),
        pageSpeed: {
            mobile: mobile ? { ...mobile } : null,
            desktop: desktop ? { ...desktop } : null,
        },
        niceGuyMetrics: niceGuy ? { ...niceGuy } : null,
        analysisMetadata: {
            visuallyAnalyzed: aiSummary?.visuallyAnalyzed ?? false,
            inputModalities: aiSummary?.inputModalities ?? ["text", "dom"],
            analysisVersion: aiSummary?.analysisVersion ?? null,
        },
    };

    const contentHash = crypto
        .createHash("sha256")
        .update(stableStringify(auditPackage))
        .digest("hex");

    return {
        package: auditPackage,
        packageVersion: AUDIT_PACKAGE_VERSION,
        contentHash,
    };
}
