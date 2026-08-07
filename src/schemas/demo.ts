import { z } from "zod";
import { nullableDateSchema, objectIdSchema, websiteIdSchema } from "@/src/schemas/shared";

/** `demo` document schema. */
export const demoSchema = z.object({
    _id: objectIdSchema.optional(),
    websiteId: websiteIdSchema,
    exists: z.boolean().default(false),
    published: z.boolean().default(false),
    title: z.string().default(""),
    description: z.string().default(""),
    url: z.string().default(""),
    previewImage: z.string().default(""),
    publishedAt: nullableDateSchema.default(null),
});

export type Demo = z.infer<typeof demoSchema>;

export function emptyDemo(websiteId: string): Demo {
    return demoSchema.parse({ websiteId });
}
