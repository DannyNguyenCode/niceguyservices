import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    assignFailedAuditSeverity,
    assignOpportunityPriority,
    normalizeLighthouseScore,
} from "@/src/lib/pagespeed-rules";
import { parsePageSpeedResponse } from "@/src/services/pagespeed-parser";

describe("Phase 6 — Google PageSpeed Insights", () => {
    describe("score normalization", () => {
        it("converts decimal lighthouse scores to 0-100", () => {
            assert.equal(normalizeLighthouseScore(0.92), 92);
            assert.equal(normalizeLighthouseScore(1), 100);
        });

        it("returns null for missing scores", () => {
            assert.equal(normalizeLighthouseScore(null), null);
            assert.equal(normalizeLighthouseScore(undefined), null);
        });
    });

    describe("priority and severity rules", () => {
        it("assigns opportunity priority from savings thresholds", () => {
            assert.equal(
                assignOpportunityPriority({ estimatedSavingsMs: 1200, score: 0.8 }),
                "high",
            );
            assert.equal(
                assignOpportunityPriority({ estimatedSavingsMs: 400, score: 0.8 }),
                "medium",
            );
            assert.equal(assignOpportunityPriority({ score: 0.95 }), "low");
        });

        it("maps failed audit scores to severity levels", () => {
            assert.equal(
                assignFailedAuditSeverity({ score: 0, category: "performance" }),
                "critical",
            );
            assert.equal(
                assignFailedAuditSeverity({ score: 0.4, category: "performance" }),
                "high",
            );
        });
    });

    describe("response parsing edge cases", () => {
        it("handles missing categories without throwing", () => {
            const parsed = parsePageSpeedResponse(
                {
                    id: "https://example.com/",
                    lighthouseResult: {
                        categories: {
                            performance: { score: 0.5 },
                        },
                        audits: {},
                    },
                },
                "mobile",
            );
            assert.equal(parsed.scores.performance, 50);
            assert.equal(parsed.scores.accessibility, null);
        });

        it("throws on invalid response payloads", () => {
            assert.throws(() => parsePageSpeedResponse({ id: "https://example.com/" }, "desktop"));
        });

        it("preserves zero scores", () => {
            const parsed = parsePageSpeedResponse(
                {
                    lighthouseResult: {
                        categories: {
                            performance: { score: 0 },
                        },
                        audits: {},
                    },
                },
                "desktop",
            );
            assert.equal(parsed.scores.performance, 0);
        });
    });
});
