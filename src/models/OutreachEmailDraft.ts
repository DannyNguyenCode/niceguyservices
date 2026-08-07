import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";

const OutreachEmailDraftSchema = new Schema(
    {
        websiteId: {
            type: Schema.Types.ObjectId,
            ref: "Website",
            required: true,
            index: true,
        },
        publicReportId: {
            type: Schema.Types.ObjectId,
            ref: "PublicReport",
            required: true,
            index: true,
        },
        pdfReportId: {
            type: Schema.Types.ObjectId,
            ref: "PdfReport",
            default: null,
        },
        sourceAuditRunId: {
            type: Schema.Types.ObjectId,
            ref: "AuditRun",
            default: null,
            index: true,
        },
        sourceAuditNumber: { type: Number, default: null },
        aiSummaryId: {
            type: Schema.Types.ObjectId,
            default: null,
        },
        status: {
            type: String,
            enum: ["draft", "approved", "rejected", "archived"],
            default: "draft",
            required: true,
        },
        isCurrentApproved: {
            type: Boolean,
            default: false,
            index: true,
        },
        outreachVersion: { type: String, required: true },
        promptVersion: { type: String, required: true },
        source: {
            publicReportVersion: { type: String, required: true },
            publicReportRevision: { type: Number, required: true, min: 1 },
            snapshotChecksum: { type: String, required: true },
            pdfVersion: { type: String, default: null },
            pdfFilename: { type: String, default: null },
        },
        recipient: {
            name: { type: String, default: null, trim: true },
            role: { type: String, default: null, trim: true },
            email: { type: String, default: null, trim: true, lowercase: true },
            businessName: { type: String, default: null, trim: true },
        },
        strategy: {
            tone: {
                type: String,
                enum: ["friendly", "professional", "concise", "consultative"],
                required: true,
            },
            length: {
                type: String,
                enum: ["short", "standard", "detailed"],
                required: true,
            },
            primaryGoal: {
                type: String,
                enum: [
                    "start-conversation",
                    "share-audit",
                    "offer-improvement",
                    "request-meeting",
                ],
                required: true,
            },
            includePublicReport: { type: Boolean, default: false },
            includePdfReference: { type: Boolean, default: true },
            includeScore: { type: Boolean, default: false },
            includePageSpeed: { type: Boolean, default: false },
            includeQuickWin: { type: Boolean, default: true },
            includeBusinessCompliment: { type: Boolean, default: true },
        },
        subject: { type: String, required: true, trim: true, maxlength: 200 },
        bodyText: { type: String, required: true, maxlength: 20000 },
        evidence: [
            {
                type: {
                    type: String,
                    enum: [
                        "strength",
                        "weakness",
                        "quick-win",
                        "score",
                        "pagespeed",
                        "content",
                        "technical",
                    ],
                    required: true,
                },
                sourceId: { type: String, default: null },
                label: { type: String, required: true },
                value: { type: Schema.Types.Mixed, default: null },
                sourcePath: { type: String, default: null },
            },
        ],
        claimWarnings: [
            {
                code: { type: String, required: true },
                message: { type: String, required: true },
            },
        ],
        generation: {
            provider: { type: String, default: null },
            model: { type: String, default: null },
            providerRequestId: { type: String, default: null },
            generatedAt: { type: Date, default: null },
            durationMs: { type: Number, default: null },
            retryCount: { type: Number, default: 0 },
        },
        editHistory: [
            {
                subject: { type: String, required: true },
                bodyText: { type: String, required: true },
                editedAt: { type: Date, required: true },
                editSource: {
                    type: String,
                    enum: ["generated", "administrator", "regenerated"],
                    required: true,
                },
            },
        ],
        approvedAt: { type: Date, default: null },
        rejectedAt: { type: Date, default: null },
        archivedAt: { type: Date, default: null },
        errorCode: { type: String, default: null },
        errorMessage: { type: String, default: null },
    },
    {
        timestamps: true,
        collection: MONGODB_COLLECTIONS.outreachEmailDrafts,
    },
);

OutreachEmailDraftSchema.index({ websiteId: 1, createdAt: -1 });
OutreachEmailDraftSchema.index({ publicReportId: 1, createdAt: -1 });
OutreachEmailDraftSchema.index({ websiteId: 1, status: 1 });
OutreachEmailDraftSchema.index(
    { websiteId: 1, isCurrentApproved: 1 },
    { partialFilterExpression: { isCurrentApproved: true } },
);

export type OutreachEmailDraftDocument = InferSchemaType<typeof OutreachEmailDraftSchema> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const MODEL_NAME = "OutreachEmailDraft";

export const OutreachEmailDraft: Model<OutreachEmailDraftDocument> =
    (mongoose.models[MODEL_NAME] as Model<OutreachEmailDraftDocument> | undefined) ??
    mongoose.model<OutreachEmailDraftDocument>(MODEL_NAME, OutreachEmailDraftSchema);
