import { z } from "zod";
import { crawlStatusSchema, pageTypeSchema } from "@/src/schemas/enums";
import {
    nonNegativeIntSchema,
    nonNegativeNumberSchema,
    nullableDateSchema,
    objectIdSchema,
    websiteIdSchema,
} from "@/src/schemas/shared";

const crawlHeadingSchema = z.object({
    level: z.number().int().min(1).max(6),
    text: z.string(),
});

const crawlButtonSchema = z.object({
    text: z.string(),
    href: z.string().optional(),
});

const crawlFormFieldSchema = z.object({
    type: z.string().optional(),
    name: z.string().optional(),
    label: z.string().optional(),
    required: z.boolean().default(false),
});

const crawlFormSchema = z.object({
    action: z.string().optional(),
    method: z.string().optional(),
    fields: z.array(crawlFormFieldSchema).default([]),
});

const crawlImageSchema = z.object({
    src: z.string().optional(),
    alt: z.string().optional(),
});

export const crawlPageResultSchema = z.object({
    url: z.string(),
    path: z.string(),
    pageType: pageTypeSchema,
    title: z.string().optional(),
    metaDescription: z.string().optional(),
    headings: z.array(crawlHeadingSchema).default([]),
    buttons: z.array(crawlButtonSchema).default([]),
    forms: z.array(crawlFormSchema).default([]),
    images: z.array(crawlImageSchema).default([]),
    visibleText: z.string().optional(),
    statusCode: z.number().int().nullable().optional(),
    loadDurationMs: z.number().nullable().optional(),
    errorMessage: z.string().nullable().optional(),
});

/** `crawl_data` document schema. */
export const crawlDataSchema = z.object({
    _id: objectIdSchema.optional(),
    websiteId: websiteIdSchema,
    status: crawlStatusSchema.default("not-started"),
    startedAt: nullableDateSchema.default(null),
    completedAt: nullableDateSchema.default(null),
    requestedUrl: z.string().default(""),
    finalUrl: z.string().optional(),
    homepageTitle: z.string().default(""),
    metaDescription: z.string().default(""),
    language: z.string().default(""),
    pagesDiscovered: nonNegativeIntSchema.default(0),
    pagesCrawled: nonNegativeIntSchema.default(0),
    internalLinks: z.array(z.string()).default([]),
    externalLinks: z.array(z.string()).default([]),
    emailsFound: z.array(z.string()).default([]),
    phoneNumbersFound: z.array(z.string()).default([]),
    socialLinks: z.array(z.string()).default([]),
    hasAboutPage: z.boolean().default(false),
    hasContactPage: z.boolean().default(false),
    hasServicesPage: z.boolean().default(false),
    hasPrivacyPolicy: z.boolean().default(false),
    hasTerms: z.boolean().default(false),
    pageResults: z.array(crawlPageResultSchema).default([]),
    crawlDurationMs: nonNegativeNumberSchema.default(0),
    errorMessage: z.string().nullable().default(null),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type CrawlData = z.infer<typeof crawlDataSchema>;
export type CrawlPageResult = z.infer<typeof crawlPageResultSchema>;

export function emptyCrawlData(websiteId: string, requestedUrl = ""): CrawlData {
    return crawlDataSchema.parse({ websiteId, requestedUrl });
}
