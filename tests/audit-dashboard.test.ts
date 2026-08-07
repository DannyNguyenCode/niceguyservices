import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateAuditReadiness } from "@/src/services/audit-readiness";
import type { SerializableAiSummary } from "@/src/data/ai-summaries";
import type { SerializableCrawl } from "@/src/data/crawls";
import type { SerializableGoogleMetric } from "@/src/data/google-metrics";
import type { SerializableNiceGuyMetric } from "@/src/data/niceguy-metrics";
import type { SerializableScreenshot } from "@/src/data/screenshots";
import type { SerializableWebsite } from "@/src/data/websites";

function baseWebsite(overrides: Partial<SerializableWebsite> = {}): SerializableWebsite {
    return {
        id: "507f1f77bcf86cd799439011",
        businessName: "Nice Guy Plumbing",
        originalUrl: "https://niceguyplumbing.ca",
        normalizedDomain: "niceguyplumbing.ca",
        businessEmail: "",
        industry: "Plumbing",
        location: "Toronto",
        source: "manual-prospect-research",
        status: "new",
        auditStatus: "processing",
        crawlStatus: "not-started",
        pageSpeedStatus: "not-started",
        niceGuyStatus: "not-started",
        aiAnalysisStatus: "not-started",
        demoStatus: "none",
        outreachStatus: "not-contacted",
        publicReportStatus: "not-created",
        latestPublicReportAt: null,
        latestPublishedReportAt: null,
        pdfReportStatus: "not-generated",
        latestPdfReportAt: null,
        outreachDraftStatus: "not-generated",
        latestOutreachDraftAt: null,
        demoProjectStatus: "not-created",
        latestDemoAt: null,
        latestPageSpeedRunAt: null,
        latestNiceGuyRunAt: null,
        latestAiAnalysisRunAt: null,
        createdAt: "2026-07-28T00:00:00.000Z",
        updatedAt: "2026-07-28T00:00:00.000Z",
        deletedAt: null,
        ...overrides,
    };
}

function completedCrawl(id = "507f1f77bcf86cd799439012"): SerializableCrawl {
    return {
        id,
        websiteId: "507f1f77bcf86cd799439011",
        auditRunId: null,
        status: "complete",
        requestedUrl: "https://niceguyplumbing.ca",
        finalUrl: "https://niceguyplumbing.ca/",
        homepageTitle: "Home",
        metaDescription: "",
        language: "en",
        pagesDiscovered: 5,
        pagesCrawled: 5,
        internalLinks: ["/about", "/contact"],
        externalLinks: ["https://facebook.com/example"],
        emailsFound: ["hello@example.com"],
        phoneNumbersFound: ["416-555-0100"],
        socialLinks: [],
        hasAboutPage: true,
        hasContactPage: true,
        hasServicesPage: true,
        hasPrivacyPolicy: false,
        hasTerms: false,
        pageResults: [
            {
                pageType: "home",
                url: "https://niceguyplumbing.ca/",
                path: "/",
                statusCode: 200,
                title: "Home",
                metaDescription: "",
                headings: [{ level: 1, text: "Home" }],
                buttons: [{ text: "Contact Us", href: "/contact" }],
                forms: [],
                images: [],
                visibleText: "Welcome",
                errorMessage: null,
            },
        ],
        crawlDurationMs: 4000,
        errorMessage: null,
        startedAt: "2026-07-28T00:00:00.000Z",
        completedAt: "2026-07-28T00:01:00.000Z",
        createdAt: "2026-07-28T00:00:00.000Z",
        updatedAt: "2026-07-28T00:01:00.000Z",
    };
}

function completePageSpeed(crawlId: string): {
    mobile: SerializableGoogleMetric;
    desktop: SerializableGoogleMetric;
} {
    const base = {
        websiteId: "507f1f77bcf86cd799439011",
        crawlId,
        requestedUrl: "https://niceguyplumbing.ca",
        finalUrl: "https://niceguyplumbing.ca/",
        status: "complete" as const,
        fetchTime: "2026-07-28T00:02:00.000Z",
        lighthouseVersion: "12.0.0",
        userAgent: "test",
        scores: {
            performance: 80,
            accessibility: 90,
            bestPractices: 85,
            seo: 92,
        },
        labMetrics: {},
        fieldData: { available: false },
        coreWebVitals: { assessment: "unavailable" as const },
        opportunities: [],
        diagnostics: [],
        failedAudits: [],
        passedAuditCount: 0,
        failedAuditCount: 0,
        notApplicableAuditCount: 0,
        apiMetadata: { responseId: null, analysisUTCTimestamp: null },
        durationMs: 1000,
        errorCode: "",
        errorMessage: "",
        createdAt: "2026-07-28T00:02:00.000Z",
        updatedAt: "2026-07-28T00:02:00.000Z",
    };

    return {
        mobile: { ...base, id: "507f1f77bcf86cd799439013", strategy: "mobile" } as SerializableGoogleMetric,
        desktop: { ...base, id: "507f1f77bcf86cd799439014", strategy: "desktop" } as SerializableGoogleMetric,
    };
}

