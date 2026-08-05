import "server-only";

import { z } from "zod";

const booleanFlagSchema = z
    .string()
    .optional()
    .transform((value) => {
        const normalized = value?.trim().toLowerCase();
        return normalized === "1" || normalized === "true" || normalized === "yes";
    });

const positiveIntSchema = (fallback: number, max?: number) =>
    z
        .string()
        .optional()
        .transform((value) => {
            const parsed = Number(value ?? String(fallback));
            if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
            return max ? Math.min(parsed, max) : parsed;
        });

const cursorAnalysisEnvSchema = z.object({
    provider: z
        .string()
        .optional()
        .transform((value) => value?.trim().toLowerCase() || "openai"),
    webhookUrl: z
        .string()
        .optional()
        .transform((value) => {
            const trimmed = value?.trim();
            if (!trimmed) return undefined;
            try {
                new URL(trimmed);
                return trimmed;
            } catch {
                return undefined;
            }
        }),
    webhookAuthToken: z.string().optional(),
    webhookAuthHeader: z
        .string()
        .optional()
        .transform((value) => value?.trim() || "Authorization"),
    webhookAuthScheme: z
        .string()
        .optional()
        .transform((value) => value?.trim() || "Bearer"),
    webhookTimeoutMs: positiveIntSchema(30_000, 120_000),
    callbackSecret: z.string().optional(),
    callbackHeader: z
        .string()
        .optional()
        .transform((value) => value?.trim() || "x-cursor-callback-secret"),
    callbackTokenTtlSeconds: positiveIntSchema(3600, 86_400),
    packageSigningSecret: z.string().optional(),
    packageUrlTtlSeconds: positiveIntSchema(3600, 86_400),
    publicAppUrl: z
        .string()
        .optional()
        .transform((value) => {
            const trimmed = value?.trim();
            if (!trimmed) return undefined;
            try {
                new URL(trimmed);
                return trimmed.replace(/\/$/, "");
            } catch {
                return undefined;
            }
        }),
    allowLocalhostTrigger: booleanFlagSchema,
    promptVersion: z
        .string()
        .optional()
        .transform((value) => value?.trim() || "1.1"),
    packageVersion: z
        .string()
        .optional()
        .transform((value) => value?.trim() || "1.1"),
    maxAttempts: positiveIntSchema(3, 10),
    queuedTimeoutMinutes: positiveIntSchema(5, 1440),
    activeTimeoutMinutes: positiveIntSchema(60, 1440),
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
            webhookUrl: process.env.CURSOR_AUTOMATION_WEBHOOK_URL,
            webhookAuthToken: readSecret(process.env.CURSOR_AUTOMATION_AUTH_TOKEN),
            webhookAuthHeader: process.env.CURSOR_AUTOMATION_AUTH_HEADER,
            webhookAuthScheme: process.env.CURSOR_AUTOMATION_AUTH_SCHEME,
            webhookTimeoutMs: process.env.CURSOR_AUTOMATION_WEBHOOK_TIMEOUT_MS,
            callbackSecret: readSecret(process.env.CURSOR_ANALYSIS_CALLBACK_SECRET),
            callbackHeader: process.env.CURSOR_ANALYSIS_CALLBACK_HEADER,
            callbackTokenTtlSeconds: process.env.CURSOR_ANALYSIS_CALLBACK_TOKEN_TTL_SECONDS,
            packageSigningSecret: readSecret(process.env.AUDIT_PACKAGE_SIGNING_SECRET),
            packageUrlTtlSeconds: process.env.AUDIT_PACKAGE_URL_TTL_SECONDS,
            publicAppUrl:
                process.env.APP_PUBLIC_URL ||
                process.env.APP_URL ||
                process.env.NEXT_PUBLIC_SITE_URL,
            allowLocalhostTrigger: process.env.CURSOR_ANALYSIS_ALLOW_LOCALHOST,
            promptVersion: process.env.CURSOR_ANALYSIS_PROMPT_VERSION,
            packageVersion: process.env.CURSOR_ANALYSIS_PACKAGE_VERSION,
            maxAttempts: process.env.CURSOR_ANALYSIS_MAX_ATTEMPTS,
            queuedTimeoutMinutes: process.env.CURSOR_ANALYSIS_QUEUED_TIMEOUT_MINUTES,
            activeTimeoutMinutes: process.env.CURSOR_ANALYSIS_ACTIVE_TIMEOUT_MINUTES,
        });
    }
    return cachedConfig;
}

export function resetCursorAnalysisConfigForTests(): void {
    cachedConfig = null;
}

export function getAuditPackageTokenTtlMs(): number {
    return getCursorAnalysisConfig().packageUrlTtlSeconds * 1000;
}

export function getCallbackAuthTokenTtlMs(): number {
    return getCursorAnalysisConfig().callbackTokenTtlSeconds * 1000;
}

export function isCursorAutomationProvider(): boolean {
    return getCursorAnalysisConfig().provider === "cursor-automation";
}

export function isMockAnalysisProvider(): boolean {
    return getCursorAnalysisConfig().provider === "mock";
}

export function isAnalysisProviderEnabled(): boolean {
    const provider = getCursorAnalysisConfig().provider;
    return provider === "cursor-automation" || provider === "mock";
}

export type CursorConfigurationStatus = {
    configured: boolean;
    missing: string[];
};

export function getCursorConfigurationStatus(): CursorConfigurationStatus {
    const config = getCursorAnalysisConfig();
    const missing: string[] = [];
    if (!config.webhookUrl) missing.push("CURSOR_AUTOMATION_WEBHOOK_URL");
    if (!config.webhookAuthToken) missing.push("CURSOR_AUTOMATION_AUTH_TOKEN");
    if (!config.callbackSecret) missing.push("CURSOR_ANALYSIS_CALLBACK_SECRET");
    if (!config.packageSigningSecret) missing.push("AUDIT_PACKAGE_SIGNING_SECRET");
    if (!config.publicAppUrl) missing.push("APP_PUBLIC_URL");
    return { configured: missing.length === 0, missing };
}

export function isCursorAnalysisConfigured(): boolean {
    return getCursorConfigurationStatus().configured;
}

export function assertCursorAnalysisConfigured(): void {
    const { missing } = getCursorConfigurationStatus();
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

export const CURSOR_ANALYSIS_CALLBACK_MAX_BYTES = 512 * 1024;

/** @deprecated Use getAuditPackageTokenTtlMs() */
export const AUDIT_PACKAGE_TOKEN_TTL_MS = 3600 * 1000;
