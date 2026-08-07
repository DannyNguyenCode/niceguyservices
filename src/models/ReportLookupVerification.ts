import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";

const ReportLookupVerificationSchema = new Schema(
    {
        normalizedEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 254,
            index: true,
        },
        codeHash: {
            type: String,
            required: true,
            trim: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },
        attemptCount: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        consumedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        collection: MONGODB_COLLECTIONS.reportLookupVerifications,
    },
);

ReportLookupVerificationSchema.index({ normalizedEmail: 1, createdAt: -1 });
ReportLookupVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type ReportLookupVerificationDocument = InferSchemaType<
    typeof ReportLookupVerificationSchema
> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
};

const MODEL_NAME = "ReportLookupVerification";

export const ReportLookupVerification: Model<ReportLookupVerificationDocument> =
    (mongoose.models[MODEL_NAME] as Model<ReportLookupVerificationDocument> | undefined) ??
    mongoose.model<ReportLookupVerificationDocument>(MODEL_NAME, ReportLookupVerificationSchema);
