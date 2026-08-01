import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import { PUBLIC_REPORT_VERSION } from "@/src/lib/public-report-config";
import { indexWebsiteForeignKey, websiteForeignKey } from "@/src/lib/mongoose-fields";
import { DEFAULT_PUBLIC_REPORT_SETTINGS } from "@/src/lib/public-report-config";

const PUBLIC_REPORT_STATUSES = ["draft", "published", "unpublished", "archived"] as const;

const PublicReportSettingsSchema = new Schema(
    {
        showOverallScore: { type: Boolean, default: DEFAULT_PUBLIC_REPORT_SETTINGS.showOverallScore },
        showScoreConfidence: {
            type: Boolean,
            default: DEFAULT_PUBLIC_REPORT_SETTINGS.showScoreConfidence,
        },
        showCategoryScores: {
            type: Boolean,
            default: DEFAULT_PUBLIC_REPORT_SETTINGS.showCategoryScores,
        },
        showPageSpeed: { type: Boolean, default: DEFAULT_PUBLIC_REPORT_SETTINGS.showPageSpeed },
        showScreenshots: { type: Boolean, default: DEFAULT_PUBLIC_REPORT_SETTINGS.showScreenshots },
        showStrengths: { type: Boolean, default: DEFAULT_PUBLIC_REPORT_SETTINGS.showStrengths },
        showWeaknesses: { type: Boolean, default: DEFAULT_PUBLIC_REPORT_SETTINGS.showWeaknesses },
        showQuickWins: { type: Boolean, default: DEFAULT_PUBLIC_REPORT_SETTINGS.showQuickWins },
        showLongTermRecommendations: {
            type: Boolean,
            default: DEFAULT_PUBLIC_REPORT_SETTINGS.showLongTermRecommendations,
        },
        showPriorityPlan: {
            type: Boolean,
            default: DEFAULT_PUBLIC_REPORT_SETTINGS.showPriorityPlan,
        },
        showHeroSuggestions: {
            type: Boolean,
            default: DEFAULT_PUBLIC_REPORT_SETTINGS.showHeroSuggestions,
        },
        showTechnicalDetails: {
            type: Boolean,
            default: DEFAULT_PUBLIC_REPORT_SETTINGS.showTechnicalDetails,
        },
        showNiceGuyBranding: {
            type: Boolean,
            default: DEFAULT_PUBLIC_REPORT_SETTINGS.showNiceGuyBranding,
        },
        showContactCta: { type: Boolean, default: DEFAULT_PUBLIC_REPORT_SETTINGS.showContactCta },
    },
    { _id: false },
);

const PublicReportBrandingSchema = new Schema(
    {
        businessName: { type: String, default: null },
        websiteUrl: { type: String, required: true, trim: true },
        normalizedDomain: { type: String, default: null },
        industry: { type: String, default: null },
        location: { type: String, default: null },
        reportPreparedBy: { type: String, default: "Nice Guy Web Design", trim: true },
        reportPreparedByUrl: { type: String, default: null },
        logoUrl: { type: String, default: null },
        accentStyle: { type: String, default: null },
    },
    { _id: false },
);

const PublicReportSchema = new Schema(
    {
        websiteId: websiteForeignKey,
        crawlId: { type: Schema.Types.ObjectId, ref: "CrawlData", required: true },
        niceGuyMetricId: { type: Schema.Types.ObjectId, ref: "NiceGuyMetric", required: true },
        aiSummaryId: { type: Schema.Types.ObjectId, ref: "AiSummary", required: true },
        auditRunId: { type: Schema.Types.ObjectId, default: null },
        sourceAuditRunId: {
            type: Schema.Types.ObjectId,
            ref: "AuditRun",
            default: null,
            index: true,
        },
        sourceAuditNumber: { type: Number, default: null },
        heroSuggestionIds: { type: [Schema.Types.ObjectId], default: [] },
        status: {
            type: String,
            enum: PUBLIC_REPORT_STATUSES,
            default: "draft",
            required: true,
        },
        reportVersion: {
            type: String,
            default: PUBLIC_REPORT_VERSION,
            required: true,
        },
        revisionNumber: { type: Number, required: true, min: 1 },
        tokenHash: { type: String, trim: true },
        tokenPrefix: { type: String, trim: true },
        publicPath: { type: String, trim: true },
        title: { type: String, required: true, trim: true, maxlength: 200 },
        subtitle: { type: String, default: null, trim: true, maxlength: 200 },
        settings: { type: PublicReportSettingsSchema, default: () => ({}) },
        branding: { type: PublicReportBrandingSchema, required: true },
        sourceSnapshot: { type: Schema.Types.Mixed, required: true },
        publishedAt: { type: Date, default: null },
        unpublishedAt: { type: Date, default: null },
        archivedAt: { type: Date, default: null },
        expiresAt: { type: Date, default: null },
        viewCount: { type: Number, default: 0, min: 0 },
        uniqueViewEstimate: { type: Number, default: 0, min: 0 },
        lastViewedAt: { type: Date, default: null },
        createdBy: { type: String, default: null, trim: true },
    },
    {
        timestamps: true,
        collection: MONGODB_COLLECTIONS.publicReports,
    },
);

indexWebsiteForeignKey(PublicReportSchema);
PublicReportSchema.index(
    { tokenHash: 1 },
    {
        unique: true,
        partialFilterExpression: {
            tokenHash: { $type: "string" },
        },
    },
);
PublicReportSchema.index({ websiteId: 1, revisionNumber: -1 });
PublicReportSchema.index({ websiteId: 1, revisionNumber: 1 }, { unique: true });
PublicReportSchema.index({ websiteId: 1, status: 1, createdAt: -1 });
PublicReportSchema.index({ status: 1, expiresAt: 1 });

export type PublicReportDocument = InferSchemaType<typeof PublicReportSchema> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const MODEL_NAME = "PublicReport";

export const PublicReport: Model<PublicReportDocument> =
    (mongoose.models[MODEL_NAME] as Model<PublicReportDocument> | undefined) ??
    mongoose.model<PublicReportDocument>(MODEL_NAME, PublicReportSchema);
