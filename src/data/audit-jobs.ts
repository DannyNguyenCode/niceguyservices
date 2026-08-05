import "server-only";

import crypto from "node:crypto";
import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { AuditJob, type AuditJobDocument } from "@/src/models/AuditJob";
import {
    ACTIVE_AUDIT_JOB_STATUSES,
    AUDIT_PIPELINE_STAGES,
    DEFAULT_AUDIT_CONFIGURATION,
} from "@/src/services/audit-pipeline/constants";
import {
    assertJobTransition,
    assertStageTransition,
    isTerminalJobStatus,
    isTerminalStageStatus,
} from "@/src/services/audit-pipeline/state";
import type {
    AuditConfigurationSnapshot,
    AuditExecutionContext,
    AuditJobStatus,
    AuditPipelineStageName,
    AuditStageState,
    AuditStageStatus,
    SanitizedJobError,
    SerializableAuditJob,
} from "@/src/services/audit-pipeline/types";
import { isDuplicateKeyError } from "@/src/services/audit-jobs/stage-job-utils";

export class AuditJobDataError extends Error {
    readonly code: string;

    constructor(code: string, message: string) {
        super(message);
        this.name = "AuditJobDataError";
        this.code = code;
    }
}

function assertObjectId(id: string, code = "AUDIT_JOB_INVALID_ID"): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AuditJobDataError(code, "Invalid audit job ID.");
    }
    return new mongoose.Types.ObjectId(id);
}

function toIso(value: Date | string | null | undefined): string | null {
    if (!value) return null;
    return new Date(value).toISOString();
}

function readStageState(
    stages: Map<string, AuditStageState> | Record<string, AuditStageState> | undefined,
    stage: AuditPipelineStageName,
): AuditStageState {
    const map = stages instanceof Map ? Object.fromEntries(stages.entries()) : (stages ?? {});
    const existing = map[stage];
    return {
        status: existing?.status ?? "pending",
        attempt: existing?.attempt ?? 0,
        startedAt: existing?.startedAt ? new Date(existing.startedAt) : null,
        heartbeatAt: existing?.heartbeatAt ? new Date(existing.heartbeatAt) : null,
        completedAt: existing?.completedAt ? new Date(existing.completedAt) : null,
        errorCode: existing?.errorCode ?? null,
        errorMessage: existing?.errorMessage ?? null,
    };
}

function serializeAuditJob(doc: AuditJobDocument | Record<string, unknown>): SerializableAuditJob {
    const stagesRaw = doc.stages as Map<string, AuditStageState> | Record<string, AuditStageState>;
    const stages = Object.fromEntries(
        AUDIT_PIPELINE_STAGES.map((stage) => [stage, readStageState(stagesRaw, stage)]),
    ) as Record<AuditPipelineStageName, AuditStageState>;

    const error = doc.error as
        | { code?: string | null; message?: string | null; retryable?: boolean }
        | null
        | undefined;
    const configuration = doc.configuration as AuditConfigurationSnapshot;

    return {
        id: String(doc._id),
        websiteId: String(doc.websiteId),
        auditRunId: String(doc.auditRunId),
        idempotencyKey: String(doc.idempotencyKey),
        status: doc.status as AuditJobStatus,
        currentStage: (doc.currentStage as AuditPipelineStageName | null) ?? null,
        progressPercent: Number(doc.progressPercent ?? 0),
        attempt: Number(doc.attempt ?? 1),
        maxAttempts: Number(doc.maxAttempts ?? 3),
        queuedAt: toIso(doc.queuedAt as Date) ?? new Date().toISOString(),
        startedAt: toIso(doc.startedAt as Date | null),
        heartbeatAt: toIso(doc.heartbeatAt as Date | null),
        completedAt: toIso(doc.completedAt as Date | null),
        failedAt: toIso(doc.failedAt as Date | null),
        cancelledAt: toIso(doc.cancelledAt as Date | null),
        error: error?.code
            ? {
                  code: String(error.code),
                  message: String(error.message ?? "Audit job failed."),
                  retryable: Boolean(error.retryable),
              }
            : null,
        configuration: {
            crawlMaxPages:
                configuration?.crawlMaxPages ?? DEFAULT_AUDIT_CONFIGURATION.crawlMaxPages,
            crawlMaxDepth:
                configuration?.crawlMaxDepth ?? DEFAULT_AUDIT_CONFIGURATION.crawlMaxDepth,
            includeScreenshots:
                configuration?.includeScreenshots ?? DEFAULT_AUDIT_CONFIGURATION.includeScreenshots,
            includePageSpeed:
                configuration?.includePageSpeed ?? DEFAULT_AUDIT_CONFIGURATION.includePageSpeed,
            includeNiceGuyMetrics:
                configuration?.includeNiceGuyMetrics ??
                DEFAULT_AUDIT_CONFIGURATION.includeNiceGuyMetrics,
            includeAiAnalysis:
                configuration?.includeAiAnalysis ?? DEFAULT_AUDIT_CONFIGURATION.includeAiAnalysis,
            generateReportDraft:
                configuration?.generateReportDraft ?? DEFAULT_AUDIT_CONFIGURATION.generateReportDraft,
            pageSpeedStrategies:
                configuration?.pageSpeedStrategies ?? DEFAULT_AUDIT_CONFIGURATION.pageSpeedStrategies,
            configurationVersion:
                configuration?.configurationVersion ?? DEFAULT_AUDIT_CONFIGURATION.configurationVersion,
        },
        packageVersion: String(doc.packageVersion),
        stages,
        reportDraftId: doc.reportDraftId ? String(doc.reportDraftId) : null,
        createdAt: toIso(doc.createdAt as Date) ?? new Date().toISOString(),
        updatedAt: toIso(doc.updatedAt as Date) ?? new Date().toISOString(),
    };
}

