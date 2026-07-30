import "server-only";

import { PAGESPEED_PARSER_LIMITS } from "@/src/lib/pagespeed-rules";

function parsePositiveInt(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const PAGESPEED_CATEGORIES = [
    "performance",
    "accessibility",
    "best-practices",
    "seo",
] as const;

export const PAGESPEED_CONFIG = {
    timeoutMs: parsePositiveInt(process.env.PAGESPEED_TIMEOUT_MS, 120_000),
    maxRetries: parsePositiveInt(process.env.PAGESPEED_MAX_RETRIES, 2),
    categories: PAGESPEED_CATEGORIES,
    endpoint: "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
    retryDelaysMs: [1_000, 3_000],
    maxOpportunities: PAGESPEED_PARSER_LIMITS.maxOpportunities,
    maxDiagnostics: PAGESPEED_PARSER_LIMITS.maxDiagnostics,
    maxFailedAudits: PAGESPEED_PARSER_LIMITS.maxFailedAudits,
} as const;

export function getPageSpeedApiKey(): string {
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY?.trim();
    if (!apiKey || apiKey === "your-google-pagespeed-api-key") {
        throw new Error("PAGESPEED_CONFIGURATION_ERROR");
    }
    return apiKey;
}

export function isPageSpeedConfigured(): boolean {
    try {
        getPageSpeedApiKey();
        return true;
    } catch {
        return false;
    }
}
