import { z } from "zod";

export const rateLimitProviderSchema = z.enum(["memory", "redis", "noop"]);

export const rateLimitBypassModeSchema = z.enum(["disabled", "test", "development"]);

export const rateLimitAlgorithmSchema = z.enum([
    "fixed-window",
    "sliding-window",
    "token-bucket",
]);

export const rateLimitScopeSchema = z.enum([
    "ip",
    "administrator",
    "website",
    "audit-run",
    "public-token",
    "global",
    "composite",
]);

export const rateLimitFailureModeSchema = z.enum(["open", "closed", "fallback"]);

export const rateLimitPolicyIdSchema = z.enum([
    "auth-login-ip",
    "auth-login-account",
    "admin-read",
    "admin-write",
    "audit-start",
    "crawl-start",
    "screenshot-start",
    "pagespeed-run",
    "pagespeed-global-daily",
    "metrics-run",
    "ai-analysis-run",
    "ai-analysis-global-daily",
    "pdf-generate",
    "outreach-generate",
    "demo-generate",
    "public-report-view",
    "public-demo-view",
    "public-pdf-download",
    "public-audit-submit",
    "administrator-note-create",
    "audit-compare",
]);

export const rateLimitPolicySchema = z.object({
    id: rateLimitPolicyIdSchema,
    algorithm: rateLimitAlgorithmSchema,
    limit: z.number().int().positive(),
    windowSeconds: z.number().int().positive(),
    burst: z.number().int().positive().optional(),
    cost: z.number().int().positive().optional(),
    scope: rateLimitScopeSchema,
    failureMode: rateLimitFailureModeSchema,
    description: z.string().min(1),
});

export const positiveIntEnvSchema = z
    .string()
    .optional()
    .transform((value, ctx) => {
        if (value === undefined || value.trim() === "") {
            return undefined;
        }
        const parsed = Number(value);
        if (!Number.isFinite(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Expected a positive integer.",
            });
            return z.NEVER;
        }
        if (parsed > 1_000_000) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Value is unreasonably large.",
            });
            return z.NEVER;
        }
        return parsed;
    });

export const providerBudgetProviderSchema = z.enum([
    "pagespeed",
    "ai",
    "cloudinary",
    "demo",
]);

export type RateLimitPolicyId = z.infer<typeof rateLimitPolicyIdSchema>;
export type RateLimitPolicyInput = z.infer<typeof rateLimitPolicySchema>;
