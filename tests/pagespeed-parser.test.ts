import test from "node:test";
import assert from "node:assert/strict";
import {
    assignFailedAuditSeverity,
    assignOpportunityPriority,
    normalizeLighthouseScore,
} from "@/src/lib/pagespeed-rules";
import { parsePageSpeedResponse } from "@/src/services/pagespeed-parser";

test("normalizeLighthouseScore converts decimals to 0-100", () => {
    assert.equal(normalizeLighthouseScore(0.92), 92);
    assert.equal(normalizeLighthouseScore(0), 0);
    assert.equal(normalizeLighthouseScore(null), null);
    assert.equal(normalizeLighthouseScore(undefined), null);
});

test("assignOpportunityPriority follows savings thresholds", () => {
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

test("assignFailedAuditSeverity maps low scores to higher severity", () => {
    assert.equal(
        assignFailedAuditSeverity({ score: 0, category: "performance" }),
        "critical",
    );
    assert.equal(
        assignFailedAuditSeverity({ score: 0.4, category: "performance" }),
        "high",
    );
});

test("parsePageSpeedResponse handles missing categories gracefully", () => {
    const parsed = parsePageSpeedResponse(
        {
            id: "https://example.com/",
            lighthouseResult: {
                categories: {
                    performance: { score: 0.5 },
                },
                audits: {
                    "first-contentful-paint": {
                        id: "first-contentful-paint",
                        title: "First Contentful Paint",
                        score: 0.8,
                        scoreDisplayMode: "numeric",
                        numericValue: 1200,
                        displayValue: "1.2 s",
                    },
                },
            },
        },
        "mobile",
    );

    assert.equal(parsed.scores.performance, 50);
    assert.equal(parsed.scores.accessibility, null);
    assert.equal(parsed.labMetrics.firstContentfulPaint?.valueMs, 1200);
    assert.equal(parsed.fieldData.available, false);
    assert.equal(parsed.coreWebVitals.assessment, "unavailable");
});

test("parsePageSpeedResponse preserves zero scores", () => {
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
