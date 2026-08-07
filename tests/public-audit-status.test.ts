import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeAuditConfiguration } from "@/src/data/audit-jobs";
import { AUDIT_PIPELINE_STAGES } from "@/src/services/audit-pipeline/constants";
import type {
    AuditPipelineStageName,
    AuditStageStatus,
    SerializableAuditJob,
} from "@/src/services/audit-pipeline/types";
import { mapAuditJobToPublicProgress } from "@/src/services/public-audit-status/map-public-audit-progress";
import {
    generatePublicAuditStatusToken,
    hashPublicAuditStatusToken,
    isValidPublicAuditStatusTokenFormat,
} from "@/src/services/public-audit-status/hash-status-token";

function jobStub(input?: {
    status?: SerializableAuditJob["status"];
    stages?: Partial<Record<AuditPipelineStageName, AuditStageStatus>>;
}): SerializableAuditJob {
    const stages = Object.fromEntries(
        AUDIT_PIPELINE_STAGES.map((stage) => [
            stage,
            {
                status: input?.stages?.[stage] ?? "pending",
                attempt: 0,
                startedAt: null,
                heartbeatAt: null,
                completedAt: null,
                errorCode: null,
                errorMessage: null,
            },
        ]),
    ) as SerializableAuditJob["stages"];

    return {
        id: "507f1f77bcf86cd799439013",
        websiteId: "507f1f77bcf86cd799439011",
        auditRunId: "507f1f77bcf86cd799439012",
        idempotencyKey: "audit-pipeline:test",
        status: input?.status ?? "queued",
        currentStage: null,
        progressPercent: 0,
        attempt: 1,
        maxAttempts: 3,
        queuedAt: "2026-08-06T00:00:00.000Z",
        startedAt: null,
        heartbeatAt: null,
        completedAt: null,
        failedAt: null,
        cancelledAt: null,
        error: null,
        configuration: normalizeAuditConfiguration(),
        packageVersion: "audit-job-v1",
        stages,
        reportDraftId: null,
        createdAt: "2026-08-06T00:00:00.000Z",
        updatedAt: "2026-08-06T00:00:00.000Z",
    };
}

describe("public audit status token crypto", () => {
    it("creates an unguessable hashed token", () => {
        const first = generatePublicAuditStatusToken();
        const second = generatePublicAuditStatusToken();
        assert.notEqual(first.rawToken, second.rawToken);
        assert.equal(hashPublicAuditStatusToken(first.rawToken), first.tokenHash);
        assert.equal(isValidPublicAuditStatusTokenFormat(first.rawToken), true);
        assert.equal(isValidPublicAuditStatusTokenFormat("short"), false);
        assert.equal(isValidPublicAuditStatusTokenFormat("a".repeat(40) + "!"), false);
    });
});

