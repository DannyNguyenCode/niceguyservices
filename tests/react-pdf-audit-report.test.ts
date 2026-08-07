import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import { readFileSync } from "node:fs";
import { createElement, type ReactElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import {
    homepageChangesSchema,
    cursorAuditResultSchema,
    validateCursorAuditResult,
} from "@/src/services/cursor-analysis/schemas";
import { mapCursorResultToAiSummaryOutput } from "@/src/services/cursor-analysis/materialize-ai-summary-from-cursor";
import { buildAuditPdfViewModel } from "@/src/services/pdf-reports/build-pdf-view-model";
import { PDF_RENDER_ENGINE } from "@/src/services/pdf-reports/constants";
import { PdfStageError } from "@/src/services/pdf-reports/pdf-stage-error";
import type { SerializablePublicReport } from "@/src/types/public-report";
import { AuditReportDocument } from "@/components/audit-report-pdf/AuditReportDocument";

const exampleResult = JSON.parse(
    readFileSync("audit-agent/examples/example-result.json", "utf8"),
);

function sampleHomepageChanges() {
    return {
        summary:
            "Clarify the offer and strengthen the primary CTA so visitors know what to do next.",
        priorityChanges: [
            {
                title: "Clarify the hero headline with the service and service area",
                priority: "high" as const,
                category: "messaging",
                problem: "The hero does not state the service clearly.",
                recommendation:
                    "Rewrite the hero headline so visitors immediately understand what service the company provides and where it operates.",
                expectedImpact: "Visitors can decide relevance faster.",
                evidence: ["screenshot-desktop", "crawl-headings"],
            },
        ],
    };
}

function sampleReport(
    overrides: Partial<SerializablePublicReport> = {},
): SerializablePublicReport {
    return {
        id: "507f1f77bcf86cd799439020",
        websiteId: "507f1f77bcf86cd799439011",
        crawlId: "507f1f77bcf86cd799439012",
        niceGuyMetricId: "507f1f77bcf86cd799439013",
        aiSummaryId: "507f1f77bcf86cd799439014",
        auditRunId: null,
        sourceAuditRunId: null,
        sourceAuditNumber: null,
        heroSuggestionIds: [],
        status: "draft",
        reportVersion: "public-report-v1",
        revisionNumber: 1,
        tokenHash: "hash",
        tokenPrefix: "abcd1234",
        publicPath: null,
        title: "Website Audit for Acme Plumbing",
        subtitle: "August 2026 review",
        settings: {
            showOverallScore: true,
            showScoreConfidence: true,
            showCategoryScores: true,
            showPageSpeed: true,
            showScreenshots: true,
            showStrengths: true,
            showWeaknesses: true,
            showQuickWins: true,
            showLongTermRecommendations: true,
            showPriorityPlan: true,
            showHeroSuggestions: false,
            showTechnicalDetails: true,
            showNiceGuyBranding: true,
            showContactCta: true,
        },
        branding: {
            businessName: "Acme Plumbing",
            websiteUrl: "https://acmeplumbing.example",
            normalizedDomain: "acmeplumbing.example",
            industry: "Plumbing",
            location: "Toronto, ON",
            reportPreparedBy: "Nice Guy Web Design",
            reportPreparedByUrl: "https://niceguyweb.design",
            logoUrl: null,
            accentStyle: null,
        },
        sourceSnapshot: {
            crawl: {
                id: "507f1f77bcf86cd799439012",
                status: "complete",
                completedAt: "2026-08-01T00:00:00.000Z",
                pageCount: 3,
                successfulPageCount: 3,
                failedPageCount: 0,
                version: null,
            },
            pageSpeed: {
                mobileAvailable: true,
                desktopAvailable: true,
                mobile: {
                    performance: 62,
                    accessibility: 88,
                    bestPractices: 90,
                    seo: 85,
                    lcp: 3200,
                    cls: 0.12,
                    tbt: 400,
                    fcp: 1800,
                    speedIndex: 3500,
                    fetchTime: "2026-08-01T00:00:00.000Z",
                    lighthouseVersion: "12.0.0",
                },
                desktop: {
                    performance: 78,
                    accessibility: 90,
                    bestPractices: 92,
                    seo: 88,
                    lcp: 2100,
                    cls: 0.05,
                    tbt: 120,
                    fcp: 1100,
                    speedIndex: 2200,
                    fetchTime: "2026-08-01T00:00:00.000Z",
                    lighthouseVersion: "12.0.0",
                },
            },
            niceGuy: {
                id: "507f1f77bcf86cd799439013",
                scoringVersion: "niceguy-v2",
                overallScore: 71,
                overallConfidence: 80,
                scoreLabel: "Good foundation",
                strongestCategory: null,
                weakestCategory: null,
                categories: [
                    {
                        id: "businessClarity",
                        name: "Business Clarity",
                        score: 70,
                        confidence: 80,
                        scoreLabel: "Good",
                        passedChecks: 4,
                        partialChecks: 1,
                        failedChecks: 1,
                        unavailableChecks: 0,
                    },
                ],
                deterministicRecommendations: [
                    {
                        checkId: "rec-0",
                        categoryId: "conversionReadiness",
                        categoryName: "Conversion Readiness",
                        priority: "high",
                        title: "Strengthen the primary CTA",
                        description: "Make the homepage CTA more specific.",
                    },
                ],
            },
            ai: {
                id: "507f1f77bcf86cd799439014",
                analysisVersion: "cursor-analysis-v1.1",
                promptVersion: "1.1",
                executiveSummary: "The website presents a clear local service offer with room to improve conversion clarity.",
                businessImpactSummary: "Improving homepage messaging should help visitors take action.",
                strengths: [
                    {
                        title: "Clear contact path",
                        description: "Contact details are easy to find.",
                        category: "trust",
                        evidenceLabels: ["crawl"],
                    },
                ],
                weaknesses: [
                    {
                        title: "SEO title could be clearer",
                        description: "Homepage title is generic.",
                        category: "seo",
                        priority: "medium",
                        evidenceLabels: ["crawl"],
                    },
                    {
                        title: "Contrast issues on buttons",
                        description: "Primary button contrast may be low.",
                        category: "accessibility",
                        priority: "medium",
                        evidenceLabels: ["screenshot"],
                    },
                ],
                quickWins: [],
                longTermRecommendations: [],
                priorityOrder: [
                    {
                        rank: 1,
                        title: "Clarify homepage offer",
                        reason: "Visitors need to understand the service immediately.",
                        priority: "high",
                        evidenceLabels: ["screenshot"],
                    },
                ],
                homepageChanges: sampleHomepageChanges(),
                disclaimers: ["Visual interpretation is subjective."],
            },
            screenshots: [
                {
                    screenshotId: "shot-desktop",
                    pageType: "home",
                    pageUrl: "https://acmeplumbing.example/",
                    viewport: "Desktop",
                    width: 1440,
                    height: 900,
                    secureUrl: "https://res.cloudinary.com/demo/desktop.png",
                    thumbnailUrl: null,
                    altText: "Desktop homepage",
                    capturedAt: "2026-08-01T00:00:00.000Z",
                },
                {
                    screenshotId: "shot-mobile",
                    pageType: "home",
                    pageUrl: "https://acmeplumbing.example/",
                    viewport: "Mobile",
                    width: 390,
                    height: 844,
                    secureUrl: "https://res.cloudinary.com/demo/mobile.png",
                    thumbnailUrl: null,
                    altText: "Mobile homepage",
                    capturedAt: "2026-08-01T00:00:00.000Z",
                },
            ],
            heroSuggestions: [],
        },
        publishedAt: null,
        unpublishedAt: null,
        archivedAt: null,
        expiresAt: null,
        viewCount: 0,
        uniqueViewEstimate: 0,
        lastViewedAt: null,
        createdBy: null,
        createdAt: "2026-08-01T00:00:00.000Z",
        updatedAt: "2026-08-01T00:00:00.000Z",
        ...overrides,
    };
}

describe("homepageChanges validation", () => {
    it("accepts a valid homepageChanges object", () => {
        const parsed = homepageChangesSchema.safeParse(sampleHomepageChanges());
        assert.equal(parsed.success, true);
    });

    it("rejects more than 8 priority changes", () => {
        const oversized = {
            summary: "Too many items",
            priorityChanges: Array.from({ length: 9 }, () => sampleHomepageChanges().priorityChanges[0]),
        };
        assert.equal(homepageChangesSchema.safeParse(oversized).success, false);
    });

    it("accepts Cursor results that include homepageChanges", () => {
        assert.doesNotThrow(() => validateCursorAuditResult(exampleResult));
        assert.ok(exampleResult.homepageChanges);
        assert.ok(exampleResult.homepageChanges.priorityChanges.length >= 1);
    });

    it("accepts Cursor results without homepageChanges for backward compatibility", () => {
        const legacy = { ...exampleResult };
        delete legacy.homepageChanges;
        assert.equal(cursorAuditResultSchema.safeParse(legacy).success, true);
    });
});

describe("homepageChanges materialization mapping", () => {
    it("maps core Cursor fields without requiring homepageChanges", () => {
        const legacy = { ...exampleResult };
        delete legacy.homepageChanges;
        const mapped = mapCursorResultToAiSummaryOutput(legacy);
        assert.ok(mapped.executiveSummary.length > 0);
        assert.ok(mapped.priorityOrder.length >= 3);
    });
});

describe("PDF view-model construction", () => {
    it("builds a view model from a complete report including homepageChanges", async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = mock.fn(async () => {
            throw new Error("network unavailable");
        }) as typeof fetch;

        try {
            const model = await buildAuditPdfViewModel({
                report: sampleReport(),
                attemptId: "testattempt",
            });
            assert.equal(model.businessName, "Acme Plumbing");
            assert.equal(model.overallScore, 71);
            assert.ok(model.homepageChanges);
            assert.equal(model.homepageChanges?.priorityChanges.length, 1);
            assert.equal(model.desktopScreenshot, null);
            assert.equal(model.mobileScreenshot, null);
            assert.ok(model.pageSpeed.mobile.metrics.length > 0);
            assert.ok(model.seoFindings.length >= 1);
            assert.ok(model.accessibilityFindings.length >= 1);
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    it("supports reports without homepageChanges", async () => {
        const report = sampleReport();
        report.sourceSnapshot.ai.homepageChanges = null;
        const originalFetch = globalThis.fetch;
        globalThis.fetch = mock.fn(async () => {
            throw new Error("network unavailable");
        }) as typeof fetch;

        try {
            const model = await buildAuditPdfViewModel({
                report,
                attemptId: "testattempt2",
            });
            assert.equal(model.homepageChanges, null);
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    it("degrades when desktop or mobile screenshots are missing", async () => {
        const report = sampleReport();
        report.sourceSnapshot.screenshots = [
            report.sourceSnapshot.screenshots[1]!, // mobile only
        ];
        const originalFetch = globalThis.fetch;
        globalThis.fetch = mock.fn(async () => {
            throw new Error("network unavailable");
        }) as typeof fetch;

        try {
            const model = await buildAuditPdfViewModel({
                report,
                attemptId: "testattempt3",
            });
            assert.equal(model.desktopScreenshot, null);
            assert.equal(model.mobileScreenshot, null);
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    it("omits unavailable optional metrics", async () => {
        const report = sampleReport();
        report.sourceSnapshot.pageSpeed.mobile = {
            performance: 50,
            accessibility: null,
            bestPractices: null,
            seo: null,
            lcp: null,
            cls: null,
            tbt: null,
            fetchTime: null,
            lighthouseVersion: null,
        };
        const originalFetch = globalThis.fetch;
        globalThis.fetch = mock.fn(async () => {
            throw new Error("network unavailable");
        }) as typeof fetch;

        try {
            const model = await buildAuditPdfViewModel({
                report,
                attemptId: "testattempt4",
            });
            assert.deepEqual(
                model.pageSpeed.mobile.metrics.map((row) => row.label),
                ["Performance"],
            );
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    it("throws PDF_DATA_INVALID when executive summary is missing", async () => {
        const report = sampleReport();
        report.sourceSnapshot.ai.executiveSummary = "";
        await assert.rejects(
            () =>
                buildAuditPdfViewModel({
                    report,
                    attemptId: "testattempt5",
                }),
            (error: unknown) =>
                error instanceof PdfStageError && error.code === "PDF_DATA_INVALID",
        );
    });
});

describe("React PDF render path", () => {
    it("renders AuditReportDocument to a real PDF buffer via renderToBuffer", async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = mock.fn(async () => {
            throw new Error("network unavailable");
        }) as typeof fetch;

        try {
            const model = await buildAuditPdfViewModel({
                report: sampleReport(),
                attemptId: "reactpdf1",
            });
            const document = createElement(AuditReportDocument, {
                model,
            }) as ReactElement<DocumentProps>;
            const rendered = await renderToBuffer(document);
            const buffer = Buffer.isBuffer(rendered) ? rendered : Buffer.from(rendered);

            assert.equal(PDF_RENDER_ENGINE, "react-pdf");
            assert.ok(Buffer.isBuffer(buffer));
            assert.equal(buffer.subarray(0, 5).toString(), "%PDF-");
            assert.ok(buffer.length > 0);
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    it("does not import Playwright or Chromium launch helpers in PDF renderer", async () => {
        const source = readFileSync("src/services/pdf-reports/render-report-pdf.ts", "utf8");
        assert.equal(source.includes("launchChromium"), false);
        assert.equal(source.includes("playwright"), false);
        assert.equal(source.includes("@sparticuz/chromium"), false);
        assert.equal(source.includes("page.pdf"), false);
        assert.equal(source.includes("renderToBuffer"), true);
        assert.equal(source.includes("@react-pdf/renderer"), true);
    });

    it("crawler still references Playwright Chromium launcher", () => {
        const crawler = readFileSync("src/services/website-crawler.ts", "utf8");
        const screenshots = readFileSync("src/services/screenshot-capture.ts", "utf8");
        assert.equal(crawler.includes("launchChromium"), true);
        assert.equal(screenshots.includes("launchChromium"), true);
    });
});
