import { z } from "zod";
import {
    pageTypeSchema,
    screenshotStatusSchema,
    screenshotStorageTypeSchema,
    screenshotTypeSchema,
} from "@/src/schemas/enums";
import {
    nullableDateSchema,
    objectIdSchema,
    websiteIdSchema,
} from "@/src/schemas/shared";

const viewportSchema = z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    deviceScaleFactor: z.number().positive().default(1),
});

/** `screenshots` document schema — one record per captured screenshot. */
export const screenshotSchema = z.object({
    _id: objectIdSchema.optional(),
    websiteId: websiteIdSchema,
    crawlId: objectIdSchema,
    type: screenshotTypeSchema,
    pageType: pageTypeSchema.default("home"),
    pageUrl: z.string().default(""),
    viewport: viewportSchema,
    storageType: screenshotStorageTypeSchema.default("cloudinary"),
    filePath: z.string().optional(),
    publicUrl: z.string().optional(),
    cloudinaryPublicId: z.string().optional(),
    cloudinaryAssetId: z.string().optional(),
    cloudinaryVersion: z.number().optional(),
    secureUrl: z.string().optional(),
    width: z.number().int().optional(),
    height: z.number().int().optional(),
    format: z.string().optional(),
    fileSizeBytes: z.number().int().optional(),
    status: screenshotStatusSchema.default("pending"),
    errorMessage: z.string().nullable().optional(),
    visualStability: z
        .object({
            attempted: z.boolean().nullable().optional(),
            stabilized: z.boolean().nullable().optional(),
            timedOut: z.boolean().nullable().optional(),
            reason: z.string().max(40).nullable().optional(),
            elapsedMs: z.number().min(0).nullable().optional(),
            samples: z.number().min(0).nullable().optional(),
            unfinishedFiniteAnimations: z.number().min(0).nullable().optional(),
            infiniteAnimations: z.number().min(0).nullable().optional(),
        })
        .nullable()
        .optional(),
    generatedAt: nullableDateSchema.default(null),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type Screenshot = z.infer<typeof screenshotSchema>;

/** @deprecated Legacy aggregate screenshots shape kept for schema registry compatibility. */
export const screenshotsSchema = screenshotSchema;

export type Screenshots = Screenshot;

export function emptyScreenshot(
    websiteId: string,
    crawlId: string,
    type: Screenshot["type"],
): Screenshot {
    return screenshotSchema.parse({
        websiteId,
        crawlId,
        type,
        viewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
        status: "pending",
    });
}
