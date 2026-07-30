import { z } from "zod";
import { activityLogActorSchema, activityLogTypeSchema } from "@/src/schemas/enums";
import { objectIdSchema, websiteIdSchema } from "@/src/schemas/shared";

/** `activity_log` document schema. */
export const activityLogSchema = z.object({
    _id: objectIdSchema.optional(),
    websiteId: websiteIdSchema,
    crawlId: objectIdSchema.nullable().optional(),
    type: activityLogTypeSchema,
    description: z.string().default(""),
    actor: activityLogActorSchema.default("system"),
    metadata: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.date().nullable().default(null),
});

export type ActivityLog = z.infer<typeof activityLogSchema>;

export function emptyActivityLog(
    websiteId: string,
    type: ActivityLog["type"],
    overrides: Partial<ActivityLog> = {},
): ActivityLog {
    return activityLogSchema.parse({
        websiteId,
        type,
        ...overrides,
    });
}
