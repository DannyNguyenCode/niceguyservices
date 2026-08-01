import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import { indexWebsiteForeignKey, websiteForeignKey } from "@/src/lib/mongoose-fields";
import { AUDIT_RUN_SCHEMA_VERSION } from "@/src/services/audit-history/constants";

const AUDIT_RUN_STATUSES = [
    "draft",
    "queued",
    "crawling",
    "collecting-screenshots",
    "collecting-pagespeed",
    "calculating-metrics",
    "generating-ai-analysis",
    "complete",
    "partial",
    "failed",
    "cancelled",
    "archived",
] as const;

const STAGE_COMPLETION_STATUSES = [
    "not-started",
    "running",
    "complete",
    "partial",
    "failed",
    "skipped",
] as const;

const CategoryScoreSchema = new Schema(
    {
        category: { type: String, required: true },
        score: { type: Number, required: true, min: 0, max: 100 },
    },
    { _id: false },
);

const PageSpeedScoreSchema = new Schema(
    {
        performance: { type: Number, default: null, min: 0, max: 100 },
        accessibility: { type: Number, default: null, min: 0, max: 100 },
        bestPractices: { type: Number, default: null, min: 0, max: 100 },
        seo: { type: Number, default: null, min: 0, max: 100 },
    },
    { _id: false },
);

const AuditRunSchema = new Schema(
    {
        websiteId: websiteForeignKey,
        auditNumber: { type: Number, required: true, min: 1 },
        status: {
            type: String,
            required: true,
            enum: AUDIT_RUN_STATUSES,
            default: "queued",
        },
        isCurrent: { type: Boolean, default: false },
        isArchived: { type: Boolean, default: false },
        trigger: {
            type: {
                type: String,
                enum: ["administrator", "system", "retry", "migration"],
                default: "administrator",
            },
            actorId: { type: String, default: null },
            actorName: { type: String, default: null },
        },
        source: {
            websiteUrl: { type: String, required: true, trim: true },
            normalizedUrl: { type: String, required: true, trim: true },
            businessName: { type: String, default: null },
            domain: { type: String, default: null },
        },
        configuration: {
            crawlMaxPages: { type: Number, default: null },
            crawlMaxDepth: { type: Number, default: null },
            includeScreenshots: { type: Boolean, default: true },
            includePageSpeed: { type: Boolean, default: true },
            includeNiceGuyMetrics: { type: Boolean, default: true },
            includeAiAnalysis: { type: Boolean, default: true },
            generateReportDraft: { type: Boolean, default: true },
            pageSpeedStrategies: {
                type: [String],
                enum: ["mobile", "desktop"],
                default: ["mobile", "desktop"],
            },
            configurationVersion: { type: String, default: "audit-config-v1" },
        },
        versions: {
            auditSchemaVersion: {
                type: String,
                default: AUDIT_RUN_SCHEMA_VERSION,
            },
            crawlerVersion: { type: String, default: null },
            screenshotVersion: { type: String, default: null },
            pageSpeedVersion: { type: String, default: null },
            metricsVersion: { type: String, default: null },
            aiPromptVersion: { type: String, default: null },
            aiSchemaVersion: { type: String, default: null },
        },
        references: {
            crawlDataIds: { type: [Schema.Types.ObjectId], default: [] },
            screenshotIds: { type: [Schema.Types.ObjectId], default: [] },
            googleMetricsIds: { type: [Schema.Types.ObjectId], default: [] },
            niceGuyMetricsId: { type: Schema.Types.ObjectId, default: null },
            aiSummaryId: { type: Schema.Types.ObjectId, default: null },
            heroSuggestionIds: { type: [Schema.Types.ObjectId], default: [] },
            aiMetadataIds: { type: [Schema.Types.ObjectId], default: [] },
            publicReportIds: { type: [Schema.Types.ObjectId], default: [] },
            pdfReportIds: { type: [Schema.Types.ObjectId], default: [] },
            outreachDraftIds: { type: [Schema.Types.ObjectId], default: [] },
            demoProjectIds: { type: [Schema.Types.ObjectId], default: [] },
        },
        summary: {
            pagesDiscovered: { type: Number, default: null },
            pagesCrawled: { type: Number, default: null },
            screenshotsCaptured: { type: Number, default: null },
            overallScore: { type: Number, default: null, min: 0, max: 100 },
            categoryScores: { type: [CategoryScoreSchema], default: [] },
            pageSpeed: {
                mobile: { type: PageSpeedScoreSchema, default: null },
                desktop: { type: PageSpeedScoreSchema, default: null },
            },
            strengthCount: { type: Number, default: null },
            weaknessCount: { type: Number, default: null },
            recommendationCount: { type: Number, default: null },
            errorCount: { type: Number, default: 0, min: 0 },
            warningCount: { type: Number, default: 0, min: 0 },
        },
        completion: {
            crawl: {
                type: String,
                enum: STAGE_COMPLETION_STATUSES,
                default: "not-started",
            },
            screenshots: {
                type: String,
                enum: STAGE_COMPLETION_STATUSES,
                default: "not-started",
            },
            pageSpeed: {
                type: String,
                enum: STAGE_COMPLETION_STATUSES,
                default: "not-started",
            },
            metrics: {
                type: String,
                enum: STAGE_COMPLETION_STATUSES,
                default: "not-started",
            },
            ai: {
                type: String,
                enum: STAGE_COMPLETION_STATUSES,
                default: "not-started",
            },
        },
        failure: {
            stage: { type: String, default: null },
            errorCode: { type: String, default: null },
            errorMessage: { type: String, default: null },
        },
        startedAt: { type: Date, default: null },
        completedAt: { type: Date, default: null },
        archivedAt: { type: Date, default: null },
        migrationWarning: { type: String, default: null },
    },
    {
        timestamps: true,
        collection: MONGODB_COLLECTIONS.auditRuns,
    },
);

indexWebsiteForeignKey(AuditRunSchema);
AuditRunSchema.index({ websiteId: 1, auditNumber: 1 }, { unique: true });
AuditRunSchema.index({ websiteId: 1, completedAt: -1, createdAt: -1 });
AuditRunSchema.index({ websiteId: 1, isCurrent: 1 });
AuditRunSchema.index(
    { websiteId: 1, isCurrent: 1 },
    { unique: true, partialFilterExpression: { isCurrent: true } },
);
AuditRunSchema.index({ websiteId: 1, isArchived: 1, completedAt: -1 });

export type AuditRunDocument = InferSchemaType<typeof AuditRunSchema> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const MODEL_NAME = "AuditRun";

export const AuditRun: Model<AuditRunDocument> =
    (mongoose.models[MODEL_NAME] as Model<AuditRunDocument> | undefined) ??
    mongoose.model<AuditRunDocument>(MODEL_NAME, AuditRunSchema);
