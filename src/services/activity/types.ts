import type { ActivityLogType } from "@/src/schemas/enums";
import { ACTIVITY_LOG_TYPE_LABELS } from "@/src/schemas/enums";
import {
    getActivityCategoryForEvent,
    getActivitySeverityForEvent,
    type ActivityActorType,
    type ActivityCategory,
    type ActivityEventType,
    type ActivitySeverity,
} from "@/src/constants/activity-events";

export type ActivityActor = {
    type: ActivityActorType;
    id: string | null;
    name: string | null;
};

export type SerializableActivityItem = {
    id: string;
    websiteId: string;
    eventType: ActivityLogType;
    category: ActivityCategory;
    severity: ActivitySeverity;
    status: string | null;
    title: string;
    description: string;
    actor: ActivityActor;
    source: {
        service: string | null;
        route: string | null;
        provider: string | null;
        version: string | null;
    };
    auditRunId: string | null;
    crawlDataId: string | null;
    screenshotId: string | null;
    googleMetricsId: string | null;
    niceGuyMetricsId: string | null;
    aiSummaryId: string | null;
    publicReportId: string | null;
    pdfReportId: string | null;
    outreachDraftId: string | null;
    demoProjectId: string | null;
    demoGenerationId: string | null;
    metadata?: Record<string, unknown>;
    occurredAt: string;
    createdAt: string;
    updatedAt: string;
    archivedAt: string | null;
    isEditableNote: boolean;
};

/** @deprecated Use SerializableActivityItem fields directly. */
export type SerializableActivityLog = SerializableActivityItem & {
    type: ActivityLogType;
    crawlId: string | null;
};

export function normalizeActorValue(actor: unknown): ActivityActor {
    if (typeof actor === "string") {
        return {
            type: actor === "admin" ? "administrator" : (actor as ActivityActorType),
            id: null,
            name: null,
        };
    }

    if (actor && typeof actor === "object") {
        const record = actor as Record<string, unknown>;
        const typeValue = String(record.type ?? "system");
        return {
            type:
                typeValue === "admin"
                    ? "administrator"
                    : (typeValue as ActivityActorType),
            id: record.id ? String(record.id) : null,
            name: record.name ? String(record.name) : null,
        };
    }

    return { type: "system", id: null, name: null };
}

export function normalizeActivityDocument(
    doc: Record<string, unknown>,
): SerializableActivityItem {
    const eventType = String(doc.type ?? doc.eventType ?? "website-created") as ActivityLogType;
    const title =
        typeof doc.title === "string" && doc.title.trim()
            ? doc.title.trim()
            : (ACTIVITY_LOG_TYPE_LABELS[eventType] ?? eventType);
    const category = (doc.category as ActivityCategory) ?? getActivityCategoryForEvent(eventType);
    const severity =
        (doc.severity as ActivitySeverity) ?? getActivitySeverityForEvent(eventType);
    const source = (doc.source as Record<string, unknown> | undefined) ?? {};

    return {
        id: String(doc._id),
        websiteId: String(doc.websiteId),
        eventType,
        category,
        severity,
        status: doc.status ? String(doc.status) : null,
        title,
        description: typeof doc.description === "string" ? doc.description : "",
        actor: normalizeActorValue(doc.actor),
        source: {
            service: source.service ? String(source.service) : null,
            route: source.route ? String(source.route) : null,
            provider: source.provider ? String(source.provider) : null,
            version: source.version ? String(source.version) : null,
        },
        auditRunId: doc.auditRunId ? String(doc.auditRunId) : null,
        crawlDataId: doc.crawlDataId
            ? String(doc.crawlDataId)
            : doc.crawlId
              ? String(doc.crawlId)
              : null,
        screenshotId: doc.screenshotId ? String(doc.screenshotId) : null,
        googleMetricsId: doc.googleMetricsId ? String(doc.googleMetricsId) : null,
        niceGuyMetricsId: doc.niceGuyMetricsId ? String(doc.niceGuyMetricsId) : null,
        aiSummaryId: doc.aiSummaryId ? String(doc.aiSummaryId) : null,
        publicReportId: doc.publicReportId ? String(doc.publicReportId) : null,
        pdfReportId: doc.pdfReportId ? String(doc.pdfReportId) : null,
        outreachDraftId: doc.outreachDraftId ? String(doc.outreachDraftId) : null,
        demoProjectId: doc.demoProjectId ? String(doc.demoProjectId) : null,
        demoGenerationId: doc.demoGenerationId ? String(doc.demoGenerationId) : null,
        metadata:
            doc.metadata && typeof doc.metadata === "object"
                ? (doc.metadata as Record<string, unknown>)
                : undefined,
        occurredAt: new Date(
            (doc.occurredAt as Date | string | undefined) ??
                (doc.createdAt as Date | string),
        ).toISOString(),
        createdAt: new Date(doc.createdAt as Date | string).toISOString(),
        updatedAt: new Date(
            (doc.updatedAt as Date | string | undefined) ??
                (doc.createdAt as Date | string),
        ).toISOString(),
        archivedAt: doc.archivedAt ? new Date(doc.archivedAt as Date).toISOString() : null,
        isEditableNote:
            eventType === "administrator-note-added" ||
            eventType === "administrator-note-updated",
    };
}

export function toLegacySerializableActivityLog(
    item: SerializableActivityItem,
): SerializableActivityLog {
    return {
        ...item,
        type: item.eventType,
        crawlId: item.crawlDataId,
    };
}

export type CreateActivityEventInput = {
    websiteId: string;
    eventType: ActivityEventType;
    category?: ActivityCategory;
    severity?: ActivitySeverity;
    title?: string;
    description?: string | null;
    auditRunId?: string | null;
    crawlDataId?: string | null;
    crawlId?: string | null;
    screenshotId?: string | null;
    googleMetricsId?: string | null;
    niceGuyMetricsId?: string | null;
    aiSummaryId?: string | null;
    publicReportId?: string | null;
    pdfReportId?: string | null;
    outreachDraftId?: string | null;
    demoProjectId?: string | null;
    demoGenerationId?: string | null;
    status?: string | null;
    metadata?: Record<string, unknown>;
    actor?: {
        type?: ActivityActorType;
        id?: string | null;
        name?: string | null;
    };
    source?: {
        service?: string | null;
        route?: string | null;
        provider?: string | null;
        version?: string | null;
    };
    occurredAt?: Date;
};
