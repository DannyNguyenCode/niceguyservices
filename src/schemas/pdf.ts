import { z } from "zod";
import {
    nonNegativeIntSchema,
    nullableDateSchema,
    objectIdSchema,
    websiteIdSchema,
} from "@/src/schemas/shared";

/** `pdf` document schema. */
export const pdfSchema = z.object({
    _id: objectIdSchema.optional(),
    websiteId: websiteIdSchema,
    generated: z.boolean().default(false),
    version: nonNegativeIntSchema.min(1).default(1),
    url: z.string().default(""),
    generatedAt: nullableDateSchema.default(null),
});

export type Pdf = z.infer<typeof pdfSchema>;

export function emptyPdf(websiteId: string): Pdf {
    return pdfSchema.parse({ websiteId });
}
