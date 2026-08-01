import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    generateReportToken,
    hashReportToken,
    isValidReportTokenFormat,
} from "@/src/services/public-reports/hash-report-token";
import {
    isScreenshotPathAllowed,
    sanitizeReportText,
    selectDefaultScreenshotIds,
} from "@/src/services/public-reports/screenshot-selection";
import {
    isPublicReportAccessible,
    isReportExpired,
    PublicReportValidationError,
    validatePublicReportSources,
} from "@/src/services/public-reports/validate-public-report-sources";
import type { SerializableScreenshot } from "@/src/data/screenshots";
import type { SerializableWebsite } from "@/src/data/websites";
import type { SerializableCrawl } from "@/src/data/crawls";
import type { SerializableGoogleMetric } from "@/src/data/google-metrics";
import type { SerializableNiceGuyMetric } from "@/src/data/niceguy-metrics";
import type { SerializableAiSummary } from "@/src/data/ai-summaries";

function website(): SerializableWebsite {
    return {
        id: "507f1f77bcf86cd799439011",
        businessName: "Acme Plumbing",
        originalUrl: "https://acmeplumbing.example",
        normalizedDomain: "acmeplumbing.example",
        businessEmail: "",
        industry: "Plumbing",
        location: "Toronto",
        source: "manual-prospect-research",
        status: "new",
        auditStatus: "complete",
        crawlStatus: "complete",
        pageSpeedStatus: "complete",
        niceGuyStatus: "complete",
        aiAnalysisStatus: "complete",
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
        deletedAt: null,
        createdAt: "2026-07-28T00:00:00.000Z",
        updatedAt: "2026-07-28T00:00:00.000Z",
    };
}

function crawl(): SerializableCrawl {
    return {
        id: "507f1f77bcf86cd799439012",
        websiteId: "507f1f77bcf86cd799439011",
        auditRunId: null,
        status: "complete",
        requestedUrl: "https://acmeplumbing.example",
        finalUrl: "https://acmeplumbing.example",
        homepageTitle: "Acme",
        metaDescription: "",
        language: "en",
        pagesDiscovered: 3,
        pagesCrawled: 3,
        internalLinks: [],
        externalLinks: [],
        emailsFound: [],
        phoneNumbersFound: [],
        socialLinks: [],
        hasAboutPage: true,
        hasContactPage: true,
        hasServicesPage: true,
        hasPrivacyPolicy: false,
        hasTerms: false,
        pageResults: [
            {
                url: "https://acmeplumbing.example",
                path: "/",
                pageType: "home",
                title: "Home",
                metaDescription: "",
                headings: [],
                buttons: [],
                forms: [],
                images: [],
                visibleText: "Welcome",
                statusCode: 200,
            },
        ],
        crawlDurationMs: 1000,
        errorMessage: null,
        startedAt: "2026-07-28T00:00:00.000Z",
        completedAt: "2026-07-28T00:01:00.000Z",
        createdAt: "2026-07-28T00:00:00.000Z",
        updatedAt: "2026-07-28T00:01:00.000Z",
    };
}

describe("public report token security", () => {
    it("generates secure tokens and stores only hashes", () => {
        const first = generateReportToken();
        const second = generateReportToken();
        assert.notEqual(first.rawToken, second.rawToken);
        assert.equal(first.tokenHash, hashReportToken(first.rawToken));
        assert.equal(first.tokenPrefix, first.rawToken.slice(0, 8));
        assert.ok(isValidReportTokenFormat(first.rawToken));
    });

    it("rejects malformed tokens before lookup", () => {
        assert.equal(isValidReportTokenFormat("short"), false);
        assert.equal(isValidReportTokenFormat(""), false);
    });
});

