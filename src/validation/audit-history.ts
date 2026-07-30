import { z } from "zod";

const objectIdSchema = z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid ID.");

export const auditWebsiteIdSchema = objectIdSchema;
export const auditRunIdSchema = objectIdSchema;

export const auditStatusSchema = z.enum([
    "draft",
    "queued",
    "crawling",
    "collecting-screenshots",
    "collecting-pagespeed",
    "calculating-metrics",
    "generating-ai-analysis",
    "complete",
    "partial",
    "failed",
    "cancelled",
    "archived",
]);

export const auditListQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    before: z.string().optional(),
    status: z.string().optional(),
    includeArchived: z
        .union([z.literal("true"), z.literal("false"), z.boolean()])
        .optional()
        .transform((value) => value === true || value === "true"),
});

export const auditConfigurationSchema = z.object({
    crawlMaxPages: z.number().int().positive().nullable().optional(),
    crawlMaxDepth: z.number().int().positive().nullable().optional(),
    includeScreenshots: z.boolean().optional().default(true),
    includePageSpeed: z.boolean().optional().default(true),
    includeNiceGuyMetrics: z.boolean().optional().default(true),
    includeAiAnalysis: z.boolean().optional().default(true),
    pageSpeedStrategies: z
        .array(z.enum(["mobile", "desktop"]))
        .optional()
        .default(["mobile", "desktop"]),
});

export const auditCreateBodySchema = z.object({
    configuration: auditConfigurationSchema.optional(),
    trigger: z
        .object({
            type: z.enum(["administrator", "system", "retry", "migration"]),
            actorId: z.string().nullable().optional(),
            actorName: z.string().nullable().optional(),
        })
        .optional(),
});

export const auditCompareQuerySchema = z
    .object({
        auditRunId: z.union([z.string(), z.array(z.string())]).optional(),
        from: z.string().optional(),
        to: z.string().optional(),
    })
    .transform((value) => {
        const ids = Array.isArray(value.auditRunId)
            ? value.auditRunId
            : value.auditRunId
              ? [value.auditRunId]
              : [];
        if (value.from) ids.unshift(value.from);
        if (value.to) ids.push(value.to);
        return { auditRunIds: ids };
    })
    .refine((value) => value.auditRunIds.length === 2, {
        message: "Exactly two audit runs are required for comparison.",
    })
    .transform((value) => ({
        auditRunIds: value.auditRunIds.map((id) => auditRunIdSchema.parse(id)),
    }));
