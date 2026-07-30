import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import {
    indexWebsiteForeignKeyUnique,
    websiteForeignKey,
} from "@/src/lib/mongoose-fields";

const DemoSchema = new Schema(
    {
        websiteId: websiteForeignKey,
        exists: {
            type: Boolean,
            default: false,
        },
        published: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            trim: true,
            default: "",
            maxlength: 500,
        },
        description: {
            type: String,
            trim: true,
            default: "",
            maxlength: 5000,
        },
        url: {
            type: String,
            trim: true,
            default: "",
            maxlength: 2048,
        },
        previewImage: {
            type: String,
            trim: true,
            default: "",
            maxlength: 2048,
        },
        publishedAt: {
            type: Date,
            default: null,
        },
    },
    {
        collection: MONGODB_COLLECTIONS.demo,
    },
);

indexWebsiteForeignKeyUnique(DemoSchema);

export type DemoDocument = InferSchemaType<typeof DemoSchema> & {
    _id: mongoose.Types.ObjectId;
};

export type DemoLean = {
    _id: string;
    websiteId: string;
    exists: boolean;
    published: boolean;
    title: string;
    description: string;
    url: string;
    previewImage: string;
    publishedAt: Date | null;
};

const MODEL_NAME = "Demo";

export const Demo: Model<DemoDocument> =
    (mongoose.models[MODEL_NAME] as Model<DemoDocument> | undefined) ??
    mongoose.model<DemoDocument>(MODEL_NAME, DemoSchema);
