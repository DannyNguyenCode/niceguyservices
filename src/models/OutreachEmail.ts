import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import {
    indexWebsiteForeignKeyUnique,
    websiteForeignKey,
} from "@/src/lib/mongoose-fields";

const OutreachEmailSchema = new Schema(
    {
        websiteId: websiteForeignKey,
        subject: {
            type: String,
            trim: true,
            default: "",
            maxlength: 500,
        },
        body: {
            type: String,
            trim: true,
            default: "",
            maxlength: 50000,
        },
        generated: {
            type: Boolean,
            default: false,
        },
        approved: {
            type: Boolean,
            default: false,
        },
        sent: {
            type: Boolean,
            default: false,
        },
        sentAt: {
            type: Date,
            default: null,
        },
        opened: {
            type: Boolean,
            default: false,
        },
        openedAt: {
            type: Date,
            default: null,
        },
        replied: {
            type: Boolean,
            default: false,
        },
        repliedAt: {
            type: Date,
            default: null,
        },
    },
    {
        collection: MONGODB_COLLECTIONS.outreachEmail,
    },
);

indexWebsiteForeignKeyUnique(OutreachEmailSchema);

export type OutreachEmailDocument = InferSchemaType<typeof OutreachEmailSchema> & {
    _id: mongoose.Types.ObjectId;
};

export type OutreachEmailLean = {
    _id: string;
    websiteId: string;
    subject: string;
    body: string;
    generated: boolean;
    approved: boolean;
    sent: boolean;
    sentAt: Date | null;
    opened: boolean;
    openedAt: Date | null;
    replied: boolean;
    repliedAt: Date | null;
};

const MODEL_NAME = "OutreachEmail";

export const OutreachEmail: Model<OutreachEmailDocument> =
    (mongoose.models[MODEL_NAME] as Model<OutreachEmailDocument> | undefined) ??
    mongoose.model<OutreachEmailDocument>(MODEL_NAME, OutreachEmailSchema);
