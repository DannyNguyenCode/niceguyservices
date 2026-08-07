import { z } from "zod";
import {
    googleMetricStatusSchema,
    pageSpeedStrategySchema,
} from "@/src/schemas/enums";
import { objectIdSchema, websiteIdSchema } from "@/src/schemas/shared";

/** `google_metrics` document schema (one record per strategy per crawl). */
export const googleMetricSchema = z.object({
    _id: objectIdSchema.optional(),
    websiteId: websiteIdSchema,
    crawlId: objectIdSchema,
    strategy: pageSpeedStrategySchema,
    status: googleMetricStatusSchema.default("queued"),
    requestedUrl: z.string().default(""),
});

export type GoogleMetric = z.infer<typeof googleMetricSchema>;

/** @deprecated Legacy aggregate name kept for schema registry compatibility. */
export const googleMetricsSchema = googleMetricSchema;
export type GoogleMetrics = GoogleMetric;

export function emptyGoogleMetric(
    websiteId: string,
    crawlId: string,
    strategy: GoogleMetric["strategy"],
): GoogleMetric {
    return googleMetricSchema.parse({ websiteId, crawlId, strategy });
}
