import "server-only";

import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { AuditRun, type AuditRunDocument } from "@/src/models/AuditRun";
import { Website } from "@/src/models/Website";
import {
    ACTIVE_AUDIT_RUN_STATUSES,
    AUDIT_RUN_SCHEMA_VERSION,
    CURRENT_ELIGIBLE_AUDIT_STATUSES,
    FINAL_AUDIT_RUN_STATUSES,
} from "@/src/services/audit-history/constants";
import type {
    AuditRunListItem,
    AuditStageCompletion,
    AuditRunStatus,
    SerializableAuditRun,
} from "@/src/services/audit-history/types";

export class AuditRunDataError extends Error {
    readonly code: string;

    constructor(code: string, message: string, options?: { cause?: unknown }) {
        super(message, options);
        this.name = "AuditRunDataError";
        this.code = code;
    }
}

function assertObjectId(id: string, code = "AUDIT_HISTORY_INVALID_AUDIT_ID"): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AuditRunDataError(code, "Invalid audit run ID.");
    }
    return new mongoose.Types.ObjectId(id);
}

function toId(value: unknown): string | null {
    if (!value) return null;
    return String(value);
}

function toIds(values: unknown[] | undefined): string[] {
    return (values ?? []).map((value) => String(value));
}

function serializeAuditRun(doc: AuditRunDocument | Record<string, unknown>): SerializableAuditRun {
    const summary = (doc.summary ?? {}) as Record<string, unknown>;
    const pageSpeed = (summary.pageSpeed ?? {}) as Record<string, unknown>;

    return {
        id: String(doc._id),
        websiteId: String(doc.websiteId),
        auditNumber: Number(doc.auditNumber),
        status: doc.status as AuditRunStatus,
        isCurrent: Boolean(doc.isCurrent),
        isArchived: Boolean(doc.isArchived),
        trigger: {
            type: (doc.trigger as { type?: string })?.type as SerializableAuditRun["trigger"]["type"],
            actorId: (doc.trigger as { actorId?: string | null })?.actorId ?? null,
            actorName: (doc.trigger as { actorName?: string | null })?.actorName ?? null,
        },
        source: {
            websiteUrl: String((doc.source as { websiteUrl?: string })?.websiteUrl ?? ""),
            normalizedUrl: String((doc.source as { normalizedUrl?: string })?.normalizedUrl ?? ""),
            businessName: (doc.source as { businessName?: string | null })?.businessName ?? null,
            domain: (doc.source as { domain?: string | null })?.domain ?? null,
        },
        configuration: {
            crawlMaxPages:
                (doc.configuration as { crawlMaxPages?: number | null })?.crawlMaxPages ?? null,
            crawlMaxDepth:
                (doc.configuration as { crawlMaxDepth?: number | null })?.crawlMaxDepth ?? null,
            includeScreenshots: Boolean(
                (doc.configuration as { includeScreenshots?: boolean })?.includeScreenshots ?? true,
            ),
            includePageSpeed: Boolean(
                (doc.configuration as { includePageSpeed?: boolean })?.includePageSpeed ?? true,
            ),
            includeNiceGuyMetrics: Boolean(
                (doc.configuration as { includeNiceGuyMetrics?: boolean })?.includeNiceGuyMetrics ??
                    true,
            ),
            includeAiAnalysis: Boolean(
                (doc.configuration as { includeAiAnalysis?: boolean })?.includeAiAnalysis ?? true,
            ),
            generateReportDraft: Boolean(
                (doc.configuration as { generateReportDraft?: boolean })?.generateReportDraft ?? true,
            ),
            pageSpeedStrategies: ((doc.configuration as { pageSpeedStrategies?: string[] })
                ?.pageSpeedStrategies ?? ["mobile", "desktop"]) as Array<"mobile" | "desktop">,
            configurationVersion: String(
                (doc.configuration as { configurationVersion?: string })?.configurationVersion ??
                    "audit-config-v1",
            ),
        },
        versions: {
            auditSchemaVersion: String(
                (doc.versions as { auditSchemaVersion?: string })?.auditSchemaVersion ??
                    AUDIT_RUN_SCHEMA_VERSION,
            ),
            crawlerVersion: (doc.versions as { crawlerVersion?: string | null })?.crawlerVersion ?? null,
            screenshotVersion:
                (doc.versions as { screenshotVersion?: string | null })?.screenshotVersion ?? null,
            pageSpeedVersion:
                (doc.versions as { pageSpeedVersion?: string | null })?.pageSpeedVersion ?? null,
            metricsVersion: (doc.versions as { metricsVersion?: string | null })?.metricsVersion ?? null,
            aiPromptVersion:
                (doc.versions as { aiPromptVersion?: string | null })?.aiPromptVersion ?? null,
            aiSchemaVersion:
                (doc.versions as { aiSchemaVersion?: string | null })?.aiSchemaVersion ?? null,
        },
        references: {
            crawlDataIds: toIds((doc.references as { crawlDataIds?: unknown[] })?.crawlDataIds),
            screenshotIds: toIds((doc.references as { screenshotIds?: unknown[] })?.screenshotIds),
            googleMetricsIds: toIds(
                (doc.references as { googleMetricsIds?: unknown[] })?.googleMetricsIds,
            ),
            niceGuyMetricsId: toId(
                (doc.references as { niceGuyMetricsId?: unknown })?.niceGuyMetricsId,
            ),
            aiSummaryId: toId((doc.references as { aiSummaryId?: unknown })?.aiSummaryId),
            heroSuggestionIds: toIds(
                (doc.references as { heroSuggestionIds?: unknown[] })?.heroSuggestionIds,
            ),
            aiMetadataIds: toIds((doc.references as { aiMetadataIds?: unknown[] })?.aiMetadataIds),
            publicReportIds: toIds(
                (doc.references as { publicReportIds?: unknown[] })?.publicReportIds,
            ),
            pdfReportIds: toIds((doc.references as { pdfReportIds?: unknown[] })?.pdfReportIds),
            outreachDraftIds: toIds(
                (doc.references as { outreachDraftIds?: unknown[] })?.outreachDraftIds,
            ),
            demoProjectIds: toIds((doc.references as { demoProjectIds?: unknown[] })?.demoProjectIds),
        },
        summary: {
            pagesDiscovered: (summary.pagesDiscovered as number | null | undefined) ?? null,
            pagesCrawled: (summary.pagesCrawled as number | null | undefined) ?? null,
            screenshotsCaptured: (summary.screenshotsCaptured as number | null | undefined) ?? null,
            overallScore: (summary.overallScore as number | null | undefined) ?? null,
            categoryScores: Array.isArray(summary.categoryScores)
                ? (summary.categoryScores as Array<{ category: string; score: number }>)
                : [],
            pageSpeed: {
                mobile: (pageSpeed.mobile as SerializableAuditRun["summary"]["pageSpeed"]["mobile"]) ?? null,
                desktop:
                    (pageSpeed.desktop as SerializableAuditRun["summary"]["pageSpeed"]["desktop"]) ??
                    null,
            },
            strengthCount: (summary.strengthCount as number | null | undefined) ?? null,
            weaknessCount: (summary.weaknessCount as number | null | undefined) ?? null,
            recommendationCount: (summary.recommendationCount as number | null | undefined) ?? null,
            errorCount: Number(summary.errorCount ?? 0),
            warningCount: Number(summary.warningCount ?? 0),
        },
        completion: {
            crawl: ((doc.completion as { crawl?: string })?.crawl ?? "not-started") as AuditStageCompletion,
            screenshots: ((doc.completion as { screenshots?: string })?.screenshots ??
                "not-started") as AuditStageCompletion,
            pageSpeed: ((doc.completion as { pageSpeed?: string })?.pageSpeed ??
                "not-started") as AuditStageCompletion,
            metrics: ((doc.completion as { metrics?: string })?.metrics ??
                "not-started") as AuditStageCompletion,
            ai: ((doc.completion as { ai?: string })?.ai ?? "not-started") as AuditStageCompletion,
        },
        failure: doc.failure
            ? {
                  stage: (doc.failure as { stage?: string | null }).stage ?? null,
                  errorCode: (doc.failure as { errorCode?: string | null }).errorCode ?? null,
                  errorMessage: (doc.failure as { errorMessage?: string | null }).errorMessage ?? null,
              }
            : null,
        startedAt: doc.startedAt ? new Date(doc.startedAt as Date).toISOString() : null,
        completedAt: doc.completedAt ? new Date(doc.completedAt as Date).toISOString() : null,
        archivedAt: doc.archivedAt ? new Date(doc.archivedAt as Date).toISOString() : null,
        createdAt: new Date(doc.createdAt as Date).toISOString(),
        updatedAt: new Date(doc.updatedAt as Date).toISOString(),
    };
}

