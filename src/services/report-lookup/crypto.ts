import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { REPORT_LOOKUP_CODE_DIGITS } from "@/src/services/report-lookup/constants";

/**
 * Cryptographically secure 6-digit numeric code (leading zeroes preserved).
 * Uses Node crypto — never Math.random().
 */
export function generateVerificationCode(): string {
    return String(randomInt(0, 1_000_000)).padStart(REPORT_LOOKUP_CODE_DIGITS, "0");
}

export function isValidVerificationCodeFormat(code: string): boolean {
    return new RegExp(`^\\d{${REPORT_LOOKUP_CODE_DIGITS}}$`).test(code);
}

/**
 * HMAC-SHA256 of the code bound to the normalized email (pepper = secret).
 * Never store plaintext codes.
 */
export function hashVerificationCode(
    code: string,
    normalizedEmail: string,
    secret: string,
): string {
    return createHmac("sha256", secret)
        .update(`report-lookup-code:${normalizedEmail}:${code}`)
        .digest("hex");
}

export function verificationCodesEqual(a: string, b: string): boolean {
    const left = Buffer.from(a);
    const right = Buffer.from(b);
    if (left.length !== right.length) {
        return false;
    }
    return timingSafeEqual(left, right);
}

export function generateLookupSessionToken(): string {
    return randomBytes(32).toString("base64url");
}

export function hashLookupSessionToken(rawToken: string, secret: string): string {
    return createHmac("sha256", secret).update(`report-lookup-session:${rawToken}`).digest("hex");
}
