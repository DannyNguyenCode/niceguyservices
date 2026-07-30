import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import { indexWebsiteForeignKey, websiteForeignKey } from "@/src/lib/mongoose-fields";
import { AI_METADATA_RELATED_TYPES } from "@/src/schemas/enums";

const AiMetadataSchema = new Schema(
    {
        websiteId: websiteForeignKey,
        crawlId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "CrawlData",
        },
        auditRunId: { type: Schema.Types.ObjectId, default: null },
        relatedType: {
            type: String,
            enum: AI_METADATA_RELATED_TYPES,
            required: true,
        },
        relatedId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        provider: { type: String, required: true, trim: true },
        model: { type: String, required: true, trim: true },
        promptVersion: { type: String, required: true, trim: true },
        analysisVersion: { type: String, required: true, trim: true },
        promptTokens: { type: Number, default: null, min: 0 },
        completionTokens: { type: Number, default: null, min: 0 },
        totalTokens: { type: Number, default: null, min: 0 },
        durationMs: { type: Number, default: null, min: 0 },
        providerRequestId: { type: String, default: null },
        retryCount: { type: Number, default: 0, min: 0 },
        generatedAt: { type: Date, required: true },
    },
    {
        timestamps: true,
        collection: MONGODB_COLLECTIONS.aiMetadata,
    },
);

indexWebsiteForeignKey(AiMetadataSchema);
AiMetadataSchema.index({ relatedType: 1, relatedId: 1 });

export type AiMetadataDocument = InferSchemaType<typeof AiMetadataSchema> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const MODEL_NAME = "AiMetadata";

export const AiMetadata: Model<AiMetadataDocument> =
    (mongoose.models[MODEL_NAME] as Model<AiMetadataDocument> | undefined) ??
    mongoose.model<AiMetadataDocument>(MODEL_NAME, AiMetadataSchema);