function toListItem(run: SerializableAuditRun): AuditRunListItem {
    return {
        id: run.id,
        websiteId: run.websiteId,
        auditNumber: run.auditNumber,
        status: run.status,
        isCurrent: run.isCurrent,
        isArchived: run.isArchived,
        summary: run.summary,
        completion: run.completion,
        startedAt: run.startedAt,
        completedAt: run.completedAt,
        createdAt: run.createdAt,
    };
}

const RESOURCE_FIELD_MAP = {
    "crawl-data": "references.crawlDataIds",
    screenshot: "references.screenshotIds",
    "google-metrics": "references.googleMetricsIds",
    "niceguy-metrics": "references.niceGuyMetricsId",
    "ai-summary": "references.aiSummaryId",
    "hero-suggestion": "references.heroSuggestionIds",
    "ai-metadata": "references.aiMetadataIds",
    "public-report": "references.publicReportIds",
    "pdf-report": "references.pdfReportIds",
    "outreach-draft": "references.outreachDraftIds",
    "demo-project": "references.demoProjectIds",
} as const;

export type AuditResourceType = keyof typeof RESOURCE_FIELD_MAP;

export async function reserveNextAuditNumber(websiteId: string): Promise<number> {
    await connectToDatabase();
    const objectId = assertObjectId(websiteId, "AUDIT_HISTORY_INVALID_WEBSITE_ID");
    const website = await Website.findOneAndUpdate(
        { _id: objectId },
        { $inc: { nextAuditNumber: 1 } },
        { new: false, select: "nextAuditNumber" },
    ).lean();

    if (!website) {
        throw new AuditRunDataError("AUDIT_HISTORY_WEBSITE_NOT_FOUND", "Website not found.");
    }

    return Number(website.nextAuditNumber ?? 1);
}

