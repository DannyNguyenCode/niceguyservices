import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import { indexWebsiteForeignKey, websiteForeignKey } from "@/src/lib/mongoose-fields";

const PublicAuditStatusTokenSchema = new Schema(
    {
        tokenHash: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        tokenPrefix: {
            type: String,
            required: true,
            trim: true,
            maxlength: 16,
        },
        websiteId: websiteForeignKey,
        auditRunId: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        auditJobId: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        normalizedDomain: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 253,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        revokedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        collection: MONGODB_COLLECTIONS.publicAuditStatusTokens,
    },
);

indexWebsiteForeignKey(PublicAuditStatusTokenSchema);
PublicAuditStatusTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type PublicAuditStatusTokenDocument = InferSchemaType<
    typeof PublicAuditStatusTokenSchema
> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
};

const MODEL_NAME = "PublicAuditStatusToken";

export const PublicAuditStatusToken: Model<PublicAuditStatusTokenDocument> =
    (mongoose.models[MODEL_NAME] as Model<PublicAuditStatusTokenDocument> | undefined) ??
    mongoose.model<PublicAuditStatusTokenDocument>(MODEL_NAME, PublicAuditStatusTokenSchema);
