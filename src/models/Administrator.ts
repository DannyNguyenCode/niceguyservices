import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const administratorSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            index: true,
        },
        passwordHash: { type: String, required: true, select: false },
        role: {
            type: String,
            enum: ["owner", "admin"],
            default: "admin",
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
            required: true,
        },
        lastLoginAt: { type: Date, default: null },
        sessionVersion: { type: Number, default: 1, min: 1 },
    },
    {
        collection: "administrators",
        timestamps: true,
    },
);

administratorSchema.index({ status: 1 });

export type AdministratorLean = InferSchemaType<typeof administratorSchema> & {
    _id: mongoose.Types.ObjectId;
};

export const Administrator =
    (mongoose.models.Administrator as Model<AdministratorLean>) ||
    mongoose.model<AdministratorLean>("Administrator", administratorSchema);
