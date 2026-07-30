import { MONGODB_COLLECTIONS } from "@/src/lib/collections";
import { activityLogSchema } from "@/src/schemas/activity-log";
import { aiMetadataSchema } from "@/src/schemas/ai-metadata";
import { aiSummarySchema } from "@/src/schemas/ai-summary";
import { crawlDataSchema } from "@/src/schemas/crawl-data";
import { demoSchema } from "@/src/schemas/demo";
import { googleMetricSchema } from "@/src/schemas/google-metrics";
import { heroSuggestionSchema } from "@/src/schemas/hero-suggestions";
import { niceGuyMetricSchema } from "@/src/schemas/niceguy-metrics";
import { outreachEmailSchema } from "@/src/schemas/outreach-email";
import { pdfSchema } from "@/src/schemas/pdf";
import { screenshotsSchema } from "@/src/schemas/screenshots";
import { websiteCollectionSchema } from "@/src/schemas/website-collection";

export * from "@/src/schemas/enums";
export * from "@/src/schemas/shared";
export * from "@/src/schemas/website-collection";
export * from "@/src/schemas/crawl-data";
export * from "@/src/schemas/screenshots";
export * from "@/src/schemas/google-metrics";
export * from "@/src/schemas/niceguy-metrics";
export * from "@/src/schemas/ai-summary";
export * from "@/src/schemas/hero-suggestions";
export * from "@/src/schemas/outreach-email";
export * from "@/src/schemas/pdf";
export * from "@/src/schemas/demo";
export * from "@/src/schemas/activity-log";
export * from "@/src/schemas/ai-metadata";

/** MongoDB collection name → Zod document schema (pairs with Mongoose models in `src/models/`). */
export const COLLECTION_SCHEMAS = {
    [MONGODB_COLLECTIONS.website]: websiteCollectionSchema,
    [MONGODB_COLLECTIONS.crawlData]: crawlDataSchema,
    [MONGODB_COLLECTIONS.screenshots]: screenshotsSchema,
    [MONGODB_COLLECTIONS.googleMetrics]: googleMetricSchema,
    [MONGODB_COLLECTIONS.niceguyMetrics]: niceGuyMetricSchema,
    [MONGODB_COLLECTIONS.aiSummary]: aiSummarySchema,
    [MONGODB_COLLECTIONS.heroSuggestions]: heroSuggestionSchema,
    [MONGODB_COLLECTIONS.outreachEmail]: outreachEmailSchema,
    [MONGODB_COLLECTIONS.pdf]: pdfSchema,
    [MONGODB_COLLECTIONS.demo]: demoSchema,
    [MONGODB_COLLECTIONS.activityLog]: activityLogSchema,
    [MONGODB_COLLECTIONS.aiMetadata]: aiMetadataSchema,
} as const;

/** Empty related records for a new website (except activity log — append entries as needed). */
export function emptyWebsiteAuditRecords(websiteId: string) {
    return {
        crawlData: crawlDataSchema.parse({ websiteId }),
        googleMetrics: googleMetricSchema.parse({
            websiteId,
            crawlId: "000000000000000000000000",
            strategy: "mobile",
        }),
        niceguyMetrics: niceGuyMetricSchema.parse({
            websiteId,
            crawlId: "000000000000000000000000",
        }),
        aiSummary: aiSummarySchema.parse({
            websiteId,
            crawlId: "000000000000000000000000",
            niceGuyMetricId: "000000000000000000000000",
        }),
        heroSuggestions: heroSuggestionSchema.parse({
            websiteId,
            crawlId: "000000000000000000000000",
            niceGuyMetricId: "000000000000000000000000",
            aiSummaryId: "000000000000000000000000",
        }),
        outreachEmail: outreachEmailSchema.parse({ websiteId }),
        pdf: pdfSchema.parse({ websiteId }),
        demo: demoSchema.parse({ websiteId }),
        aiMetadata: aiMetadataSchema.parse({
            websiteId,
            crawlId: "000000000000000000000000",
            relatedType: "ai-summary",
            relatedId: "000000000000000000000000",
            generatedAt: new Date(),
        }),
    };
}
