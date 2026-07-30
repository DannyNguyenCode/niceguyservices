import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import {
    GOOGLE_METRIC_STATUSES,
    PAGESPEED_STRATEGIES,
} from "@/src/schemas/enums";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import { indexWebsiteForeignKey, websiteForeignKey } from "@/src/lib/mongoose-fields";

const MetricValueSchema = new Schema(
    {
        valueMs: { type: Number, default: null },
        value: { type: Number, default: null },
        displayValue: { type: String, default: "" },
        score: { type: Number, default: null, min: 0, max: 100 },
    },
    { _id: false },
);

const FieldMetricSchema = new Schema(
    {
        percentile: { type: Number, default: null },
        category: { type: String, default: "" },
    },
    { _id: false },
);

const OpportunitySchema = new Schema(
    {
        auditId: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: "" },
        score: { type: Number, default: null },
        scoreDisplayMode: { type: String, default: "" },
        displayValue: { type: String, default: "" },
        estimatedSavingsMs: { type: Number, default: null },
        estimatedSavingsBytes: { type: Number, default: null },
        priority: {
            type: String,
            enum: ["high", "medium", "low"],
            required: true,
        },
    },
    { _id: false },
);

const DiagnosticSchema = new Schema(
    {
        auditId: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: "" },
        score: { type: Number, default: null },
        scoreDisplayMode: { type: String, default: "" },
        displayValue: { type: String, default: "" },
        detailsType: { type: String, default: "" },
    },
    { _id: false },
);

const FailedAuditSchema = new Schema(
    {
        auditId: { type: String, required: true },
        category: {
            type: String,
            enum: ["performance", "accessibility", "best-practices", "seo", "unknown"],
            default: "unknown",
        },
        title: { type: String, required: true },
        description: { type: String, default: "" },
        score: { type: Number, default: null },
        scoreDisplayMode: { type: String, default: "" },
        displayValue: { type: String, default: "" },
        severity: {
            type: String,
            enum: ["critical", "high", "medium", "low"],
            required: true,
        },
    },
    { _id: false },
);

const GoogleMetricSchema = new Schema(
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
        strategy: {
            type: String,
            required: true,
            enum: PAGESPEED_STRATEGIES,
        },
        status: {
            type: String,
            required: true,
            enum: GOOGLE_METRIC_STATUSES,
            default: "queued",
        },
        requestedUrl: { type: String, required: true, trim: true, maxlength: 2048 },
        finalUrl: { type: String, default: "", trim: true, maxlength: 2048 },
        fetchTime: { type: Date, default: null },
        lighthouseVersion: { type: String, default: "", maxlength: 64 },
        userAgent: { type: String, default: "", maxlength: 512 },
        scores: {
            performance: { type: Number, default: null, min: 0, max: 100 },
            accessibility: { type: Number, default: null, min: 0, max: 100 },
            bestPractices: { type: Number, default: null, min: 0, max: 100 },
            seo: { type: Number, default: null, min: 0, max: 100 },
        },
        labMetrics: {
            firstContentfulPaint: { type: MetricValueSchema, default: undefined },
            largestContentfulPaint: { type: MetricValueSchema, default: undefined },
            totalBlockingTime: { type: MetricValueSchema, default: undefined },
            cumulativeLayoutShift: { type: MetricValueSchema, default: undefined },
            speedIndex: { type: MetricValueSchema, default: undefined },
            interactive: { type: MetricValueSchema, default: undefined },
            timeToFirstByte: { type: MetricValueSchema, default: undefined },
            maxPotentialFirstInputDelay: { type: MetricValueSchema, default: undefined },
        },
        fieldData: {
            available: { type: Boolean, default: false },
            overallCategory: {
                type: String,
                enum: ["FAST", "AVERAGE", "SLOW", "NONE", null],
                default: null,
            },
            originFallback: { type: Boolean, default: false },
            firstContentfulPaint: { type: FieldMetricSchema, default: undefined },
            largestContentfulPaint: { type: FieldMetricSchema, default: undefined },
            interactionToNextPaint: { type: FieldMetricSchema, default: undefined },
            cumulativeLayoutShift: { type: FieldMetricSchema, default: undefined },
            timeToFirstByte: { type: FieldMetricSchema, default: undefined },
        },
        coreWebVitals: {
            assessment: {
                type: String,
                enum: ["passed", "failed", "unavailable", null],
                default: null,
            },
            largestContentfulPaint: {
                value: { type: Number, default: null },
                rating: {
                    type: String,
                    enum: ["good", "needs-improvement", "poor", "unavailable", null],
                    default: null,
                },
            },
            interactionToNextPaint: {
                value: { type: Number, default: null },
                rating: {
                    type: String,
                    enum: ["good", "needs-improvement", "poor", "unavailable", null],
                    default: null,
                },
            },
            cumulativeLayoutShift: {
                value: { type: Number, default: null },
                rating: {
                    type: String,
                    enum: ["good", "needs-improvement", "poor", "unavailable", null],
                    default: null,
                },
            },
        },
        opportunities: { type: [OpportunitySchema], default: [] },
        diagnostics: { type: [DiagnosticSchema], default: [] },
        failedAudits: { type: [FailedAuditSchema], default: [] },
        passedAuditCount: { type: Number, default: 0, min: 0 },
        failedAuditCount: { type: Number, default: 0, min: 0 },
        notApplicableAuditCount: { type: Number, default: 0, min: 0 },
        apiMetadata: {
            responseId: { type: String, default: "" },
            analysisUTCTimestamp: { type: Date, default: null },
        },
        durationMs: { type: Number, default: null, min: 0 },
        errorCode: { type: String, default: "" },
        errorMessage: { type: String, default: "" },
    },
    {
        timestamps: true,
        collection: MONGODB_COLLECTIONS.googleMetrics,
    },
);

indexWebsiteForeignKey(GoogleMetricSchema);
GoogleMetricSchema.index({ websiteId: 1, createdAt: -1 });
GoogleMetricSchema.index({ crawlId: 1, strategy: 1 });
GoogleMetricSchema.index({ websiteId: 1, strategy: 1, createdAt: -1 });
GoogleMetricSchema.index({ websiteId: 1, auditRunId: 1, strategy: 1 });

export type GoogleMetricDocument = InferSchemaType<typeof GoogleMetricSchema> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const MODEL_NAME = "GoogleMetric";

export const GoogleMetric: Model<GoogleMetricDocument> =
    (mongoose.models[MODEL_NAME] as Model<GoogleMetricDocument> | undefined) ??
    mongoose.model<GoogleMetricDocument>(MODEL_NAME, GoogleMetricSchema);

/** @deprecated Use `GoogleMetric` model. */
export const GoogleMetrics = GoogleMetric;
