import { createHash, randomBytes } from "crypto";

export function hashDemoPreviewToken(rawToken: string): string {
    return createHash("sha256").update(rawToken).digest("hex");
}

export function generateDemoPreviewToken(): {
    rawToken: string;
    tokenHash: string;
    tokenPrefix: string;
} {
    const rawToken = randomBytes(32).toString("base64url");
    return {
        rawToken,
        tokenHash: hashDemoPreviewToken(rawToken),
        tokenPrefix: rawToken.slice(0, 8),
    };
}

export function isValidDemoPreviewTokenFormat(rawToken: string): boolean {
    if (!rawToken || typeof rawToken !== "string") return false;
    if (rawToken.length < 16 || rawToken.length > 128) return false;
    return /^[A-Za-z0-9_-]+$/.test(rawToken);
}