export function hashAuditConfiguration(configuration: AuditConfigurationSnapshot): string {
    const payload = JSON.stringify({
        crawlMaxPages: configuration.crawlMaxPages,
        crawlMaxDepth: configuration.crawlMaxDepth,
        includeScreenshots: configuration.includeScreenshots,
        includePageSpeed: configuration.includePageSpeed,
        includeNiceGuyMetrics: configuration.includeNiceGuyMetrics,
        includeAiAnalysis: configuration.includeAiAnalysis,
        generateReportDraft: configuration.generateReportDraft,
        pageSpeedStrategies: [...configuration.pageSpeedStrategies].sort(),
        configurationVersion: configuration.configurationVersion,
    });
    return crypto.createHash("sha256").update(payload).digest("hex").slice(0, 16);
}

export function buildAuditJobIdempotencyKey(input: {
    websiteId: string;
    configuration: AuditConfigurationSnapshot;
}): string {
    return `audit-pipeline:${input.websiteId}:${hashAuditConfiguration(input.configuration)}`;
}

export function normalizeAuditConfiguration(
    input?: Partial<AuditConfigurationSnapshot>,
): AuditConfigurationSnapshot {
    return {
        crawlMaxPages: input?.crawlMaxPages ?? DEFAULT_AUDIT_CONFIGURATION.crawlMaxPages,
        crawlMaxDepth: input?.crawlMaxDepth ?? DEFAULT_AUDIT_CONFIGURATION.crawlMaxDepth,
        includeScreenshots: input?.includeScreenshots ?? DEFAULT_AUDIT_CONFIGURATION.includeScreenshots,
        includePageSpeed: input?.includePageSpeed ?? DEFAULT_AUDIT_CONFIGURATION.includePageSpeed,
        includeNiceGuyMetrics:
            input?.includeNiceGuyMetrics ?? DEFAULT_AUDIT_CONFIGURATION.includeNiceGuyMetrics,
        includeAiAnalysis: input?.includeAiAnalysis ?? DEFAULT_AUDIT_CONFIGURATION.includeAiAnalysis,
        generateReportDraft: input?.generateReportDraft ?? DEFAULT_AUDIT_CONFIGURATION.generateReportDraft,
        pageSpeedStrategies: input?.pageSpeedStrategies ?? DEFAULT_AUDIT_CONFIGURATION.pageSpeedStrategies,
        configurationVersion:
            input?.configurationVersion ?? DEFAULT_AUDIT_CONFIGURATION.configurationVersion,
    };
}

export async function getAuditJobById(jobId: string): Promise<SerializableAuditJob | null> {
    await connectToDatabase();
    const doc = await AuditJob.findById(assertObjectId(jobId)).lean();
    return doc ? serializeAuditJob(doc) : null;
}

