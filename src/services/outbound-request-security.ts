import dns from "node:dns/promises";
import { isIP } from "node:net";

export class OutboundRequestSecurityError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "OutboundRequestSecurityError";
    }
}

const BLOCKED_PROTOCOLS = new Set([
    "file:",
    "ftp:",
    "data:",
    "javascript:",
    "ws:",
    "wss:",
    "blob:",
    "about:",
]);

const BLOCKED_HOSTNAMES = new Set([
    "localhost",
    "0.0.0.0",
    "127.0.0.1",
    "::1",
    "[::1]",
    "metadata.google.internal",
    "metadata",
]);

const BLOCKED_HOST_SUFFIXES = [
    ".local",
    ".internal",
    ".localhost",
    ".lan",
    ".home",
    ".corp",
    ".intranet",
];

const METADATA_IPV4 = new Set(["169.254.169.254", "169.254.170.2"]);
const METADATA_IPV6 = new Set(["fe80::a9fe:a9fe", "fd00:ec2::254"]);

function normalizeIpv6(ip: string): string {
    return ip.toLowerCase().replace(/^\[|\]$/g, "");
}

function expandIpv4MappedIpv6(ip: string): string | null {
    const normalized = normalizeIpv6(ip);
    if (normalized.startsWith("::ffff:")) {
        return normalized.slice("::ffff:".length);
    }
    return null;
}

function isPrivateIpv4(ip: string): boolean {
    const parts = ip.split(".").map((part) => Number.parseInt(part, 10));
    if (parts.length !== 4 || parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
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
    if (a >= 224) return true;
    return false;
}

function isPrivateIpv6(ip: string): boolean {
    const normalized = normalizeIpv6(ip);
    if (normalized === "::1") return true;
    if (normalized === "::") return true;
    if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
    if (normalized.startsWith("fe80:")) return true;
    if (METADATA_IPV6.has(normalized)) return true;
    return false;
}

export function isPrivateOrReservedIp(ip: string): boolean {
    const mappedIpv4 = expandIpv4MappedIpv6(ip);
    if (mappedIpv4) {
        return isPrivateIpv4(mappedIpv4);
    }

    const version = isIP(ip);
    if (version === 4) {
        if (METADATA_IPV4.has(ip)) return true;
        return isPrivateIpv4(ip);
    }
    if (version === 6) {
        return isPrivateIpv6(ip);
    }
    return true;
}

function isBlockedHostname(hostname: string): boolean {
    const lower = hostname.toLowerCase().replace(/\.$/, "");
    if (BLOCKED_HOSTNAMES.has(lower)) return true;
    if (lower.endsWith(".localhost")) return true;
    if (lower === "localhost" || lower.endsWith(".localhost")) return true;
    return BLOCKED_HOST_SUFFIXES.some((suffix) => lower.endsWith(suffix));
}

async function resolveHostname(hostname: string): Promise<string[]> {
    if (isIP(hostname)) {
        return [hostname];
    }

    const addresses = new Set<string>();
    let resolutionFailed = true;

    try {
        const ipv4 = await dns.resolve4(hostname, { ttl: true });
        ipv4.forEach((entry) => {
            addresses.add(entry.address);
            resolutionFailed = false;
        });
    } catch {
        // IPv4 may be unavailable.
    }

    try {
        const ipv6 = await dns.resolve6(hostname, { ttl: true });
        ipv6.forEach((entry) => {
            addresses.add(entry.address);
            resolutionFailed = false;
        });
    } catch {
        // IPv6 may be unavailable.
    }

    if (resolutionFailed || addresses.size === 0) {
        throw new OutboundRequestSecurityError("Unable to resolve the website hostname.");
    }

    return [...addresses];
}

export function parseAllowedHttpUrl(input: string): URL {
    const trimmed = input.trim();
    if (!trimmed) {
        throw new OutboundRequestSecurityError("Website URL is required.");
    }

    const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;

    let parsed: URL;
    try {
        parsed = new URL(withProtocol);
    } catch {
        throw new OutboundRequestSecurityError("Please enter a valid website URL.");
    }

    if (BLOCKED_PROTOCOLS.has(parsed.protocol)) {
        throw new OutboundRequestSecurityError("This URL protocol is not allowed.");
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new OutboundRequestSecurityError("Website URL must use http or https.");
    }

    if (!parsed.hostname) {
        throw new OutboundRequestSecurityError("Website URL must include a hostname.");
    }

    if (parsed.username || parsed.password) {
        throw new OutboundRequestSecurityError("Website URL must not include credentials.");
    }

    return parsed;
}

export async function validateOutboundHttpUrl(input: string): Promise<URL> {
    const parsed = parseAllowedHttpUrl(input);
    const hostname = parsed.hostname.toLowerCase().replace(/\.$/, "");

    if (isBlockedHostname(hostname)) {
        throw new OutboundRequestSecurityError("This website URL is not allowed.");
    }

    if (isIP(hostname) && isPrivateOrReservedIp(hostname)) {
        throw new OutboundRequestSecurityError("This website URL is not allowed.");
    }

    const resolvedAddresses = await resolveHostname(hostname);
    let hasPublicAddress = false;

    for (const address of resolvedAddresses) {
        if (isPrivateOrReservedIp(address)) {
            throw new OutboundRequestSecurityError("This website URL is not allowed.");
        }
        hasPublicAddress = true;
    }

    if (!hasPublicAddress) {
        throw new OutboundRequestSecurityError("This website URL is not allowed.");
    }

    return parsed;
}

export function toSafeOutboundErrorMessage(error: unknown): string {
    if (error instanceof OutboundRequestSecurityError) {
        return error.message;
    }
    return "This website URL is not allowed.";
}
