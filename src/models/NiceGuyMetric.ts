import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import {
    CategoryScoreSchema,
    emptyCategoryScore,
    NiceGuySummarySchema,
} from "@/src/lib/niceguy-metric-schemas";
import { indexWebsiteForeignKey, websiteForeignKey } from "@/src/lib/mongoose-fields";
import { NICEGUY_METRIC_STATUSES } from "@/src/schemas/enums";

const NiceGuyMetricSchema = new Schema(
    {
        websiteId: websiteForeignKey,
        crawlId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "CrawlData",
        },
        auditRunId: {
            type: Schema.Types.ObjectId,
            ref: "AuditRun",
            default: null,
            index: true,
        },
        status: {
            type: String,
            enum: NICEGUY_METRIC_STATUSES,
            required: true,
            default: "queued",
        },
        idempotencyKey: {
            type: String,
            trim: true,
            default: null,
            index: true,
        },
        attempt: { type: Number, default: 1, min: 1 },
        startedAt: { type: Date, default: null },
        heartbeatAt: { type: Date, default: null },
        completedAt: { type: Date, default: null },
        scoringVersion: { type: String, required: true, default: "niceguy-v1" },
        overallScore: { type: Number, default: 0, min: 0, max: 100 },
        categories: {
            businessClarity: { type: CategoryScoreSchema, default: emptyCategoryScore },
            trustCredibility: { type: CategoryScoreSchema, default: emptyCategoryScore },
            conversionReadiness: { type: CategoryScoreSchema, default: emptyCategoryScore },
            userExperience: { type: CategoryScoreSchema, default: emptyCategoryScore },
            brandingConsistency: { type: CategoryScoreSchema, default: emptyCategoryScore },
            contentQuality: { type: CategoryScoreSchema, default: emptyCategoryScore },
            technicalFoundation: { type: CategoryScoreSchema, default: emptyCategoryScore },
        },
        summary: { type: NiceGuySummarySchema, default: () => ({}) },
        generatedAt: { type: Date, default: null },
        durationMs: { type: Number, default: null, min: 0 },
        errorCode: { type: String, default: "" },
        errorMessage: { type: String, default: "" },
    },
    {
        timestamps: true,
        collection: MONGODB_COLLECTIONS.niceguyMetrics,
    },
);

indexWebsiteForeignKey(NiceGuyMetricSchema);
NiceGuyMetricSchema.index({ websiteId: 1, createdAt: -1 });
NiceGuyMetricSchema.index({ crawlId: 1, scoringVersion: 1 });
NiceGuyMetricSchema.index({ websiteId: 1, status: 1 });
NiceGuyMetricSchema.index({ websiteId: 1, auditRunId: 1 });
NiceGuyMetricSchema.index(
    { idempotencyKey: 1 },
    {
        unique: true,
        partialFilterExpression: {
            idempotencyKey: { $type: "string" },
            status: { $in: ["queued", "processing"] },
        },
    },
);

export type NiceGuyMetricDocument = InferSchemaType<typeof NiceGuyMetricSchema> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const MODEL_NAME = "NiceGuyMetric";

export const NiceGuyMetric: Model<NiceGuyMetricDocument> =
    (mongoose.models[MODEL_NAME] as Model<NiceGuyMetricDocument> | undefined) ??
    mongoose.model<NiceGuyMetricDocument>(MODEL_NAME, NiceGuyMetricSchema);

/** @deprecated Use `NiceGuyMetric` model. */
export const NiceguyMetrics = NiceGuyMetric;
