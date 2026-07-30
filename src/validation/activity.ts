import { z } from "zod";
import {
    ACTIVITY_CATEGORIES,
    ACTIVITY_SEVERITIES,
} from "@/src/constants/activity-events";
import { ACTIVITY_LOG_TYPES } from "@/src/schemas/enums";

const objectIdPattern = /^[a-f\d]{24}$/i;

export const activityWebsiteIdSchema = z
    .string()
    .trim()
    .regex(objectIdPattern, "Invalid website ID.");

export const activityIdSchema = z
    .string()
    .trim()
    .regex(objectIdPattern, "Invalid activity ID.");

export const activityLimitSchema = z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(25);

export const activityCategorySchema = z.enum(ACTIVITY_CATEGORIES);
export const activitySeveritySchema = z.enum(ACTIVITY_SEVERITIES);
export const activityEventTypeSchema = z.enum(ACTIVITY_LOG_TYPES);

export const activityQuerySchema = z.object({
    limit: activityLimitSchema.optional(),
    before: z.string().datetime().optional(),
    category: z
        .string()
        .optional()
        .transform((value) =>
            value
                ? value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean)
                : [],
        ),
    severity: z
        .string()
        .optional()
        .transform((value) =>
            value
                ? value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean)
                : [],
        ),
    eventType: z.string().optional(),
    errorsOnly: z
        .string()
        .optional()
        .transform((value) => value === "true"),
});

export const activityNoteSchema = z.object({
    title: z.string().trim().min(1, "Title is required.").max(120),
    description: z.string().trim().min(1, "Description is required.").max(2000),
});

export const activityNoteUpdateSchema = activityNoteSchema;
