import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateAuditReadiness } from "@/src/services/audit-readiness";

describe("audit readiness visual analysis metadata", () => {
    it("warns when visuallyAnalyzed is false and omits warning when true", () => {
        const baseInput = {
            website: {
                id: "web1",
                businessName: "Example",
                originalUrl: "https://example.com",
                industry: null,
                location: null,
                crawlStatus: "complete",
                pageSpeedStatus: "complete",
                niceGuyStatus: "complete",
                aiAnalysisStatus: "complete",
                deletedAt: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            latestCrawl: {
                id: "crawl1",
                websiteId: "web1",
                status: "complete",
                pageResults: [
                    {
                        pageType: "home",
                        url: "https://example.com",
                        path: "/",
                        headings: [],
                        buttons: [],
                        forms: [],
                        images: [],
                        statusCode: 200,
                    },
                ],
            },
            screenshots: [],
            pageSpeed: {
                mobile: { status: "complete", crawlId: "crawl1" },
                desktop: null,
            },
            niceGuy: {
                status: "complete",
                crawlId: "crawl1",
                id: "ng1",
                categories: {
                    businessClarity: { confidence: 80 },
                    trustCredibility: { confidence: 80 },
                    conversionReadiness: { confidence: 80 },
                    userExperience: { confidence: 80 },
                    brandingConsistency: { confidence: 80 },
                    contentQuality: { confidence: 80 },
                    technicalFoundation: { confidence: 80 },
                },
            },
            heroSuggestionsComplete: true,
            hasActiveCrawl: false,
            hasActivePageSpeed: false,
            hasActiveNiceGuy: false,
            hasActiveAiAnalysis: false,
            aiSummary: null,
        } as unknown as Parameters<typeof calculateAuditReadiness>[0];

        const withoutVision = calculateAuditReadiness({
            ...baseInput,
            aiSummary: {
                status: "complete",
                crawlId: "crawl1",
                niceGuyMetricId: "ng1",
                visuallyAnalyzed: false,
            } as Parameters<typeof calculateAuditReadiness>[0]["aiSummary"],
        });
        assert.ok(
            withoutVision.warnings.some((warning) =>
                warning.includes("without visual screenshot analysis"),
            ),
        );

        const withVision = calculateAuditReadiness({
            ...baseInput,
            aiSummary: {
                status: "complete",
                crawlId: "crawl1",
                niceGuyMetricId: "ng1",
                visuallyAnalyzed: true,
            } as Parameters<typeof calculateAuditReadiness>[0]["aiSummary"],
        });
        assert.equal(
            withVision.warnings.some((warning) =>
                warning.includes("without visual screenshot analysis"),
            ),
            false,
        );
    });
});
