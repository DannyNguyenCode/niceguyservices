import "server-only";

import mongoose from "mongoose";
import type { ActivityLogActor, ActivityLogType } from "@/src/lib/activity-log";
import { connectToDatabase } from "@/src/lib/mongodb";
import { ActivityLog } from "@/src/models/ActivityLog";
import type { ActivityCategory, ActivitySeverity } from "@/src/constants/activity-events";
import { createActivityEvent } from "@/src/services/activity/create-activity-event";
import {
    normalizeActivityDocument,
    toLegacySerializableActivityLog,
    type CreateActivityEventInput,
    type SerializableActivityItem,
    type SerializableActivityLog,
} from "@/src/services/activity/types";

export type {
    SerializableActivityItem,
    SerializableActivityLog,
    CreateActivityEventInput,
};

export type CreateActivityLogInput = {
    websiteId: string;
    crawlId?: string | null;
    auditRunId?: string | null;
    type: ActivityLogType;
    description?: string;
    actor?: ActivityLogActor;
    metadata?: Record<string, unknown>;
    title?: string;
    category?: ActivityCategory;
    severity?: ActivitySeverity;
    publicReportId?: string | null;
    pdfReportId?: string | null;
    outreachDraftId?: string | null;
    demoProjectId?: string | null;
    demoGenerationId?: string | null;
    aiSummaryId?: string | null;
    screenshotId?: string | null;
    googleMetricsId?: string | null;
    niceGuyMetricsId?: string | null;
};

export type ActivityLogQueryResult = {
    items: SerializableActivityItem[];
    nextCursor: string | null;
    hasMore: boolean;
};

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

function assertObjectId(id: string): mongoose.Types.ObjectId | null {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return new mongoose.Types.ObjectId(id);
}

function clampLimit(limit?: number): number {
    if (!limit || Number.isNaN(limit)) return DEFAULT_LIMIT;
    return Math.min(Math.max(1, Math.floor(limit)), MAX_LIMIT);
}

function buildQuery(input: {
    websiteId: mongoose.Types.ObjectId;
    auditRunId?: string | null;
    before?: Date | null;
    categories?: ActivityCategory[];
    severities?: ActivitySeverity[];
    eventTypes?: string[];
    includeArchived?: boolean;
}) {
    const query: Record<string, unknown> = {
        websiteId: input.websiteId,
    };

    if (!input.includeArchived) {
        query.archivedAt = null;
    }

    if (input.auditRunId && mongoose.Types.ObjectId.isValid(input.auditRunId)) {
        query.auditRunId = new mongoose.Types.ObjectId(input.auditRunId);
    }

    if (input.before) {
        query.occurredAt = { $lt: input.before };
    }

    if (input.categories?.length) {
        query.category = { $in: input.categories };
    }

    if (input.severities?.length) {
        query.severity = { $in: input.severities };
    }

    if (input.eventTypes?.length) {
        query.type = { $in: input.eventTypes };
    }

    return query;
}

export async function getActivityLogForWebsite(input: {
    websiteId: string;
    auditRunId?: string | null;
    limit?: number;
    before?: Date | null;
    categories?: ActivityCategory[];
    severities?: ActivitySeverity[];
    eventTypes?: string[];
    includeArchived?: boolean;
}): Promise<ActivityLogQueryResult> {
    await connectToDatabase();
    const websiteObjectId = assertObjectId(input.websiteId);
    if (!websiteObjectId) {
        return { items: [], nextCursor: null, hasMore: false };
    }

    const limit = clampLimit(input.limit);
    const matchQuery = buildQuery({
        websiteId: websiteObjectId,
        auditRunId: input.auditRunId,
        before: input.before ?? null,
        categories: input.categories,
        severities: input.severities,
        eventTypes: input.eventTypes,
        includeArchived: input.includeArchived,
    });

    const docs = await ActivityLog.aggregate([
        { $match: matchQuery },
        {
            $addFields: {
                sortAt: { $ifNull: ["$occurredAt", "$createdAt"] },
            },
        },
        { $sort: { sortAt: -1, _id: -1 } },
        { $limit: limit + 1 },
    ]);

    const hasMore = docs.length > limit;
    const pageDocs = hasMore ? docs.slice(0, limit) : docs;
    const items = pageDocs.map((doc) =>
        normalizeActivityDocument(doc as Record<string, unknown>),
    );
    const last = items[items.length - 1];

    return {
        items,
        nextCursor: hasMore && last ? last.occurredAt : null,
        hasMore,
    };
}

export async function getActivityLogsForWebsite(
    websiteId: string,
    limit = DEFAULT_LIMIT,
): Promise<SerializableActivityLog[]> {
    const result = await getActivityLogForWebsite({ websiteId, limit });
    return result.items.map(toLegacySerializableActivityLog);
}

