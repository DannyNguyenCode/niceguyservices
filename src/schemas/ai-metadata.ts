import { z } from "zod";
import { aiMetadataRelatedTypeSchema } from "@/src/schemas/enums";
import { nullableDateSchema, objectIdSchema, websiteIdSchema } from "@/src/schemas/shared";

/** `ai_metadata` document schema. */
export const aiMetadataSchema = z.object({
    _id: objectIdSchema.optional(),
    websiteId: websiteIdSchema,
    crawlId: objectIdSchema,
    auditRunId: objectIdSchema.nullable().default(null),
    relatedType: aiMetadataRelatedTypeSchema,
    relatedId: objectIdSchema,
    provider: z.string().default(""),
    model: z.string().default(""),
    promptVersion: z.string().default(""),
    analysisVersion: z.string().default(""),
    promptTokens: z.number().nullable().default(null),
    completionTokens: z.number().nullable().default(null),
    totalTokens: z.number().nullable().default(null),
    durationMs: z.number().nullable().default(null),
    providerRequestId: z.string().nullable().default(null),
    retryCount: z.number().default(0),
    generatedAt: z.date().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type AiMetadata = z.infer<typeof aiMetadataSchema>;

export function emptyAiMetadata(
    websiteId: string,
    crawlId = "000000000000000000000000",
    relatedId = "000000000000000000000000",
): AiMetadata {
    return aiMetadataSchema.parse({
        websiteId,
        crawlId,
        relatedType: "ai-summary",
        relatedId,
        generatedAt: new Date(),
    });
}
