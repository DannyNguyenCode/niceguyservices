import { NormalizeDomainError } from "@/src/lib/errors/audit-platform-error";

export type NormalizedWebsiteUrl = {
    normalizedUrl: string;
    normalizedDomain: string;
};

/**
 * Normalize a user-entered website address to a comparable domain and canonical URL.
 *
 * Examples that all become domain `example.com`:
 * - https://www.example.com/
 * - http://example.com/contact
 * - example.com
 * - www.example.com/services
 */
export function normalizeWebsiteUrl(input: string): NormalizedWebsiteUrl {
    const trimmed = input.trim();
    if (!trimmed) {
        throw new NormalizeDomainError("Website URL is required.");
    }

    const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;

    let parsed: URL;
    try {
        parsed = new URL(withProtocol);
    } catch {
        throw new NormalizeDomainError("Please enter a valid website URL.");
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new NormalizeDomainError("Website URL must use http or https.");
    }

    let hostname = parsed.hostname.toLowerCase();
    if (hostname.endsWith(".")) {
        hostname = hostname.replace(/\.+$/, "");
    }
    if (hostname.startsWith("www.")) {
        hostname = hostname.slice(4);
    }

    if (!hostname || !hostname.includes(".")) {
        throw new NormalizeDomainError("Please enter a valid website domain.");
    }

    return {
        normalizedDomain: hostname,
        normalizedUrl: `https://${hostname}`,
    };
}

export function tryNormalizeWebsiteUrl(
    input: string,
): NormalizedWebsiteUrl | null {
    try {
        return normalizeWebsiteUrl(input);
    } catch {
        return null;
    }
}
