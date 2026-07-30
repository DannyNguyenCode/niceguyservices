import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import {
    ACTIVITY_CATEGORIES,
    ACTIVITY_SEVERITIES,
    ACTIVITY_ACTOR_TYPES,
} from "@/src/constants/activity-events";
import { ACTIVITY_LOG_TYPES } from "@/src/lib/activity-log";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import {
    indexWebsiteForeignKeyActivityLog,
    websiteForeignKey,
} from "@/src/lib/mongoose-fields";

const ActivityLogSchema = new Schema(
    {
        websiteId: websiteForeignKey,
        auditRunId: { type: Schema.Types.ObjectId, default: null },
        crawlId: { type: Schema.Types.ObjectId, ref: "CrawlData", default: null },
        crawlDataId: { type: Schema.Types.ObjectId, ref: "CrawlData", default: null },
        screenshotId: { type: Schema.Types.ObjectId, default: null },
        googleMetricsId: { type: Schema.Types.ObjectId, default: null },
        niceGuyMetricsId: { type: Schema.Types.ObjectId, default: null },
        aiSummaryId: { type: Schema.Types.ObjectId, default: null },
        publicReportId: { type: Schema.Types.ObjectId, default: null },
        pdfReportId: { type: Schema.Types.ObjectId, default: null },
        outreachDraftId: { type: Schema.Types.ObjectId, default: null },
        demoProjectId: { type: Schema.Types.ObjectId, default: null },
        demoGenerationId: { type: Schema.Types.ObjectId, default: null },
        type: {
            type: String,
            required: true,
            enum: ACTIVITY_LOG_TYPES,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: ACTIVITY_CATEGORIES,
            default: "system",
        },
        severity: {
            type: String,
            required: true,
            enum: ACTIVITY_SEVERITIES,
            default: "info",
        },
        status: { type: String, default: null, trim: true },
        title: { type: String, required: true, trim: true, maxlength: 200 },
        description: {
            type: String,
            trim: true,
            default: "",
            maxlength: 5000,
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: undefined,
        },
        actor: {
            type: Schema.Types.Mixed,
            default: { type: "system", id: null, name: null },
        },
        source: {
            service: { type: String, default: null, trim: true },
            route: { type: String, default: null, trim: true },
            provider: { type: String, default: null, trim: true },
            version: { type: String, default: null, trim: true },
        },
        occurredAt: {
            type: Date,
            default: () => new Date(),
        },
        archivedAt: {
            type: Date,
            default: null,
        },
    },
    {
        collection: MONGODB_COLLECTIONS.activityLog,
        timestamps: true,
    },
);

indexWebsiteForeignKeyActivityLog(ActivityLogSchema);

ActivityLogSchema.index({ websiteId: 1, occurredAt: -1, _id: -1 });
ActivityLogSchema.index({ websiteId: 1, category: 1, occurredAt: -1 });
ActivityLogSchema.index({ websiteId: 1, severity: 1, occurredAt: -1 });
ActivityLogSchema.index({ websiteId: 1, type: 1, occurredAt: -1 });

export type ActivityLogDocument = InferSchemaType<typeof ActivityLogSchema> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export type ActivityLogLean = Record<string, unknown>;

const MODEL_NAME = "ActivityLog";

export const ActivityLog: Model<ActivityLogDocument> =
    (mongoose.models[MODEL_NAME] as Model<ActivityLogDocument> | undefined) ??
    mongoose.model<ActivityLogDocument>(MODEL_NAME, ActivityLogSchema);

export { ACTIVITY_ACTOR_TYPES };
