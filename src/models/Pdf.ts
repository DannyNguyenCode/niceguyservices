import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import {
    indexWebsiteForeignKeyUnique,
    websiteForeignKey,
} from "@/src/lib/mongoose-fields";

const PdfSchema = new Schema(
    {
        websiteId: websiteForeignKey,
        generated: {
            type: Boolean,
            default: false,
        },
        version: {
            type: Number,
            default: 1,
            min: 1,
        },
        url: {
            type: String,
            trim: true,
            default: "",
            maxlength: 2048,
        },
        generatedAt: {
            type: Date,
            default: null,
        },
    },
    {
        collection: MONGODB_COLLECTIONS.pdf,
    },
);

indexWebsiteForeignKeyUnique(PdfSchema);

export type PdfDocument = InferSchemaType<typeof PdfSchema> & {
    _id: mongoose.Types.ObjectId;
};

export type PdfLean = {
    _id: string;
    websiteId: string;
    generated: boolean;
    version: number;
    url: string;
    generatedAt: Date | null;
};

const MODEL_NAME = "Pdf";

export const Pdf: Model<PdfDocument> =
    (mongoose.models[MODEL_NAME] as Model<PdfDocument> | undefined) ??
    mongoose.model<PdfDocument>(MODEL_NAME, PdfSchema);
