import { createHmac, timingSafeEqual } from "crypto";
import { readPdfRenderSecret } from "@/src/services/pdf-reports/read-pdf-render-secret";
import type { PdfRenderTokenPayload } from "@/src/services/pdf-reports/types";

function verifySignature(encodedPayload: string, signature: string): boolean {
    const expected = createHmac("sha256", readPdfRenderSecret())
        .update(encodedPayload)
        .digest("base64url");

    const left = Buffer.from(expected);
    const right = Buffer.from(signature);
    if (left.length !== right.length) {
        return false;
    }
    return timingSafeEqual(left, right);
}

export function validatePdfRenderToken(
    token: string,
    expected: {
        publicReportId: string;
        pdfReportId: string;
        snapshotChecksum: string;
    },
): PdfRenderTokenPayload | null {
    if (!token || typeof token !== "string") {
        return null;
    }

    const parts = token.split(".");
    if (parts.length !== 2) {
        return null;
    }

    const [encodedPayload, signature] = parts;
    if (!verifySignature(encodedPayload, signature)) {
        return null;
    }

    try {
        const payload = JSON.parse(
            Buffer.from(encodedPayload, "base64url").toString("utf8"),
        ) as PdfRenderTokenPayload;

        if (
            payload.publicReportId !== expected.publicReportId ||
            payload.pdfReportId !== expected.pdfReportId ||
            payload.snapshotChecksum !== expected.snapshotChecksum
        ) {
            return null;
        }

        if (!payload.expiresAt || payload.expiresAt < Date.now()) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}
