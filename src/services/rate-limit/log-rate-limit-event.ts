import "server-only";

import { createActivityLog } from "@/src/data/activity-logs";
import type { RateLimitPolicyId } from "@/src/validation/rate-limit";

const IMPORTANT_POLICIES = new Set<RateLimitPolicyId>([
    "auth-login-ip",
    "auth-login-account",
    "audit-start",
    "crawl-start",
    "pagespeed-run",
    "ai-analysis-run",
    "demo-generate",
    "pagespeed-global-daily",
    "ai-analysis-global-daily",
]);

export async function logImportantRateLimitEvent(input: {
    policyId: RateLimitPolicyId;
    retryAfterSeconds: number;
    websiteId?: string | null;
    auditRunId?: string | null;
    action?: string;
}): Promise<void> {
    if (!IMPORTANT_POLICIES.has(input.policyId)) {
        return;
    }

    if (!input.websiteId) {
        return;
    }

    try {
        await createActivityLog({
            websiteId: input.websiteId,
            auditRunId: input.auditRunId ?? null,
            type: "rate-limit-triggered",
            description: "An action was temporarily limited to prevent abuse.",
            severity: "warning",
            actor: "system",
            metadata: {
                policyId: input.policyId,
                action: input.action ?? input.policyId,
                retryAfterSeconds: input.retryAfterSeconds,
                resourceType: input.policyId,
                websiteId: input.websiteId ?? undefined,
                auditRunId: input.auditRunId ?? undefined,
            },
        });
    } catch (error) {
        console.warn("[rate-limit] Failed to record activity event", {
            policyId: input.policyId,
            environment: process.env.NODE_ENV ?? "development",
            error: error instanceof Error ? error.message : "unknown",
        });
    }
}

export function logRateLimitDecision(input: {
    policyId: string;
    allowed: boolean;
    remaining: number;
    retryAfterSeconds: number;
    route?: string;
}): void {
    console.info("[rate-limit]", {
        policyId: input.policyId,
        allowed: input.allowed,
        remaining: input.remaining,
        retryAfterSeconds: input.retryAfterSeconds,
        route: input.route,
        environment: process.env.NODE_ENV ?? "development",
    });
}