describe("audit readiness", () => {
    it("recommends crawl for a new website", () => {
        const readiness = calculateAuditReadiness({
            website: baseWebsite(),
            latestCrawl: null,
            screenshots: [],
            pageSpeed: { mobile: null, desktop: null },
            niceGuy: null,
            aiSummary: null,
            heroSuggestionsComplete: false,
            hasActiveCrawl: false,
            hasActivePageSpeed: false,
            hasActiveNiceGuy: false,
            hasActiveAiAnalysis: false,
        });

        assert.equal(readiness.nextRecommendedStage, "crawl");
        assert.equal(readiness.canRunCrawl, true);
        assert.equal(readiness.canRunPageSpeed, false);
    });

    it("enables screenshots and pagespeed after completed crawl", () => {
        const crawl = completedCrawl();
        const readiness = calculateAuditReadiness({
            website: baseWebsite({ crawlStatus: "complete" }),
            latestCrawl: crawl,
            screenshots: [],
            pageSpeed: { mobile: null, desktop: null },
            niceGuy: null,
            aiSummary: null,
            heroSuggestionsComplete: false,
            hasActiveCrawl: false,
            hasActivePageSpeed: false,
            hasActiveNiceGuy: false,
            hasActiveAiAnalysis: false,
        });

        assert.equal(readiness.nextRecommendedStage, "screenshots");
        assert.equal(readiness.canRunScreenshots, true);
        assert.equal(readiness.canRunPageSpeed, true);
    });

    it("blocks Nice Guy without PageSpeed", () => {
        const crawl = completedCrawl();
        const readiness = calculateAuditReadiness({
            website: baseWebsite({ crawlStatus: "complete" }),
            latestCrawl: crawl,
            screenshots: [],
            pageSpeed: { mobile: null, desktop: null },
            niceGuy: null,
            aiSummary: null,
            heroSuggestionsComplete: false,
            hasActiveCrawl: false,
            hasActivePageSpeed: false,
            hasActiveNiceGuy: false,
            hasActiveAiAnalysis: false,
        });

        assert.equal(readiness.canRunNiceGuy, false);
        assert.ok(
            readiness.blockers.some((blocker) => blocker.code === "PAGESPEED_REQUIRED"),
        );
    });

    it("allows partial PageSpeed for Nice Guy when one strategy succeeded", () => {
        const crawl = completedCrawl();
        const pageSpeed = completePageSpeed(crawl.id);
        pageSpeed.desktop = {
            ...pageSpeed.desktop,
            status: "failed",
            errorCode: "PAGESPEED_TIMEOUT",
            errorMessage: "Timed out",
        };

        const readiness = calculateAuditReadiness({
            website: baseWebsite({
                crawlStatus: "complete",
                pageSpeedStatus: "partial",
            }),
            latestCrawl: crawl,
            screenshots: [],
            pageSpeed,
            niceGuy: null,
            aiSummary: null,
            heroSuggestionsComplete: false,
            hasActiveCrawl: false,
            hasActivePageSpeed: false,
            hasActiveNiceGuy: false,
            hasActiveAiAnalysis: false,
        });

        assert.equal(readiness.canRunNiceGuy, true);
    });

    it("marks screenshots stale when crawl was rerun", () => {
        const crawl = completedCrawl("new-crawl-id");
        const screenshots: SerializableScreenshot[] = [
            {
                id: "shot-1",
                websiteId: "507f1f77bcf86cd799439011",
                crawlId: "old-crawl-id",
                type: "desktop-viewport",
                pageType: "home",
                pageUrl: "https://niceguyplumbing.ca",
                status: "complete",
                storageType: "cloudinary",
                secureUrl: "https://res.cloudinary.com/demo/image/upload/v1/test.png",
                width: 1280,
                height: 800,
                format: "png",
                fileSizeBytes: 1000,
                viewport: { width: 1280, height: 800, deviceScaleFactor: 1 },
                generatedAt: "2026-07-28T00:00:00.000Z",
                createdAt: "2026-07-28T00:00:00.000Z",
                updatedAt: "2026-07-28T00:00:00.000Z",
                errorMessage: null,
                visualStability: null,
                filePath: "",
                publicUrl: "",
                cloudinaryPublicId: "",
                cloudinaryAssetId: "",
                cloudinaryVersion: 1,
            },
        ];

        const readiness = calculateAuditReadiness({
            website: baseWebsite({ crawlStatus: "complete" }),
            latestCrawl: crawl,
            screenshots,
            pageSpeed: { mobile: null, desktop: null },
            niceGuy: null,
            aiSummary: null,
            heroSuggestionsComplete: false,
            hasActiveCrawl: false,
            hasActivePageSpeed: false,
            hasActiveNiceGuy: false,
            hasActiveAiAnalysis: false,
        });

        assert.equal(readiness.stages.screenshots.isStale, true);
        assert.ok(readiness.warnings.some((warning) => warning.includes("Screenshots")));
    });

    it("reports audit readiness when workflow is complete", () => {
        const crawl = completedCrawl();
        const pageSpeed = completePageSpeed(crawl.id);
        const niceGuy = {
            id: "507f1f77bcf86cd799439015",
            websiteId: crawl.websiteId,
            crawlId: crawl.id,
            status: "complete" as const,
            scoringVersion: "niceguy-v1",
            overallScore: 74,
            categories: {},
            summary: {},
            generatedAt: "2026-07-28T00:03:00.000Z",
            durationMs: 500,
            errorCode: "",
            errorMessage: "",
            createdAt: "2026-07-28T00:03:00.000Z",
            updatedAt: "2026-07-28T00:03:00.000Z",
        } as SerializableNiceGuyMetric;

        const aiSummary = {
            id: "507f1f77bcf86cd799439016",
            websiteId: crawl.websiteId,
            crawlId: crawl.id,
            niceGuyMetricId: niceGuy.id,
            status: "complete" as const,
            analysisVersion: "audit-analysis-v1",
            promptVersion: "audit-analysis-v1",
            generatedAt: "2026-07-28T00:04:00.000Z",
            durationMs: 2000,
            errorCode: "",
            errorMessage: "",
            createdAt: "2026-07-28T00:04:00.000Z",
            updatedAt: "2026-07-28T00:04:00.000Z",
        } as SerializableAiSummary;

        const readiness = calculateAuditReadiness({
            website: baseWebsite({
                crawlStatus: "complete",
                pageSpeedStatus: "complete",
                niceGuyStatus: "complete",
                aiAnalysisStatus: "complete",
            }),
            latestCrawl: crawl,
            screenshots: [
                {
                    id: "shot-complete",
                    websiteId: crawl.websiteId,
                    crawlId: crawl.id,
                    type: "desktop-viewport",
                    pageType: "home",
                    pageUrl: "https://niceguyplumbing.ca",
                    status: "complete",
                    storageType: "cloudinary",
                    secureUrl: "https://res.cloudinary.com/demo/image/upload/v1/test.png",
                    width: 1280,
                    height: 800,
                    format: "png",
                    fileSizeBytes: 1000,
                    viewport: { width: 1280, height: 800, deviceScaleFactor: 1 },
                    generatedAt: "2026-07-28T00:01:30.000Z",
                    createdAt: "2026-07-28T00:01:30.000Z",
                    updatedAt: "2026-07-28T00:01:30.000Z",
                    errorMessage: null,
                    visualStability: null,
                    filePath: "",
                    publicUrl: "",
                    cloudinaryPublicId: "",
                    cloudinaryAssetId: "",
                    cloudinaryVersion: 1,
                },
            ],
            pageSpeed,
            niceGuy,
            aiSummary,
            heroSuggestionsComplete: true,
            hasActiveCrawl: false,
            hasActivePageSpeed: false,
            hasActiveNiceGuy: false,
            hasActiveAiAnalysis: false,
        });

        assert.equal(readiness.nextRecommendedStage, "complete");
        assert.equal(readiness.isAuditReadyForReport, true);
    });

    it("disables duplicate actions while a stage is active", () => {
        const crawl = completedCrawl();
        const readiness = calculateAuditReadiness({
            website: baseWebsite({ crawlStatus: "processing" }),
            latestCrawl: crawl,
            screenshots: [],
            pageSpeed: { mobile: null, desktop: null },
            niceGuy: null,
            aiSummary: null,
            heroSuggestionsComplete: false,
            hasActiveCrawl: true,
            hasActivePageSpeed: false,
            hasActiveNiceGuy: false,
            hasActiveAiAnalysis: false,
        });

        assert.equal(readiness.canRunCrawl, false);
        assert.equal(readiness.canRunPageSpeed, false);
    });
});
