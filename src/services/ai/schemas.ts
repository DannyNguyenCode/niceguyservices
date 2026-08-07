import { z } from "zod";
import { AI_LENGTH_LIMITS } from "@/src/services/ai/constants";

const prioritySchema = z.enum(["high", "medium", "low"]);
const impactSchema = z.enum(["high", "medium", "low"]);
const effortSchema = z.enum(["low", "medium", "high"]);

function wordCount(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

function wordRangeSchema(min: number, max: number) {
    return z
        .string()
        .min(1)
        .refine((value) => {
            const count = wordCount(value);
            return count >= min && count <= max;
        }, `Must be between ${min} and ${max} words`);
}

function descriptionSchema() {
    return z
        .string()
        .min(1)
        .refine(
            (value) => wordCount(value) <= AI_LENGTH_LIMITS.itemDescriptionWords,
            `Description must be at most ${AI_LENGTH_LIMITS.itemDescriptionWords} words`,
        );
}

const evidenceIdsSchema = z.array(z.string().min(1)).min(1);

export const aiSummaryOutputSchema = z.object({
    executiveSummary: wordRangeSchema(
        AI_LENGTH_LIMITS.executiveSummaryWords.min,
        AI_LENGTH_LIMITS.executiveSummaryWords.max,
    ),
    businessImpactSummary: wordRangeSchema(
        AI_LENGTH_LIMITS.businessImpactSummaryWords.min,
        AI_LENGTH_LIMITS.businessImpactSummaryWords.max,
    ),
    strengths: z
        .array(
            z.object({
                title: z.string().min(1),
                description: descriptionSchema(),
                category: z.string().nullable().optional(),
                evidenceCheckIds: evidenceIdsSchema,
            }),
        )
        .min(AI_LENGTH_LIMITS.strengths.min)
        .max(AI_LENGTH_LIMITS.strengths.max),
    weaknesses: z
        .array(
            z.object({
                title: z.string().min(1),
                description: descriptionSchema(),
                category: z.string().nullable().optional(),
                priority: prioritySchema,
                evidenceCheckIds: evidenceIdsSchema,
            }),
        )
        .min(AI_LENGTH_LIMITS.weaknesses.min)
        .max(AI_LENGTH_LIMITS.weaknesses.max),
    quickWins: z
        .array(
            z.object({
                title: z.string().min(1),
                description: descriptionSchema(),
                expectedImpact: impactSchema,
                estimatedEffort: effortSchema,
                category: z.string().nullable().optional(),
                evidenceCheckIds: evidenceIdsSchema,
            }),
        )
        .min(AI_LENGTH_LIMITS.quickWins.min)
        .max(AI_LENGTH_LIMITS.quickWins.max),
    longTermRecommendations: z
        .array(
            z.object({
                title: z.string().min(1),
                description: descriptionSchema(),
                priority: prioritySchema,
                estimatedEffort: effortSchema,
                category: z.string().nullable().optional(),
                evidenceCheckIds: evidenceIdsSchema,
            }),
        )
        .min(AI_LENGTH_LIMITS.longTermRecommendations.min)
        .max(AI_LENGTH_LIMITS.longTermRecommendations.max),
    priorityOrder: z
        .array(
            z.object({
                rank: z.number().int().positive(),
                title: z.string().min(1),
                reason: descriptionSchema(),
                priority: prioritySchema,
                evidenceCheckIds: evidenceIdsSchema,
            }),
        )
        .min(AI_LENGTH_LIMITS.priorityOrder.min)
        .max(AI_LENGTH_LIMITS.priorityOrder.max),
    disclaimers: z
        .array(z.string().min(1))
        .min(AI_LENGTH_LIMITS.disclaimers.min)
        .max(AI_LENGTH_LIMITS.disclaimers.max),
});

const ctaSchema = z.object({
    label: z.string().min(1),
    hrefSuggestion: z.string().nullable().optional(),
});

export const heroSuggestionItemSchema = z.object({
    conceptName: z.string().min(1),
    headline: z.string().min(1),
    supportingCopy: z.string().min(1),
    primaryCta: ctaSchema,
    secondaryCta: ctaSchema.nullable().optional(),
    trustSupport: z.string().nullable().optional(),
    designDirection: z.object({
        layout: z.string().min(1),
        hierarchy: z.string().min(1),
        imagery: z.string().min(1),
        mobileBehavior: z.string().min(1),
        accessibilityNotes: z.array(z.string().min(1)).min(1),
    }),
    rationale: z.string().min(1),
    targetProblems: z
        .array(
            z.object({
                checkId: z.string().min(1),
                category: z.string().min(1),
                explanation: z.string().min(1),
            }),
        )
        .min(1),
    constraints: z.array(z.string().min(1)),
});

export const heroSuggestionsOutputSchema = z.object({
    suggestions: z
        .array(heroSuggestionItemSchema)
        .length(AI_LENGTH_LIMITS.heroSuggestions),
});

export const providerMetadataSchema = z.object({
    model: z.string().min(1),
    promptTokens: z.number().nullable().optional(),
    completionTokens: z.number().nullable().optional(),
    totalTokens: z.number().nullable().optional(),
    durationMs: z.number().nullable().optional(),
    providerRequestId: z.string().nullable().optional(),
});

export function parseAiSummaryOutput(raw: unknown) {
    return aiSummaryOutputSchema.parse(raw);
}

export function parseHeroSuggestionsOutput(raw: unknown) {
    return heroSuggestionsOutputSchema.parse(raw);
}

export function safeParseAiSummaryOutput(raw: unknown) {
    return aiSummaryOutputSchema.safeParse(raw);
}

export function safeParseHeroSuggestionsOutput(raw: unknown) {
    return heroSuggestionsOutputSchema.safeParse(raw);
}
