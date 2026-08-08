import "server-only";

import mongoose from "mongoose";
import type {
    GoogleMetricStatus,
    PageSpeedStrategy,
} from "@/src/schemas/enums";
import { connectToDatabase } from "@/src/lib/mongodb";
import { GoogleMetric } from "@/src/models/GoogleMetric";
import type { NormalizedPageSpeedResult } from "@/src/types/pagespeed";

export type SerializableGoogleMetric = {
    id: string;
    websiteId: string;
    crawlId: string;
    strategy: PageSpeedStrategy;
    status: GoogleMetricStatus;
    requestedUrl: string;
    finalUrl: string | null;
    fetchTime: string | null;
    lighthouseVersion: string | null;
    userAgent: string | null;
    scores: NormalizedPageSpeedResult["scores"];
    labMetrics: NormalizedPageSpeedResult["labMetrics"];
    fieldData: NormalizedPageSpeedResult["fieldData"];
    coreWebVitals: NormalizedPageSpeedResult["coreWebVitals"];
    opportunities: NormalizedPageSpeedResult["opportunities"];
    diagnostics: NormalizedPageSpeedResult["diagnostics"];
    failedAudits: NormalizedPageSpeedResult["failedAudits"];
    passedAuditCount: number;
    failedAuditCount: number;
    notApplicableAuditCount: number;
    apiMetadata: {
        responseId: string | null;
        analysisUTCTimestamp: string | null;
    };
    durationMs: number | null;
    errorCode: string | null;
    errorMessage: string | null;
    createdAt: string;
    updatedAt: string;
};

function assertObjectId(id: string, message = "Invalid ID."): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(message);
    }
    return new mongoose.Types.ObjectId(id);
}

function toSerializable(doc: Record<string, unknown>): SerializableGoogleMetric {
    const apiMetadata = (doc.apiMetadata as Record<string, unknown>) ?? {};
    return {
        id: String(doc._id),
        websiteId: String(doc.websiteId),
        crawlId: String(doc.crawlId),
        strategy: doc.strategy as PageSpeedStrategy,
        status: doc.status as GoogleMetricStatus,
        requestedUrl: String(doc.requestedUrl ?? ""),
        finalUrl: doc.finalUrl ? String(doc.finalUrl) : null,
        fetchTime: doc.fetchTime ? new Date(doc.fetchTime as Date).toISOString() : null,
        lighthouseVersion: doc.lighthouseVersion ? String(doc.lighthouseVersion) : null,
        userAgent: doc.userAgent ? String(doc.userAgent) : null,
        scores: (doc.scores as SerializableGoogleMetric["scores"]) ?? {},
        labMetrics: (doc.labMetrics as SerializableGoogleMetric["labMetrics"]) ?? {},
        fieldData: (doc.fieldData as SerializableGoogleMetric["fieldData"]) ?? {
            available: false,
        },
        coreWebVitals:
            (doc.coreWebVitals as SerializableGoogleMetric["coreWebVitals"]) ?? {},
        opportunities: (doc.opportunities as SerializableGoogleMetric["opportunities"]) ?? [],
        diagnostics: (doc.diagnostics as SerializableGoogleMetric["diagnostics"]) ?? [],
        failedAudits: (doc.failedAudits as SerializableGoogleMetric["failedAudits"]) ?? [],
        passedAuditCount: Number(doc.passedAuditCount ?? 0),
        failedAuditCount: Number(doc.failedAuditCount ?? 0),
        notApplicableAuditCount: Number(doc.notApplicableAuditCount ?? 0),
        apiMetadata: {
            responseId: apiMetadata.responseId ? String(apiMetadata.responseId) : null,
            analysisUTCTimestamp: apiMetadata.analysisUTCTimestamp
                ? new Date(apiMetadata.analysisUTCTimestamp as Date).toISOString()
                : null,
        },
        durationMs: doc.durationMs !== null && doc.durationMs !== undefined
            ? Number(doc.durationMs)
            : null,
        errorCode: doc.errorCode ? String(doc.errorCode) : null,
        errorMessage: doc.errorMessage ? String(doc.errorMessage) : null,
        createdAt: new Date(doc.createdAt as Date).toISOString(),
        updatedAt: new Date(doc.updatedAt as Date).toISOString(),
    };
}

