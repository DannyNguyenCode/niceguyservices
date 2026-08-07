import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import { indexWebsiteForeignKey, websiteForeignKey } from "@/src/lib/mongoose-fields";
import { AI_SUMMARY_STATUSES } from "@/src/schemas/enums";

const EvidenceItemSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        category: { type: String, default: null },
        evidenceCheckIds: { type: [String], default: [] },
    },
    { _id: false },
);

const WeaknessItemSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        category: { type: String, default: null },
        priority: {
            type: String,
            enum: ["high", "medium", "low"],
            required: true,
        },
        evidenceCheckIds: { type: [String], default: [] },
    },
    { _id: false },
);

const QuickWinItemSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        expectedImpact: {
            type: String,
            enum: ["high", "medium", "low"],
            required: true,
        },
        estimatedEffort: {
            type: String,
            enum: ["low", "medium", "high"],
            required: true,
        },
        category: { type: String, default: null },
        evidenceCheckIds: { type: [String], default: [] },
    },
    { _id: false },
);

const LongTermItemSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        priority: {
            type: String,
            enum: ["high", "medium", "low"],
            required: true,
        },
        estimatedEffort: {
            type: String,
            enum: ["low", "medium", "high"],
            required: true,
        },
        category: { type: String, default: null },
        evidenceCheckIds: { type: [String], default: [] },
    },
    { _id: false },
);

const PriorityOrderItemSchema = new Schema(
    {
        rank: { type: Number, required: true, min: 1 },
        title: { type: String, required: true, trim: true },
        reason: { type: String, required: true, trim: true },
        priority: {
            type: String,
            enum: ["high", "medium", "low"],
            required: true,
        },
        evidenceCheckIds: { type: [String], default: [] },
    },
    { _id: false },
);

const HomepageChangeItemSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        priority: {
            type: String,
            enum: ["high", "medium", "low"],
            required: true,
        },
        category: { type: String, required: true, trim: true },
        problem: { type: String, required: true, trim: true },
        recommendation: { type: String, required: true, trim: true },
        expectedImpact: { type: String, required: true, trim: true },
        evidence: { type: [String], default: [] },
    },
    { _id: false },
);

const HomepageChangesSchema = new Schema(
    {
        summary: { type: String, required: true, trim: true },
        priorityChanges: { type: [HomepageChangeItemSchema], default: [] },
    },
    { _id: false },
);

const SourceSnapshotSchema = new Schema(
    {
        scoringVersion: { type: String, required: true },
        overallScore: { type: Number, required: true, min: 0, max: 100 },
        categoryScores: {
            businessClarity: { type: Number, default: null },
            trustCredibility: { type: Number, default: null },
            conversionReadiness: { type: Number, default: null },
            userExperience: { type: Number, default: null },
            brandingConsistency: { type: Number, default: null },
            contentQuality: { type: Number, default: null },
            technicalFoundation: { type: Number, default: null },
        },
        mobilePageSpeedAvailable: { type: Boolean, default: false },
        desktopPageSpeedAvailable: { type: Boolean, default: false },
        screenshotCount: { type: Number, default: 0, min: 0 },
        pageCount: { type: Number, default: 0, min: 0 },
    },
    { _id: false },
);

const AiSummarySchema = new Schema(
    {
        websiteId: websiteForeignKey,
        crawlId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "CrawlData",
        },
        niceGuyMetricId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "NiceGuyMetric",
        },
        auditRunId: { type: Schema.Types.ObjectId, default: null },
        status: {
            type: String,
            enum: AI_SUMMARY_STATUSES,
            required: true,
            default: "queued",
        },
        analysisVersion: { type: String, required: true },
        promptVersion: { type: String, required: true },
        visuallyAnalyzed: { type: Boolean, default: false },
        inputModalities: {
            type: [String],
            default: ["text", "dom"],
        },
        screenshotIds: {
            type: [Schema.Types.ObjectId],
            default: [],
        },
        sourceSnapshot: { type: SourceSnapshotSchema, required: true },
        executiveSummary: { type: String, default: "", trim: true },
        businessImpactSummary: { type: String, default: "", trim: true },
        strengths: { type: [EvidenceItemSchema], default: [] },
        weaknesses: { type: [WeaknessItemSchema], default: [] },
        quickWins: { type: [QuickWinItemSchema], default: [] },
        longTermRecommendations: { type: [LongTermItemSchema], default: [] },
        priorityOrder: { type: [PriorityOrderItemSchema], default: [] },
        homepageChanges: { type: HomepageChangesSchema, default: null },
        disclaimers: { type: [String], default: [] },
        generatedAt: { type: Date, default: null },
        durationMs: { type: Number, default: null, min: 0 },
        errorCode: { type: String, default: null },
        errorMessage: { type: String, default: null },
    },
    {
        timestamps: true,
        collection: MONGODB_COLLECTIONS.aiSummary,
    },
);

indexWebsiteForeignKey(AiSummarySchema);
AiSummarySchema.index({ websiteId: 1, createdAt: -1 });
AiSummarySchema.index({ crawlId: 1, niceGuyMetricId: 1, createdAt: -1 });
AiSummarySchema.index({ websiteId: 1, status: 1 });

export type AiSummaryDocument = InferSchemaType<typeof AiSummarySchema> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const MODEL_NAME = "AiSummary";

export const AiSummary: Model<AiSummaryDocument> =
    (mongoose.models[MODEL_NAME] as Model<AiSummaryDocument> | undefined) ??
    mongoose.model<AiSummaryDocument>(MODEL_NAME, AiSummarySchema);