export async function getActiveAuditJobForWebsite(
    websiteId: string,
): Promise<SerializableAuditJob | null> {
    await connectToDatabase();
    const doc = await AuditJob.findOne({
        websiteId: assertObjectId(websiteId, "AUDIT_JOB_INVALID_WEBSITE_ID"),
        status: { $in: [...ACTIVE_AUDIT_JOB_STATUSES] },
    })
        .sort({ queuedAt: -1 })
        .lean();
    return doc ? serializeAuditJob(doc) : null;
}

export async function getAuditJobByIdempotencyKey(
    idempotencyKey: string,
): Promise<SerializableAuditJob | null> {
    await connectToDatabase();
    const doc = await AuditJob.findOne({
        idempotencyKey,
        status: { $in: [...ACTIVE_AUDIT_JOB_STATUSES] },
    }).lean();
    return doc ? serializeAuditJob(doc) : null;
}

export async function createAuditJobRecord(input: {
    websiteId: string;
    auditRunId: string;
    idempotencyKey: string;
    configuration: AuditConfigurationSnapshot;
    maxAttempts?: number;
}): Promise<{ job: SerializableAuditJob; created: boolean }> {
    await connectToDatabase();

    const existing = await getAuditJobByIdempotencyKey(input.idempotencyKey);
    if (existing) {
        return { job: existing, created: false };
    }

    try {
        const doc = await AuditJob.create({
            websiteId: assertObjectId(input.websiteId, "AUDIT_JOB_INVALID_WEBSITE_ID"),
            auditRunId: assertObjectId(input.auditRunId, "AUDIT_JOB_INVALID_AUDIT_RUN_ID"),
            idempotencyKey: input.idempotencyKey,
            status: "queued",
            configuration: {
                ...input.configuration,
                crawlMaxPages: input.configuration.crawlMaxPages ?? undefined,
                crawlMaxDepth: input.configuration.crawlMaxDepth ?? undefined,
            },
            maxAttempts: input.maxAttempts,
            queuedAt: new Date(),
            stages: Object.fromEntries(
                AUDIT_PIPELINE_STAGES.map((stage) => [
                    stage,
                    { status: "pending", attempt: 0 },
                ]),
            ),
        });
        return { job: serializeAuditJob(doc), created: true };
    } catch (error) {
        if (!isDuplicateKeyError(error)) {
            throw error;
        }
        const raced = await getAuditJobByIdempotencyKey(input.idempotencyKey);
        if (!raced) {
            throw error;
        }
        return { job: raced, created: false };
    }
}

export async function claimQueuedAuditJob(): Promise<SerializableAuditJob | null> {
    await connectToDatabase();
    const claimed = await AuditJob.findOneAndUpdate(
        { status: "queued" },
        {
            $set: {
                status: "processing",
                startedAt: new Date(),
                heartbeatAt: new Date(),
            },
        },
        { sort: { queuedAt: 1 }, new: true },
    ).lean();

    return claimed ? serializeAuditJob(claimed) : null;
}

export async function touchAuditJobHeartbeat(jobId: string): Promise<void> {
    await connectToDatabase();
    await AuditJob.updateOne(
        { _id: assertObjectId(jobId) },
        { $set: { heartbeatAt: new Date() } },
    );
}

export async function updateAuditJobStage(input: {
    jobId: string;
    stage: AuditPipelineStageName;
    status: AuditStageStatus;
    errorCode?: string | null;
    errorMessage?: string | null;
    incrementAttempt?: boolean;
}): Promise<SerializableAuditJob | null> {
    await connectToDatabase();
    const job = await getAuditJobById(input.jobId);
    if (!job) {
        return null;
    }

    const current = job.stages[input.stage];
    assertStageTransition(current.status, input.status);

    const now = new Date();
    const setFields: Record<string, unknown> = {
        currentStage: input.stage,
        heartbeatAt: now,
        [`stages.${input.stage}.status`]: input.status,
        [`stages.${input.stage}.errorCode`]: input.errorCode ?? null,
        [`stages.${input.stage}.errorMessage`]: input.errorMessage ?? null,
    };

    if (input.status === "processing") {
        setFields[`stages.${input.stage}.startedAt`] = now;
        setFields[`stages.${input.stage}.heartbeatAt`] = now;
    }
    if (isTerminalStageStatus(input.status)) {
        setFields[`stages.${input.stage}.completedAt`] = now;
    }

    const update: Record<string, unknown> = { $set: setFields };
    if (input.incrementAttempt) {
        update.$inc = { [`stages.${input.stage}.attempt`]: 1 };
    }

    const doc = await AuditJob.findByIdAndUpdate(assertObjectId(input.jobId), update, {
        new: true,
    }).lean();
    return doc ? serializeAuditJob(doc) : null;
}