export async function createAuditRunRecord(input: {
    websiteId: string;
    auditNumber: number;
    trigger?: SerializableAuditRun["trigger"];
    source: SerializableAuditRun["source"];
    configuration: SerializableAuditRun["configuration"];
    versions?: Partial<SerializableAuditRun["versions"]>;
    status?: AuditRunStatus;
    migrationWarning?: string | null;
}): Promise<SerializableAuditRun> {
    await connectToDatabase();
    const websiteObjectId = assertObjectId(input.websiteId, "AUDIT_HISTORY_INVALID_WEBSITE_ID");

    const created = await AuditRun.create({
        websiteId: websiteObjectId,
        auditNumber: input.auditNumber,
        status: input.status ?? "queued",
        trigger: input.trigger ?? { type: "administrator", actorId: null, actorName: null },
        source: input.source,
        configuration: input.configuration,
        versions: {
            auditSchemaVersion: AUDIT_RUN_SCHEMA_VERSION,
            ...input.versions,
        },
        migrationWarning: input.migrationWarning ?? null,
    });

    return serializeAuditRun(created);
}

export async function getAuditRunById(auditRunId: string): Promise<SerializableAuditRun | null> {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(auditRunId)) {
        return null;
    }
    const doc = await AuditRun.findById(auditRunId).lean();
    return doc ? serializeAuditRun(doc) : null;
}

export async function hasActiveAuditRunForWebsite(websiteId: string): Promise<boolean> {
    await connectToDatabase();
    const objectId = assertObjectId(websiteId, "AUDIT_HISTORY_INVALID_WEBSITE_ID");
    const existing = await AuditRun.findOne({
        websiteId: objectId,
        status: { $in: ACTIVE_AUDIT_RUN_STATUSES },
        isArchived: false,
    })
        .select("_id")
        .lean();
    return Boolean(existing);
}

