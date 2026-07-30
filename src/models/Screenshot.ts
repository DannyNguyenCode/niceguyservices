import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import {
    PAGE_TYPES,
    SCREENSHOT_STATUSES,
    SCREENSHOT_STORAGE_TYPES,
    SCREENSHOT_TYPES,
} from "@/src/schemas/enums";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import { indexWebsiteForeignKey, websiteForeignKey } from "@/src/lib/mongoose-fields";

const ViewportSchema = new Schema(
    {
        width: { type: Number, required: true, min: 1 },
        height: { type: Number, required: true, min: 1 },
        deviceScaleFactor: { type: Number, required: true, default: 1, min: 0.1 },
    },
    { _id: false },
);

const ScreenshotSchema = new Schema(
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
        type: {
            type: String,
            required: true,
            enum: SCREENSHOT_TYPES,
        },
        pageType: {
            type: String,
            required: true,
            enum: PAGE_TYPES,
            default: "home",
        },
        pageUrl: {
            type: String,
            trim: true,
            default: "",
            maxlength: 2048,
        },
        viewport: {
            type: ViewportSchema,
            required: true,
        },
        storageType: {
            type: String,
            required: true,
            enum: SCREENSHOT_STORAGE_TYPES,
            default: "cloudinary",
        },
        filePath: {
            type: String,
            trim: true,
            default: "",
            maxlength: 2048,
        },
        publicUrl: {
            type: String,
            trim: true,
            default: "",
            maxlength: 2048,
        },
        cloudinaryPublicId: {
            type: String,
            trim: true,
            default: "",
            maxlength: 512,
        },
        cloudinaryAssetId: {
            type: String,
            trim: true,
            default: "",
            maxlength: 128,
        },
        cloudinaryVersion: {
            type: Number,
            default: null,
        },
        secureUrl: {
            type: String,
            trim: true,
            default: "",
            maxlength: 2048,
        },
        width: {
            type: Number,
            default: null,
            min: 0,
        },
        height: {
            type: Number,
            default: null,
            min: 0,
        },
        format: {
            type: String,
            trim: true,
            default: "",
            maxlength: 32,
        },
        fileSizeBytes: {
            type: Number,
            default: null,
            min: 0,
        },
        status: {
            type: String,
            required: true,
            enum: SCREENSHOT_STATUSES,
            default: "pending",
        },
        errorMessage: {
            type: String,
            trim: true,
            default: null,
            maxlength: 2000,
        },
        generatedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        collection: MONGODB_COLLECTIONS.screenshots,
    },
);

indexWebsiteForeignKey(ScreenshotSchema);
ScreenshotSchema.index({ websiteId: 1, createdAt: -1 });
ScreenshotSchema.index({ crawlId: 1, type: 1 });
ScreenshotSchema.index({ websiteId: 1, auditRunId: 1, createdAt: -1 });

export type ScreenshotDocument = InferSchemaType<typeof ScreenshotSchema> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export type ScreenshotLean = {
    _id: string;
    websiteId: string;
    crawlId: string;
    type: (typeof SCREENSHOT_TYPES)[number];
    pageType: (typeof PAGE_TYPES)[number];
    pageUrl: string;
    viewport: {
        width: number;
        height: number;
        deviceScaleFactor: number;
    };
    storageType: (typeof SCREENSHOT_STORAGE_TYPES)[number];
    filePath: string;
    publicUrl: string;
    cloudinaryPublicId: string;
    cloudinaryAssetId: string;
    cloudinaryVersion: number | null;
    secureUrl: string;
    width: number | null;
    height: number | null;
    format: string;
    fileSizeBytes: number | null;
    status: (typeof SCREENSHOT_STATUSES)[number];
    errorMessage: string | null;
    generatedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

const MODEL_NAME = "Screenshot";

export const Screenshot: Model<ScreenshotDocument> =
    (mongoose.models[MODEL_NAME] as Model<ScreenshotDocument> | undefined) ??
    mongoose.model<ScreenshotDocument>(MODEL_NAME, ScreenshotSchema);

/** @deprecated Use `Screenshot` model — kept for import compatibility. */
export const Screenshots = Screenshot;

export type ScreenshotsDocument = ScreenshotDocument;
export type ScreenshotsLean = ScreenshotLean;
