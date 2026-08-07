import "server-only";

import mongoose from "mongoose";
import {
    getActivityCategoryForEvent,
    getActivitySeverityForEvent,
} from "@/src/constants/activity-events";
import { connectToDatabase } from "@/src/lib/mongodb";
import { ActivityLog } from "@/src/models/ActivityLog";
import { ACTIVITY_LOG_TYPE_LABELS } from "@/src/schemas/enums";
import { sanitizeActivityMetadata } from "@/src/services/activity/sanitize-activity-metadata";
import {
    normalizeActivityDocument,
    normalizeActorValue,
    type CreateActivityEventInput,
    type SerializableActivityItem,
} from "@/src/services/activity/types";

function assertObjectId(id: string, message = "Invalid ID."): mongoose.Types.ObjectId | null {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }
    return new mongoose.Types.ObjectId(id);
}

function resolveTitle(eventType: string, title?: string): string {
    if (title?.trim()) return title.trim().slice(0, 200);
    return ACTIVITY_LOG_TYPE_LABELS[eventType as keyof typeof ACTIVITY_LOG_TYPE_LABELS] ?? eventType;
}

export async function createActivityEvent(
    input: CreateActivityEventInput,
): Promise<SerializableActivityItem | null> {
    const websiteObjectId = assertObjectId(input.websiteId);
    if (!websiteObjectId) {
        console.warn("Activity event skipped: invalid website ID.");
        return null;
    }

    try {
        await connectToDatabase();

        const eventType = input.eventType;
        const category = input.category ?? getActivityCategoryForEvent(eventType);
        const severity = input.severity ?? getActivitySeverityForEvent(eventType);
        const occurredAt = input.occurredAt ?? new Date();
        const actor = normalizeActorValue({
            type: input.actor?.type ?? "system",
            id: input.actor?.id ?? null,
            name: input.actor?.name ?? null,
        });
        const crawlDataId =
            input.crawlDataId ?? input.crawlId ?? null;

        const created = await ActivityLog.create({
            websiteId: websiteObjectId,
            auditRunId: input.auditRunId ? assertObjectId(input.auditRunId) : null,
            crawlId: crawlDataId ? assertObjectId(crawlDataId) : null,
            crawlDataId: crawlDataId ? assertObjectId(crawlDataId) : null,
            screenshotId: input.screenshotId ? assertObjectId(input.screenshotId) : null,
            googleMetricsId: input.googleMetricsId
                ? assertObjectId(input.googleMetricsId)
                : null,
            niceGuyMetricsId: input.niceGuyMetricsId
                ? assertObjectId(input.niceGuyMetricsId)
                : null,
            aiSummaryId: input.aiSummaryId ? assertObjectId(input.aiSummaryId) : null,
            publicReportId: input.publicReportId ? assertObjectId(input.publicReportId) : null,
            pdfReportId: input.pdfReportId ? assertObjectId(input.pdfReportId) : null,
            outreachDraftId: input.outreachDraftId
                ? assertObjectId(input.outreachDraftId)
                : null,
            demoProjectId: input.demoProjectId ? assertObjectId(input.demoProjectId) : null,
            demoGenerationId: input.demoGenerationId
                ? assertObjectId(input.demoGenerationId)
                : null,
            type: eventType,
            category,
            severity,
            status: input.status ?? null,
            title: resolveTitle(eventType, input.title),
            description: input.description?.trim() ?? "",
            metadata: sanitizeActivityMetadata(input.metadata),
            actor,
            source: {
                service: input.source?.service ?? null,
                route: input.source?.route ?? null,
                provider: input.source?.provider ?? null,
                version: input.source?.version ?? null,
            },
            occurredAt,
        });

        return normalizeActivityDocument(created.toObject() as Record<string, unknown>);
    } catch (error) {
        console.warn("Activity event save failed:", error);
        return null;
    }
}
