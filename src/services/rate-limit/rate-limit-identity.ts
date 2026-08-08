import { headers } from "next/headers";
import { hashRateLimitIdentifier, hashRateLimitIdentifierPrefix } from "@/src/services/rate-limit/hash-rate-limit-identifier";
import { RATE_LIMIT_KEY_VERSION } from "@/src/services/rate-limit/constants";

const IPV4_PATTERN = /^(?:\d{1,3}\.){3}\d{1,3}$/;
const IPV6_PATTERN = /^[0-9a-f:]+$/i;

function stripIpv4Port(value: string): string {
    // Some proxies append :port to IPv4 (e.g. "203.0.113.10:54321").
    const matched = /^((?:\d{1,3}\.){3}\d{1,3})(?::\d+)?$/.exec(value);
    return matched?.[1] ?? value;
}

function normalizeIpAddress(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return null;

    // Prefer the left-most address in X-Forwarded-For style lists.
    const first = trimmed.split(",")[0]?.trim() ?? "";
    if (!first) return null;

    if (first.includes(".")) {
        const ipv4 = stripIpv4Port(first);
        if (!IPV4_PATTERN.test(ipv4)) return null;
        return ipv4;
    }

    // Bracketed IPv6 with optional port: [2001:db8::1]:443
    const bracketed = /^\[([0-9a-f:]+)\](?::\d+)?$/i.exec(first);
    const ipv6Raw = (bracketed?.[1] ?? first).toLowerCase();
    if (!IPV6_PATTERN.test(ipv6Raw)) return null;
    return ipv6Raw.replace(/^::ffff:/, "");
}

function shouldTrustProxyHeaders(): boolean {
    return (
        process.env.RATE_LIMIT_TRUST_PROXY_HEADERS === "true" ||
        process.env.VERCEL === "1" ||
        Boolean(process.env.VERCEL_ENV?.trim())
    );
}

function readClientIpFromHeaderGetter(
    getHeader: (name: string) => string | null,
): string | null {
    if (!shouldTrustProxyHeaders()) {
        return null;
    }

    const candidates = [
        getHeader("x-vercel-forwarded-for"),
        getHeader("cf-connecting-ip"),
        getHeader("x-real-ip"),
        getHeader("x-forwarded-for"),
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

export function getClientIp(request: Request): string | null {
    return readClientIpFromHeaderGetter((name) => request.headers.get(name));
}

/**
 * Resolve client IP from the current Next.js request headers.
 * Reads headers() directly — avoids wrapping ReadonlyHeaders in a Fetch Request,
 * which can drop forwarded-IP headers in some runtimes.
 */
export async function getClientIpFromHeaders(): Promise<string | null> {
    const headerStore = await headers();
    return readClientIpFromHeaderGetter((name) => headerStore.get(name));
}

/** @internal Exported for unit tests. */
export function normalizeIpAddressForTests(value: string): string | null {
    return normalizeIpAddress(value);
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
