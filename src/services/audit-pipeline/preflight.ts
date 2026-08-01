import "server-only";

import {
    OutboundRequestSecurityError,
    toSafeOutboundErrorMessage,
    validateOutboundHttpUrl,
} from "@/src/services/outbound-request-security";
import { AUDIT_PREFLIGHT_TIMEOUT_MS } from "@/src/services/audit-pipeline/constants";

export class AuditPreflightError extends Error {
    readonly code: string;

    constructor(code: string, message: string) {
        super(message);
        this.name = "AuditPreflightError";
        this.code = code;
    }
}

export type AuditPreflightResult = {
    submittedUrl: string;
    finalUrl: string;
    normalizedDomain: string;
    redirectCount: number;
};

function normalizeDomain(hostname: string): string {
    return hostname.toLowerCase().replace(/^www\./, "");
}

export async function runAuditPreflight(url: string): Promise<AuditPreflightResult> {
    let parsed: URL;
    try {
        parsed = await validateOutboundHttpUrl(url);
    } catch (error) {
        throw new AuditPreflightError(
            "AUDIT_PREFLIGHT_URL_INVALID",
            error instanceof OutboundRequestSecurityError
                ? error.message
                : toSafeOutboundErrorMessage(error),
        );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AUDIT_PREFLIGHT_TIMEOUT_MS);

    try {
        const response = await fetch(parsed.toString(), {
            method: "GET",
            redirect: "follow",
            signal: controller.signal,
            headers: {
                "User-Agent": "NiceGuyAuditPreflight/1.0",
                Accept: "text/html,application/xhtml+xml",
            },
        });

        const contentType = response.headers.get("content-type") ?? "";
        if (
            contentType &&
            !contentType.includes("text/html") &&
            !contentType.includes("application/xhtml")
        ) {
            throw new AuditPreflightError(
                "AUDIT_PREFLIGHT_UNSUPPORTED_CONTENT",
                "The website did not return an HTML page.",
            );
        }

        const finalUrl = response.url || parsed.toString();
        const finalParsed = new URL(finalUrl);
        await validateOutboundHttpUrl(finalUrl);

        return {
            submittedUrl: parsed.toString(),
            finalUrl,
            normalizedDomain: normalizeDomain(finalParsed.hostname),
            redirectCount: response.redirected ? 1 : 0,
        };
    } catch (error) {
        if (error instanceof AuditPreflightError) {
            throw error;
        }
        if (error instanceof Error && error.name === "AbortError") {
            throw new AuditPreflightError(
                "AUDIT_PREFLIGHT_TIMEOUT",
                "The website did not respond within the expected time.",
            );
        }
        throw new AuditPreflightError(
            "AUDIT_PREFLIGHT_UNREACHABLE",
            "The website could not be reached.",
        );
    } finally {
        clearTimeout(timeout);
    }
}
