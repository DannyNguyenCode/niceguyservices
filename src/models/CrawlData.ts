import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import {
    CRAWL_STATUSES,
    PAGE_TYPES,
} from "@/src/schemas/enums";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import { indexWebsiteForeignKey, websiteForeignKey } from "@/src/lib/mongoose-fields";

const CrawlHeadingSchema = new Schema(
    {
        level: { type: Number, required: true, min: 1, max: 6 },
        text: { type: String, trim: true, default: "" },
    },
    { _id: false },
);

const CrawlButtonSchema = new Schema(
    {
        text: { type: String, trim: true, default: "" },
        href: { type: String, trim: true, default: "" },
    },
    { _id: false },
);

const CrawlFormFieldSchema = new Schema(
    {
        type: { type: String, trim: true, default: "" },
        name: { type: String, trim: true, default: "" },
        label: { type: String, trim: true, default: "" },
        required: { type: Boolean, default: false },
    },
    { _id: false },
);

const CrawlFormSchema = new Schema(
    {
        action: { type: String, trim: true, default: "" },
        method: { type: String, trim: true, default: "" },
        fields: { type: [CrawlFormFieldSchema], default: [] },
    },
    { _id: false },
);

const CrawlImageSchema = new Schema(
    {
        src: { type: String, trim: true, default: "" },
        alt: { type: String, trim: true, default: "" },
    },
    { _id: false },
);

const CrawlPageResultSchema = new Schema(
    {
        url: { type: String, required: true, trim: true },
        path: { type: String, required: true, trim: true },
        pageType: {
            type: String,
            required: true,
            enum: PAGE_TYPES,
            default: "other",
        },
        title: { type: String, trim: true, default: "" },
        metaDescription: { type: String, trim: true, default: "", maxlength: 2000 },
        headings: { type: [CrawlHeadingSchema], default: [] },
        buttons: { type: [CrawlButtonSchema], default: [] },
        forms: { type: [CrawlFormSchema], default: [] },
        images: { type: [CrawlImageSchema], default: [] },
        visibleText: { type: String, trim: true, default: "", maxlength: 15_500 },
        statusCode: { type: Number, default: null },
        loadDurationMs: { type: Number, default: null, min: 0 },
        errorMessage: { type: String, trim: true, default: null, maxlength: 2000 },
    },
    { _id: false },
);

const CrawlDataSchema = new Schema(
    {
        websiteId: websiteForeignKey,
        auditRunId: {
            type: Schema.Types.ObjectId,
            ref: "AuditRun",
            default: null,
            index: true,
        },
        status: {
            type: String,
            required: true,
            enum: CRAWL_STATUSES,
            default: "not-started",
        },
        idempotencyKey: {
            type: String,
            trim: true,
            default: null,
            index: true,
        },
        attempt: { type: Number, default: 1, min: 1 },
        heartbeatAt: { type: Date, default: null },
        startedAt: {
            type: Date,
            default: null,
        },
        completedAt: {
            type: Date,
            default: null,
        },
        requestedUrl: {
            type: String,
            trim: true,
            default: "",
            maxlength: 2048,
        },
        finalUrl: {
            type: String,
            trim: true,
            default: "",
            maxlength: 2048,
        },
        homepageTitle: {
            type: String,
            trim: true,
            default: "",
            maxlength: 500,
        },
        metaDescription: {
            type: String,
            trim: true,
            default: "",
            maxlength: 2000,
        },
        language: {
            type: String,
            trim: true,
            default: "",
            maxlength: 32,
        },
        pagesDiscovered: {
            type: Number,
            default: 0,
            min: 0,
        },
        pagesCrawled: {
            type: Number,
            default: 0,
            min: 0,
        },
        internalLinks: {
            type: [String],
            default: [],
        },
        externalLinks: {
            type: [String],
            default: [],
        },
        emailsFound: {
            type: [String],
            default: [],
        },
        phoneNumbersFound: {
            type: [String],
            default: [],
        },
        socialLinks: {
            type: [String],
            default: [],
        },
        hasAboutPage: {
            type: Boolean,
            default: false,
        },
        hasContactPage: {
            type: Boolean,
            default: false,
        },
        hasServicesPage: {
            type: Boolean,
            default: false,
        },
        hasPrivacyPolicy: {
            type: Boolean,
            default: false,
        },
        hasTerms: {
            type: Boolean,
            default: false,
        },
        pageResults: {
            type: [CrawlPageResultSchema],
            default: [],
        },
        crawlDurationMs: {
            type: Number,
            default: 0,
            min: 0,
        },
        errorMessage: {
            type: String,
            trim: true,
            default: null,
            maxlength: 5000,
        },
    },
    {
        timestamps: true,
        collection: MONGODB_COLLECTIONS.crawlData,
    },
);

indexWebsiteForeignKey(CrawlDataSchema);
CrawlDataSchema.index({ websiteId: 1, createdAt: -1 });
CrawlDataSchema.index({ websiteId: 1, auditRunId: 1 });
CrawlDataSchema.index({ websiteId: 1, status: 1 });
CrawlDataSchema.index(
    { idempotencyKey: 1 },
    {
        unique: true,
        partialFilterExpression: {
            idempotencyKey: { $type: "string" },
            status: { $in: ["queued", "processing"] },
        },
    },
);

export type CrawlDataDocument = InferSchemaType<typeof CrawlDataSchema> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export type CrawlDataLean = {
    auditRunId: string | null;
    _id: string;
    websiteId: string;
    status: (typeof CRAWL_STATUSES)[number];
    attempt: number;
    heartbeatAt: Date | null;
    startedAt: Date | null;
    completedAt: Date | null;
    requestedUrl: string;
    finalUrl: string;
    homepageTitle: string;
    metaDescription: string;
    language: string;
    pagesDiscovered: number;
    pagesCrawled: number;
    internalLinks: string[];
    externalLinks: string[];
    emailsFound: string[];
    phoneNumbersFound: string[];
    socialLinks: string[];
    hasAboutPage: boolean;
    hasContactPage: boolean;
    hasServicesPage: boolean;
    hasPrivacyPolicy: boolean;
    hasTerms: boolean;
    pageResults: Array<{
        url: string;
        path: string;
        pageType: (typeof PAGE_TYPES)[number];
        title?: string;
        metaDescription?: string;
        headings: Array<{ level: number; text: string }>;
        buttons: Array<{ text: string; href?: string }>;
        forms: Array<{
            action?: string;
            method?: string;
            fields: Array<{
                type?: string;
                name?: string;
                label?: string;
                required: boolean;
            }>;
        }>;
        images: Array<{ src?: string; alt?: string }>;
        visibleText?: string;
        statusCode?: number | null;
        loadDurationMs?: number | null;
        errorMessage?: string | null;
    }>;
    crawlDurationMs: number;
    errorMessage: string | null;
    createdAt: Date;
    updatedAt: Date;
};

const MODEL_NAME = "CrawlData";

export const CrawlData: Model<CrawlDataDocument> =
    (mongoose.models[MODEL_NAME] as Model<CrawlDataDocument> | undefined) ??
    mongoose.model<CrawlDataDocument>(MODEL_NAME, CrawlDataSchema);
