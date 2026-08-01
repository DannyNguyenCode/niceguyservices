import "server-only";

import { z } from "zod";

const booleanFlagSchema = z
    .string()
    .optional()
    .transform((value) => {
        const normalized = value?.trim().toLowerCase();
        return normalized === "1" || normalized === "true" || normalized === "yes";
    });

const cursorAnalysisEnvSchema = z.object({
    provider: z
        .string()
        .optional()
        .transform((value) => value?.trim().toLowerCase() || "openai"),
    webhookUrl: z.string().optional(),
    webhookAuthToken: z.string().optional(),
    webhookAuthHeader: z
        .string()
        .optional()
        .transform((value) => value?.trim() || "Authorization"),
    webhookAuthScheme: z
        .string()
        .optional()
        .transform((value) => value?.trim() || "Bearer"),
    callbackSecret: z.string().optional(),
    callbackHeader: z
        .string()
        .optional()
        .transform((value) => value?.trim() || "x-cursor-callback-secret"),
    packageSigningSecret: z.string().optional(),
    publicAppUrl: z.string().optional(),
    allowLocalhostTrigger: booleanFlagSchema,
    promptVersion: z
        .string()
        .optional()
        .transform((value) => value?.trim() || "1.0"),
    packageVersion: z
        .string()
        .optional()
        .transform((value) => value?.trim() || "1.0"),
    maxAttempts: z
        .string()
        .optional()
        .transform((value) => {
            const parsed = Number(value ?? "3");
            return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 10) : 3;
        }),
});

export type CursorAnalysisConfig = z.infer<typeof cursorAnalysisEnvSchema>;

let cachedConfig: CursorAnalysisConfig | null = null;

function readSecret(value: string | undefined): string | undefined {
    const trimmed = value?.trim();
    if (!trimmed) return undefined;
    return trimmed;
}

export function getCursorAnalysisConfig(): CursorAnalysisConfig {
    if (!cachedConfig) {
        cachedConfig = cursorAnalysisEnvSchema.parse({
            provider: process.env.AI_ANALYSIS_PROVIDER ?? process.env.AI_PROVIDER,
            webhookUrl: readSecret(process.env.CURSOR_AUTOMATION_WEBHOOK_URL),
            webhookAuthToken: readSecret(process.env.CURSOR_AUTOMATION_AUTH_TOKEN),
            webhookAuthHeader: process.env.CURSOR_AUTOMATION_AUTH_HEADER,
            webhookAuthScheme: process.env.CURSOR_AUTOMATION_AUTH_SCHEME,
            callbackSecret: readSecret(process.env.CURSOR_ANALYSIS_CALLBACK_SECRET),
            callbackHeader: process.env.CURSOR_ANALYSIS_CALLBACK_HEADER,
            packageSigningSecret: readSecret(process.env.AUDIT_PACKAGE_SIGNING_SECRET),
            publicAppUrl:
                readSecret(process.env.APP_PUBLIC_URL) ||
                readSecret(process.env.APP_URL) ||
                readSecret(process.env.NEXT_PUBLIC_SITE_URL),
            allowLocalhostTrigger: process.env.CURSOR_ANALYSIS_ALLOW_LOCALHOST,
            promptVersion: process.env.CURSOR_ANALYSIS_PROMPT_VERSION,
            packageVersion: process.env.CURSOR_ANALYSIS_PACKAGE_VERSION,
            maxAttempts: process.env.CURSOR_ANALYSIS_MAX_ATTEMPTS,
        });
    }
    return cachedConfig;
}

export function resetCursorAnalysisConfigForTests(): void {
    cachedConfig = null;
}

export function isCursorAutomationProvider(): boolean {
    return getCursorAnalysisConfig().provider === "cursor-automation";
}

export function isCursorAnalysisConfigured(): boolean {
    const config = getCursorAnalysisConfig();
    return Boolean(
        config.webhookUrl &&
            config.webhookAuthToken &&
            config.callbackSecret &&
            config.packageSigningSecret &&
            config.publicAppUrl,
    );
}

export function assertCursorAnalysisConfigured(): void {
    const config = getCursorAnalysisConfig();
    const missing: string[] = [];
    if (!config.webhookUrl) missing.push("CURSOR_AUTOMATION_WEBHOOK_URL");
    if (!config.webhookAuthToken) missing.push("CURSOR_AUTOMATION_AUTH_TOKEN");
    if (!config.callbackSecret) missing.push("CURSOR_ANALYSIS_CALLBACK_SECRET");
    if (!config.packageSigningSecret) missing.push("AUDIT_PACKAGE_SIGNING_SECRET");
    if (!config.publicAppUrl) missing.push("APP_PUBLIC_URL");
    if (missing.length > 0) {
        throw new Error(`CURSOR_ANALYSIS_NOT_CONFIGURED: Missing ${missing.join(", ")}`);
    }
}

export function isPublicUrlReachableForCursor(url: string | undefined): boolean {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        if (parsed.protocol !== "https:") {
            return false;
        }
        const host = parsed.hostname.toLowerCase();
        if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) {
            return getCursorAnalysisConfig().allowLocalhostTrigger;
        }
        return true;
    } catch {
        return false;
    }
}

export const AUDIT_PACKAGE_TOKEN_TTL_MS = 60 * 60 * 1000;
export const CURSOR_ANALYSIS_CALLBACK_MAX_BYTES = 512 * 1024;
