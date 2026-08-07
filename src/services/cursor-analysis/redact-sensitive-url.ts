import { VERCEL_PROTECTION_BYPASS_QUERY_PARAM } from "@/src/services/cursor-analysis/vercel-automation-bypass";

const SENSITIVE_QUERY_PARAMS = new Set([
    "token",
    "key",
    "secret",
    "auth",
    "session",
    VERCEL_PROTECTION_BYPASS_QUERY_PARAM,
]);

/** Redact sensitive query parameters before logging or displaying URLs. */
export function redactSensitiveUrl(url: string): string {
    try {
        const parsed = new URL(url);
        for (const param of SENSITIVE_QUERY_PARAMS) {
            if (parsed.searchParams.has(param)) {
                parsed.searchParams.set(param, "[redacted]");
            }
        }
        return parsed.toString();
    } catch {
        return "[invalid-url]";
    }
}
