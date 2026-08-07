import "server-only";

import { logPdfError } from "@/src/services/pdf-reports/pdf-diagnostics";

const IMAGE_FETCH_TIMEOUT_MS = 12_000;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export type PdfImageSource = {
    src: string;
    width: number;
    height: number;
};

/**
 * Prefetch a screenshot for React PDF. Failures degrade gracefully —
 * a missing/broken image must not abort PDF generation.
 */
export async function fetchPdfImageSource(input: {
    url: string | null | undefined;
    width: number | null | undefined;
    height: number | null | undefined;
    attemptId: string;
    label: string;
}): Promise<PdfImageSource | null> {
    const url = input.url?.trim();
    if (!url) {
        return null;
    }

    const width = input.width && input.width > 0 ? input.width : 1200;
    const height = input.height && input.height > 0 ? input.height : 800;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), IMAGE_FETCH_TIMEOUT_MS);
        let response: Response;
        try {
            response = await fetch(url, {
                signal: controller.signal,
                redirect: "follow",
            });
        } finally {
            clearTimeout(timeout);
        }

        if (!response.ok) {
            logPdfError(input.attemptId, "image_fetch_http", {
                label: input.label,
                status: response.status,
            });
            return null;
        }

        const contentType = (response.headers.get("content-type") ?? "").toLowerCase();
        if (contentType && !contentType.startsWith("image/")) {
            logPdfError(input.attemptId, "image_unsupported_type", {
                label: input.label,
                contentType: contentType.slice(0, 80),
            });
            return null;
        }

        const arrayBuffer = await response.arrayBuffer();
        if (!arrayBuffer.byteLength || arrayBuffer.byteLength > MAX_IMAGE_BYTES) {
            logPdfError(input.attemptId, "image_size_invalid", {
                label: input.label,
                bytes: arrayBuffer.byteLength,
            });
            return null;
        }

        const mime =
            contentType.split(";")[0]?.trim() ||
            inferMimeFromUrl(url) ||
            "image/png";
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        return {
            src: `data:${mime};base64,${base64}`,
            width,
            height,
        };
    } catch (error) {
        logPdfError(input.attemptId, "image_fetch_failed", {
            label: input.label,
            errorName: error instanceof Error ? error.name : "Error",
        });
        return null;
    }
}

function inferMimeFromUrl(url: string): string | null {
    const lower = url.toLowerCase();
    if (lower.includes(".jpg") || lower.includes(".jpeg")) return "image/jpeg";
    if (lower.includes(".webp")) return "image/webp";
    if (lower.includes(".gif")) return "image/gif";
    if (lower.includes(".png")) return "image/png";
    return null;
}
