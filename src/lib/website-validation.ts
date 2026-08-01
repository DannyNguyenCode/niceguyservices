import { z } from "zod";
import { normalizeWebsiteUrl } from "@/src/lib/normalize-domain";
import {
    AUDIT_STATUSES,
    CRAWL_STATUSES,
    DEMO_STATUSES,
    OUTREACH_STATUSES,
    WEBSITE_SOURCES,
    WEBSITE_SOURCE_LABELS,
    WEBSITE_STATUSES,
} from "@/src/schemas/enums";

export {
    AUDIT_STATUSES,
    CRAWL_STATUSES,
    DEMO_STATUSES,
    OUTREACH_STATUSES,
    WEBSITE_SOURCES,
    WEBSITE_SOURCE_LABELS,
    WEBSITE_STATUSES,
};

const optionalTrimmed = (max: number) =>
    z
        .string()
        .trim()
        .max(max)
        .optional()
        .transform((value) => (value && value.length > 0 ? value : undefined));

const optionalEmail = z
    .string()
    .trim()
    .max(254)
    .optional()
    .transform((value) => (value && value.length > 0 ? value.toLowerCase() : undefined))
    .refine((value) => value === undefined || z.string().email().safeParse(value).success, {
        message: "Please enter a valid email address.",
    });

const websiteUrlField = z
    .string()
    .trim()
    .min(1, "Please enter a website URL.")
    .max(2048, "Website URL is too long.")
    .superRefine((value, ctx) => {
        try {
            normalizeWebsiteUrl(value);
        } catch (error) {
            ctx.addIssue({
                code: "custom",
                message:
                    error instanceof Error
                        ? error.message
                        : "Please enter a valid website URL.",
            });
        }
    });

const requiredEmail = z
    .string()
    .trim()
    .min(1, "Please enter a business email address.")
    .max(254, "Email address is too long.")
    .transform((value) => value.toLowerCase())
    .refine((value) => z.string().email().safeParse(value).success, {
        message: "Please enter a valid email address.",
    });

export const publicAuditRequestSchema = z.object({
    websiteUrl: websiteUrlField,
    businessEmail: requiredEmail,
});

export const createWebsiteSchema = z.object({
    businessName: optionalTrimmed(120),
    websiteUrl: websiteUrlField,
    businessEmail: optionalEmail,
    industry: optionalTrimmed(120),
    location: optionalTrimmed(120),
    source: z.enum(WEBSITE_SOURCES, {
        message: "Please select a valid source.",
    }),
});

export const updateWebsiteSchema = z.object({
    businessName: optionalTrimmed(120),
    websiteUrl: websiteUrlField,
    businessEmail: optionalEmail,
    industry: optionalTrimmed(120),
    location: optionalTrimmed(120),
    source: z.enum(WEBSITE_SOURCES, {
        message: "Please select a valid source.",
    }),
    status: z.enum(WEBSITE_STATUSES, {
        message: "Please select a valid website status.",
    }),
    auditStatus: z.enum(AUDIT_STATUSES, {
        message: "Please select a valid audit status.",
    }),
    demoStatus: z.enum(DEMO_STATUSES, {
        message: "Please select a valid demo status.",
    }),
    outreachStatus: z.enum(OUTREACH_STATUSES, {
        message: "Please select a valid outreach status.",
    }),
});

export type PublicAuditRequestInput = z.infer<typeof publicAuditRequestSchema>;
export type CreateWebsiteInput = z.infer<typeof createWebsiteSchema>;
export type UpdateWebsiteInput = z.infer<typeof updateWebsiteSchema>;

export function formatZodErrors(error: z.ZodError): Record<string, string> {
    const fieldErrors: Record<string, string> = {};
    for (const issue of error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key]) {
            fieldErrors[key] = issue.message;
        }
    }
    return fieldErrors;
}
