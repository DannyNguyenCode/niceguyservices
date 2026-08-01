import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    AUDIT_NAV_SECTIONS,
    AUDIT_SECTIONS,
    getAuditSectionById,
    isValidAuditSectionId,
} from "../src/lib/audit-sections";

const REQUIRED_DOM_SECTION_IDS = [
    "audit-summary",
    "overview",
    "crawl",
    "screenshots",
    "pagespeed",
    "metrics",
    "ai",
    "audit-outputs",
    "audit-runs",
    "activity",
    "stage-execution-log",
    "audit-administration",
];

describe("audit section configuration", () => {
    it("defines unique section IDs", () => {
        const ids = Object.values(AUDIT_SECTIONS).map((section) => section.id);
        assert.equal(new Set(ids).size, ids.length);
    });

    it("defines unique heading IDs", () => {
        const headingIds = Object.values(AUDIT_SECTIONS).map((section) => section.headingId);
        assert.equal(new Set(headingIds).size, headingIds.length);
    });

    it("exposes navigation entries for every primary destination", () => {
        for (const section of AUDIT_NAV_SECTIONS) {
            assert.ok(isValidAuditSectionId(section.id), `Unknown nav section: ${section.id}`);
            assert.equal(getAuditSectionById(section.id)?.id, section.id);
        }
    });

    it("maps legacy mismatched targets to existing sections", () => {
        assert.equal(getAuditSectionById("metrics")?.label, "Nice Guy");
        assert.equal(getAuditSectionById("ai")?.label, "AI analysis");
        assert.equal(getAuditSectionById("stage-execution-log")?.label, "Stage execution log");
        assert.equal(getAuditSectionById("niceguy"), undefined);
        assert.equal(getAuditSectionById("ai-analysis"), undefined);
    });

    it("includes required dashboard DOM targets", () => {
        for (const sectionId of REQUIRED_DOM_SECTION_IDS) {
            assert.ok(isValidAuditSectionId(sectionId), `Missing section config for #${sectionId}`);
        }
    });
});