export async function getOpenAuditRunForWebsite(
    websiteId: string,
): Promise<SerializableAuditRun | null> {
    await connectToDatabase();
    const objectId = assertObjectId(websiteId, "AUDIT_HISTORY_INVALID_WEBSITE_ID");
    const doc = await AuditRun.findOne({
        websiteId: objectId,
        status: { $nin: [...FINAL_AUDIT_RUN_STATUSES, "archived"] },
        isArchived: false,
    })
        .sort({ createdAt: -1 })
        .lean();
    return doc ? serializeAuditRun(doc) : null;
}

export async function getCurrentAuditRunForWebsite(
    websiteId: string,
): Promise<SerializableAuditRun | null> {
    await connectToDatabase();
    const objectId = assertObjectId(websiteId, "AUDIT_HISTORY_INVALID_WEBSITE_ID");
    const doc = await AuditRun.findOne({
        websiteId: objectId,
        isCurrent: true,
        isArchived: false,
    }).lean();
    return doc ? serializeAuditRun(doc) : null;
}

export async function getLatestCompletedAuditRunForWebsite(
    websiteId: string,
): Promise<SerializableAuditRun | null> {
    await connectToDatabase();
    const objectId = assertObjectId(websiteId, "AUDIT_HISTORY_INVALID_WEBSITE_ID");
    const doc = await AuditRun.findOne({
        websiteId: objectId,
        status: { $in: CURRENT_ELIGIBLE_AUDIT_STATUSES },
        isArchived: false,
    })
        .sort({ completedAt: -1, createdAt: -1, _id: -1 })
        .lean();
    return doc ? serializeAuditRun(doc) : null;
}

export async function getAuditRunsForWebsite(input: {
    websiteId: string;
    limit?: number;
    before?: { completedAt?: Date; id?: string } | null;
    statuses?: string[];
    includeArchived?: boolean;
}): Promise<{ items: AuditRunListItem[]; hasMore: boolean; nextCursor: string | null }> {
    await connectToDatabase();
    const objectId = assertObjectId(input.websiteId, "AUDIT_HISTORY_INVALID_WEBSITE_ID");
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);

    const filter: Record<string, unknown> = { websiteId: objectId };
    if (!input.includeArchived) {
        filter.isArchived = false;
    }
    if (input.statuses?.length) {
        filter.status = { $in: input.statuses };
    }
    if (input.before?.id && mongoose.Types.ObjectId.isValid(input.before.id)) {
        const beforeDoc = await AuditRun.findById(input.before.id).select("completedAt createdAt").lean();
        if (beforeDoc) {
            const completedAt = beforeDoc.completedAt ?? null;
            const createdAt = beforeDoc.createdAt;
            filter.$or = [
                { completedAt: { $lt: completedAt } },
                { completedAt, createdAt: { $lt: createdAt } },
                { completedAt: null, createdAt: { $lt: createdAt } },
            ];
        }
    }

    const docs = await AuditRun.find(filter)
        .sort({ completedAt: -1, createdAt: -1, _id: -1 })
        .limit(limit + 1)
        .lean();

    const hasMore = docs.length > limit;
    const page = hasMore ? docs.slice(0, limit) : docs;
    const items = page.map((doc) => toListItem(serializeAuditRun(doc)));
    const last = items[items.length - 1];

    return {
        items,
        hasMore,
        nextCursor: hasMore && last ? last.id : null,
    };
}

export async function getAuditRunsForComparison(input: {
    websiteId: string;
    auditRunIds: string[];
}): Promise<SerializableAuditRun[]> {
    await connectToDatabase();
    const objectId = assertObjectId(input.websiteId, "AUDIT_HISTORY_INVALID_WEBSITE_ID");
    const ids = input.auditRunIds.map((id) => assertObjectId(id));
    const docs = await AuditRun.find({
        _id: { $in: ids },
        websiteId: objectId,
    }).lean();
    const byId = new Map(docs.map((doc) => [String(doc._id), serializeAuditRun(doc)]));
    return input.auditRunIds
        .map((id) => byId.get(id))
        .filter((run): run is SerializableAuditRun => Boolean(run));
}

