import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    canTransitionAnalysisStatus,
    getAllowedNextStatuses,
} from "@/src/services/cursor-analysis/state-machine";
import {
    AUDIT_RESULT_FIELD_LIMITS,
    buildAuditResultContract,
} from "@/src/services/cursor-analysis/result-contract";
import {
    safeValidateCursorAuditResult,
    validateCursorAuditResult,
} from "@/src/services/cursor-analysis/schemas";
import {
    deriveJobStatusFromStages,
    isWaitingJobStatus,
    isWaitingStageStatus,
} from "@/src/services/audit-pipeline/state";
import { getNextPipelineStage, hasWaitingPipelineStage } from "@/src/services/audit-pipeline/stage-plan";
import { DEFAULT_AUDIT_CONFIGURATION } from "@/src/services/audit-pipeline/constants";
import { mapCursorResultToAiSummaryOutput } from "@/src/services/cursor-analysis/materialize-ai-summary-from-cursor";
import type { AuditPipelineStageName, AuditStageState } from "@/src/services/audit-pipeline/types";
import { AUDIT_PIPELINE_STAGES } from "@/src/services/audit-pipeline/constants";

function makeResult(overrides: Record<string, unknown> = {}) {
    return {
        schemaVersion: "1.1",
        auditId: "507f1f77bcf86cd799439011",
        analysisRequestId: "11111111-1111-4111-8111-111111111111",
        assessment: {
            priority: "high",
            confidence: 0.8,
            summary: "Assessment summary for contract tests.",
        },
        executiveSummary: "Executive summary covering the primary conversion and trust findings.",
        strengths: [
            {
                title: "Clear services",
                description: "Homepage explains services clearly.",
                sources: ["crawl"],
            },
        ],
        issues: [
            {
                title: "Weak CTA",
                description: "Primary call to action is unclear.",
                severity: "high",
                category: "conversion",
                recommendation: "Make the primary CTA more prominent.",
                sources: ["screenshot-desktop"],
            },
        ],
        limitations: ["Mobile screenshot quality was limited."],
        analyzedAt: "2026-04-01T12:00:00.000Z",
        ...overrides,
    };
}

function emptyStages(): Record<AuditPipelineStageName, AuditStageState> {
    return Object.fromEntries(
        AUDIT_PIPELINE_STAGES.map((stage) => [
            stage,
            {
                status: "pending",
                attempt: 0,
                startedAt: null,
                heartbeatAt: null,
                completedAt: null,
                errorCode: null,
                errorMessage: null,
            },
        ]),
    ) as Record<AuditPipelineStageName, AuditStageState>;
}

describe("Cursor async lifecycle states", () => {
    it("allows queued -> validating for fast-callback race", () => {
        assert.equal(canTransitionAnalysisStatus("queued", "validating"), true);
        assert.ok(getAllowedNextStatuses("queued").includes("validating"));
    });

    it("treats waiting_for_external as a non-terminal pause, not a warning", () => {
        assert.equal(isWaitingStageStatus("waiting_for_external"), true);
        assert.equal(isWaitingJobStatus("waiting_for_external"), true);

        const status = deriveJobStatusFromStages([
            { required: true, status: "completed" },
            { required: false, status: "waiting_for_external" },
            { required: false, status: "pending" },
        ]);
        assert.equal(status, "waiting_for_external");
        assert.notEqual(status, "completed_with_warnings");
        assert.notEqual(status, "completed");
    });

    it("pauses pipeline progression while waiting for Cursor", () => {
        const stages = emptyStages();
        for (const stage of [
            "preflight",
            "crawl",
            "screenshots",
            "pagespeed_mobile",
            "pagespeed_desktop",
            "niceguy",
        ] as const) {
            stages[stage].status = "completed";
        }
        stages.ai_analysis.status = "waiting_for_external";

        assert.equal(hasWaitingPipelineStage(stages), true);
        assert.equal(
            getNextPipelineStage({
                configuration: DEFAULT_AUDIT_CONFIGURATION,
                stages,
            }),
            null,
        );
    });
});

describe("resultContract parity with Zod callback validation", () => {
    it("embeds field limits that match Zod bounds", () => {
        const contract = buildAuditResultContract({
            auditId: "507f1f77bcf86cd799439011",
            analysisRequestId: "11111111-1111-4111-8111-111111111111",
        });
        assert.equal(contract.fieldLimits.sourceMaxLength, 200);
        assert.equal(contract.fieldLimits.sourcesMaxItems, 5);
        assert.equal(contract.fieldLimits.executiveSummaryMaxLength, 8000);
        assert.equal(
            (contract.jsonSchema.properties as Record<string, { maxLength?: number }>).executiveSummary
                .maxLength,
            AUDIT_RESULT_FIELD_LIMITS.executiveSummaryMaxLength,
        );

        const sourcesSchema = (
            (
                (contract.jsonSchema.properties as Record<string, unknown>).strengths as {
                    items: {
                        properties: { sources: { items: { maxLength: number }; maxItems: number } };
                    };
                }
            ).items.properties.sources
        );
        assert.equal(sourcesSchema.maxItems, 5);
        assert.equal(sourcesSchema.items.maxLength, 200);
    });

    it("accepts resultContract-compatible payloads in Zod validator", () => {
        const result = makeResult();
        assert.doesNotThrow(() => validateCursorAuditResult(result));
    });

    it("rejects source strings longer than 200 in Zod (matches JSON Schema)", () => {
        const result = makeResult({
            strengths: [
                {
                    title: "Clear services",
                    description: "Homepage explains services clearly.",
                    sources: ["x".repeat(201)],
                },
            ],
        });
        const parsed = safeValidateCursorAuditResult(result);
        assert.equal(parsed.success, false);
    });

    it("rejects additional properties in nested objects via schema additionalProperties:false", () => {
        const schema = buildAuditResultContract({
            auditId: "a",
            analysisRequestId: "b",
        }).jsonSchema as {
            additionalProperties: boolean;
            properties: { assessment: { additionalProperties: boolean } };
        };
        assert.equal(schema.additionalProperties, false);
        assert.equal(schema.properties.assessment.additionalProperties, false);
    });
});

describe("Cursor -> AiSummary normalization", () => {
    it("maps Cursor result without replacing Nice Guy overallScore ownership", () => {
        const mapped = mapCursorResultToAiSummaryOutput(makeResult() as never);
        assert.ok(mapped.executiveSummary.length > 0);
        assert.ok(mapped.strengths.length >= 2);
        assert.ok(mapped.weaknesses.length >= 2);
        assert.ok(mapped.quickWins.length >= 3);
        assert.equal(
            Object.prototype.hasOwnProperty.call(mapped, "overallScore"),
            false,
        );
    });
});
