import "server-only";

import {
    createAuditRunRecord,
    hasActiveAuditRunForWebsite,
    reserveNextAuditNumber,
} from "@/src/data/audit-runs";
import { getWebsiteById } from "@/src/data/websites";
import { CRAWL_CONFIG } from "@/src/lib/crawl-config";
import { NICEGUY_SCORING_VERSION } from "@/src/config/niceguy-scoring";
import { AI_ANALYSIS_VERSION, AI_HERO_SUGGESTION_VERSION } from "@/src/lib/ai-config";
import { createActivityEvent } from "@/src/services/activity/create-activity-event";
import { AUDIT_RUN_SCHEMA_VERSION } from "@/src/services/audit-history/constants";
import type { SerializableAuditRun } from "@/src/services/audit-history/types";

export class AuditHistoryError extends Error {
    readonly code: string;

    constructor(code: string, message: string) {
        super(message);
        this.name = "AuditHistoryError";
        this.code = code;
    }
}

export async function createAuditRun(input: {
    websiteId: string;
    trigger?: SerializableAuditRun["trigger"];
    configuration?: Partial<SerializableAuditRun["configuration"]>;
}): Promise<SerializableAuditRun> {
    const website = await getWebsiteById(input.websiteId);
    if (!website) {
        throw new AuditHistoryError("AUDIT_HISTORY_WEBSITE_NOT_FOUND", "Website not found.");
    }

    if (await hasActiveAuditRunForWebsite(input.websiteId)) {
        throw new AuditHistoryError(
            "AUDIT_HISTORY_DUPLICATE_ACTIVE_RUN",
            "An audit is already running for this website.",
        );
    }

    let auditNumber: number;
    try {
        auditNumber = await reserveNextAuditNumber(input.websiteId);
    } catch {
        throw new AuditHistoryError(
            "AUDIT_HISTORY_NUMBER_RESERVATION_FAILED",
            "Unable to reserve audit number.",
        );
    }

    const configuration: SerializableAuditRun["configuration"] = {
        crawlMaxPages: input.configuration?.crawlMaxPages ?? CRAWL_CONFIG.maxPages,
        crawlMaxDepth: input.configuration?.crawlMaxDepth ?? null,
        includeScreenshots: input.configuration?.includeScreenshots ?? true,
        includePageSpeed: input.configuration?.includePageSpeed ?? true,
        includeNiceGuyMetrics: input.configuration?.includeNiceGuyMetrics ?? true,
        includeAiAnalysis: input.configuration?.includeAiAnalysis ?? true,
        pageSpeedStrategies: input.configuration?.pageSpeedStrategies ?? ["mobile", "desktop"],
    };

    const auditRun = await createAuditRunRecord({
        websiteId: input.websiteId,
        auditNumber,
        trigger: input.trigger ?? { type: "administrator", actorId: null, actorName: null },
        source: {
            websiteUrl: website.originalUrl,
            normalizedUrl: website.normalizedDomain,
            businessName: website.businessName || null,
            domain: website.normalizedDomain,
        },
        configuration,
        versions: {
            auditSchemaVersion: AUDIT_RUN_SCHEMA_VERSION,
            crawlerVersion: "playwright-crawler-v1",
            screenshotVersion: "cloudinary-v1",
            pageSpeedVersion: "pagespeed-v5",
            metricsVersion: NICEGUY_SCORING_VERSION,
            aiPromptVersion: AI_ANALYSIS_VERSION,
            aiSchemaVersion: AI_HERO_SUGGESTION_VERSION,
        },
    });

    await createActivityEvent({
        websiteId: input.websiteId,
        auditRunId: auditRun.id,
        eventType: "audit-run-created",
        title: `Audit ${auditRun.auditNumber} created`,
        description: `Audit run ${auditRun.auditNumber} was created.`,
        actor: { type: "administrator" },
        metadata: {
            auditRunId: auditRun.id,
            auditNumber: auditRun.auditNumber,
            status: auditRun.status,
            auditSchemaVersion: AUDIT_RUN_SCHEMA_VERSION,
        },
    });

    return auditRun;
}
