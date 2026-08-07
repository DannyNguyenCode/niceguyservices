import { z } from "zod";
import { aiSummaryStatusSchema } from "@/src/schemas/enums";
import { nullableDateSchema, objectIdSchema, websiteIdSchema } from "@/src/schemas/shared";

const evidenceItemSchema = z.object({
    title: z.string(),
    description: z.string(),
    category: z.string().nullable().optional(),
    evidenceCheckIds: z.array(z.string()).default([]),
});

/** `ai_summary` document schema. */
export const aiSummarySchema = z.object({
    _id: objectIdSchema.optional(),
    websiteId: websiteIdSchema,
    crawlId: objectIdSchema,
    niceGuyMetricId: objectIdSchema,
    auditRunId: objectIdSchema.nullable().default(null),
    status: aiSummaryStatusSchema.default("queued"),
    analysisVersion: z.string().default("audit-analysis-v1"),
    promptVersion: z.string().default("audit-analysis-v1"),
    sourceSnapshot: z
        .object({
            scoringVersion: z.string().default("niceguy-v1"),
            overallScore: z.number().default(0),
            categoryScores: z.record(z.string(), z.number().nullable()).default({}),
            mobilePageSpeedAvailable: z.boolean().default(false),
            desktopPageSpeedAvailable: z.boolean().default(false),
            screenshotCount: z.number().default(0),
            pageCount: z.number().default(0),
        })
        .default({
            scoringVersion: "niceguy-v1",
            overallScore: 0,
            categoryScores: {},
            mobilePageSpeedAvailable: false,
            desktopPageSpeedAvailable: false,
            screenshotCount: 0,
            pageCount: 0,
        }),
    executiveSummary: z.string().default(""),
    businessImpactSummary: z.string().default(""),
    strengths: z.array(evidenceItemSchema).default([]),
    weaknesses: z.array(evidenceItemSchema.extend({ priority: z.string() })).default([]),
    quickWins: z
        .array(
            evidenceItemSchema.extend({
                expectedImpact: z.string(),
                estimatedEffort: z.string(),
            }),
        )
        .default([]),
    longTermRecommendations: z
        .array(
            evidenceItemSchema.extend({
                priority: z.string(),
                estimatedEffort: z.string(),
            }),
        )
        .default([]),
    priorityOrder: z
        .array(
            z.object({
                rank: z.number(),
                title: z.string(),
                reason: z.string(),
                priority: z.string(),
                evidenceCheckIds: z.array(z.string()).default([]),
            }),
        )
        .default([]),
    disclaimers: z.array(z.string()).default([]),
    generatedAt: nullableDateSchema.default(null),
    durationMs: z.number().nullable().default(null),
    errorCode: z.string().nullable().default(null),
    errorMessage: z.string().nullable().default(null),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type AiSummary = z.infer<typeof aiSummarySchema>;

export function emptyAiSummary(
    websiteId: string,
    crawlId = "000000000000000000000000",
    niceGuyMetricId = "000000000000000000000000",
): AiSummary {
    return aiSummarySchema.parse({ websiteId, crawlId, niceGuyMetricId });
}
