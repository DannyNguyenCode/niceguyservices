import "server-only";

export const VERCEL_PROTECTION_BYPASS_QUERY_PARAM = "x-vercel-protection-bypass";

/** Preview-only: Vercel Deployment Protection bypass for external automation. */
export function shouldUseVercelProtectionBypass(): boolean {
    if (process.env.VERCEL_ENV !== "preview") {
        return false;
    }

    return Boolean(process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim());
}

/**
 * Appends Vercel's official protection-bypass query parameter on Preview deployments only.
 * Production and local development always receive the URL unchanged.
 */
export function applyVercelAutomationBypass(url: string): string {
    if (!shouldUseVercelProtectionBypass()) {
        return url;
    }

    const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
    if (!secret) {
        return url;
    }

    const parsed = new URL(url);
    parsed.searchParams.set(VERCEL_PROTECTION_BYPASS_QUERY_PARAM, secret);
    return parsed.toString();
}