export async function updateAuditRunStatus(
    auditRunId: string,
    status: AuditRunStatus,
    extra?: {
        startedAt?: Date | null;
        failure?: { stage?: string | null; errorCode?: string | null; errorMessage?: string | null };
    },
): Promise<SerializableAuditRun | null> {
    await connectToDatabase();
    const objectId = assertObjectId(auditRunId);
    const update: Record<string, unknown> = { status };
    if (extra?.startedAt !== undefined) update.startedAt = extra.startedAt;
    if (extra?.failure !== undefined) update.failure = extra.failure;

    const doc = await AuditRun.findByIdAndUpdate(objectId, { $set: update }, { new: true }).lean();
    return doc ? serializeAuditRun(doc) : null;
}

export async function updateAuditRunCompletion(
    auditRunId: string,
    completion: Partial<SerializableAuditRun["completion"]>,
    status?: AuditRunStatus,
): Promise<SerializableAuditRun | null> {
    await connectToDatabase();
    const objectId = assertObjectId(auditRunId);
    const setFields: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(completion)) {
        setFields[`completion.${key}`] = value;
    }
    if (status) setFields.status = status;

    const doc = await AuditRun.findByIdAndUpdate(objectId, { $set: setFields }, { new: true }).lean();
    return doc ? serializeAuditRun(doc) : null;
}

export async function registerAuditRunReference(input: {
    auditRunId: string;
    resourceType: AuditResourceType;
    resourceId: string;
    websiteId: string;
}): Promise<void> {
    await connectToDatabase();
    const auditObjectId = assertObjectId(input.auditRunId);
    const resourceObjectId = assertObjectId(input.resourceId, "AUDIT_HISTORY_INVALID_REFERENCE");
    const websiteObjectId = assertObjectId(input.websiteId, "AUDIT_HISTORY_INVALID_WEBSITE_ID");

    const auditRun = await AuditRun.findById(auditObjectId).select("websiteId status references").lean();
    if (!auditRun) {
        throw new AuditRunDataError("AUDIT_HISTORY_AUDIT_NOT_FOUND", "Audit run not found.");
    }
    if (String(auditRun.websiteId) !== String(websiteObjectId)) {
        throw new AuditRunDataError(
            "AUDIT_HISTORY_REFERENCE_MISMATCH",
            "Resource does not belong to this website.",
        );
    }

    const field = RESOURCE_FIELD_MAP[input.resourceType];
    if (input.resourceType === "niceguy-metrics" || input.resourceType === "ai-summary") {
        await AuditRun.findByIdAndUpdate(auditObjectId, {
            $set: { [field]: resourceObjectId },
        });
        return;
    }

    await AuditRun.findByIdAndUpdate(auditObjectId, {
        $addToSet: { [field]: resourceObjectId },
    });
}

