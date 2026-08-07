import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import {
    DEMO_GENERATION_VERSION,
    DEMO_SPEC_VERSION,
    DEFAULT_APPROVED_FACTS,
    DEFAULT_CONTENT_POLICY,
    DEFAULT_DEMO_CONFIGURATION,
} from "@/src/services/demo/constants";

const DemoProjectSchema = new Schema(
    {
        websiteId: {
            type: Schema.Types.ObjectId,
            ref: "Website",
            required: true,
            index: true,
        },
        publicReportId: {
            type: Schema.Types.ObjectId,
            ref: "PublicReport",
            required: true,
            index: true,
        },
        sourceAuditRunId: {
            type: Schema.Types.ObjectId,
            ref: "AuditRun",
            default: null,
            index: true,
        },
        sourceAuditNumber: { type: Number, default: null },
        aiSummaryId: {
            type: Schema.Types.ObjectId,
            default: null,
        },
        status: {
            type: String,
            enum: ["draft", "ready", "generating", "review", "approved", "rejected", "archived"],
            default: "draft",
            required: true,
        },
        deploymentState: {
            type: String,
            enum: ["not-deployed", "preview-private", "preview-public", "archived"],
            default: "preview-private",
            required: true,
        },
        demoGenerationVersion: {
            type: String,
            required: true,
            default: DEMO_GENERATION_VERSION,
        },
        demoSpecVersion: {
            type: String,
            required: true,
            default: DEMO_SPEC_VERSION,
        },
        previewTokenHash: { type: String, default: null },
        previewTokenPrefix: { type: String, default: null },
        previewPath: { type: String, default: null },
        source: {
            publicReportVersion: { type: String, required: true },
            publicReportRevision: { type: Number, required: true, min: 1 },
            snapshotChecksum: { type: String, required: true },
            heroSuggestionIds: [{ type: Schema.Types.ObjectId }],
            screenshotIds: [{ type: Schema.Types.ObjectId }],
        },
        business: {
            originalBusinessName: { type: String, default: null, trim: true },
            demoBusinessName: { type: String, required: true, trim: true },
            domain: { type: String, default: null, trim: true },
            industry: { type: String, default: null, trim: true },
            location: { type: String, default: null, trim: true },
        },
        configuration: {
            architecture: {
                type: String,
                enum: ["single-page", "multi-page"],
                default: DEFAULT_DEMO_CONFIGURATION.architecture,
            },
            pages: {
                type: [String],
                default: DEFAULT_DEMO_CONFIGURATION.pages,
            },
            visualDirection: {
                type: String,
                enum: [
                    "modern-professional",
                    "warm-trustworthy",
                    "bold-conversion",
                    "clean-minimal",
                    "custom",
                ],
                default: DEFAULT_DEMO_CONFIGURATION.visualDirection,
            },
            devicePriority: {
                type: String,
                enum: ["mobile-first", "balanced", "desktop-showcase"],
                default: DEFAULT_DEMO_CONFIGURATION.devicePriority,
            },
            includeAuditComparison: {
                type: Boolean,
                default: DEFAULT_DEMO_CONFIGURATION.includeAuditComparison,
            },
            includeDemoBanner: {
                type: Boolean,
                default: DEFAULT_DEMO_CONFIGURATION.includeDemoBanner,
            },
            includePlaceholderForms: {
                type: Boolean,
                default: DEFAULT_DEMO_CONFIGURATION.includePlaceholderForms,
            },
            includePlaceholderContactInfo: {
                type: Boolean,
                default: DEFAULT_DEMO_CONFIGURATION.includePlaceholderContactInfo,
            },
            useApprovedHeroConcept: {
                type: Boolean,
                default: DEFAULT_DEMO_CONFIGURATION.useApprovedHeroConcept,
            },
            useExistingLogo: {
                type: Boolean,
                default: DEFAULT_DEMO_CONFIGURATION.useExistingLogo,
            },
            useExistingImages: {
                type: Boolean,
                default: DEFAULT_DEMO_CONFIGURATION.useExistingImages,
            },
            customDirectionNotes: { type: String, default: null, trim: true },
        },
        approvedFacts: {
            businessName: { type: Boolean, default: DEFAULT_APPROVED_FACTS.businessName },
            industry: { type: Boolean, default: DEFAULT_APPROVED_FACTS.industry },
            location: { type: Boolean, default: DEFAULT_APPROVED_FACTS.location },
            services: { type: Boolean, default: DEFAULT_APPROVED_FACTS.services },
            contactInformation: {
                type: Boolean,
                default: DEFAULT_APPROVED_FACTS.contactInformation,
            },
            logo: { type: Boolean, default: DEFAULT_APPROVED_FACTS.logo },
            images: { type: Boolean, default: DEFAULT_APPROVED_FACTS.images },
            brandColours: { type: Boolean, default: DEFAULT_APPROVED_FACTS.brandColours },
            existingCopyExcerpts: {
                type: Boolean,
                default: DEFAULT_APPROVED_FACTS.existingCopyExcerpts,
            },
            certifications: { type: Boolean, default: DEFAULT_APPROVED_FACTS.certifications },
            licences: { type: Boolean, default: DEFAULT_APPROVED_FACTS.licences },
            insurance: { type: Boolean, default: DEFAULT_APPROVED_FACTS.insurance },
            awards: { type: Boolean, default: DEFAULT_APPROVED_FACTS.awards },
            ratings: { type: Boolean, default: DEFAULT_APPROVED_FACTS.ratings },
            reviews: { type: Boolean, default: DEFAULT_APPROVED_FACTS.reviews },
            yearsInBusiness: { type: Boolean, default: DEFAULT_APPROVED_FACTS.yearsInBusiness },
            emergencyAvailability: {
                type: Boolean,
                default: DEFAULT_APPROVED_FACTS.emergencyAvailability,
            },
            guarantees: { type: Boolean, default: DEFAULT_APPROVED_FACTS.guarantees },
            financing: { type: Boolean, default: DEFAULT_APPROVED_FACTS.financing },
            legalCompliance: { type: Boolean, default: DEFAULT_APPROVED_FACTS.legalCompliance },
        },
        contentPolicy: {
            mode: {
                type: String,
                enum: [
                    "placeholder-only",
                    "approved-facts-only",
                    "approved-facts-with-rewritten-copy",
                ],
                default: DEFAULT_CONTENT_POLICY.mode,
            },
            disclaimerRequired: {
                type: Boolean,
                default: DEFAULT_CONTENT_POLICY.disclaimerRequired,
            },
            inventedClaimsForbidden: {
                type: Boolean,
                default: DEFAULT_CONTENT_POLICY.inventedClaimsForbidden,
            },
        },
        selectedHeroSuggestionId: { type: Schema.Types.ObjectId, default: null },
        editedHeroConcept: {
            headline: { type: String, default: null, trim: true },
            supportingCopy: { type: String, default: null, trim: true },
            primaryCta: { type: String, default: null, trim: true },
            secondaryCta: { type: String, default: null, trim: true },
        },
        currentGenerationId: { type: Schema.Types.ObjectId, default: null },
        rejectionReason: {
            type: String,
            enum: ["design", "content", "accuracy", "technical", "assets", "other", null],
            default: null,
        },
        rejectionNotes: { type: String, default: null, trim: true },
        approvedAt: { type: Date, default: null },
        rejectedAt: { type: Date, default: null },
        archivedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
        collection: MONGODB_COLLECTIONS.demoProjects,
    },
);

DemoProjectSchema.index({ websiteId: 1, createdAt: -1 });
DemoProjectSchema.index({ publicReportId: 1, createdAt: -1 });
DemoProjectSchema.index({ websiteId: 1, status: 1 });
DemoProjectSchema.index({ previewTokenHash: 1 }, { sparse: true });

export type DemoProjectDocument = InferSchemaType<typeof DemoProjectSchema> & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const MODEL_NAME = "DemoProject";

export const DemoProject: Model<DemoProjectDocument> =
    (mongoose.models[MODEL_NAME] as Model<DemoProjectDocument> | undefined) ??
    mongoose.model<DemoProjectDocument>(MODEL_NAME, DemoProjectSchema);
