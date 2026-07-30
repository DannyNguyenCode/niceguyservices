import "server-only";

import { getApplicationUrl } from "@/src/lib/application-url";
import { readPdfRenderSecret } from "@/src/services/pdf-reports/read-pdf-render-secret";

export function getPdfRenderBaseUrl(): string {
    return getApplicationUrl();
}

export function getPdfRenderSecret(): string {
    return readPdfRenderSecret();
}

export function getPdfRenderTimeoutMs(): number {
    const value = Number(process.env.PDF_RENDER_TIMEOUT_MS ?? 120000);
    return Number.isFinite(value) && value > 0 ? value : 120000;
}

export function getPdfMaxRetries(): number {
    const value = Number(process.env.PDF_MAX_RETRIES ?? 1);
    return Number.isFinite(value) && value >= 0 ? value : 1;
}

export function getPdfCloudinaryFolder(): string {
    const base = process.env.PDF_CLOUDINARY_FOLDER?.trim() || "website-audit-reports";
    const deployment = process.env.DEPLOYMENT_ENV?.trim().toLowerCase();
    if (deployment === "production") return `${base}/production`;
    if (deployment === "preview" || deployment === "staging") return `${base}/preview`;
    if (process.env.NODE_ENV === "production") return `${base}/production`;
    return `${base}/development`;
}

export function isPdfRendererConfigured(): boolean {
    try {
        getPdfRenderSecret();
        return Boolean(getPdfRenderBaseUrl());
    } catch {
        return false;
    }
}
