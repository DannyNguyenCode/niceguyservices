import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import {
    AUDIT_STATUSES,
    DEMO_STATUSES,
    OUTREACH_STATUSES,
    WEBSITE_SOURCES,
    WEBSITE_STATUSES,
} from "@/src/lib/website-validation";
import { CRAWL_STATUSES, NICEGUY_STATUSES, PAGESPEED_STATUSES } from "@/src/schemas/enums";

const WebsiteSchema = new Schema(
    {
        businessName: {
            type: String,
            trim: true,
            default: "",
            maxlength: 120,
        },
        originalUrl: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2048,
        },
        normalizedDomain: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 253,
        },
        businessEmail: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
            maxlength: 254,
        },
        industry: {
            type: String,
            trim: true,
            default: "",
            maxlength: 120,
        },
        location: {
            type: String,
            trim: true,
            default: "",
            maxlength: 120,
        },
        source: {
            type: String,
            required: true,
            enum: WEBSITE_SOURCES,
            default: "manual-prospect-research",
        },
        status: {
            type: String,
            required: true,
            enum: WEBSITE_STATUSES,
            default: "new",
        },
        auditStatus: {
            type: String,
            required: true,
            enum: AUDIT_STATUSES,
            default: "not-started",
        },
        crawlStatus: {
            type: String,
            required: true,
            enum: CRAWL_STATUSES,
            default: "not-started",
        },
        pageSpeedStatus: {
            type: String,
            required: true,
            enum: PAGESPEED_STATUSES,
            default: "not-started",
        },
        latestPageSpeedRunAt: {
            type: Date,
            default: null,
        },
        niceGuyStatus: {
            type: String,
            required: true,
            enum: NICEGUY_STATUSES,
            default: "not-started",
        },
        latestNiceGuyRunAt: {
            type: Date,
            default: null,
        },
        aiAnalysisStatus: {
            type: String,
            required: true,
            enum: ["not-started", "queued", "processing", "complete", "partial", "failed"],
            default: "not-started",
        },
        latestAiAnalysisRunAt: {
            type: Date,
            default: null,
        },
        demoStatus: {
            type: String,
            required: true,
            enum: DEMO_STATUSES,
            default: "none",
        },
        outreachStatus: {
            type: String,
            required: true,
            enum: OUTREACH_STATUSES,
            default: "not-contacted",
        },
        publicReportStatus: {
            type: String,
            required: true,
            enum: ["not-created", "draft", "published", "unpublished"],
            default: "not-created",
        },
        latestPublicReportAt: {
            type: Date,
            default: null,
        },
        latestPublishedReportAt: {
            type: Date,
            default: null,
        },
        pdfReportStatus: {
            type: String,
            required: true,
            enum: ["not-generated", "queued", "processing", "complete", "failed"],
            default: "not-generated",
        },
        latestPdfReportAt: {
            type: Date,
            default: null,
        },
        outreachDraftStatus: {
            type: String,
            required: true,
            enum: ["not-generated", "draft", "approved", "rejected"],
            default: "not-generated",
        },
        latestOutreachDraftAt: {
            type: Date,
            default: null,
        },
        demoProjectStatus: {
            type: String,
            required: true,
            enum: ["not-created", "draft", "generating", "review", "approved", "rejected"],
            default: "not-created",
        },
        latestDemoAt: {
            type: Date,
            default: null,
        },
        currentAuditRunId: {
            type: Schema.Types.ObjectId,
            ref: "AuditRun",
            default: null,
        },
        latestCompletedAuditRunId: {
            type: Schema.Types.ObjectId,
            ref: "AuditRun",
            default: null,
        },
        nextAuditNumber: {
            type: Number,
            default: 1,
            min: 1,
        },
        auditCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        collection: MONGODB_COLLECTIONS.website,
    },
);

WebsiteSchema.index(
    { normalizedDomain: 1 },
    {
        unique: true,
        partialFilterExpression: { deletedAt: null },
    },
);

WebsiteSchema.index({ updatedAt: -1 });

export type WebsiteDocument = InferSchemaType<typeof WebsiteSchema> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export type WebsiteLean = {
    _id: string;
    businessName: string;
    originalUrl: string;
    normalizedDomain: string;
    businessEmail: string;
    industry: string;
    location: string;
    source: (typeof WEBSITE_SOURCES)[number];
    status: (typeof WEBSITE_STATUSES)[number];
    auditStatus: (typeof AUDIT_STATUSES)[number];
    crawlStatus: (typeof CRAWL_STATUSES)[number];
    pageSpeedStatus: (typeof PAGESPEED_STATUSES)[number];
    latestPageSpeedRunAt: Date | null;
    niceGuyStatus: (typeof NICEGUY_STATUSES)[number];
    latestNiceGuyRunAt: Date | null;
    aiAnalysisStatus:
        | "not-started"
        | "queued"
        | "processing"
        | "complete"
        | "partial"
        | "failed";
    latestAiAnalysisRunAt: Date | null;
    demoStatus: (typeof DEMO_STATUSES)[number];
    outreachStatus: (typeof OUTREACH_STATUSES)[number];
    publicReportStatus: "not-created" | "draft" | "published" | "unpublished";
    latestPublicReportAt: Date | null;
    latestPublishedReportAt: Date | null;
    pdfReportStatus: "not-generated" | "queued" | "processing" | "complete" | "failed";
    latestPdfReportAt: Date | null;
    outreachDraftStatus: "not-generated" | "draft" | "approved" | "rejected";
    latestOutreachDraftAt: Date | null;
    demoProjectStatus:
        | "not-created"
        | "draft"
        | "generating"
        | "review"
        | "approved"
        | "rejected";
    latestDemoAt: Date | null;
    currentAuditRunId: string | null;
    latestCompletedAuditRunId: string | null;
    nextAuditNumber: number;
    auditCount: number;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

const MODEL_NAME = "Website";

export const Website: Model<WebsiteDocument> =
    (mongoose.models[MODEL_NAME] as Model<WebsiteDocument> | undefined) ??
    mongoose.model<WebsiteDocument>(MODEL_NAME, WebsiteSchema);
