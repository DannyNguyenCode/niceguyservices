import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import { indexWebsiteForeignKey, websiteForeignKey } from "@/src/lib/mongoose-fields";
import {
    ACTIVE_AUDIT_JOB_STATUSES,
    AUDIT_JOB_PACKAGE_VERSION,
    AUDIT_PIPELINE_STAGES,
    AUDIT_STAGE_STATUSES,
    DEFAULT_AUDIT_CONFIGURATION,
    TERMINAL_AUDIT_JOB_STATUSES,
} from "@/src/services/audit-pipeline/constants";

const AUDIT_JOB_STATUSES = [...ACTIVE_AUDIT_JOB_STATUSES, ...TERMINAL_AUDIT_JOB_STATUSES] as const;

const AuditStageStateSchema = new Schema(
    {
        status: {
            type: String,
            enum: AUDIT_STAGE_STATUSES,
            default: "pending",
        },
        attempt: { type: Number, default: 0, min: 0 },
        startedAt: { type: Date, default: null },
        heartbeatAt: { type: Date, default: null },
        completedAt: { type: Date, default: null },
        errorCode: { type: String, default: null },
        errorMessage: { type: String, default: null },
    },
    { _id: false },
);

const AuditJobSchema = new Schema(
    {
        websiteId: websiteForeignKey,
        auditRunId: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        idempotencyKey: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: AUDIT_JOB_STATUSES,
            default: "queued",
            index: true,
        },
        currentStage: {
            type: String,
            enum: [...AUDIT_PIPELINE_STAGES, null],
            default: null,
        },
        progressPercent: { type: Number, default: 0, min: 0, max: 100 },
        attempt: { type: Number, default: 1, min: 1 },
        maxAttempts: { type: Number, default: 3, min: 1 },
        queuedAt: { type: Date, default: () => new Date() },
        startedAt: { type: Date, default: null },
        heartbeatAt: { type: Date, default: null },
        completedAt: { type: Date, default: null },
        failedAt: { type: Date, default: null },
        cancelledAt: { type: Date, default: null },
        error: {
            code: { type: String, default: null },
            message: { type: String, default: null },
            retryable: { type: Boolean, default: false },
        },
        configuration: {
            crawlMaxPages: {
                type: Number,
                default: DEFAULT_AUDIT_CONFIGURATION.crawlMaxPages,
            },
            crawlMaxDepth: {
                type: Number,
                default: DEFAULT_AUDIT_CONFIGURATION.crawlMaxDepth,
            },
            includeScreenshots: {
                type: Boolean,
                default: DEFAULT_AUDIT_CONFIGURATION.includeScreenshots,
            },
            includePageSpeed: {
                type: Boolean,
                default: DEFAULT_AUDIT_CONFIGURATION.includePageSpeed,
            },
            includeNiceGuyMetrics: {
                type: Boolean,
                default: DEFAULT_AUDIT_CONFIGURATION.includeNiceGuyMetrics,
            },
            includeAiAnalysis: {
                type: Boolean,
                default: DEFAULT_AUDIT_CONFIGURATION.includeAiAnalysis,
            },
            generateReportDraft: {
                type: Boolean,
                default: DEFAULT_AUDIT_CONFIGURATION.generateReportDraft,
            },
            pageSpeedStrategies: {
                type: [String],
                enum: ["mobile", "desktop"],
                default: DEFAULT_AUDIT_CONFIGURATION.pageSpeedStrategies,
            },
            configurationVersion: {
                type: String,
                default: DEFAULT_AUDIT_CONFIGURATION.configurationVersion,
            },
        },
        packageVersion: {
            type: String,
            default: AUDIT_JOB_PACKAGE_VERSION,
        },
        stages: {
            type: Map,
            of: AuditStageStateSchema,
            default: () =>
                Object.fromEntries(
                    AUDIT_PIPELINE_STAGES.map((stage) => [
                        stage,
                        { status: "pending", attempt: 0 },
                    ]),
                ),
        },
        reportDraftId: { type: Schema.Types.ObjectId, default: null },
    },
    { timestamps: true },
);

AuditJobSchema.index({ websiteId: 1, status: 1, queuedAt: -1 });
AuditJobSchema.index({ auditRunId: 1 });
AuditJobSchema.index(
    { idempotencyKey: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: { $in: [...ACTIVE_AUDIT_JOB_STATUSES] },
        },
    },
);
indexWebsiteForeignKey(AuditJobSchema);

export type AuditJobDocument = InferSchemaType<typeof AuditJobSchema> & {
    _id: mongoose.Types.ObjectId;
};

export const AuditJob: Model<AuditJobDocument> =
    (mongoose.models.AuditJob as Model<AuditJobDocument> | undefined) ??
    mongoose.model<AuditJobDocument>("AuditJob", AuditJobSchema, MONGODB_COLLECTIONS.auditJobs);
