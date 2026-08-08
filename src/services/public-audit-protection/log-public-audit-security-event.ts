import "server-only";

import type { PublicAuditBlockReason } from "@/src/services/public-audit-protection/evaluate-public-audit-eligibility";

/**
 * Internal operational logging for public audit abuse protection.
 * Never log tokens, codes, secrets, raw IPs, or full emails.
 */
export function logPublicAuditSecurityEvent(input: {
    event:
        | "public_audit_request_received"
        | "public_audit_rate_limited"
        | "public_audit_domain_active"
        | "public_audit_domain_cooldown"
        | "public_audit_accepted"
        | "public_audit_orchestration_started"
        | "public_audit_orchestration_start_failed";
    normalizedDomain?: string;
    websiteId?: string | null;
    reason?: PublicAuditBlockReason | "rate_limited";
    orchestrationStarted?: boolean;
    /** Safe machine id only — never raw IP/email. */
    policyId?: string;
    retryAfterSeconds?: number;
}): void {
    console.info("[public-audit-protection]", {
        event: input.event,
        normalizedDomain: input.normalizedDomain,
        websiteId: input.websiteId ?? undefined,
        reason: input.reason,
        orchestrationStarted: input.orchestrationStarted,
        policyId: input.policyId,
        retryAfterSeconds: input.retryAfterSeconds,
        environment: process.env.NODE_ENV ?? "development",
    });
}
