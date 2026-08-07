import { z } from "zod";
import { nullableDateSchema, objectIdSchema, websiteIdSchema } from "@/src/schemas/shared";

/** `outreach_email` document schema. */
export const outreachEmailSchema = z.object({
    _id: objectIdSchema.optional(),
    websiteId: websiteIdSchema,
    subject: z.string().default(""),
    body: z.string().default(""),
    generated: z.boolean().default(false),
    approved: z.boolean().default(false),
    sent: z.boolean().default(false),
    sentAt: nullableDateSchema.default(null),
    opened: z.boolean().default(false),
    openedAt: nullableDateSchema.default(null),
    replied: z.boolean().default(false),
    repliedAt: nullableDateSchema.default(null),
});

export type OutreachEmail = z.infer<typeof outreachEmailSchema>;

export function emptyOutreachEmail(websiteId: string): OutreachEmail {
    return outreachEmailSchema.parse({ websiteId });
}