export async function getRecentActivityForWebsite(input: {
    websiteId: string;
    limit?: number;
}): Promise<SerializableActivityItem[]> {
    const result = await getActivityLogForWebsite({
        websiteId: input.websiteId,
        limit: input.limit ?? DEFAULT_LIMIT,
    });
    return result.items;
}

export async function getActivityCountsForWebsite(websiteId: string): Promise<{
    total: number;
    errors: number;
    warnings: number;
}> {
    await connectToDatabase();
    const websiteObjectId = assertObjectId(websiteId);
    if (!websiteObjectId) {
        return { total: 0, errors: 0, warnings: 0 };
    }

    const [total, errors, warnings] = await Promise.all([
        ActivityLog.countDocuments({ websiteId: websiteObjectId, archivedAt: null }),
        ActivityLog.countDocuments({
            websiteId: websiteObjectId,
            archivedAt: null,
            severity: "error",
        }),
        ActivityLog.countDocuments({
            websiteId: websiteObjectId,
            archivedAt: null,
            severity: "warning",
        }),
    ]);

    return { total, errors, warnings };
}

export async function getLatestActivityByCategory(input: {
    websiteId: string;
    category: ActivityCategory;
}): Promise<SerializableActivityItem | null> {
    const result = await getActivityLogForWebsite({
        websiteId: input.websiteId,
        limit: 1,
        categories: [input.category],
    });
    return result.items[0] ?? null;
}

export async function getActivityLogById(
    activityId: string,
): Promise<SerializableActivityItem | null> {
    if (!mongoose.Types.ObjectId.isValid(activityId)) return null;
    await connectToDatabase();
    const doc = await ActivityLog.findById(activityId).lean();
    return doc ? normalizeActivityDocument(doc as Record<string, unknown>) : null;
}

export async function createActivityLog(
    input: CreateActivityLogInput,
): Promise<SerializableActivityLog | null> {
    const created = await createActivityEvent({
        websiteId: input.websiteId,
        eventType: input.type,
        category: input.category,
        severity: input.severity,
        title: input.title,
        description: input.description,
        crawlDataId: input.crawlId,
        auditRunId: input.auditRunId,
        publicReportId: input.publicReportId,
        pdfReportId: input.pdfReportId,
        outreachDraftId: input.outreachDraftId,
        demoProjectId: input.demoProjectId,
        demoGenerationId: input.demoGenerationId,
        aiSummaryId: input.aiSummaryId,
        screenshotId: input.screenshotId,
        googleMetricsId: input.googleMetricsId,
        niceGuyMetricsId: input.niceGuyMetricsId,
        metadata: input.metadata,
        actor: {
            type: input.actor === "admin" ? "administrator" : "system",
        },
    });

    return created ? toLegacySerializableActivityLog(created) : null;
}

export async function updateAdministratorNote(
    activityId: string,
    input: { title: string; description: string },
): Promise<SerializableActivityItem | null> {
    if (!mongoose.Types.ObjectId.isValid(activityId)) return null;
    await connectToDatabase();

    const existing = await ActivityLog.findById(activityId).lean();
    if (!existing) return null;

    const eventType = String((existing as Record<string, unknown>).type);
    if (
        eventType !== "administrator-note-added" &&
        eventType !== "administrator-note-updated"
    ) {
        return null;
    }

    const doc = await ActivityLog.findByIdAndUpdate(
        activityId,
        {
            $set: {
                type: "administrator-note-updated",
                title: input.title,
                description: input.description,
            },
        },
        { new: true },
    ).lean();

    return doc ? normalizeActivityDocument(doc as Record<string, unknown>) : null;
}

export async function archiveAdministratorNote(
    activityId: string,
): Promise<SerializableActivityItem | null> {
    if (!mongoose.Types.ObjectId.isValid(activityId)) return null;
    await connectToDatabase();

    const existing = await ActivityLog.findById(activityId).lean();
    if (!existing) return null;

    const eventType = String((existing as Record<string, unknown>).type);
    if (
        eventType !== "administrator-note-added" &&
        eventType !== "administrator-note-updated"
    ) {
        return null;
    }

    const doc = await ActivityLog.findByIdAndUpdate(
        activityId,
        {
            $set: {
                type: "administrator-note-archived",
                archivedAt: new Date(),
            },
        },
        { new: true },
    ).lean();

    return doc ? normalizeActivityDocument(doc as Record<string, unknown>) : null;
}

export async function deleteActivityForWebsite(websiteId: string): Promise<number> {
    await connectToDatabase();
    const websiteObjectId = assertObjectId(websiteId);
    if (!websiteObjectId) return 0;
    const result = await ActivityLog.deleteMany({ websiteId: websiteObjectId });
    return result.deletedCount ?? 0;
}

/** @deprecated Use `createActivityLog`. */
export const createActivityLogEntry = createActivityLog;

/** @deprecated Use `getActivityLogsForWebsite`. */
export const getActivityLogsByWebsiteId = getActivityLogsForWebsite;
