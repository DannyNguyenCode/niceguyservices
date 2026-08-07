import "server-only";

import {
    registerAuditRunReference,
    type AuditResourceType,
} from "@/src/data/audit-runs";
import { getAuditRunById } from "@/src/data/audit-runs";

export class AuditReferenceError extends Error {
    readonly code: string;

    constructor(code: string, message: string) {
        super(message);
        this.name = "AuditReferenceError";
        this.code = code;
    }
}

export async function registerAuditReference(input: {
    auditRunId: string;
    resourceType: AuditResourceType;
    resourceId: string;
}): Promise<void> {
    const auditRun = await getAuditRunById(input.auditRunId);
    if (!auditRun) {
        throw new AuditReferenceError("AUDIT_HISTORY_AUDIT_NOT_FOUND", "Audit run not found.");
    }

    const finalStatuses = ["complete", "partial", "failed", "cancelled"];
    const immutableSourceTypes: AuditResourceType[] = [
        "crawl-data",
        "screenshot",
        "google-metrics",
        "niceguy-metrics",
        "ai-summary",
        "hero-suggestion",
        "ai-metadata",
    ];

    if (
        finalStatuses.includes(auditRun.status) &&
        immutableSourceTypes.includes(input.resourceType) &&
        auditRun.references.crawlDataIds.length > 0 &&
        input.resourceType === "crawl-data"
    ) {
        throw new AuditReferenceError(
            "AUDIT_HISTORY_ALREADY_FINALIZED",
            "Cannot replace crawl data on a finalized audit.",
        );
    }

    try {
        await registerAuditRunReference({
            auditRunId: input.auditRunId,
            resourceType: input.resourceType,
            resourceId: input.resourceId,
            websiteId: auditRun.websiteId,
        });
    } catch (error) {
        if (error instanceof Error && "code" in error) {
            throw error;
        }
        throw new AuditReferenceError("AUDIT_HISTORY_SAVE_FAILED", "Unable to register reference.");
    }
}
