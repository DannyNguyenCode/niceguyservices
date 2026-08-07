import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { getAuthSecret } from "@/src/lib/auth/config";
import { buildApplicationPath } from "@/src/lib/application-url";

/** Signed PDF download links for completion emails (7 days). */
export const PUBLIC_PDF_EMAIL_DOWNLOAD_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type PublicPdfEmailDownloadPayload = {
    pdfReportId: string;
    websiteId: string;
    publicReportId: string;
    expiresAt: number;
};

function signEncodedPayload(encodedPayload: string): string {
    return createHmac("sha256", getAuthSecret()).update(encodedPayload).digest("base64url");
}

export function buildPublicPdfEmailDownloadToken(input: {
    pdfReportId: string;
    websiteId: string;
    publicReportId: string;
    ttlMs?: number;
}): string {
    const payload: PublicPdfEmailDownloadPayload = {
        pdfReportId: input.pdfReportId,
        websiteId: input.websiteId,
        publicReportId: input.publicReportId,
        expiresAt: Date.now() + (input.ttlMs ?? PUBLIC_PDF_EMAIL_DOWNLOAD_TTL_MS),
    };
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
    return `${encodedPayload}.${signEncodedPayload(encodedPayload)}`;
}

export function verifyPublicPdfEmailDownloadToken(
    rawToken: string,
):
    | { ok: true; payload: PublicPdfEmailDownloadPayload }
    | { ok: false; code: "INVALID" | "EXPIRED" } {
    if (!rawToken || typeof rawToken !== "string" || !rawToken.includes(".")) {
        return { ok: false, code: "INVALID" };
    }

    const [encodedPayload, signature] = rawToken.split(".");
    if (!encodedPayload || !signature) {
        return { ok: false, code: "INVALID" };
    }

    const expected = signEncodedPayload(encodedPayload);
    const left = Buffer.from(signature);
    const right = Buffer.from(expected);
    if (left.length !== right.length || !timingSafeEqual(left, right)) {
        return { ok: false, code: "INVALID" };
    }

    try {
        const parsed = JSON.parse(
            Buffer.from(encodedPayload, "base64url").toString("utf8"),
        ) as PublicPdfEmailDownloadPayload;
        if (
            !parsed?.pdfReportId ||
            !parsed?.websiteId ||
            !parsed?.publicReportId ||
            typeof parsed.expiresAt !== "number"
        ) {
            return { ok: false, code: "INVALID" };
        }
        if (Date.now() > parsed.expiresAt) {
            return { ok: false, code: "EXPIRED" };
        }
        return { ok: true, payload: parsed };
    } catch {
        return { ok: false, code: "INVALID" };
    }
}

export function buildPublicPdfEmailDownloadUrl(input: {
    pdfReportId: string;
    websiteId: string;
    publicReportId: string;
}): string {
    const token = buildPublicPdfEmailDownloadToken(input);
    return buildApplicationPath(`/api/public/pdf-download/${encodeURIComponent(token)}`);
}