export async function updateAuditJobProgress(input: {
    jobId: string;
    progressPercent: number;
    currentStage?: AuditPipelineStageName | null;
}): Promise<void> {
    await connectToDatabase();
    await AuditJob.updateOne(
        { _id: assertObjectId(input.jobId) },
        {
            $set: {
                progressPercent: Math.max(0, Math.min(100, input.progressPercent)),
                heartbeatAt: new Date(),
                ...(input.currentStage !== undefined ? { currentStage: input.currentStage } : {}),
            },
        },
    );
}

export async function completeAuditJob(input: {
    jobId: string;
    status: Extract<AuditJobStatus, "completed" | "completed_with_warnings" | "failed" | "cancelled">;
    error?: SanitizedJobError | null;
    reportDraftId?: string | null;
}): Promise<SerializableAuditJob | null> {
    await connectToDatabase();
    const job = await getAuditJobById(input.jobId);
    if (!job) {
        return null;
    }
    assertJobTransition(job.status, input.status);

    const now = new Date();
    const doc = await AuditJob.findByIdAndUpdate(
        assertObjectId(input.jobId),
        {
            $set: {
                status: input.status,
                completedAt: ["completed", "completed_with_warnings"].includes(input.status)
                    ? now
                    : null,
                failedAt: input.status === "failed" ? now : null,
                cancelledAt: input.status === "cancelled" ? now : null,
                heartbeatAt: now,
                currentStage: null,
                progressPercent: input.status === "failed" || input.status === "cancelled" ? job.progressPercent : 100,
                error: input.error ?? null,
                ...(input.reportDraftId ? { reportDraftId: assertObjectId(input.reportDraftId) } : {}),
            },
        },
        { new: true },
    ).lean();

    return doc ? serializeAuditJob(doc) : null;
}

export async function cancelAuditJob(jobId: string): Promise<SerializableAuditJob | null> {
    const job = await getAuditJobById(jobId);
    if (!job || isTerminalJobStatus(job.status)) {
        return job;
    }
    return completeAuditJob({
        jobId,
        status: "cancelled",
        error: {
            code: "AUDIT_JOB_CANCELLED",
            message: "Audit was cancelled by an administrator.",
            retryable: false,
        },
    });
}

export async function retryFailedAuditJob(jobId: string): Promise<SerializableAuditJob | null> {
    await connectToDatabase();
    const job = await getAuditJobById(jobId);
    if (!job || job.status !== "failed") {
        return null;
    }

    const failedStageUpdates: Record<string, unknown> = {
        status: "queued",
        error: null,
        failedAt: null,
        completedAt: null,
        heartbeatAt: null,
        currentStage: null,
    };

    for (const [stageName, stage] of Object.entries(job.stages)) {
        if (stage.status === "failed") {
            failedStageUpdates[`stages.${stageName}.status`] = "pending";
            failedStageUpdates[`stages.${stageName}.errorCode`] = null;
            failedStageUpdates[`stages.${stageName}.errorMessage`] = null;
        }
    }

    const doc = await AuditJob.findByIdAndUpdate(
        assertObjectId(jobId),
        {
            $set: failedStageUpdates,
            $inc: { attempt: 1 },
        },
        { new: true },
    ).lean();

    return doc ? serializeAuditJob(doc) : null;
}

export function toExecutionContext(job: SerializableAuditJob): AuditExecutionContext {
    return {
        jobId: job.id,
        auditRunId: job.auditRunId,
        websiteId: job.websiteId,
        configuration: job.configuration,
        attempt: job.attempt,
    };
}

