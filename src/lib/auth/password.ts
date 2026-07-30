import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { AuthValidationError } from "@/src/lib/errors/audit-platform-error";

const MIN_PASSWORD_LENGTH = 8;

const SCRYPT_PARAMS = {
    N: 16384,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024,
} as const;

export function assertPasswordUsable(password: string): void {
    if (!password || password.trim().length < MIN_PASSWORD_LENGTH) {
        throw new AuthValidationError(
            `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
        );
    }
}

export function hashPassword(password: string): string {
    assertPasswordUsable(password);
    const salt = randomBytes(16);
    const derived = scryptSync(password, salt, 64, SCRYPT_PARAMS);
    return `scrypt$${salt.toString("base64")}$${derived.toString("base64")}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
    const parts = storedHash.split("$");
    if (parts.length !== 3 || parts[0] !== "scrypt") {
        return false;
    }

    const salt = Buffer.from(parts[1], "base64");
    const expected = Buffer.from(parts[2], "base64");
    const derived = scryptSync(password, salt, expected.length, SCRYPT_PARAMS);

    if (derived.length !== expected.length) {
        return false;
    }

    return timingSafeEqual(derived, expected);
}
