import { z } from "zod";

export const demoPageSchema = z.enum(["home", "services", "about", "contact", "resources"]);

export const demoConfigurationSchema = z.object({
    architecture: z.enum(["single-page", "multi-page"]).optional(),
    pages: z.array(demoPageSchema).min(1).optional(),
    visualDirection: z
        .enum([
            "modern-professional",
            "warm-trustworthy",
            "bold-conversion",
            "clean-minimal",
            "custom",
        ])
        .optional(),
    devicePriority: z.enum(["mobile-first", "balanced", "desktop-showcase"]).optional(),
    includeAuditComparison: z.boolean().optional(),
    includeDemoBanner: z.boolean().optional(),
    includePlaceholderForms: z.boolean().optional(),
    includePlaceholderContactInfo: z.boolean().optional(),
    useApprovedHeroConcept: z.boolean().optional(),
    useExistingLogo: z.boolean().optional(),
    useExistingImages: z.boolean().optional(),
    customDirectionNotes: z.string().max(1000).nullable().optional(),
});

export const demoApprovedFactsSchema = z
    .object({
        businessName: z.boolean().optional(),
        industry: z.boolean().optional(),
        location: z.boolean().optional(),
        services: z.boolean().optional(),
        contactInformation: z.boolean().optional(),
        logo: z.boolean().optional(),
        images: z.boolean().optional(),
        brandColours: z.boolean().optional(),
        existingCopyExcerpts: z.boolean().optional(),
    })
    .partial();

export const demoContentPolicySchema = z.object({
    mode: z
        .enum([
            "placeholder-only",
            "approved-facts-only",
            "approved-facts-with-rewritten-copy",
        ])
        .optional(),
    disclaimerRequired: z.boolean().optional(),
    inventedClaimsForbidden: z.boolean().optional(),
});

export const demoHeroConceptSchema = z.object({
    headline: z.string().min(1).max(200),
    supportingCopy: z.string().min(1).max(2000),
    primaryCta: z.string().min(1).max(80),
    secondaryCta: z.string().max(80).nullable().optional(),
});

export const demoRejectionSchema = z.object({
    reason: z.enum(["design", "content", "accuracy", "technical", "assets", "other"]),
    notes: z.string().max(2000).optional(),
});

export const createDemoProjectSchema = z.object({
    configuration: demoConfigurationSchema.optional(),
    approvedFacts: demoApprovedFactsSchema.optional(),
    contentPolicy: demoContentPolicySchema.optional(),
    selectedHeroSuggestionId: z.string().nullable().optional(),
    editedHeroConcept: demoHeroConceptSchema.nullable().optional(),
    demoBusinessName: z.string().max(120).nullable().optional(),
});

export const updateDemoProjectSchema = z.object({
    status: z.enum(["draft", "ready"]).optional(),
    configuration: demoConfigurationSchema.optional(),
    approvedFacts: demoApprovedFactsSchema.optional(),
    contentPolicy: demoContentPolicySchema.optional(),
    selectedHeroSuggestionId: z.string().nullable().optional(),
    editedHeroConcept: demoHeroConceptSchema.nullable().optional(),
});
