import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import { indexWebsiteForeignKey, websiteForeignKey } from "@/src/lib/mongoose-fields";
import { HERO_SUGGESTION_STATUSES } from "@/src/schemas/enums";

const CtaSchema = new Schema(
    {
        label: { type: String, required: true, trim: true },
        hrefSuggestion: { type: String, default: null },
    },
    { _id: false },
);

const DesignDirectionSchema = new Schema(
    {
        layout: { type: String, required: true, trim: true },
        hierarchy: { type: String, required: true, trim: true },
        imagery: { type: String, required: true, trim: true },
        mobileBehavior: { type: String, required: true, trim: true },
        accessibilityNotes: { type: [String], default: [] },
    },
    { _id: false },
);

const TargetProblemSchema = new Schema(
    {
        checkId: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        explanation: { type: String, required: true, trim: true },
    },
    { _id: false },
);

const HeroSuggestionSchema = new Schema(
    {
        websiteId: websiteForeignKey,
        crawlId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "CrawlData",
        },
        niceGuyMetricId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "NiceGuyMetric",
        },
        aiSummaryId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "AiSummary",
        },
        auditRunId: { type: Schema.Types.ObjectId, default: null },
        status: {
            type: String,
            enum: HERO_SUGGESTION_STATUSES,
            required: true,
            default: "draft",
        },
        promptVersion: { type: String, required: true },
        suggestionVersion: { type: String, required: true },
        optionNumber: { type: Number, required: true, min: 1, max: 3 },
        conceptName: { type: String, required: true, trim: true },
        headline: { type: String, required: true, trim: true },
        supportingCopy: { type: String, required: true, trim: true },
        primaryCta: { type: CtaSchema, required: true },
        secondaryCta: { type: CtaSchema, default: null },
        trustSupport: { type: String, default: null },
        designDirection: { type: DesignDirectionSchema, required: true },
        rationale: { type: String, required: true, trim: true },
        targetProblems: { type: [TargetProblemSchema], default: [] },
        constraints: { type: [String], default: [] },
        generatedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
        collection: MONGODB_COLLECTIONS.heroSuggestions,
    },
);

indexWebsiteForeignKey(HeroSuggestionSchema);
HeroSuggestionSchema.index({ websiteId: 1, createdAt: -1 });
HeroSuggestionSchema.index({ aiSummaryId: 1, optionNumber: 1 });
HeroSuggestionSchema.index({ aiSummaryId: 1, status: 1 });

export type HeroSuggestionDocument = InferSchemaType<typeof HeroSuggestionSchema> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const MODEL_NAME = "HeroSuggestion";

export const HeroSuggestion: Model<HeroSuggestionDocument> =
    (mongoose.models[MODEL_NAME] as Model<HeroSuggestionDocument> | undefined) ??
    mongoose.model<HeroSuggestionDocument>(MODEL_NAME, HeroSuggestionSchema);

/** @deprecated Use `HeroSuggestion` model (one document per suggestion). */
export const HeroSuggestions = HeroSuggestion;
