import "server-only";

import type { SerializableAuditRun } from "@/src/services/audit-history/types";
import type { SerializableCrawl } from "@/src/data/crawls";
import type { SerializableGoogleMetric } from "@/src/data/google-metrics";
import type { SerializableNiceGuyMetric } from "@/src/data/niceguy-metrics";
import type { SerializableScreenshot } from "@/src/data/screenshots";
import type { SerializableWebsite } from "@/src/data/websites";
import { AUDIT_REQUESTED_OUTPUTS } from "@/src/services/cursor-analysis/schemas";
import {
    validateCursorAuditPackage,
    type CursorAuditPackage,
} from "@/src/services/cursor-analysis/schemas";
import { getCursorAnalysisConfig } from "@/src/services/cursor-analysis/config";

function mapScreenshotDevice(type: SerializableScreenshot["type"]): "desktop" | "mobile" | null {
    if (type.startsWith("desktop")) return "desktop";
    if (type.startsWith("mobile")) return "mobile";
    return null;
}

function normalizeGoogleMetric(metric: SerializableGoogleMetric | null): Record<string, unknown> {
    if (!metric) return {};
    return {
        strategy: metric.strategy,
        status: metric.status,
        requestedUrl: metric.requestedUrl,
        finalUrl: metric.finalUrl,
        fetchTime: metric.fetchTime,
        scores: metric.scores,
        labMetrics: metric.labMetrics,
        fieldData: metric.fieldData,
        coreWebVitals: metric.coreWebVitals,
        opportunities: metric.opportunities,
        diagnostics: metric.diagnostics,
        failedAudits: metric.failedAudits,
        passedAuditCount: metric.passedAuditCount,
        failedAuditCount: metric.failedAuditCount,
        notApplicableAuditCount: metric.notApplicableAuditCount,
    };
}

function normalizeNiceGuyMetric(metric: SerializableNiceGuyMetric | null): Record<string, unknown> {
    if (!metric) return {};
    return {
        status: metric.status,
        scoringVersion: metric.scoringVersion,
        overallScore: metric.overallScore,
        categories: metric.categories,
        generatedAt: metric.generatedAt,
    };
}

function normalizeCrawl(crawl: SerializableCrawl | null): Record<string, unknown> {
    if (!crawl) return {};
    return {
        status: crawl.status,
        requestedUrl: crawl.requestedUrl,
        finalUrl: crawl.finalUrl,
        homepageTitle: crawl.homepageTitle,
        metaDescription: crawl.metaDescription,
        language: crawl.language,
        pagesDiscovered: crawl.pagesDiscovered,
        pagesCrawled: crawl.pagesCrawled,
        internalLinks: crawl.internalLinks.slice(0, 50),
        externalLinks: crawl.externalLinks.slice(0, 25),
        emailsFound: crawl.emailsFound,
        phoneNumbersFound: crawl.phoneNumbersFound,
        socialLinks: crawl.socialLinks,
        hasAboutPage: crawl.hasAboutPage,
        hasContactPage: crawl.hasContactPage,
        hasServicesPage: crawl.hasServicesPage,
        hasPrivacyPolicy: crawl.hasPrivacyPolicy,
        hasTerms: crawl.hasTerms,
        pageResults: crawl.pageResults.map((page) => ({
            url: page.url,
            pageType: page.pageType,
            statusCode: page.statusCode,
            title: page.title,
            metaDescription: page.metaDescription,
            headings: page.headings,
            visibleText: page.visibleText?.slice(0, 8000) ?? "",
            buttons: page.buttons?.slice(0, 20) ?? [],
            forms: page.forms?.slice(0, 5) ?? [],
            images: page.images?.slice(0, 20) ?? [],
        })),
    };
}

export function buildCursorAuditPackage(input: {
    auditRun: SerializableAuditRun;
    website: SerializableWebsite;
    crawl: SerializableCrawl | null;
    screenshots: SerializableScreenshot[];
    pageSpeed: {
        mobile: SerializableGoogleMetric | null;
        desktop: SerializableGoogleMetric | null;
    };
    niceGuy: SerializableNiceGuyMetric | null;
}): CursorAuditPackage {
    const config = getCursorAnalysisConfig();
    const pagesAnalyzed = input.crawl
        ? input.crawl.pageResults
              .filter((page) => !page.errorMessage && (page.statusCode ?? 200) < 400)
              .map((page) => page.url)
        : [];

    const packageValue: CursorAuditPackage = {
        schemaVersion: "1.0",
        auditId: input.auditRun.id,
        website: {
            url: input.auditRun.source.websiteUrl,
            businessName: input.website.businessName || input.auditRun.source.businessName,
            industry: input.website.industry || null,
            pagesAnalyzed,
        },
        screenshots: input.screenshots
            .filter((shot) => shot.status === "complete")
            .map((shot) => {
                const device = mapScreenshotDevice(shot.type);
                if (!device) return null;
                const url = shot.secureUrl || shot.publicUrl;
                if (!url) return null;
                return {
                    id: shot.id,
                    page: shot.pageType,
                    device,
                    url,
                    width: shot.width ?? shot.viewport.width,
                    height: shot.height ?? shot.viewport.height,
                    capturedAt: shot.generatedAt ?? shot.createdAt,
                };
            })
            .filter((shot): shot is NonNullable<typeof shot> => Boolean(shot)),
        googleMetrics: {
            mobile: normalizeGoogleMetric(input.pageSpeed.mobile),
            desktop: normalizeGoogleMetric(input.pageSpeed.desktop),
        },
        niceGuyMetrics: normalizeNiceGuyMetric(input.niceGuy),
        crawl: normalizeCrawl(input.crawl),
        requestedOutputs: [...AUDIT_REQUESTED_OUTPUTS],
        metadata: {
            packageCreatedAt: new Date().toISOString(),
            packageVersion: config.packageVersion as "1.0",
        },
    };

    return validateCursorAuditPackage(packageValue);
}
