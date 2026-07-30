import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ACTIVITY_EVENTS } from "@/src/constants/activity-events";
import {
    sanitizeActivityMetadata,
    sanitizePlainText,
} from "@/src/services/activity/sanitize-activity-metadata";
import { getActivitySummary } from "@/src/services/activity/get-activity-summary";
import { normalizeActivityDocument } from "@/src/services/activity/types";

describe("Phase 14 — Activity timeline", () => {
    describe("metadata sanitization", () => {
        it("removes secrets from activity metadata", () => {
            const sanitized = sanitizeActivityMetadata({
                pageCount: 3,
                apiKey: "secret-key",
                previewToken: "raw-token",
                password: "hidden",
            });
            assert.equal(sanitized?.pageCount, 3);
            assert.equal(sanitized?.apiKey, undefined);
            assert.equal(sanitized?.previewToken, undefined);
            assert.equal(sanitized?.password, undefined);
        });

        it("handles circular references safely", () => {
            const value: Record<string, unknown> = { ok: true };
            value.self = value;
            const sanitized = sanitizeActivityMetadata(value);
            assert.equal((sanitized as { ok?: boolean }).ok, true);
            assert.equal((sanitized as { self?: unknown }).self, "[circular]");
        });

        it("sanitizes plain text notes", () => {
            const text = sanitizePlainText("<b>Hello</b>   world", 50);
            assert.equal(text, "Hello world");
        });
    });

    describe("activity normalization", () => {
        it("normalizes legacy string actor values", () => {
            const item = normalizeActivityDocument({
                _id: "507f1f77bcf86cd799439011",
                websiteId: "507f1f77bcf86cd799439012",
                type: ACTIVITY_EVENTS.WEBSITE_CREATED,
                title: "Website created",
                severity: "success",
                createdAt: new Date("2026-07-28T00:00:00.000Z"),
                occurredAt: new Date("2026-07-28T00:00:00.000Z"),
            });
            assert.equal(item.eventType, ACTIVITY_EVENTS.WEBSITE_CREATED);
        });
    });

    describe("activity summaries", () => {
        it("counts errors and warnings", () => {
            const summary = getActivitySummary([
                normalizeActivityDocument({
                    _id: "1",
                    websiteId: "w1",
                    type: "crawl-failed",
                    title: "Crawl failed",
                    severity: "error",
                    createdAt: new Date(),
                    occurredAt: new Date(),
                }),
                normalizeActivityDocument({
                    _id: "2",
                    websiteId: "w1",
                    type: "pagespeed-partial",
                    title: "PageSpeed partial",
                    severity: "warning",
                    createdAt: new Date(),
                    occurredAt: new Date(),
                }),
            ]);
            assert.equal(summary.errorCount, 1);
            assert.equal(summary.warningCount, 1);
        });
    });
});
