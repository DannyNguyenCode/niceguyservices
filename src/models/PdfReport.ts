import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";

const PdfReportSchema = new Schema(
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
        auditRunId: {
            type: Schema.Types.ObjectId,
            default: null,
        },
        sourceAuditRunId: {
            type: Schema.Types.ObjectId,
            ref: "AuditRun",
            default: null,
            index: true,
        },
        sourceAuditNumber: { type: Number, default: null },
        status: {
            type: String,
            enum: ["queued", "processing", "complete", "failed", "deleted"],
            default: "queued",
            required: true,
        },
        pdfVersion: {
            type: String,
            required: true,
            trim: true,
        },
        source: {
            publicReportVersion: { type: String, required: true },
            publicReportRevision: { type: Number, required: true, min: 1 },
            snapshotChecksum: { type: String, required: true },
            reportTitle: { type: String, required: true, trim: true },
        },
        render: {
            engine: { type: String, required: true },
            engineVersion: { type: String, default: null },
            paperFormat: { type: String, required: true },
            landscape: { type: Boolean, default: false },
            printBackground: { type: Boolean, default: true },
            preferCssPageSize: { type: Boolean, default: true },
            marginTop: { type: String, required: true },
            marginRight: { type: String, required: true },
            marginBottom: { type: String, required: true },
            marginLeft: { type: String, required: true },
        },
        file: {
            provider: { type: String, default: null },
            secureUrl: { type: String, default: null },
            publicId: { type: String, default: null },
            resourceType: { type: String, default: null },
            format: { type: String, default: null },
            filename: { type: String, default: null },
            bytes: { type: Number, default: null },
            pageCount: { type: Number, default: null },
            checksum: { type: String, default: null },
        },
        warnings: [
            {
                code: { type: String, required: true },
                message: { type: String, required: true },
            },
        ],
        generatedAt: { type: Date, default: null },
        startedAt: { type: Date, default: null },
        completedAt: { type: Date, default: null },
        durationMs: { type: Number, default: null },
        errorCode: { type: String, default: null },
        errorMessage: { type: String, default: null },
    },
    {
        timestamps: true,
        collection: MONGODB_COLLECTIONS.pdfReports,
    },
);

PdfReportSchema.index({ websiteId: 1, createdAt: -1 });
PdfReportSchema.index({ publicReportId: 1, createdAt: -1 });
PdfReportSchema.index({
    publicReportId: 1,
    "source.snapshotChecksum": 1,
    pdfVersion: 1,
    status: 1,
});
PdfReportSchema.index({ publicReportId: 1, status: 1 });

export type PdfReportDocument = InferSchemaType<typeof PdfReportSchema> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export type PdfReportLean = {
    _id: string;
    websiteId: string;
    publicReportId: string;
    auditRunId: string | null;
    status: "queued" | "processing" | "complete" | "failed" | "deleted";
    pdfVersion: string;
    source: {
        publicReportVersion: string;
        publicReportRevision: number;
        snapshotChecksum: string;
        reportTitle: string;
    };
    render: {
        engine: string;
        engineVersion: string | null;
        paperFormat: string;
        landscape: boolean;
        printBackground: boolean;
        preferCssPageSize: boolean;
        marginTop: string;
        marginRight: string;
        marginBottom: string;
        marginLeft: string;
    };
    file: {
        provider: string | null;
        secureUrl: string | null;
        publicId: string | null;
        resourceType: string | null;
        format: string | null;
        filename: string | null;
        bytes: number | null;
        pageCount: number | null;
        checksum: string | null;
    } | null;
    warnings: Array<{ code: string; message: string }>;
    generatedAt: Date | null;
    startedAt: Date | null;
    completedAt: Date | null;
    durationMs: number | null;
    errorCode: string | null;
    errorMessage: string | null;
    createdAt: Date;
    updatedAt: Date;
};

const MODEL_NAME = "PdfReport";

export const PdfReport: Model<PdfReportDocument> =
    (mongoose.models[MODEL_NAME] as Model<PdfReportDocument> | undefined) ??
    mongoose.model<PdfReportDocument>(MODEL_NAME, PdfReportSchema);
