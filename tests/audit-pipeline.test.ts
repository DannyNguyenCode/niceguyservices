import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    buildAuditJobIdempotencyKey,
    hashAuditConfiguration,
    normalizeAuditConfiguration,
} from "@/src/data/audit-jobs";
import {
    computePipelineProgress,
    getNextPipelineStage,
    markSkippedStages,
    resolveEnabledPipelineStages,
} from "@/src/services/audit-pipeline/stage-plan";
import {
    assertJobTransition,
    assertStageTransition,
    deriveJobStatusFromStages,
} from "@/src/services/audit-pipeline/state";
import { AUDIT_PIPELINE_STAGES } from "@/src/services/audit-pipeline/constants";

describe("audit pipeline configuration", () => {
    it("normalizes defaults", () => {
        const config = normalizeAuditConfiguration();
        assert.equal(config.includeScreenshots, true);
        assert.equal(config.generateReportDraft, true);
    });

    it("builds stable idempotency keys", () => {
        const config = normalizeAuditConfiguration({ includePageSpeed: false });
        const key = buildAuditJobIdempotencyKey({ websiteId: "abc", configuration: config });
        assert.match(key, /^audit-pipeline:abc:/);
        assert.equal(
            hashAuditConfiguration(config),
            hashAuditConfiguration(normalizeAuditConfiguration({ includePageSpeed: false })),
        );
    });
});

describe("audit pipeline stage plan", () => {
    it("skips disabled stages", () => {
        const config = normalizeAuditConfiguration({
            includeScreenshots: false,
            includePageSpeed: false,
            includeAiAnalysis: false,
            generateReportDraft: false,
        });
        const enabled = resolveEnabledPipelineStages(config);
        assert.ok(!enabled.includes("screenshots"));
        assert.ok(!enabled.includes("pagespeed_mobile"));
        assert.ok(!enabled.includes("ai_analysis"));
        assert.ok(!enabled.includes("report_draft"));
        assert.deepEqual(
            markSkippedStages(config),
            AUDIT_PIPELINE_STAGES.filter((stage) => !enabled.includes(stage)),
        );
    });

    it("finds the next incomplete stage", () => {
        const config = normalizeAuditConfiguration({ includePageSpeed: false, generateReportDraft: false });
        const stages = Object.fromEntries(
            AUDIT_PIPELINE_STAGES.map((stage) => [stage, { status: "pending" }]),
        ) as Record<string, { status: string }>;
        stages.preflight = { status: "completed" };
        assert.equal(getNextPipelineStage({ configuration: config, stages }), "crawl");
    });

    it("skips failed optional stages when finding the next stage", () => {
        const config = normalizeAuditConfiguration();
        const stages = Object.fromEntries(
            AUDIT_PIPELINE_STAGES.map((stage) => [stage, { status: "completed" }]),
        ) as Record<string, { status: string }>;
        stages.screenshots = { status: "failed" };
        stages.pagespeed_mobile = { status: "pending" };
        assert.equal(getNextPipelineStage({ configuration: config, stages }), "pagespeed_mobile");
    });

    it("computes progress from completed stages", () => {
        const config = normalizeAuditConfiguration({ generateReportDraft: false });
        const enabled = resolveEnabledPipelineStages(config);
        const stages = Object.fromEntries(
            AUDIT_PIPELINE_STAGES.map((stage) => [
                stage,
                { status: enabled.includes(stage) ? "completed" : "skipped" },
            ]),
        ) as Record<string, { status: string }>;
        assert.equal(computePipelineProgress(config, stages), 100);
    });
});

describe("audit pipeline state machine", () => {
    it("validates stage transitions", () => {
        assert.doesNotThrow(() => assertStageTransition("pending", "queued"));
        assert.throws(() => assertStageTransition("completed", "processing"));
    });

    it("validates job transitions", () => {
        assert.doesNotThrow(() => assertJobTransition("queued", "processing"));
        assert.throws(() => assertJobTransition("completed", "processing"));
    });

    it("derives completed_with_warnings", () => {
        const status = deriveJobStatusFromStages([
            { required: true, status: "completed" },
            { required: false, status: "completed_with_warnings" },
        ]);
        assert.equal(status, "completed_with_warnings");
    });

    it("supports waiting_for_external without premature completion", () => {
        assert.doesNotThrow(() => assertStageTransition("processing", "waiting_for_external"));
        assert.doesNotThrow(() => assertStageTransition("waiting_for_external", "completed"));
        assert.doesNotThrow(() => assertJobTransition("processing", "waiting_for_external"));
        assert.doesNotThrow(() => assertJobTransition("waiting_for_external", "processing"));
        const status = deriveJobStatusFromStages([
            { required: true, status: "completed" },
            { required: false, status: "waiting_for_external" },
        ]);
        assert.equal(status, "waiting_for_external");
    });
});
