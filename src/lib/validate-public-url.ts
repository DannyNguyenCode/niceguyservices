import dns from "node:dns/promises";
import { isIP } from "node:net";

export class PublicUrlValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PublicUrlValidationError";
    }
}

const BLOCKED_PROTOCOLS = new Set(["file:", "ftp:", "data:", "javascript:"]);
const BLOCKED_HOSTNAMES = new Set([
    "localhost",
    "0.0.0.0",
    "127.0.0.1",
    "::1",
    "[::1]",
]);

const BLOCKED_HOST_SUFFIXES = [".local", ".internal", ".localhost", ".lan"];

function isPrivateIpv4(ip: string): boolean {
    const parts = ip.split(".").map((part) => Number.parseInt(part, 10));
    if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
        return true;
    }

    const [a, b] = parts;
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    return false;
}

function isPrivateIpv6(ip: string): boolean {
    const normalized = ip.toLowerCase();
    if (normalized === "::1") return true;
    if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
    if (normalized.startsWith("fe80:")) return true;
    return false;
}

export function isPrivateOrReservedIp(ip: string): boolean {
    const version = isIP(ip);
    if (version === 4) return isPrivateIpv4(ip);
    if (version === 6) return isPrivateIpv6(ip);
    return true;
}

function isBlockedHostname(hostname: string): boolean {
    const lower = hostname.toLowerCase().replace(/\.$/, "");
    if (BLOCKED_HOSTNAMES.has(lower)) return true;
    if (lower.endsWith(".localhost")) return true;
    return BLOCKED_HOST_SUFFIXES.some((suffix) => lower.endsWith(suffix));
}

async function resolveHostname(hostname: string): Promise<string[]> {
    if (isIP(hostname)) {
        return [hostname];
    }

    const addresses = new Set<string>();

    try {
        const ipv4 = await dns.resolve4(hostname);
        ipv4.forEach((address) => addresses.add(address));
    } catch {
        // IPv4 resolution may be unavailable.
    }

    try {
        const ipv6 = await dns.resolve6(hostname);
        ipv6.forEach((address) => addresses.add(address));
    } catch {
        // IPv6 resolution may be unavailable.
    }

    if (addresses.size === 0) {
        throw new PublicUrlValidationError(
            "Unable to resolve the website hostname.",
        );
    }

    return [...addresses];
}

export function parseHttpUrl(input: string): URL {
    const trimmed = input.trim();
    if (!trimmed) {
        throw new PublicUrlValidationError("Website URL is required.");
    }

    const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;

    let parsed: URL;
    try {
        parsed = new URL(withProtocol);
    } catch {
        throw new PublicUrlValidationError("Please enter a valid website URL.");
    }

    if (BLOCKED_PROTOCOLS.has(parsed.protocol)) {
        throw new PublicUrlValidationError("This URL protocol is not allowed.");
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new PublicUrlValidationError("Website URL must use http or https.");
    }

    if (!parsed.hostname) {
        throw new PublicUrlValidationError("Website URL must include a hostname.");
    }

    if (parsed.username || parsed.password) {
        throw new PublicUrlValidationError("Website URL must not include credentials.");
    }

    return parsed;
}

export async function validatePublicCrawlUrl(input: string): Promise<URL> {
    const parsed = parseHttpUrl(input);
    const hostname = parsed.hostname.toLowerCase().replace(/\.$/, "");

    if (isBlockedHostname(hostname)) {
        throw new PublicUrlValidationError("This website URL is not allowed.");
    }

    if (isIP(hostname) && isPrivateOrReservedIp(hostname)) {
        throw new PublicUrlValidationError("This website URL is not allowed.");
    }

    const resolvedAddresses = await resolveHostname(hostname);
    for (const address of resolvedAddresses) {
        if (isPrivateOrReservedIp(address)) {
            throw new PublicUrlValidationError("This website URL is not allowed.");
        }
    }

    return parsed;
}

export function toSafePublicErrorMessage(error: unknown): string {
    if (error instanceof PublicUrlValidationError) {
        return error.message;
    }
    return "This website URL is not allowed.";
}
