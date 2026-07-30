import "server-only";

import mongoose from "mongoose";
import type { NiceGuyMetricStatus } from "@/src/schemas/enums";
import { connectToDatabase } from "@/src/lib/mongodb";
import { NiceGuyMetric } from "@/src/models/NiceGuyMetric";
import type { NiceGuyScoreResult } from "@/src/services/niceguy-scoring/types";

export type SerializableNiceGuyMetric = {
    id: string;
    websiteId: string;
    crawlId: string;
    status: NiceGuyMetricStatus;
    scoringVersion: string;
    overallScore: number;
    categories: NiceGuyScoreResult["categories"];
    summary: NiceGuyScoreResult["summary"];
    generatedAt: string | null;
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

function toSerializable(doc: Record<string, unknown>): SerializableNiceGuyMetric {
    return {
        id: String(doc._id),
        websiteId: String(doc.websiteId),
        crawlId: String(doc.crawlId),
        status: doc.status as NiceGuyMetricStatus,
        scoringVersion: String(doc.scoringVersion ?? "niceguy-v1"),
        overallScore: Number(doc.overallScore ?? 0),
        categories: (doc.categories as SerializableNiceGuyMetric["categories"]) ?? {},
        summary: (doc.summary as SerializableNiceGuyMetric["summary"]) ?? {
            highPriorityIssueCount: 0,
            mediumPriorityIssueCount: 0,
            lowPriorityIssueCount: 0,
            checksPassed: 0,
            checksFailed: 0,
            checksUnavailable: 0,
        },
        generatedAt: doc.generatedAt ? new Date(doc.generatedAt as Date).toISOString() : null,
        durationMs: doc.durationMs != null ? Number(doc.durationMs) : null,
        errorCode: doc.errorCode ? String(doc.errorCode) : null,
        errorMessage: doc.errorMessage ? String(doc.errorMessage) : null,
        createdAt: new Date(doc.createdAt as Date).toISOString(),
        updatedAt: new Date(doc.updatedAt as Date).toISOString(),
    };
}

export async function createNiceGuyMetricRecord(input: {
    websiteId: string;
    crawlId: string;
    auditRunId?: string | null;
    scoringVersion: string;
    status?: NiceGuyMetricStatus;
}): Promise<SerializableNiceGuyMetric> {
    await connectToDatabase();

    const created = await NiceGuyMetric.create({
        websiteId: assertObjectId(input.websiteId),
        crawlId: assertObjectId(input.crawlId),
        auditRunId: input.auditRunId ? assertObjectId(input.auditRunId) : null,
        scoringVersion: input.scoringVersion,
        status: input.status ?? "queued",
    });

    return toSerializable(created.toObject() as Record<string, unknown>);
}

export async function getNiceGuyMetricById(
    id: string,
): Promise<SerializableNiceGuyMetric | null> {
    await connectToDatabase();
    try {
        const objectId = assertObjectId(id);
        const doc = await NiceGuyMetric.findById(objectId).lean();
        if (!doc) return null;
        return toSerializable(doc as Record<string, unknown>);
    } catch {
        return null;
    }
}

export async function getLatestNiceGuyMetricForWebsite(
    websiteId: string,
): Promise<SerializableNiceGuyMetric | null> {
    await connectToDatabase();
    try {
        const objectId = assertObjectId(websiteId);
        const doc = await NiceGuyMetric.findOne({
            websiteId: objectId,
            status: "complete",
        })
            .sort({ createdAt: -1 })
            .lean();
        if (!doc) return null;
        return toSerializable(doc as Record<string, unknown>);
    } catch {
        return null;
    }
}

export async function getNiceGuyMetricsForCrawl(
    crawlId: string,
): Promise<SerializableNiceGuyMetric[]> {
    await connectToDatabase();
    try {
        const objectId = assertObjectId(crawlId);
        const docs = await NiceGuyMetric.find({ crawlId: objectId })
            .sort({ createdAt: -1 })
            .lean();
        return docs.map((doc) => toSerializable(doc as Record<string, unknown>));
    } catch {
        return [];
    }
}

export async function updateNiceGuyMetricStatus(
    id: string,
    status: NiceGuyMetricStatus,
): Promise<SerializableNiceGuyMetric> {
    await connectToDatabase();
    const updated = await NiceGuyMetric.findByIdAndUpdate(
        assertObjectId(id),
        { $set: { status } },
        { new: true, runValidators: true },
    ).lean();

    if (!updated) {
        throw new Error("Nice Guy metric record not found.");
    }

    return toSerializable(updated as Record<string, unknown>);
}

export async function completeNiceGuyMetricRecord(
    id: string,
    payload: NiceGuyScoreResult & { durationMs: number },
): Promise<SerializableNiceGuyMetric> {
    await connectToDatabase();

    const updated = await NiceGuyMetric.findByIdAndUpdate(
        assertObjectId(id),
        {
            $set: {
                status: "complete",
                scoringVersion: payload.scoringVersion,
                overallScore: payload.overallScore,
                categories: payload.categories,
                summary: payload.summary,
                generatedAt: new Date(),
                durationMs: payload.durationMs,
                errorCode: "",
                errorMessage: "",
            },
        },
        { new: true, runValidators: true },
    ).lean();

    if (!updated) {
        throw new Error("Nice Guy metric record not found.");
    }

    return toSerializable(updated as Record<string, unknown>);
}

export async function failNiceGuyMetricRecord(
    id: string,
    input: {
        errorCode: string;
        errorMessage: string;
        durationMs?: number;
    },
): Promise<SerializableNiceGuyMetric> {
    await connectToDatabase();

    const updated = await NiceGuyMetric.findByIdAndUpdate(
        assertObjectId(id),
        {
            $set: {
                status: "failed",
                errorCode: input.errorCode,
                errorMessage: input.errorMessage,
                durationMs: input.durationMs ?? null,
            },
        },
        { new: true, runValidators: true },
    ).lean();

    if (!updated) {
        throw new Error("Nice Guy metric record not found.");
    }

    return toSerializable(updated as Record<string, unknown>);
}

export async function hasActiveNiceGuyRun(
    websiteId: string,
    crawlId: string,
): Promise<boolean> {
    await connectToDatabase();
    try {
        const count = await NiceGuyMetric.countDocuments({
            websiteId: assertObjectId(websiteId),
            crawlId: assertObjectId(crawlId),
            status: { $in: ["queued", "processing"] },
        });
        return count > 0;
    } catch {
        return false;
    }
}

export async function getNiceGuyMetricsForWebsite(
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
        version: string;
        score: number | null;
        confidence: number | null;
    }>
> {
    await connectToDatabase();
    try {
        const objectId = assertObjectId(websiteId);
        const docs = await NiceGuyMetric.find({ websiteId: objectId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        return docs.map((doc) => {
            const metric = toSerializable(doc as Record<string, unknown>);
            const confidence = Math.round(
                Object.values(metric.categories).reduce(
                    (sum, category) => sum + category.confidence,
                    0,
                ) / 7,
            );
            return {
                id: metric.id,
                status: metric.status,
                label: "Nice Guy Metrics",
                createdAt: metric.createdAt,
                completedAt: metric.generatedAt,
                durationMs: metric.durationMs,
                crawlId: metric.crawlId,
                version: metric.scoringVersion,
                score: metric.overallScore,
                confidence,
            };
        });
    } catch {
        return [];
    }
}

/** @deprecated Use `getLatestNiceGuyMetricForWebsite`. */
export async function getNiceguyMetricsByWebsiteId(
    websiteId: string,
): Promise<SerializableNiceGuyMetric | null> {
    return getLatestNiceGuyMetricForWebsite(websiteId);
}

/** @deprecated Use `createNiceGuyMetricRecord`. */
export async function createEmptyNiceguyMetrics(
    websiteId: string,
): Promise<SerializableNiceGuyMetric> {
    return createNiceGuyMetricRecord({
        websiteId,
        crawlId: "000000000000000000000000",
        scoringVersion: "niceguy-v1",
    });
}
