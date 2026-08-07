import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { compareAuditRuns } from "@/src/services/audit-history/compare-audit-runs";
import type { SerializableAuditRun } from "@/src/services/audit-history/types";

function buildRun(overrides: Partial<SerializableAuditRun>): SerializableAuditRun {
    return {
        id: overrides.id ?? "1",
        websiteId: overrides.websiteId ?? "site",
        auditNumber: overrides.auditNumber ?? 1,
        status: overrides.status ?? "complete",
        isCurrent: false,
        isArchived: false,
        trigger: { type: "administrator", actorId: null, actorName: null },
        source: {
            websiteUrl: "https://example.com",
            normalizedUrl: "example.com",
            businessName: "Example",
            domain: "example.com",
        },
        configuration: {
            crawlMaxPages: 10,
            crawlMaxDepth: null,
            includeScreenshots: true,
            includePageSpeed: true,
            includeNiceGuyMetrics: true,
            includeAiAnalysis: true,
            generateReportDraft: true,
            pageSpeedStrategies: ["mobile", "desktop"],
            configurationVersion: "audit-config-v1",
        },
        versions: {
            auditSchemaVersion: "audit-run-v1",
            crawlerVersion: "v1",
            screenshotVersion: "v1",
            pageSpeedVersion: "v1",
            metricsVersion: "niceguy-v1",
            aiPromptVersion: "audit-analysis-v1",
            aiSchemaVersion: "hero-v1",
        },
        references: {
            crawlDataIds: [],
            screenshotIds: [],
            googleMetricsIds: [],
            niceGuyMetricsId: null,
            aiSummaryId: null,
            heroSuggestionIds: [],
            aiMetadataIds: [],
            publicReportIds: [],
            pdfReportIds: [],
            outreachDraftIds: [],
            demoProjectIds: [],
        },
        summary: {
            pagesDiscovered: null,
            pagesCrawled: null,
            screenshotsCaptured: null,
            overallScore: null,
            categoryScores: [],
            pageSpeed: { mobile: null, desktop: null },
            strengthCount: null,
            weaknessCount: null,
            recommendationCount: null,
            warningCount: 0,
            errorCount: 0,
            ...overrides.summary,
        },
        completion: {
            crawl: "complete",
            screenshots: "complete",
            pageSpeed: "complete",
            metrics: "complete",
            ai: "complete",
            ...overrides.completion,
        },
        failure: null,
        startedAt: null,
        completedAt: null,
        archivedAt: null,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        ...overrides,
    };
}

describe("compareAuditRuns", () => {
    it("calculates overall score difference", () => {
        const from = buildRun({
            id: "a",
            auditNumber: 1,
            summary: { overallScore: 60, categoryScores: [], pageSpeed: { mobile: null, desktop: null }, warningCount: 0, errorCount: 0 },
        });
        const to = buildRun({
            id: "b",
            auditNumber: 2,
            summary: { overallScore: 72, categoryScores: [], pageSpeed: { mobile: null, desktop: null }, warningCount: 0, errorCount: 0 },
        });
        const result = compareAuditRuns(from, to);
        assert.equal(result.changes.overallScore?.difference, 12);
    });

    it("does not convert missing values to zero", () => {
        const from = buildRun({
            id: "a",
            auditNumber: 1,
            summary: {
                overallScore: null,
                categoryScores: [],
                pageSpeed: { mobile: null, desktop: null },
                warningCount: 0,
                errorCount: 0,
            },
        });
        const to = buildRun({
            id: "b",
            auditNumber: 2,
            summary: {
                overallScore: 72,
                categoryScores: [],
                pageSpeed: { mobile: { performance: 72 }, desktop: null },
                warningCount: 0,
                errorCount: 0,
            },
        });
        const result = compareAuditRuns(from, to);
        assert.equal(result.changes.overallScore, undefined);
        assert.equal(result.changes.pageSpeed.mobile.performance?.difference, undefined);
    });

    it("warns when metrics versions differ", () => {
        const from = buildRun({
            id: "a",
            auditNumber: 1,
            versions: {
                auditSchemaVersion: "audit-run-v1",
                crawlerVersion: null,
                screenshotVersion: null,
                pageSpeedVersion: null,
                metricsVersion: "niceguy-v1",
                aiPromptVersion: null,
                aiSchemaVersion: null,
            },
        });
        const to = buildRun({
            id: "b",
            auditNumber: 2,
            versions: {
                auditSchemaVersion: "audit-run-v1",
                crawlerVersion: null,
                screenshotVersion: null,
                pageSpeedVersion: null,
                metricsVersion: "niceguy-v2",
                aiPromptVersion: null,
                aiSchemaVersion: null,
            },
        });
        const result = compareAuditRuns(from, to);
        assert.equal(result.compatibility.metricsVersionMatch, false);
        assert.ok(result.compatibility.warnings.length > 0);
    });
});