describe("mapAuditJobToPublicProgress", () => {
    it("maps queued jobs to request complete + crawl processing", () => {
        const view = mapAuditJobToPublicProgress({
            job: jobStub({ status: "queued" }),
            normalizedDomain: "example.com",
        });
        assert.equal(view.domain, "example.com");
        assert.equal(view.reportAvailable, false);
        assert.equal(
            view.stages.find((stage) => stage.id === "request")?.state,
            "complete",
        );
        assert.equal(
            view.stages.find((stage) => stage.id === "crawl")?.state,
            "processing",
        );
        assert.equal(view.currentStage, "crawl");
        assert.match(view.message, /crawl|started|progress/i);
        assert.equal(/507f1f77|mongo|cursor|email@/i.test(JSON.stringify(view)), false);
    });

    it("maps crawl running correctly", () => {
        const view = mapAuditJobToPublicProgress({
            job: jobStub({
                status: "processing",
                stages: {
                    preflight: "completed",
                    crawl: "processing",
                },
            }),
            normalizedDomain: "example.com",
        });
        assert.equal(view.status, "processing");
        assert.equal(view.stages.find((s) => s.id === "crawl")?.state, "processing");
        assert.equal(view.stages.find((s) => s.id === "performance")?.state, "pending");
    });

    it("maps crawl complete and performance running", () => {
        const view = mapAuditJobToPublicProgress({
            job: jobStub({
                status: "processing",
                stages: {
                    preflight: "completed",
                    crawl: "completed",
                    screenshots: "completed",
                    pagespeed_mobile: "processing",
                    pagespeed_desktop: "pending",
                },
            }),
            normalizedDomain: "shop.example.com",
        });
        assert.equal(view.stages.find((s) => s.id === "crawl")?.state, "complete");
        assert.equal(view.stages.find((s) => s.id === "performance")?.state, "processing");
        assert.match(view.message, /performance/i);
    });

    it("maps niceguy / UX conversion running", () => {
        const view = mapAuditJobToPublicProgress({
            job: jobStub({
                status: "processing",
                stages: {
                    preflight: "completed",
                    crawl: "completed",
                    screenshots: "completed",
                    pagespeed_mobile: "completed",
                    pagespeed_desktop: "completed",
                    niceguy: "processing",
                },
            }),
            normalizedDomain: "example.com",
        });
        assert.equal(view.stages.find((s) => s.id === "ux_conversion")?.state, "processing");
        assert.equal(view.currentStage, "ux_conversion");
    });

    it("maps cursor / AI review waiting_for_external as processing", () => {
        const view = mapAuditJobToPublicProgress({
            job: jobStub({
                status: "waiting_for_external",
                stages: {
                    preflight: "completed",
                    crawl: "completed",
                    screenshots: "completed",
                    pagespeed_mobile: "completed",
                    pagespeed_desktop: "completed",
                    niceguy: "completed",
                    ai_analysis: "waiting_for_external",
                },
            }),
            normalizedDomain: "example.com",
        });
        assert.equal(view.stages.find((s) => s.id === "ai_review")?.state, "processing");
        assert.match(view.message, /AI/i);
    });

    it("maps report preparation", () => {
        const view = mapAuditJobToPublicProgress({
            job: jobStub({
                status: "processing",
                stages: {
                    preflight: "completed",
                    crawl: "completed",
                    screenshots: "completed",
                    pagespeed_mobile: "completed",
                    pagespeed_desktop: "completed",
                    niceguy: "completed",
                    ai_analysis: "completed",
                    finalize: "completed",
                    report_draft: "processing",
                },
            }),
            normalizedDomain: "example.com",
        });
        assert.equal(view.stages.find((s) => s.id === "report")?.state, "processing");
        assert.match(view.message, /report/i);
    });

    it("maps completed audits only when the report is published", () => {
        const completedStages = Object.fromEntries(
            AUDIT_PIPELINE_STAGES.map((stage) => [stage, "completed" as const]),
        ) as Partial<Record<AuditPipelineStageName, AuditStageStatus>>;
        const preparing = mapAuditJobToPublicProgress({
            job: jobStub({ status: "completed", stages: completedStages }),
            normalizedDomain: "example.com",
            deliverables: { reportPublished: false, pdfReady: false },
        });
        assert.equal(preparing.status, "processing");
        assert.equal(preparing.stages.find((s) => s.id === "report")?.state, "processing");
        assert.match(preparing.message, /preparing your report/i);

        const view = mapAuditJobToPublicProgress({
            job: jobStub({ status: "completed", stages: completedStages }),
            normalizedDomain: "example.com",
            deliverables: { reportPublished: true, pdfReady: true },
        });
        assert.equal(view.status, "complete");
        assert.equal(view.useReportLookup, true);
        assert.equal(view.reportAvailable, false);
        assert.equal(view.pdfReady, true);
        assert.ok(view.stages.every((stage) => stage.state === "complete"));
        assert.match(view.message, /complete|Retrieve your report/i);
    });

    it("keeps preparing report after AI when publish has not finished", () => {
        const view = mapAuditJobToPublicProgress({
            job: jobStub({
                status: "completed_with_warnings",
                stages: {
                    preflight: "completed",
                    crawl: "completed",
                    screenshots: "completed",
                    pagespeed_mobile: "completed",
                    pagespeed_desktop: "completed",
                    niceguy: "completed",
                    ai_analysis: "completed",
                    finalize: "completed",
                    report_draft: "completed_with_warnings",
                },
            }),
            normalizedDomain: "example.com",
            deliverables: { reportPublished: true, pdfReady: false },
        });
        assert.equal(view.status, "complete");
        assert.equal(view.stages.find((s) => s.id === "report")?.state, "complete");
        assert.equal(view.reportAvailable, false);
        assert.equal(view.pdfReady, false);
        assert.equal(view.useReportLookup, true);
    });

    it("maps failed audits to a safe customer error", () => {
        const view = mapAuditJobToPublicProgress({
            job: jobStub({
                status: "failed",
                stages: {
                    preflight: "completed",
                    crawl: "failed",
                },
            }),
            normalizedDomain: "example.com",
        });
        assert.equal(view.status, "failed");
        assert.equal(view.stages.find((s) => s.id === "request")?.state, "complete");
        assert.equal(view.stages.find((s) => s.id === "crawl")?.state, "failed");
        assert.match(view.message, /couldn't complete/i);
        assert.equal(/stack|mongo|ObjectId|CURSOR_/i.test(view.message), false);
    });

    it("does not crash when optional stages are skipped", () => {
        const view = mapAuditJobToPublicProgress({
            job: jobStub({
                status: "processing",
                stages: {
                    preflight: "completed",
                    crawl: "completed",
                    screenshots: "skipped",
                    pagespeed_mobile: "skipped",
                    pagespeed_desktop: "skipped",
                    niceguy: "processing",
                },
            }),
            normalizedDomain: "example.com",
        });
        assert.equal(view.stages.find((s) => s.id === "crawl")?.state, "complete");
        assert.equal(view.stages.find((s) => s.id === "performance")?.state, "complete");
        assert.equal(view.stages.find((s) => s.id === "ux_conversion")?.state, "processing");
    });
});
