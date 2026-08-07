import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeAuditConfiguration } from "@/src/data/audit-jobs";
import { AUDIT_PIPELINE_STAGES } from "@/src/services/audit-pipeline/constants";
import {
    areStageDependenciesMet,
    getNextPipelineStage,
    getReadyPipelineStages,
    getStageDependencies,
    hasBlockingRequiredFailure,
} from "@/src/services/audit-pipeline/stage-plan";
import { summarizeEvidenceBlockers } from "@/src/services/audit-pipeline/evidence-barrier";

function pendingStages(): Record<string, { status: string }> {
    return Object.fromEntries(
        AUDIT_PIPELINE_STAGES.map((stage) => [stage, { status: "pending" }]),
    );
}

describe("audit orchestration dependency graph", () => {
    it("allows crawl and PageSpeed to become ready together after preflight", () => {
        const configuration = normalizeAuditConfiguration();
        const stages = pendingStages();
        stages.preflight = { status: "completed" };

        const ready = getReadyPipelineStages({ configuration, stages });
        assert.ok(ready.includes("crawl"));
        assert.ok(ready.includes("pagespeed_mobile"));
        assert.ok(ready.includes("pagespeed_desktop"));
        assert.ok(!ready.includes("niceguy"));
        assert.ok(!ready.includes("ai_analysis"));
    });

    it("does not start NiceGuy before crawl completes", () => {
        const configuration = normalizeAuditConfiguration();
        const stages = pendingStages();
        stages.preflight = { status: "completed" };
        stages.crawl = { status: "processing" };
        stages.pagespeed_mobile = { status: "processing" };

        const ready = getReadyPipelineStages({ configuration, stages });
        assert.ok(!ready.includes("niceguy"));
        assert.equal(
            areStageDependenciesMet({
                stage: "niceguy",
                configuration,
                stages,
            }),
            false,
        );
    });

    it("starts NiceGuy after crawl completes even while PageSpeed is still running", () => {
        const configuration = normalizeAuditConfiguration();
        const stages = pendingStages();
        stages.preflight = { status: "completed" };
        stages.crawl = { status: "completed" };
        stages.screenshots = { status: "completed" };
        stages.pagespeed_mobile = { status: "processing" };
        stages.pagespeed_desktop = { status: "processing" };

        const ready = getReadyPipelineStages({ configuration, stages });
        assert.ok(ready.includes("niceguy"));
        assert.ok(!ready.includes("ai_analysis"));
        assert.deepEqual(getStageDependencies("niceguy", configuration), ["crawl"]);
    });

    it("does not make Cursor ready until all evidence stages are terminal", () => {
        const configuration = normalizeAuditConfiguration();
        const stages = pendingStages();
        stages.preflight = { status: "completed" };
        stages.crawl = { status: "completed" };
        stages.screenshots = { status: "completed" };
        stages.pagespeed_mobile = { status: "completed" };
        stages.pagespeed_desktop = { status: "pending" };
        stages.niceguy = { status: "completed" };

        const ready = getReadyPipelineStages({ configuration, stages });
        assert.ok(!ready.includes("ai_analysis"));
        assert.ok(ready.includes("pagespeed_desktop"));
    });

    it("makes Cursor stage selectable only after all evidence stages are terminal", () => {
        const configuration = normalizeAuditConfiguration();
        const stages = pendingStages();
        for (const stage of [
            "preflight",
            "crawl",
            "screenshots",
            "pagespeed_mobile",
            "pagespeed_desktop",
            "niceguy",
        ] as const) {
            stages[stage] = { status: "completed" };
        }

        const ready = getReadyPipelineStages({ configuration, stages });
        assert.deepEqual(ready, ["ai_analysis"]);
    });

    it("blocks NiceGuy and later stages when crawl fails", () => {
        const configuration = normalizeAuditConfiguration();
        const stages = pendingStages();
        stages.preflight = { status: "completed" };
        stages.crawl = { status: "failed" };
        stages.pagespeed_mobile = { status: "completed" };
        stages.pagespeed_desktop = { status: "completed" };

        assert.equal(hasBlockingRequiredFailure({ configuration, stages }), "crawl");
        const ready = getReadyPipelineStages({ configuration, stages });
        assert.ok(!ready.includes("niceguy"));
        assert.ok(!ready.includes("ai_analysis"));
    });

    it("keeps getNextPipelineStage compatible as first ready stage", () => {
        const configuration = normalizeAuditConfiguration({
            includePageSpeed: false,
            generateReportDraft: false,
        });
        const stages = pendingStages();
        stages.preflight = { status: "completed" };
        assert.equal(getNextPipelineStage({ configuration, stages }), "crawl");
    });
});

describe("evidence barrier helpers", () => {
    it("summarizes blocker codes without leaking secrets", () => {
        const summary = summarizeEvidenceBlockers([
            { code: "PAGESPEED_MOBILE_MISSING", message: "PageSpeed mobile data is required." },
            { code: "NICEGUY_METRICS_MISSING", message: "Nice Guy Metrics v2 result is required." },
        ]);
        assert.equal(summary, "PAGESPEED_MOBILE_MISSING, NICEGUY_METRICS_MISSING");
        assert.equal(summary.includes("token"), false);
        assert.equal(summary.includes("secret"), false);
    });
});

describe("concurrent stage overlap semantics", () => {
    it("documents that crawl and pagespeed overlap is intentional", () => {
        const configuration = normalizeAuditConfiguration();
        assert.deepEqual(getStageDependencies("crawl", configuration), ["preflight"]);
        assert.deepEqual(getStageDependencies("pagespeed_mobile", configuration), ["preflight"]);
        assert.deepEqual(getStageDependencies("pagespeed_desktop", configuration), ["preflight"]);
        assert.deepEqual(getStageDependencies("niceguy", configuration), ["crawl"]);
        assert.ok(
            getStageDependencies("ai_analysis", configuration).includes("pagespeed_mobile"),
        );
        assert.ok(getStageDependencies("ai_analysis", configuration).includes("niceguy"));
    });
});