export async function markAuditJobProcessing(jobId: string): Promise<void> {
    await connectToDatabase();
    await AuditJob.updateOne(
        {
            _id: assertObjectId(jobId),
            status: { $in: ["queued", "processing"] },
        },
        {
            $set: {
                status: "processing",
                startedAt: new Date(),
                heartbeatAt: new Date(),
            },
        },
    );
}

export async function setAuditJobReportDraftId(
    jobId: string,
    reportDraftId: string,
): Promise<void> {
    await connectToDatabase();
    await AuditJob.updateOne(
        { _id: assertObjectId(jobId) },
        { $set: { reportDraftId: assertObjectId(reportDraftId) } },
    );
}

export async function getAuditJobByAuditRunId(
    auditRunId: string,
): Promise<SerializableAuditJob | null> {
    await connectToDatabase();
    const doc = await AuditJob.findOne({
        auditRunId: assertObjectId(auditRunId, "AUDIT_JOB_INVALID_AUDIT_RUN_ID"),
    })
        .sort({ queuedAt: -1 })
        .lean();
    return doc ? serializeAuditJob(doc) : null;
}

/**
 * Park an AuditJob while waiting for an asynchronous external system (Cursor).
 * Heartbeats stop — waiting is owned by the Cursor analysis lifecycle.
 */
export async function parkAuditJobWaitingForExternal(
    jobId: string,
): Promise<SerializableAuditJob | null> {
    await connectToDatabase();
    const job = await getAuditJobById(jobId);
    if (!job) return null;
    if (job.status === "waiting_for_external") {
        return job;
    }
    assertJobTransition(job.status, "waiting_for_external");

    const doc = await AuditJob.findByIdAndUpdate(
        assertObjectId(jobId),
        {
            $set: {
                status: "waiting_for_external",
                // Clear heartbeat so stale recovery does not treat Cursor wait as abandoned execution.
                heartbeatAt: null,
            },
        },
        { new: true },
    ).lean();
    return doc ? serializeAuditJob(doc) : null;
}

export async function resumeWaitingAuditJob(
    jobId: string,
): Promise<SerializableAuditJob | null> {
    await connectToDatabase();
    const job = await getAuditJobById(jobId);
    if (!job) return null;
    if (job.status === "processing") {
        return job;
    }
    if (job.status !== "waiting_for_external") {
        return job;
    }
    assertJobTransition(job.status, "processing");

    const doc = await AuditJob.findByIdAndUpdate(
        assertObjectId(jobId),
        {
            $set: {
                status: "processing",
                heartbeatAt: new Date(),
                startedAt: job.startedAt ? new Date(job.startedAt) : new Date(),
            },
        },
        { new: true },
    ).lean();
    return doc ? serializeAuditJob(doc) : null;
}

export async function recoverStaleAuditPipelineJobs(): Promise<number> {
    await connectToDatabase();
    const minutes = Number.parseInt(process.env.AUDIT_JOB_STALE_MINUTES ?? "30", 10);
    const cutoff = new Date(Date.now() - Math.max(5, minutes) * 60_000);

    // Only recover genuinely stale *processing* jobs. Jobs waiting for Cursor must not be requeued.
    const result = await AuditJob.updateMany(
        {
            status: "processing",
            $or: [
                { heartbeatAt: { $lte: cutoff } },
                { heartbeatAt: null, startedAt: { $lte: cutoff } },
            ],
        },
        {
            $set: {
                status: "queued",
                heartbeatAt: null,
            },
            $inc: { attempt: 1 },
        },
    );

    const exceeded = await AuditJob.updateMany(
        {
            status: "processing",
            attempt: { $gte: Number.parseInt(process.env.AUDIT_JOB_MAX_ATTEMPTS ?? "3", 10) },
            $or: [
                { heartbeatAt: { $lte: cutoff } },
                { heartbeatAt: null, startedAt: { $lte: cutoff } },
            ],
        },
        {
            $set: {
                status: "failed",
                failedAt: new Date(),
                error: {
                    code: "AUDIT_JOB_STALE",
                    message: "Audit job exceeded the maximum processing time or attempts.",
                    retryable: true,
                },
            },
        },
    );

    return (result.modifiedCount ?? 0) + (exceeded.modifiedCount ?? 0);
}
