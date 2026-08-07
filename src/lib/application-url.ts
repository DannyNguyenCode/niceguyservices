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

function parseConfiguredUrl(value: string | undefined): string | null {
    const trimmed = value?.trim();
    if (!trimmed) return null;
    const parsed = urlSchema.safeParse(trimmed);
    return parsed.success ? normalizeBaseUrl(parsed.data) : null;
}

function vercelDeploymentBaseUrl(): string | null {
    const vercelHost = process.env.VERCEL_URL?.trim();
    if (!vercelHost) return null;
    const host = vercelHost.replace(/^https?:\/\//i, "").replace(/\/$/, "");
    return host ? `https://${host}` : null;
}

/**
 * Candidate application base URLs, highest preference first.
 * AUTH_URL is last — NextAuth commonly sets it to localhost, which must not
 * win over a real public site URL in customer-facing links (emails, reports).
 */
function collectConfiguredAppUrls(): string[] {
    const urls: string[] = [];
    const push = (value: string | null) => {
        if (value && !urls.includes(value)) {
            urls.push(value);
        }
    };

    push(parseConfiguredUrl(process.env.APP_PUBLIC_URL));
    push(parseConfiguredUrl(process.env.APP_URL));
    push(parseConfiguredUrl(process.env.NEXT_PUBLIC_APP_URL));
    push(parseConfiguredUrl(process.env.NEXT_PUBLIC_SITE_URL));
    push(parseConfiguredUrl(process.env.PDF_RENDER_BASE_URL));
    push(parseConfiguredUrl(process.env.DEMO_PREVIEW_BASE_URL));
    push(vercelDeploymentBaseUrl());
    push(parseConfiguredUrl(process.env.AUTH_URL));

    return urls;
}

function preferNonLocalhost(urls: string[]): string | null {
    if (urls.length === 0) return null;
    return urls.find((url) => !isLocalhostUrl(url)) ?? urls[0] ?? null;
}

function readServerAppUrl(): string | null {
    // Preview deployments must use the current host so signed email/PDF links
    // hit the same environment that created them.
    if (process.env.VERCEL_ENV === "preview") {
        const previewUrl = vercelDeploymentBaseUrl();
        if (previewUrl) {
            return previewUrl;
        }
    }

    return preferNonLocalhost(collectConfiguredAppUrls());
}

function readClientAppUrl(): string | null {
    return preferNonLocalhost([
        parseConfiguredUrl(process.env.NEXT_PUBLIC_APP_URL),
        parseConfiguredUrl(process.env.NEXT_PUBLIC_SITE_URL),
        vercelDeploymentBaseUrl(),
    ].filter((value): value is string => Boolean(value)));
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
