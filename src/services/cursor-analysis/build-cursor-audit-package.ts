import "server-only";

import type { SerializableAuditRun } from "@/src/services/audit-history/types";
import type { SerializableCrawl } from "@/src/data/crawls";
import type { SerializableGoogleMetric } from "@/src/data/google-metrics";
import type { SerializableNiceGuyMetric } from "@/src/data/niceguy-metrics";
import type { SerializableScreenshot } from "@/src/data/screenshots";
import type { SerializableWebsite } from "@/src/data/websites";
import { getCursorAnalysisConfig } from "@/src/services/cursor-analysis/config";
import {
    validateCursorAuditPackage,
    type CursorAuditPackage,
} from "@/src/services/cursor-analysis/schemas";
import { calculateCursorAnalysisReadiness } from "@/src/services/cursor-analysis/readiness";
import { buildAuditResultContract } from "@/src/services/cursor-analysis/result-contract";

function mapScreenshotDevice(type: SerializableScreenshot["type"]): "desktop" | "mobile" | null {
    if (type.startsWith("desktop")) return "desktop";
    if (type.startsWith("mobile")) return "mobile";
    return null;
}

function toScreenshotRef(shot: SerializableScreenshot) {
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
        viewport: {
            width: shot.viewport.width,
            height: shot.viewport.height,
        },
        capturedAt: shot.generatedAt ?? shot.createdAt,
        visualStability: shot.visualStability
            ? {
                  attempted: shot.visualStability.attempted,
                  stabilized: shot.visualStability.stabilized,
                  timedOut: shot.visualStability.timedOut,
                  reason: shot.visualStability.reason,
                  elapsedMs: shot.visualStability.elapsedMs,
              }
            : undefined,
    };
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

function normalizeEvidenceCoverageForPackage(
    value: number | null | undefined,
): number | null {
    if (value == null || !Number.isFinite(value)) {
        return null;
    }

    const normalized = value > 1 ? value / 100 : value;
    return Math.min(Math.max(normalized, 0), 1);
}

function normalizeNiceGuyMetric(metric: SerializableNiceGuyMetric): CursorAuditPackage["niceGuyMetrics"] {
    const completeness = metric.completeness;
    const methodology = metric.methodology;

    return {
        status: metric.status,
        scoringVersion: metric.scoringVersion,
        overallScore: metric.overallScore ?? null,
        categories: Object.values(metric.categories ?? {}),
        completeness: {
            status: completeness?.isComplete ? "complete" : "preliminary",
            evidenceCoverage: normalizeEvidenceCoverageForPackage(
                completeness?.overallEvidenceCoverage,
            ),
            applicableChecks: null,
            evaluatedChecks: completeness
                ? (completeness.blockers?.length ?? 0) + (metric.summary?.checksPassed ?? 0)
                : null,
            unavailableChecks: metric.summary?.checksUnavailable ?? null,
            notApplicableChecks: null,
        },
        methodology: {
            rubricVersion: methodology?.rubricVersion,
            applicabilityVersion: methodology?.applicabilityVersion,
            deterministicCheckCount: methodology?.deterministicCheckCount,
            aiAssistedCheckCount: methodology?.aiAssistedCheckCount,
            limitations: methodology?.limitations ?? [],
        },
        generatedAt: metric.generatedAt ?? undefined,
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

function buildAnalysisInstructions(promptVersion: string) {
    return {
        promptVersion,
        outputSchemaVersion: "1.1",
        rules: [
            "Treat deterministic Nice Guy Metrics overallScore as the official audit score; never replace it.",
            "Treat unavailable checks as missing evidence, not failure.",
            "Ignore not_applicable checks when identifying failures.",
            "Distinguish quality score from evidence coverage.",
            "Label preliminary metrics as preliminary.",
            "Label visual interpretation as interpretation.",
            "Never invent evidence or claim guaranteed outcomes.",
            "Include homepageChanges with a concise customer-facing summary and specific homepage priorityChanges grounded only in supplied evidence.",
            "Target about 5–8 homepage recommendations when evidence supports them; do not pad; return fewer when evidence is limited.",
            "Return only the required callback JSON structure defined in resultContract.",
            "Validate the callback body against resultContract before POSTing.",
            "Post results to callbackUrl using the specified callback header.",
            "Do not place secrets in output, logs, or repository files.",
        ],
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
    analysisRequestId: string;
}): CursorAuditPackage {
    const readiness = calculateCursorAnalysisReadiness({
        auditId: input.auditRun.id,
        auditedUrl: input.auditRun.source.websiteUrl,
        website: input.website,
        crawl: input.crawl,
        screenshots: input.screenshots,
        pageSpeed: input.pageSpeed,
        niceGuy: input.niceGuy,
    });

    if (!readiness.ready) {
        const codes = readiness.blockers.map((item) => item.code).join(", ");
        throw new Error(`AUDIT_PACKAGE_BUILD_BLOCKED: ${codes}`);
    }

    if (!input.niceGuy) {
        throw new Error("AUDIT_PACKAGE_BUILD_BLOCKED: NICEGUY_METRICS_MISSING");
    }

    const config = getCursorAnalysisConfig();
    const completedScreenshots = input.screenshots
        .filter((shot) => shot.status === "complete")
        .map(toScreenshotRef)
        .filter((shot): shot is NonNullable<typeof shot> => Boolean(shot));

    const desktop = completedScreenshots.find((shot) => shot.device === "desktop") ?? null;
    const mobile = completedScreenshots.find((shot) => shot.device === "mobile") ?? null;
    const additional = completedScreenshots.filter(
        (shot) => shot.id !== desktop?.id && shot.id !== mobile?.id,
    );

    const pagesAnalyzed = input.crawl
        ? input.crawl.pageResults
              .filter((page) => !page.errorMessage && (page.statusCode ?? 200) < 400)
              .map((page) => page.url)
        : [];

    const packageValue: CursorAuditPackage = {
        schemaVersion: "1.1",
        packageVersion: config.packageVersion,
        audit: {
            auditId: input.auditRun.id,
            analysisRequestId: input.analysisRequestId,
            auditedUrl: input.auditRun.source.websiteUrl,
            normalizedUrl: input.crawl?.finalUrl ?? input.auditRun.source.websiteUrl,
            createdAt: input.auditRun.createdAt,
            completedAt: input.auditRun.completedAt ?? undefined,
        },
        crawl: normalizeCrawl(input.crawl),
        screenshots: {
            desktop,
            mobile,
            additional: additional.length > 0 ? additional : undefined,
        },
        pageSpeed: {
            mobile: normalizeGoogleMetric(input.pageSpeed.mobile),
            desktop: normalizeGoogleMetric(input.pageSpeed.desktop),
        },
        niceGuyMetrics: normalizeNiceGuyMetric(input.niceGuy),
        analysisInstructions: buildAnalysisInstructions(config.promptVersion),
        resultContract: buildAuditResultContract({
            auditId: input.auditRun.id,
            analysisRequestId: input.analysisRequestId,
        }),
        metadata: {
            packageCreatedAt: new Date().toISOString(),
            websiteBusinessName: input.website.businessName || input.auditRun.source.businessName,
            websiteIndustry: input.website.industry || null,
            pagesAnalyzed,
        },
    };

    return validateCursorAuditPackage(packageValue);
}
