import { z } from "zod";
import {
    aiAnalysisStatusSchema,
    auditStatusSchema,
    crawlStatusSchema,
    pageSpeedStatusSchema,
    niceGuyStatusSchema,
    demoStatusSchema,
    outreachStatusSchema,
    websiteSourceSchema,
    websiteStatusSchema,
} from "@/src/schemas/enums";
import { nullableDateSchema, objectIdSchema } from "@/src/schemas/shared";

/** `website_collection` document schema. */
export const websiteCollectionSchema = z.object({
    _id: objectIdSchema.optional(),
    businessName: z.string().default(""),
    originalUrl: z.string().min(1),
    normalizedDomain: z.string().min(1),
    businessEmail: z.string().default(""),
    industry: z.string().default(""),
    location: z.string().default(""),
    source: websiteSourceSchema.default("manual-prospect-research"),
    status: websiteStatusSchema.default("new"),
    auditStatus: auditStatusSchema.default("not-started"),
    crawlStatus: crawlStatusSchema.default("not-started"),
    pageSpeedStatus: pageSpeedStatusSchema.default("not-started"),
    latestPageSpeedRunAt: nullableDateSchema.default(null),
    niceGuyStatus: niceGuyStatusSchema.default("not-started"),
    latestNiceGuyRunAt: nullableDateSchema.default(null),
    aiAnalysisStatus: aiAnalysisStatusSchema.default("not-started"),
    latestAiAnalysisRunAt: nullableDateSchema.default(null),
    demoStatus: demoStatusSchema.default("none"),
    outreachStatus: outreachStatusSchema.default("not-contacted"),
    deletedAt: nullableDateSchema.default(null),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type WebsiteCollection = z.infer<typeof websiteCollectionSchema>;

export function emptyWebsiteCollection(
    overrides: Partial<WebsiteCollection> = {},
): WebsiteCollection {
    return websiteCollectionSchema.parse({
        originalUrl: "",
        normalizedDomain: "",
        ...overrides,
    });
}
