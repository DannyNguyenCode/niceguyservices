import { z } from "zod";
import { niceGuyMetricStatusSchema } from "@/src/schemas/enums";
import { objectIdSchema, scoreSchema, websiteIdSchema } from "@/src/schemas/shared";
import { NICEGUY_SCORING_VERSION } from "@/src/config/niceguy-scoring";

export const NICEGUY_CATEGORY_KEYS = [
    "businessClarity",
    "trustCredibility",
    "conversionReadiness",
    "userExperience",
    "brandingConsistency",
    "contentQuality",
    "technicalFoundation",
] as const;

export type NiceGuyCategoryKey = (typeof NICEGUY_CATEGORY_KEYS)[number];

const metricEvidenceSchema = z.object({
    type: z.enum([
        "crawl",
        "pagespeed",
        "page",
        "content",
        "contact",
        "form",
        "image",
        "link",
        "derived",
    ]),
    label: z.string(),
    value: z.union([z.string(), z.number(), z.boolean(), z.null()]).optional(),
    pageUrl: z.string().nullable().optional(),
});

const metricCheckSchema = z.object({
    id: z.string(),
    label: z.string(),
    description: z.string(),
    status: z.enum([
        "passed",
        "failed",
        "partial",
        "unavailable",
        "not_detected",
        "not_applicable",
    ]),
    weight: z.number().min(0),
    pointsAwarded: z.number().min(0),
    maximumPoints: z.number().min(0),
    evidence: z.array(metricEvidenceSchema).default([]),
    missing: z.array(z.string()).default([]),
    recommendation: z.string().nullable().optional(),
    priority: z.enum(["high", "medium", "low"]).nullable().optional(),
});

const categoryRecommendationSchema = z.object({
    checkId: z.string(),
    priority: z.enum(["high", "medium", "low"]),
    title: z.string(),
    description: z.string(),
});

export const categoryScoreSchema = z.object({
    score: scoreSchema.default(0),
    maximumScore: scoreSchema.default(100),
    confidence: scoreSchema.default(0),
    checks: z.array(metricCheckSchema).default([]),
    strengths: z.array(z.string()).default([]),
    issues: z.array(z.string()).default([]),
    recommendations: z.array(categoryRecommendationSchema).default([]),
});

export type CategoryScoreRecord = z.infer<typeof categoryScoreSchema>;

function emptyCategoryScoreRecord(): CategoryScoreRecord {
    return categoryScoreSchema.parse({});
}

const niceGuySummarySchema = z.object({
    strongestCategory: z.string().nullable().optional(),
    weakestCategory: z.string().nullable().optional(),
    highPriorityIssueCount: z.number().int().min(0).default(0),
    mediumPriorityIssueCount: z.number().int().min(0).default(0),
    lowPriorityIssueCount: z.number().int().min(0).default(0),
    checksPassed: z.number().int().min(0).default(0),
    checksFailed: z.number().int().min(0).default(0),
    checksUnavailable: z.number().int().min(0).default(0),
});

/** `niceguy_metrics` document schema. */
export const niceGuyMetricSchema = z.object({
    _id: objectIdSchema.optional(),
    websiteId: websiteIdSchema,
    crawlId: objectIdSchema,
    status: niceGuyMetricStatusSchema.default("queued"),
    scoringVersion: z.string().default(NICEGUY_SCORING_VERSION),
    overallScore: scoreSchema.default(0),
    categories: z.object({
        businessClarity: categoryScoreSchema.default(emptyCategoryScoreRecord),
        trustCredibility: categoryScoreSchema.default(emptyCategoryScoreRecord),
        conversionReadiness: categoryScoreSchema.default(emptyCategoryScoreRecord),
        userExperience: categoryScoreSchema.default(emptyCategoryScoreRecord),
        brandingConsistency: categoryScoreSchema.default(emptyCategoryScoreRecord),
        contentQuality: categoryScoreSchema.default(emptyCategoryScoreRecord),
        technicalFoundation: categoryScoreSchema.default(emptyCategoryScoreRecord),
    }),
    summary: niceGuySummarySchema.default(() =>
        niceGuySummarySchema.parse({
            highPriorityIssueCount: 0,
            mediumPriorityIssueCount: 0,
            lowPriorityIssueCount: 0,
            checksPassed: 0,
            checksFailed: 0,
            checksUnavailable: 0,
        }),
    ),
    generatedAt: z.date().nullable().optional(),
    durationMs: z.number().nullable().optional(),
    errorCode: z.string().nullable().optional(),
    errorMessage: z.string().nullable().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type NiceGuyMetricRecord = z.infer<typeof niceGuyMetricSchema>;

/** @deprecated Use `niceGuyMetricSchema`. */
export const niceguyMetricsSchema = niceGuyMetricSchema;

/** @deprecated Use `NiceGuyMetricRecord`. */
export type NiceguyMetrics = NiceGuyMetricRecord;

export function emptyNiceGuyMetric(
    websiteId: string,
    crawlId: string,
): NiceGuyMetricRecord {
    return niceGuyMetricSchema.parse({ websiteId, crawlId });
}

/** @deprecated Use `emptyNiceGuyMetric`. */
export function emptyNiceguyMetrics(websiteId: string): NiceGuyMetricRecord {
    return emptyNiceGuyMetric(websiteId, "000000000000000000000000");
}

/** @deprecated */
export const NICEGUY_METRIC_CATEGORIES = NICEGUY_CATEGORY_KEYS;

/** @deprecated */
export const niceguyMetricCategorySchema = categoryScoreSchema;

/** @deprecated */
export type NiceguyMetricCategory = CategoryScoreRecord;

/** @deprecated */
export function emptyNiceguyMetricCategory(): CategoryScoreRecord {
    return emptyCategoryScoreRecord();
}