export async function finalizeAuditRunRecord(input: {
    auditRunId: string;
    status: AuditRunStatus;
    summary: SerializableAuditRun["summary"];
    completedAt: Date;
    makeCurrent: boolean;
}): Promise<SerializableAuditRun | null> {
    await connectToDatabase();
    const auditObjectId = assertObjectId(input.auditRunId);
    const auditRun = await AuditRun.findById(auditObjectId).lean();
    if (!auditRun) return null;

    const websiteObjectId = auditRun.websiteId;

    if (input.makeCurrent) {
        await AuditRun.updateMany(
            { websiteId: websiteObjectId, isCurrent: true },
            { $set: { isCurrent: false } },
        );
    }

    const doc = await AuditRun.findByIdAndUpdate(
        auditObjectId,
        {
            $set: {
                status: input.status,
                summary: input.summary,
                completedAt: input.completedAt,
                isCurrent: input.makeCurrent,
            },
        },
        { new: true },
    ).lean();

    if (!doc) return null;

    const websiteUpdate: Record<string, unknown> = {
        $inc: { auditCount: 0 },
    };
    if (input.makeCurrent) {
        websiteUpdate.$set = {
            currentAuditRunId: auditObjectId,
            latestCompletedAuditRunId: auditObjectId,
        };
    } else if (CURRENT_ELIGIBLE_AUDIT_STATUSES.includes(input.status as (typeof CURRENT_ELIGIBLE_AUDIT_STATUSES)[number])) {
        websiteUpdate.$set = { latestCompletedAuditRunId: auditObjectId };
    }

    if (input.makeCurrent || CURRENT_ELIGIBLE_AUDIT_STATUSES.includes(input.status as (typeof CURRENT_ELIGIBLE_AUDIT_STATUSES)[number])) {
        await Website.findByIdAndUpdate(websiteObjectId, {
            ...(input.makeCurrent
                ? {
                      $set: {
                          currentAuditRunId: auditObjectId,
                          latestCompletedAuditRunId: auditObjectId,
                      },
                  }
                : {
                      $set: { latestCompletedAuditRunId: auditObjectId },
                  }),
            $inc: { auditCount: 1 },
        });
    }

    return serializeAuditRun(doc);
}

export async function archiveAuditRun(auditRunId: string): Promise<SerializableAuditRun | null> {
    await connectToDatabase();
    const objectId = assertObjectId(auditRunId);
    const auditRun = await AuditRun.findById(objectId).lean();
    if (!auditRun) return null;
    if (!CURRENT_ELIGIBLE_AUDIT_STATUSES.includes(auditRun.status as (typeof CURRENT_ELIGIBLE_AUDIT_STATUSES)[number]) && auditRun.status !== "failed") {
        throw new AuditRunDataError(
            "AUDIT_HISTORY_NOT_ARCHIVABLE",
            "Only completed, partial, or failed audits can be archived.",
        );
    }

    const doc = await AuditRun.findByIdAndUpdate(
        objectId,
        {
            $set: {
                isArchived: true,
                archivedAt: new Date(),
                isCurrent: false,
            },
        },
        { new: true },
    ).lean();

    if (doc?.isCurrent) {
        await Website.findByIdAndUpdate(doc.websiteId, { $set: { currentAuditRunId: null } });
    }

    return doc ? serializeAuditRun(doc) : null;
}

export async function restoreAuditRun(auditRunId: string): Promise<SerializableAuditRun | null> {
    await connectToDatabase();
    const objectId = assertObjectId(auditRunId);
    const auditRun = await AuditRun.findById(objectId).lean();
    if (!auditRun?.isArchived) {
        throw new AuditRunDataError("AUDIT_HISTORY_NOT_RESTORABLE", "Audit run is not archived.");
    }

    const doc = await AuditRun.findByIdAndUpdate(
        objectId,
        { $set: { isArchived: false, archivedAt: null } },
        { new: true },
    ).lean();
    return doc ? serializeAuditRun(doc) : null;
}

export async function getAuditRunCountsForWebsite(websiteId: string): Promise<{
    total: number;
    archived: number;
    current: SerializableAuditRun | null;
    latestCompleted: SerializableAuditRun | null;
}> {
    await connectToDatabase();
    const objectId = assertObjectId(websiteId, "AUDIT_HISTORY_INVALID_WEBSITE_ID");
    const [total, archived, current, latestCompleted] = await Promise.all([
        AuditRun.countDocuments({ websiteId: objectId }),
        AuditRun.countDocuments({ websiteId: objectId, isArchived: true }),
        getCurrentAuditRunForWebsite(websiteId),
        getLatestCompletedAuditRunForWebsite(websiteId),
    ]);
    return { total, archived, current, latestCompleted };
}

export async function saveAuditRunSummary(
    auditRunId: string,
    summary: SerializableAuditRun["summary"],
): Promise<SerializableAuditRun | null> {
    await connectToDatabase();
    const objectId = assertObjectId(auditRunId);
    const doc = await AuditRun.findByIdAndUpdate(
        objectId,
        { $set: { summary } },
        { new: true },
    ).lean();
    return doc ? serializeAuditRun(doc) : null;
}
