import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";

const DemoAssetSchema = new Schema(
    {
        demoProjectId: {
            type: Schema.Types.ObjectId,
            ref: "DemoProject",
            required: true,
            index: true,
        },
        demoGenerationId: {
            type: Schema.Types.ObjectId,
            ref: "DemoGeneration",
            default: null,
        },
        type: {
            type: String,
            enum: [
                "logo",
                "screenshot",
                "reference-image",
                "generated-image",
                "icon",
                "font-reference",
                "content-file",
            ],
            required: true,
        },
        source: {
            type: String,
            enum: ["audit", "administrator", "generated", "placeholder"],
            required: true,
        },
        originalAssetId: { type: Schema.Types.ObjectId, default: null },
        provider: { type: String, default: null },
        secureUrl: { type: String, default: null },
        publicId: { type: String, default: null },
        filename: { type: String, default: null },
        mimeType: { type: String, default: null },
        bytes: { type: Number, default: null },
        approvedForDemo: { type: Boolean, default: false },
        usageMode: {
            type: String,
            enum: ["reference-only", "comparison", "demo-content", "do-not-use"],
            default: "reference-only",
        },
        usageNotes: { type: String, default: null, trim: true },
        label: { type: String, default: null, trim: true },
        pageType: { type: String, default: null, trim: true },
    },
    {
        timestamps: true,
        collection: MONGODB_COLLECTIONS.demoAssets,
    },
);

DemoAssetSchema.index({ demoProjectId: 1, approvedForDemo: 1 });

export type DemoAssetDocument = InferSchemaType<typeof DemoAssetSchema> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const MODEL_NAME = "DemoAsset";

export const DemoAsset: Model<DemoAssetDocument> =
    (mongoose.models[MODEL_NAME] as Model<DemoAssetDocument> | undefined) ??
    mongoose.model<DemoAssetDocument>(MODEL_NAME, DemoAssetSchema);
