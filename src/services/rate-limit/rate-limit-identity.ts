import { headers } from "next/headers";
import { hashRateLimitIdentifier, hashRateLimitIdentifierPrefix } from "@/src/services/rate-limit/hash-rate-limit-identifier";
import { RATE_LIMIT_KEY_VERSION } from "@/src/services/rate-limit/constants";

const IPV4_PATTERN = /^(?:\d{1,3}\.){3}\d{1,3}$/;
const IPV6_PATTERN = /^[0-9a-f:]+$/i;

function normalizeIpAddress(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return null;

    if (trimmed.includes(".")) {
        const first = trimmed.split(",")[0]?.trim() ?? "";
        if (!IPV4_PATTERN.test(first)) return null;
        return first;
    }

    const ipv6 = trimmed.toLowerCase();
    if (!IPV6_PATTERN.test(ipv6)) return null;
    return ipv6.replace(/^::ffff:/, "");
}

export function getClientIp(request: Request): string | null {
    const trustProxy =
        process.env.RATE_LIMIT_TRUST_PROXY_HEADERS === "true" ||
        process.env.VERCEL === "1" ||
        Boolean(process.env.VERCEL_ENV?.trim());
    if (!trustProxy) {
        return null;
    }

    const candidates = [
        request.headers.get("x-vercel-forwarded-for"),
        request.headers.get("cf-connecting-ip"),
        request.headers.get("x-real-ip"),
        request.headers.get("x-forwarded-for"),
    ];

    for (const candidate of candidates) {
        if (!candidate) continue;
        const normalized = normalizeIpAddress(candidate);
        if (normalized) {
            return normalized;
        }
    }

    return null;
}

export async function getClientIpFromHeaders(): Promise<string | null> {
    const headerStore = await headers();
    const request = new Request("http://rate-limit.local", {
        headers: headerStore,
    });
    return getClientIp(request);
}

export function getAdministratorRateLimitKey(administratorId: string): string {
    return `admin:${administratorId}`;
}

export function getWebsiteRateLimitKey(websiteId: string): string {
    return `website:${websiteId}`;
}

export function getPublicTokenRateLimitKey(tokenHash: string): string {
    return `token:${tokenHash.slice(0, 16)}`;
}

export function createCompositeRateLimitKey(parts: string[]): string {
    return parts.join(":");
}

export function buildRateLimitStorageKey(policyId: string, identityParts: string[]): string {
    return `rate:${RATE_LIMIT_KEY_VERSION}:${policyId}:${identityParts.join(":")}`;
}

export function getHashedIpRateLimitKey(ip: string): string {
    return `ip:${hashRateLimitIdentifier(ip)}`;
}

export function getHashedEmailRateLimitKey(normalizedEmail: string): string {
    return `account:${hashRateLimitIdentifier(normalizedEmail.toLowerCase())}`;
}

export function getPublicTokenIdentityFromRawToken(rawToken: string): string {
    return getPublicTokenRateLimitKey(hashRateLimitIdentifierPrefix(rawToken, 32));
}

export function normalizeLoginEmail(email: string): string {
    return email.trim().toLowerCase();
}
