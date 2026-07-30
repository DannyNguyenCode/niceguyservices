import { z } from "zod";
import { heroSuggestionStatusSchema } from "@/src/schemas/enums";
import { nullableDateSchema, objectIdSchema, websiteIdSchema } from "@/src/schemas/shared";

const ctaSchema = z.object({
    label: z.string(),
    hrefSuggestion: z.string().nullable().optional(),
});

/** `hero_suggestions` document schema (one suggestion per document). */
export const heroSuggestionSchema = z.object({
    _id: objectIdSchema.optional(),
    websiteId: websiteIdSchema,
    crawlId: objectIdSchema,
    niceGuyMetricId: objectIdSchema,
    aiSummaryId: objectIdSchema,
    auditRunId: objectIdSchema.nullable().default(null),
    status: heroSuggestionStatusSchema.default("draft"),
    promptVersion: z.string().default("hero-suggestions-v1"),
    suggestionVersion: z.string().default("hero-suggestions-v1"),
    optionNumber: z.number().int().min(1).max(3).default(1),
    conceptName: z.string().default(""),
    headline: z.string().default(""),
    supportingCopy: z.string().default(""),
    primaryCta: ctaSchema.default({ label: "" }),
    secondaryCta: ctaSchema.nullable().default(null),
    trustSupport: z.string().nullable().default(null),
    designDirection: z
        .object({
            layout: z.string().default(""),
            hierarchy: z.string().default(""),
            imagery: z.string().default(""),
            mobileBehavior: z.string().default(""),
            accessibilityNotes: z.array(z.string()).default([]),
        })
        .default({
            layout: "",
            hierarchy: "",
            imagery: "",
            mobileBehavior: "",
            accessibilityNotes: [],
        }),
    rationale: z.string().default(""),
    targetProblems: z
        .array(
            z.object({
                checkId: z.string(),
                category: z.string(),
                explanation: z.string(),
            }),
        )
        .default([]),
    constraints: z.array(z.string()).default([]),
    generatedAt: nullableDateSchema.default(null),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type HeroSuggestionItem = z.infer<typeof heroSuggestionSchema>;

/** @deprecated Use `heroSuggestionSchema`. */
export const heroSuggestionsSchema = heroSuggestionSchema;

/** @deprecated Use `HeroSuggestionItem`. */
export type HeroSuggestions = HeroSuggestionItem;

export function emptyHeroSuggestions(
    websiteId: string,
    crawlId = "000000000000000000000000",
    niceGuyMetricId = "000000000000000000000000",
    aiSummaryId = "000000000000000000000000",
): HeroSuggestionItem {
    return heroSuggestionSchema.parse({
        websiteId,
        crawlId,
        niceGuyMetricId,
        aiSummaryId,
    });
}
