import { randomBytes } from "node:crypto";
import {
    VERCEL_PROTECTION_BYPASS_QUERY_PARAM,
    shouldUseVercelProtectionBypass,
} from "@/src/services/cursor-analysis/vercel-automation-bypass";
import { redactSensitiveUrl } from "@/src/services/cursor-analysis/redact-sensitive-url";
import type { PdfStage } from "@/src/services/pdf-reports/pdf-stage-error";

const SENSITIVE_QUERY_KEYS = new Set([
    "rendertoken",
    "token",
    "x-vercel-protection-bypass",
    "authorization",
    "cookie",
]);

export type PdfAttemptId = string;

export function createPdfAttemptId(): PdfAttemptId {
    return randomBytes(4).toString("hex");
}

export function sanitizeErrorMessage(message: string | undefined, max = 400): string | undefined {
    if (!message) return undefined;
    let out = message
        .replace(/x-vercel-protection-bypass=[^&\s]+/gi, "x-vercel-protection-bypass=[redacted]")
        .replace(/renderToken=[^&\s]+/gi, "renderToken=[redacted]");

    if (/^https?:\/\//i.test(out.trim())) {
        out = redactSensitiveUrl(out);
    } else {
        out = out.replace(/https?:\/\/[^\s]+/gi, (url) => redactSensitiveUrl(url));
    }

    return out.slice(0, max);
}

export function sanitizeNavigationTarget(rawUrl: string): {
    host: string;
    pathname: string;
} {
    try {
        const parsed = new URL(rawUrl);
        const pathname = parsed.pathname.replace(
            /\/internal\/reports\/[^/]+/i,
            "/internal/reports/[redacted]",
        );
        return {
            host: parsed.host,
            pathname,
        };
    } catch {
        return { host: "invalid", pathname: "/[unparseable]" };
    }
}

export function urlContainsSensitiveQuery(rawUrl: string): boolean {
    try {
        const parsed = new URL(rawUrl);
        for (const key of parsed.searchParams.keys()) {
            if (SENSITIVE_QUERY_KEYS.has(key.toLowerCase())) {
                return true;
            }
        }
        return false;
    } catch {
        return false;
    }
}

export function describePdfEnvironment(): {
    vercelEnv: string | null;
    nodeEnv: string | null;
    renderBaseUrlConfigured: boolean;
    renderHost: string | null;
    pdfRenderSecretConfigured: boolean;
    automationBypassConfigured: boolean;
    chromiumRuntimeHint: string;
} {
    const vercelEnv = process.env.VERCEL_ENV?.trim() || null;
    let renderHost: string | null = null;
    let renderBaseUrlConfigured = false;

    try {
        const candidates = [
            process.env.PDF_RENDER_BASE_URL,
            vercelEnv === "preview" ? process.env.VERCEL_URL : null,
            process.env.APP_URL,
            process.env.AUTH_URL,
            process.env.NEXT_PUBLIC_SITE_URL,
        ];
        for (const candidate of candidates) {
            const trimmed = candidate?.trim();
            if (!trimmed) continue;
            const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
            try {
                renderHost = new URL(withProtocol).host;
                renderBaseUrlConfigured = true;
                break;
            } catch {
                continue;
            }
        }
    } catch {
        renderHost = null;
    }

    const useSparticuz = process.env.PLAYWRIGHT_USE_SPARTICUZ?.trim();
    const customPath = Boolean(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?.trim());
    let chromiumRuntimeHint = "auto";
    if (customPath) chromiumRuntimeHint = "custom-executable";
    else if (useSparticuz === "1") chromiumRuntimeHint = "sparticuz";
    else if (useSparticuz === "0") chromiumRuntimeHint = "local";
    else if (process.platform === "linux") chromiumRuntimeHint = "sparticuz-default-linux";
    else chromiumRuntimeHint = "local-default";

    return {
        vercelEnv,
        nodeEnv: process.env.NODE_ENV ?? null,
        renderBaseUrlConfigured,
        renderHost,
        pdfRenderSecretConfigured: Boolean(process.env.PDF_RENDER_SECRET?.trim()),
        automationBypassConfigured: Boolean(
            process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim(),
        ),
        chromiumRuntimeHint,
    };
}

export function describeVercelAutomationBypass(urlBefore: string, urlAfter: string): {
    environment: string | null;
    secretConfigured: boolean;
    bypassExpected: boolean;
    bypassApplied: boolean;
} {
    const environment = process.env.VERCEL_ENV?.trim() || null;
    const secretConfigured = Boolean(process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim());
    const bypassExpected = shouldUseVercelProtectionBypass();
    let bypassApplied = false;
    try {
        const before = new URL(urlBefore);
        const after = new URL(urlAfter);
        bypassApplied =
            bypassExpected &&
            !before.searchParams.has(VERCEL_PROTECTION_BYPASS_QUERY_PARAM) &&
            after.searchParams.has(VERCEL_PROTECTION_BYPASS_QUERY_PARAM);
    } catch {
        bypassApplied = false;
    }

    return {
        environment,
        secretConfigured,
        bypassExpected,
        bypassApplied,
    };
}

export function looksLikeVercelProtectionPage(input: {
    status: number;
    title?: string | null;
    finalUrl?: string | null;
}): boolean {
    if (input.status === 401 || input.status === 403) {
        const title = (input.title ?? "").toLowerCase();
        if (
            title.includes("authentication required") ||
            title.includes("vercel authentication") ||
            title.includes("login – vercel") ||
            title.includes("login - vercel")
        ) {
            return true;
        }
    }

    if (input.finalUrl) {
        try {
            const host = new URL(input.finalUrl).host.toLowerCase();
            if (host === "vercel.com" || host.endsWith(".vercel.com")) {
                return true;
            }
        } catch {
            // ignore
        }
    }

    return false;
}

export function logPdfEvent(
    attemptId: PdfAttemptId,
    event: string,
    context: Record<string, unknown> = {},
): void {
    const safe: Record<string, unknown> = { attemptId, event };
    for (const [key, value] of Object.entries(context)) {
        if (value === undefined) continue;
        if (typeof value === "string") {
            safe[key] = sanitizeErrorMessage(value) ?? value;
        } else {
            safe[key] = value;
        }
    }
    console.info(`[pdf:${attemptId}]`, JSON.stringify(safe));
}

export function logPdfError(
    attemptId: PdfAttemptId,
    event: string,
    context: Record<string, unknown> = {},
): void {
    const safe: Record<string, unknown> = { attemptId, event };
    for (const [key, value] of Object.entries(context)) {
        if (value === undefined) continue;
        if (typeof value === "string") {
            safe[key] = sanitizeErrorMessage(value) ?? value;
        } else {
            safe[key] = value;
        }
    }
    console.error(`[pdf:${attemptId}]`, JSON.stringify(safe));
}

export function logPdfStage(
    attemptId: PdfAttemptId,
    stage: PdfStage,
    detail: Record<string, unknown> = {},
): void {
    logPdfEvent(attemptId, "stage", { stage, ...detail });
}
