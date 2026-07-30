import { z } from "zod";

const urlSchema = z
    .string()
    .trim()
    .url()
    .refine((value) => /^https?:\/\//i.test(value), {
        message: "Application URL must use http or https.",
    });

function normalizeBaseUrl(value: string): string {
    return value.replace(/\/$/, "");
}

function readServerAppUrl(): string | null {
    const candidates = [
        process.env.APP_URL,
        process.env.AUTH_URL,
        process.env.PDF_RENDER_BASE_URL,
        process.env.DEMO_PREVIEW_BASE_URL,
        process.env.NEXT_PUBLIC_SITE_URL,
    ];

    for (const candidate of candidates) {
        const trimmed = candidate?.trim();
        if (!trimmed) continue;
        const parsed = urlSchema.safeParse(trimmed);
        if (parsed.success) {
            return normalizeBaseUrl(parsed.data);
        }
    }

    return null;
}

function readClientAppUrl(): string | null {
    const value = process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (!value) return null;
    const parsed = urlSchema.safeParse(value);
    return parsed.success ? normalizeBaseUrl(parsed.data) : null;
}

export function getApplicationUrl(): string {
    const serverUrl = readServerAppUrl();
    if (serverUrl) {
        return serverUrl;
    }

    const nodeEnv = process.env.NODE_ENV ?? "development";
    if (nodeEnv === "production") {
        throw new Error(
            "APP_URL (or NEXT_PUBLIC_SITE_URL) must be configured for production.",
        );
    }

    return "http://localhost:3000";
}

export function getClientApplicationUrl(): string {
    return readClientAppUrl() ?? getApplicationUrl();
}

export function buildApplicationPath(path: string): string {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${getApplicationUrl()}${normalizedPath}`;
}

export function buildPublicReportUrl(rawToken: string): string {
    return buildApplicationPath(`/report/${rawToken}`);
}

export function buildDemoPreviewUrl(rawToken: string): string {
    return buildApplicationPath(`/demo-preview/${rawToken}`);
}

export function isLocalhostUrl(value: string): boolean {
    try {
        const hostname = new URL(value).hostname.toLowerCase();
        return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
    } catch {
        return false;
    }
}

export function assertProductionApplicationUrl(): void {
    const nodeEnv = process.env.NODE_ENV ?? "development";
    if (nodeEnv !== "production") {
        return;
    }

    const url = getApplicationUrl();
    if (isLocalhostUrl(url)) {
        throw new Error("Production APP_URL cannot use localhost.");
    }
}
