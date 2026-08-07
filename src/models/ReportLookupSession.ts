import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";

const ReportLookupSessionSchema = new Schema(
    {
        tokenHash: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        normalizedEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 254,
            index: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },
        revokedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        collection: MONGODB_COLLECTIONS.reportLookupSessions,
    },
);

ReportLookupSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type ReportLookupSessionDocument = InferSchemaType<typeof ReportLookupSessionSchema> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
};

const MODEL_NAME = "ReportLookupSession";

export const ReportLookupSession: Model<ReportLookupSessionDocument> =
    (mongoose.models[MODEL_NAME] as Model<ReportLookupSessionDocument> | undefined) ??
    mongoose.model<ReportLookupSessionDocument>(MODEL_NAME, ReportLookupSessionSchema);
