import "server-only";

import { getWebsiteById } from "@/src/data/websites";
import {
    buildAuditJobIdempotencyKey,
    createAuditJobRecord,
    getActiveAuditJobForWebsite,
    getAuditJobByIdempotencyKey,
    normalizeAuditConfiguration,
} from "@/src/data/audit-jobs";
import { createAuditRun } from "@/src/services/audit-history/create-audit-run";
import { AuditHistoryError } from "@/src/services/audit-history/create-audit-run";
import { recoverAbandonedQueuedCrawlForWebsite } from "@/src/services/audit-jobs/recover-abandoned-queued-crawl";
import { runAuditPreflight, AuditPreflightError } from "@/src/services/audit-pipeline/preflight";
import { maybeRunAuditPipelineSynchronously } from "@/src/services/audit-pipeline/run-audit-pipeline-sync";
import { scheduleAuditWorkerKick } from "@/src/services/audit-pipeline/schedule-audit-worker";
import type { AuditConfigurationSnapshot, SerializableAuditJob } from "@/src/services/audit-pipeline/types";
import { updateAuditRunStatus } from "@/src/data/audit-runs";

export class StartAuditJobError extends Error {
    readonly code: string;

    constructor(code: string, message: string) {
        super(message);
        this.name = "StartAuditJobError";
        this.code = code;
    }
}

export type StartAuditJobResult = {
    job: SerializableAuditJob;
    auditRunId: string;
    websiteId: string;
    reused: boolean;
    statusUrl: string;
};

async function buildStartAuditJobResult(input: {
    job: SerializableAuditJob;
    websiteId: string;
    reused: boolean;
}): Promise<StartAuditJobResult> {
    const job = await maybeRunAuditPipelineSynchronously(input.job);
    if (job.status === "queued") {
        scheduleAuditWorkerKick(input.reused ? "audit-job-reused" : "audit-job-created");
    }
    return {
        job,
        auditRunId: job.auditRunId,
        websiteId: input.websiteId,
        reused: input.reused,
        statusUrl: `/api/admin/audit-jobs/${job.id}`,
    };
}

export async function startAuditJob(input: {
    websiteId: string;
    configuration?: Partial<AuditConfigurationSnapshot>;
    trigger?: {
        type: "administrator" | "system" | "retry" | "migration";
        actorId?: string | null;
        actorName?: string | null;
    };
    skipPreflight?: boolean;
}): Promise<StartAuditJobResult> {
    const website = await getWebsiteById(input.websiteId);
    if (!website || website.deletedAt) {
        throw new StartAuditJobError("AUDIT_WEBSITE_NOT_FOUND", "Website not found.");
    }

    await recoverAbandonedQueuedCrawlForWebsite(input.websiteId);

    const configuration = normalizeAuditConfiguration(input.configuration);
    const idempotencyKey = buildAuditJobIdempotencyKey({
        websiteId: input.websiteId,
        configuration,
    });

    const existingJob = await getAuditJobByIdempotencyKey(idempotencyKey);
    if (existingJob) {
        return buildStartAuditJobResult({
            job: existingJob,
            websiteId: input.websiteId,
            reused: true,
        });
    }

    const activeJob = await getActiveAuditJobForWebsite(input.websiteId);
    if (activeJob) {
        return buildStartAuditJobResult({
            job: activeJob,
            websiteId: input.websiteId,
            reused: true,
        });
    }

    if (!input.skipPreflight) {
        try {
            await runAuditPreflight(website.originalUrl);
        } catch (error) {
            if (error instanceof AuditPreflightError) {
                throw new StartAuditJobError(error.code, error.message);
            }
            throw error;
        }
    }

    let auditRun;
    try {
        auditRun = await createAuditRun({
            websiteId: input.websiteId,
            trigger: {
                type: input.trigger?.type ?? "administrator",
                actorId: input.trigger?.actorId ?? null,
                actorName: input.trigger?.actorName ?? null,
            },
            configuration,
        });
    } catch (error) {
        if (error instanceof AuditHistoryError) {
            throw new StartAuditJobError(error.code, error.message);
        }
        throw error;
    }

    await updateAuditRunStatus(auditRun.id, "queued");

    const { job, created } = await createAuditJobRecord({
        websiteId: input.websiteId,
        auditRunId: auditRun.id,
        idempotencyKey,
        configuration,
    });

    return buildStartAuditJobResult({
        job,
        websiteId: input.websiteId,
        reused: !created,
    });
}