describe("public report validation", () => {
    it("blocks mismatched audit records", () => {
        const site = website();
        const crawlRecord = crawl();
        const niceGuy = {
            id: "507f1f77bcf86cd799439013",
            websiteId: site.id,
            crawlId: crawlRecord.id,
            status: "complete",
            scoringVersion: "niceguy-v1",
            overallScore: 70,
            categories: {},
            summary: {
                highPriorityIssueCount: 0,
                mediumPriorityIssueCount: 0,
                lowPriorityIssueCount: 0,
                checksPassed: 0,
                checksFailed: 0,
                checksUnavailable: 0,
            },
            generatedAt: "2026-07-28T00:02:00.000Z",
            durationMs: 100,
            errorCode: "",
            errorMessage: "",
            createdAt: "2026-07-28T00:02:00.000Z",
            updatedAt: "2026-07-28T00:02:00.000Z",
        } as SerializableNiceGuyMetric;

        const aiSummary = {
            id: "507f1f77bcf86cd799439014",
            websiteId: site.id,
            crawlId: crawlRecord.id,
            niceGuyMetricId: "wrong-metric-id",
            auditRunId: null,
            status: "complete",
            analysisVersion: "audit-analysis-v1",
            promptVersion: "audit-analysis-v1",
            visuallyAnalyzed: false,
            inputModalities: ["text", "dom"],
            screenshotIds: [],
            sourceSnapshot: {
                scoringVersion: "niceguy-v1",
                overallScore: 70,
                categoryScores: {},
                mobilePageSpeedAvailable: true,
                desktopPageSpeedAvailable: true,
                screenshotCount: 1,
                pageCount: 3,
            },
            executiveSummary: "Summary",
            businessImpactSummary: "Impact",
            strengths: [],
            weaknesses: [],
            quickWins: [],
            longTermRecommendations: [],
            priorityOrder: [],
            disclaimers: [],
            generatedAt: "2026-07-28T00:03:00.000Z",
            durationMs: 100,
            errorCode: "",
            errorMessage: "",
            createdAt: "2026-07-28T00:03:00.000Z",
            updatedAt: "2026-07-28T00:03:00.000Z",
        } as SerializableAiSummary;

        const pageSpeed = {
            mobile: {
                id: "1",
                websiteId: site.id,
                crawlId: crawlRecord.id,
                strategy: "mobile",
                status: "complete",
            } as SerializableGoogleMetric,
            desktop: null,
        };

        assert.throws(
            () =>
                validatePublicReportSources({
                    website: site,
                    crawl: crawlRecord,
                    pageSpeed,
                    niceGuy,
                    aiSummary,
                    heroSuggestions: [],
                    screenshots: [],
                }),
            (error: unknown) => {
                assert.ok(error instanceof PublicReportValidationError);
                assert.equal(error.code, "AI_SUMMARY_REQUIRED");
                return true;
            },
        );
    });

    it("detects expired published reports", () => {
        assert.equal(isReportExpired("2020-01-01T00:00:00.000Z"), true);
        assert.equal(isPublicReportAccessible({ status: "draft", expiresAt: null }), false);
        assert.equal(
            isPublicReportAccessible({
                status: "published",
                expiresAt: "2099-01-01T00:00:00.000Z",
            }),
            true,
        );
    });
});

describe("screenshot selection", () => {
    it("blocks private route screenshots", () => {
        assert.equal(isScreenshotPathAllowed("https://example.com/login"), false);
        assert.equal(isScreenshotPathAllowed("https://example.com/services"), true);
    });

    it("prefers homepage desktop and mobile screenshots", () => {
        const screenshots: SerializableScreenshot[] = [
            {
                id: "1",
                websiteId: "w",
                crawlId: "c",
                type: "desktop-viewport",
                pageType: "home",
                pageUrl: "https://example.com",
                viewport: { width: 1280, height: 800, deviceScaleFactor: 1 },
                storageType: "cloudinary",
                filePath: "",
                publicUrl: "",
                cloudinaryPublicId: "",
                cloudinaryAssetId: "",
                cloudinaryVersion: 1,
                secureUrl: "https://res.cloudinary.com/demo/image/upload/v1/a.png",
                width: 1280,
                height: 800,
                format: "png",
                fileSizeBytes: 1000,
                status: "complete",
                errorMessage: null,
                generatedAt: "2026-07-28T00:00:00.000Z",
                createdAt: "2026-07-28T00:00:00.000Z",
                updatedAt: "2026-07-28T00:00:00.000Z",
            },
            {
                id: "2",
                websiteId: "w",
                crawlId: "c",
                type: "mobile-viewport",
                pageType: "home",
                pageUrl: "https://example.com",
                viewport: { width: 390, height: 844, deviceScaleFactor: 2 },
                storageType: "cloudinary",
                filePath: "",
                publicUrl: "",
                cloudinaryPublicId: "",
                cloudinaryAssetId: "",
                cloudinaryVersion: 1,
                secureUrl: "https://res.cloudinary.com/demo/image/upload/v1/b.png",
                width: 390,
                height: 844,
                format: "png",
                fileSizeBytes: 1000,
                status: "complete",
                errorMessage: null,
                generatedAt: "2026-07-28T00:00:00.000Z",
                createdAt: "2026-07-28T00:00:00.000Z",
                updatedAt: "2026-07-28T00:00:00.000Z",
            },
        ];

        const ids = selectDefaultScreenshotIds(screenshots);
        assert.deepEqual(ids, ["1", "2"]);
    });
});

describe("report text sanitization", () => {
    it("removes HTML from titles", () => {
        assert.equal(sanitizeReportText("<b>Unsafe</b> title"), "Unsafe title");
    });
});
