import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateAuditReadiness } from "@/src/services/audit-readiness";
import type { SerializableWebsite } from "@/src/data/websites";
import type { SerializableCrawl } from "@/src/data/crawls";
import { assertFileExists } from "./helpers";

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

function completedCrawl(): SerializableCrawl {
    return {
        id: "507f1f77bcf86cd799439012",
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
        externalLinks: [],
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

describe("Phase 9 — Administrator dashboard", () => {
    it("includes dashboard routes and audit overview components", () => {
        assertFileExists("app/dashboard/websites/[id]/page.tsx");
        assertFileExists("components/audit-dashboard/audit-overview.tsx");
        assertFileExists("components/audit-dashboard/audit-progress.tsx");
    });

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
        const readiness = calculateAuditReadiness({
            website: baseWebsite({ crawlStatus: "complete" }),
            latestCrawl: completedCrawl(),
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
        const readiness = calculateAuditReadiness({
            website: baseWebsite({ crawlStatus: "complete" }),
            latestCrawl: completedCrawl(),
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
    });
});
