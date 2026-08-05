import "server-only";

import auditResultJsonSchema from "@/audit-agent/audit-result.schema.json";
import auditResultExample from "@/audit-agent/examples/example-result.json";
import {
    AUDIT_ASSESSMENT_PRIORITIES,
    AUDIT_ISSUE_SEVERITIES,
} from "@/src/services/cursor-analysis/schemas";

export const AUDIT_RESULT_CONTRACT_VERSION = "1.1";

export const AUDIT_RESULT_REQUIRED_FIELDS = [
    "schemaVersion",
    "auditId",
    "analysisRequestId",
    "assessment",
    "executiveSummary",
    "strengths",
    "issues",
    "limitations",
    "analyzedAt",
] as const;

export const AUDIT_RESULT_FIELD_LIMITS = {
    assessmentSummaryMaxLength: 2000,
    executiveSummaryMaxLength: 8000,
    strengthTitleMaxLength: 300,
    strengthDescriptionMaxLength: 4000,
    strengthsMaxItems: 10,
    issueTitleMaxLength: 300,
    issueDescriptionMaxLength: 4000,
    issueRecommendationMaxLength: 4000,
    issuesMaxItems: 20,
    limitationsMaxLength: 1000,
    limitationsMaxItems: 10,
    sourcesMaxItems: 5,
} as const;

export type AuditResultContract = {
    schemaVersion: "1.1";
    contractVersion: typeof AUDIT_RESULT_CONTRACT_VERSION;
    jsonSchema: Record<string, unknown>;
    requiredFields: string[];
    fieldLimits: Record<string, number>;
    enums: {
        assessmentPriority: string[];
        issueSeverity: string[];
    };
    example: Record<string, unknown>;
};

export function buildAuditResultContract(input: {
    auditId: string;
    analysisRequestId: string;
}): AuditResultContract {
    return {
        schemaVersion: "1.1",
        contractVersion: AUDIT_RESULT_CONTRACT_VERSION,
        jsonSchema: auditResultJsonSchema as Record<string, unknown>,
        requiredFields: [...AUDIT_RESULT_REQUIRED_FIELDS],
        fieldLimits: { ...AUDIT_RESULT_FIELD_LIMITS },
        enums: {
            assessmentPriority: [...AUDIT_ASSESSMENT_PRIORITIES],
            issueSeverity: [...AUDIT_ISSUE_SEVERITIES],
        },
        example: {
            ...(auditResultExample as Record<string, unknown>),
            auditId: input.auditId,
            analysisRequestId: input.analysisRequestId,
        },
    };
}