export async function hasActivePageSpeedRun(
    websiteId: string,
    crawlId?: string,
): Promise<boolean> {
    await connectToDatabase();
    const websiteObjectId = assertObjectId(websiteId);

    const query: Record<string, unknown> = {
        websiteId: websiteObjectId,
        status: { $in: ["queued", "processing"] },
    };
    if (crawlId) {
        query.crawlId = assertObjectId(crawlId);
    }

    const existing = await GoogleMetric.findOne(query).select("_id").lean();
    return Boolean(existing);
}

export async function createGoogleMetricRecord(input: {
    websiteId: string;
    crawlId: string;
    auditRunId?: string | null;
    strategy: PageSpeedStrategy;
    requestedUrl: string;
    status?: GoogleMetricStatus;
    idempotencyKey?: string;
}): Promise<SerializableGoogleMetric> {
    await connectToDatabase();

    const websiteObjectId = assertObjectId(input.websiteId);
    const crawlObjectId = assertObjectId(input.crawlId);
    const idempotencyKey =
        input.idempotencyKey ??
        `pagespeed:${input.websiteId}:${input.crawlId}:${input.strategy}`;

    const { acquireOrReuseActiveJob } = await import("@/src/services/audit-jobs/stage-job");
    const result = await acquireOrReuseActiveJob({
        idempotencyKey,
        findActive: async () =>
            GoogleMetric.findOne({
                websiteId: websiteObjectId,
                crawlId: crawlObjectId,
                strategy: input.strategy,
                status: { $in: ["queued", "processing"] },
            }).lean(),
        createDocument: async () => {
            const created = await GoogleMetric.create({
                websiteId: websiteObjectId,
                crawlId: crawlObjectId,
                auditRunId: input.auditRunId ? assertObjectId(input.auditRunId) : null,
                strategy: input.strategy,
                status: input.status ?? "queued",
                idempotencyKey,
                attempt: 1,
                requestedUrl: input.requestedUrl,
                scores: {},
                fieldData: { available: false },
                opportunities: [],
                diagnostics: [],
                failedAudits: [],
                passedAuditCount: 0,
                failedAuditCount: 0,
                notApplicableAuditCount: 0,
                apiMetadata: {},
            });
            return created.toObject() as { _id: unknown };
        },
        serialize: (doc) => ({ id: String(doc._id) }),
    });

    const record = await getGoogleMetricById(result.record.id);
    if (!record) {
        throw new Error("Google metric record not found.");
    }
    return record;
}

export async function getGoogleMetricById(
    id: string,
): Promise<SerializableGoogleMetric | null> {
    await connectToDatabase();
    let objectId: mongoose.Types.ObjectId;
    try {
        objectId = assertObjectId(id);
    } catch {
        return null;
    }

    const doc = await GoogleMetric.findById(objectId).lean();
    if (!doc) return null;
    return toSerializable(doc as Record<string, unknown>);
}

export async function getGoogleMetricsForCrawl(
    crawlId: string,
): Promise<SerializableGoogleMetric[]> {
    await connectToDatabase();
    let objectId: mongoose.Types.ObjectId;
    try {
        objectId = assertObjectId(crawlId);
    } catch {
        return [];
    }

    const docs = await GoogleMetric.find({ crawlId: objectId })
        .sort({ createdAt: -1 })
        .lean();

    return docs.map((doc) => toSerializable(doc as Record<string, unknown>));
}

export async function getLatestGoogleMetricsForWebsite(
    websiteId: string,
): Promise<{ mobile: SerializableGoogleMetric | null; desktop: SerializableGoogleMetric | null }> {
    const [mobile, desktop] = await Promise.all([
        getLatestGoogleMetricByStrategy(websiteId, "mobile"),
        getLatestGoogleMetricByStrategy(websiteId, "desktop"),
    ]);
    return { mobile, desktop };
}

