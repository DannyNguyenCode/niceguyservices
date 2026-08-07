import { createHash, randomBytes } from "crypto";
import {
    MAX_REPORT_TOKEN_LENGTH,
    MIN_REPORT_TOKEN_LENGTH,
} from "@/src/lib/public-report-config";

export function hashReportToken(rawToken: string): string {
    return createHash("sha256").update(rawToken).digest("hex");
}

export function generateReportToken(): {
    rawToken: string;
    tokenHash: string;
    tokenPrefix: string;
} {
    const rawToken = randomBytes(32).toString("base64url");
    return {
        rawToken,
        tokenHash: hashReportToken(rawToken),
        tokenPrefix: rawToken.slice(0, 8),
    };
}

export function isValidReportTokenFormat(rawToken: string): boolean {
    if (!rawToken || typeof rawToken !== "string") return false;
    if (rawToken.length < MIN_REPORT_TOKEN_LENGTH) return false;
    if (rawToken.length > MAX_REPORT_TOKEN_LENGTH) return false;
    return /^[A-Za-z0-9_-]+$/.test(rawToken);
}
