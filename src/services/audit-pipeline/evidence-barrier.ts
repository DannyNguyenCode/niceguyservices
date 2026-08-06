import "server-only";

import { getAuditRunById } from "@/src/data/audit-runs";
import { getWebsiteById } from "@/src/data/websites";
import { loadAuditRunResources } from "@/src/services/audit-history/load-audit-run-resources";
import {
    calculateCursorAnalysisReadiness,
    type AnalysisReadiness,
    type AnalysisReadinessItem,
} from "@/src/services/cursor-analysis/readiness";

export type EvidenceBarrierResult = AnalysisReadiness & {
    auditRunId: string;
    websiteId: string | null;
};

/**
 * Canonical server-side evidence barrier for Cursor Cloud Agent.
 *
 * All orchestration paths (automatic pipeline and manual stage completion)
 * must use this decision before triggering analysis. Do not scatter readiness
 * checks across completion handlers.
 */
export async function evaluateAuditEvidenceBarrier(
    auditRunId: string,
): Promise<EvidenceBarrierResult> {
    const auditRun = await getAuditRunById(auditRunId);
    if (!auditRun) {
        return {
            auditRunId,
            websiteId: null,
            ready: false,
            blockers: [
                {
                    code: "AUDIT_RUN_MISSING",
                    message: "Audit run not found.",
                    field: "auditId",
                },
            ],
            warnings: [],
        };
    }

    const website = await getWebsiteById(auditRun.websiteId);
    if (!website) {
        return {
            auditRunId,
            websiteId: auditRun.websiteId,
            ready: false,
            blockers: [
                {
                    code: "WEBSITE_MISSING",
                    message: "Website not found for this audit run.",
                    field: "websiteId",
                },
            ],
            warnings: [],
        };
    }

    const resources = await loadAuditRunResources({
        websiteId: auditRun.websiteId,
        auditRunId,
    });
    if (!resources) {
        return {
            auditRunId,
            websiteId: auditRun.websiteId,
            ready: false,
            blockers: [
                {
                    code: "AUDIT_RESOURCES_MISSING",
                    message: "Audit evidence resources could not be loaded.",
                },
            ],
            warnings: [],
        };
    }

    const readiness = calculateCursorAnalysisReadiness({
        auditId: auditRunId,
        auditedUrl: auditRun.source.websiteUrl || website.originalUrl,
        website,
        crawl: resources.crawl,
        screenshots: resources.screenshots,
        pageSpeed: resources.pageSpeed,
        niceGuy: resources.niceGuy,
    });

    return {
        auditRunId,
        websiteId: website.id,
        ready: readiness.ready,
        blockers: readiness.blockers,
        warnings: readiness.warnings,
    };
}

export function summarizeEvidenceBlockers(blockers: AnalysisReadinessItem[]): string {
    if (blockers.length === 0) {
        return "Evidence is not ready.";
    }
    return blockers.map((item) => item.code).join(", ");
}