export async function getLatestGoogleMetricByStrategy(
    websiteId: string,
    strategy: PageSpeedStrategy,
): Promise<SerializableGoogleMetric | null> {
    await connectToDatabase();
    let objectId: mongoose.Types.ObjectId;
    try {
        objectId = assertObjectId(websiteId);
    } catch {
        return null;
    }

    const doc = await GoogleMetric.findOne({
        websiteId: objectId,
        strategy,
    })
        .sort({ createdAt: -1 })
        .lean();

    if (!doc) return null;
    return toSerializable(doc as Record<string, unknown>);
}

export async function updateGoogleMetricStatus(
    id: string,
    status: GoogleMetricStatus,
    extra: Partial<{
        startedAt: Date | null;
        heartbeatAt: Date | null;
        completedAt: Date | null;
        idempotencyKey: string | null;
    }> = {},
): Promise<SerializableGoogleMetric> {
    await connectToDatabase();
    const updated = await GoogleMetric.findByIdAndUpdate(
        assertObjectId(id),
        { $set: { status, ...extra } },
        { new: true, runValidators: true },
    ).lean();

    if (!updated) {
        throw new Error("Google metric record not found.");
    }

    return toSerializable(updated as Record<string, unknown>);
}

export async function completeGoogleMetricRecord(
    id: string,
    payload: NormalizedPageSpeedResult & { durationMs: number },
): Promise<SerializableGoogleMetric> {
    await connectToDatabase();

    const updated = await GoogleMetric.findByIdAndUpdate(
        assertObjectId(id),
        {
            $set: {
                status: "complete",
                completedAt: new Date(),
                heartbeatAt: new Date(),
                idempotencyKey: null,
                finalUrl: payload.finalUrl ?? "",
                fetchTime: payload.fetchTime,
                lighthouseVersion: payload.lighthouseVersion ?? "",
                userAgent: payload.userAgent ?? "",
                scores: payload.scores,
                labMetrics: payload.labMetrics,
                fieldData: payload.fieldData,
                coreWebVitals: payload.coreWebVitals,
                opportunities: payload.opportunities,
                diagnostics: payload.diagnostics,
                failedAudits: payload.failedAudits,
                passedAuditCount: payload.passedAuditCount,
                failedAuditCount: payload.failedAuditCount,
                notApplicableAuditCount: payload.notApplicableAuditCount,
                apiMetadata: payload.apiMetadata,
                durationMs: payload.durationMs,
                errorCode: "",
                errorMessage: "",
            },
        },
        { new: true, runValidators: true },
    ).lean();

    if (!updated) {
        throw new Error("Google metric record not found.");
    }

    return toSerializable(updated as Record<string, unknown>);
}

export async function failGoogleMetricRecord(
    id: string,
    input: {
        errorCode: string;
        errorMessage: string;
        durationMs?: number;
    },
): Promise<SerializableGoogleMetric> {
    await connectToDatabase();

    const updated = await GoogleMetric.findByIdAndUpdate(
        assertObjectId(id),
        {
            $set: {
                status: "failed",
                completedAt: new Date(),
                heartbeatAt: new Date(),
                idempotencyKey: null,
                errorCode: input.errorCode,
                errorMessage: input.errorMessage,
                durationMs: input.durationMs ?? null,
            },
        },
        { new: true, runValidators: true },
    ).lean();

    if (!updated) {
        throw new Error("Google metric record not found.");
    }

    return toSerializable(updated as Record<string, unknown>);
}

export async function getGoogleMetricsForWebsite(
    websiteId: string,
    limit = 10,
): Promise<
    Array<{
        id: string;
        status: string;
        label: string;
        createdAt: string;
        completedAt: string | null;
        durationMs: number | null;
        crawlId: string;
        version: string | null;
        score: number | null;
    }>
> {
    await connectToDatabase();
    try {
        const objectId = assertObjectId(websiteId);
        const docs = await GoogleMetric.find({ websiteId: objectId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        return docs.map((doc) => {
            const metric = toSerializable(doc as Record<string, unknown>);
            return {
                id: metric.id,
                status: metric.status,
                label: `PageSpeed ${metric.strategy}`,
                createdAt: metric.createdAt,
                completedAt: metric.fetchTime,
                durationMs: metric.durationMs,
                crawlId: metric.crawlId,
                version: metric.lighthouseVersion,
                score: metric.scores.performance ?? null,
            };
        });
    } catch {
        return [];
    }
}
