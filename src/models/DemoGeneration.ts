import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import {
    DEMO_GENERATION_VERSION,
    DEMO_SPEC_VERSION,
} from "@/src/services/demo/constants";

const ValidationIssueSchema = new Schema(
    {
        code: { type: String, required: true },
        message: { type: String, required: true },
        filePath: { type: String, default: null },
    },
    { _id: false },
);

const DemoGenerationSchema = new Schema(
    {
        demoProjectId: {
            type: Schema.Types.ObjectId,
            ref: "DemoProject",
            required: true,
            index: true,
        },
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
        },
        status: {
            type: String,
            enum: [
                "queued",
                "preparing",
                "generating",
                "validating",
                "complete",
                "failed",
                "cancelled",
            ],
            default: "queued",
            required: true,
        },
        generationVersion: {
            type: String,
            required: true,
            default: DEMO_GENERATION_VERSION,
        },
        specVersion: {
            type: String,
            required: true,
            default: DEMO_SPEC_VERSION,
        },
        source: {
            snapshotChecksum: { type: String, required: true },
            publicReportRevision: { type: Number, required: true, min: 1 },
            heroSuggestionIds: [{ type: Schema.Types.ObjectId }],
            screenshotIds: [{ type: Schema.Types.ObjectId }],
        },
        provider: {
            name: { type: String, required: true },
            model: { type: String, default: null },
            providerRequestId: { type: String, default: null },
            providerRunUrl: { type: String, default: null },
        },
        workspace: {
            repository: { type: String, default: null },
            branch: { type: String, default: null },
            commitSha: { type: String, default: null },
            outputPath: { type: String, default: null },
        },
        output: {
            framework: { type: String, default: null },
            packageManager: { type: String, default: null },
            pagesGenerated: { type: [String], default: [] },
            componentsGenerated: { type: [String], default: [] },
            filesChanged: { type: [String], default: [] },
            previewUrl: { type: String, default: null },
            buildStatus: { type: String, default: null },
            buildOutput: { type: String, default: null },
        },
        validation: {
            passed: { type: Boolean, default: false },
            errors: { type: [ValidationIssueSchema], default: [] },
            warnings: { type: [ValidationIssueSchema], default: [] },
        },
        startedAt: { type: Date, default: null },
        completedAt: { type: Date, default: null },
        durationMs: { type: Number, default: null },
        errorCode: { type: String, default: null },
        errorMessage: { type: String, default: null },
    },
    {
        timestamps: true,
        collection: MONGODB_COLLECTIONS.demoGenerations,
    },
);

DemoGenerationSchema.index({ demoProjectId: 1, createdAt: -1 });
DemoGenerationSchema.index({ demoProjectId: 1, status: 1 });

export type DemoGenerationDocument = InferSchemaType<typeof DemoGenerationSchema> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const MODEL_NAME = "DemoGeneration";

export const DemoGeneration: Model<DemoGenerationDocument> =
    (mongoose.models[MODEL_NAME] as Model<DemoGenerationDocument> | undefined) ??
    mongoose.model<DemoGenerationDocument>(MODEL_NAME, DemoGenerationSchema);
