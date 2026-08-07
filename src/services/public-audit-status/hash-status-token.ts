import { createHash, randomBytes } from "crypto";
import {
    MAX_PUBLIC_AUDIT_STATUS_TOKEN_LENGTH,
    MIN_PUBLIC_AUDIT_STATUS_TOKEN_LENGTH,
} from "@/src/services/public-audit-status/constants";

export function hashPublicAuditStatusToken(rawToken: string): string {
    return createHash("sha256").update(rawToken).digest("hex");
}

export function generatePublicAuditStatusToken(): {
    rawToken: string;
    tokenHash: string;
    tokenPrefix: string;
} {
    const rawToken = randomBytes(32).toString("base64url");
    return {
        rawToken,
        tokenHash: hashPublicAuditStatusToken(rawToken),
        tokenPrefix: rawToken.slice(0, 8),
    };
}

export function isValidPublicAuditStatusTokenFormat(rawToken: string): boolean {
    if (!rawToken || typeof rawToken !== "string") return false;
    if (rawToken.length < MIN_PUBLIC_AUDIT_STATUS_TOKEN_LENGTH) return false;
    if (rawToken.length > MAX_PUBLIC_AUDIT_STATUS_TOKEN_LENGTH) return false;
    return /^[A-Za-z0-9_-]+$/.test(rawToken);
}

/** Safe log reference — never log the full raw token. */
export function publicAuditStatusTokenLogRef(rawTokenOrPrefix: string): string {
    return rawTokenOrPrefix.slice(0, 8);
}
