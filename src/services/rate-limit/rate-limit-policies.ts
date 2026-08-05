import type { RateLimitPolicyId } from "@/src/validation/rate-limit";
import { getRateLimitEnv } from "@/src/config/env";

export type RateLimitPolicy = {
    id: RateLimitPolicyId;
    algorithm: "fixed-window" | "sliding-window" | "token-bucket";
    limit: number;
    windowSeconds: number;
    burst?: number;
    cost?: number;
    scope:
        | "ip"
        | "administrator"
        | "website"
        | "audit-run"
        | "public-token"
        | "global"
        | "composite";
    failureMode: "open" | "closed" | "fallback";
    description: string;
};

const BASE_POLICIES: Record<RateLimitPolicyId, RateLimitPolicy> = {
    "auth-login-ip": {
        id: "auth-login-ip",
        algorithm: "sliding-window",
        limit: 10,
        windowSeconds: 15 * 60,
        scope: "ip",
        failureMode: "closed",
        description: "Login attempts per IP.",
    },
    "auth-login-account": {
        id: "auth-login-account",
        algorithm: "sliding-window",
        limit: 8,
        windowSeconds: 15 * 60,
        scope: "composite",
        failureMode: "closed",
        description: "Login attempts per normalized account identifier.",
    },
    "admin-read": {
        id: "admin-read",
        algorithm: "token-bucket",
        limit: 180,
        windowSeconds: 60,
        burst: 60,
        scope: "administrator",
        failureMode: "open",
        description: "Administrator read safety net.",
    },
    "admin-write": {
        id: "admin-write",
        algorithm: "token-bucket",
        limit: 60,
        windowSeconds: 60,
        burst: 20,
        scope: "administrator",
        failureMode: "open",
        description: "Administrator write safety net.",
    },
    "audit-start": {
        id: "audit-start",
        algorithm: "sliding-window",
        limit: 3,
        windowSeconds: 10 * 60,
        scope: "composite",
        failureMode: "closed",
        description: "Start full audit per administrator and website.",
    },
    "crawl-start": {
        id: "crawl-start",
        algorithm: "sliding-window",
        limit: 3,
        windowSeconds: 10 * 60,
        scope: "composite",
        failureMode: "closed",
        description: "Website crawl starts per administrator and website.",
    },
    "screenshot-start": {
        id: "screenshot-start",
        algorithm: "sliding-window",
        limit: 5,
        windowSeconds: 10 * 60,
        scope: "composite",
        failureMode: "closed",
        description: "Screenshot capture per administrator and website.",
    },
    "pagespeed-run": {
        id: "pagespeed-run",
        algorithm: "sliding-window",
        limit: 4,
        windowSeconds: 15 * 60,
        scope: "composite",
        failureMode: "closed",
        description: "PageSpeed runs per administrator and website.",
    },
    "pagespeed-global-daily": {
        id: "pagespeed-global-daily",
        algorithm: "fixed-window",
        limit: 500,
        windowSeconds: 24 * 60 * 60,
        scope: "global",
        failureMode: "closed",
        description: "Global daily PageSpeed budget.",
    },
    "metrics-run": {
        id: "metrics-run",
        algorithm: "sliding-window",
        limit: 10,
        windowSeconds: 10 * 60,
        scope: "composite",
        failureMode: "open",
        description: "Nice Guy metrics per administrator and website.",
    },
    "ai-analysis-run": {
        id: "ai-analysis-run",
        algorithm: "sliding-window",
        limit: 3,
        windowSeconds: 30 * 60,
        scope: "composite",
        failureMode: "closed",
        description: "AI analysis per administrator and website.",
    },
    "ai-analysis-global-daily": {
        id: "ai-analysis-global-daily",
        algorithm: "fixed-window",
        limit: 200,
        windowSeconds: 24 * 60 * 60,
        scope: "global",
        failureMode: "closed",
        description: "Global daily AI analysis budget.",
    },
    "pdf-generate": {
        id: "pdf-generate",
        algorithm: "sliding-window",
        limit: 5,
        windowSeconds: 15 * 60,
        scope: "composite",
        failureMode: "closed",
        description: "PDF generation per administrator and website.",
    },
    "outreach-generate": {
        id: "outreach-generate",
        algorithm: "sliding-window",
        limit: 5,
        windowSeconds: 30 * 60,
        scope: "composite",
        failureMode: "closed",
        description: "Outreach draft generation per administrator and website.",
    },
    "demo-generate": {
        id: "demo-generate",
        algorithm: "sliding-window",
        limit: 2,
        windowSeconds: 60 * 60,
        scope: "composite",
        failureMode: "closed",
        description: "Demo generation per administrator and website.",
    },
    "public-report-view": {
        id: "public-report-view",
        algorithm: "sliding-window",
        limit: 120,
        windowSeconds: 10 * 60,
        scope: "composite",
        failureMode: "closed",
        description: "Public report views per IP and token.",
    },
    "public-demo-view": {
        id: "public-demo-view",
        algorithm: "sliding-window",
        limit: 120,
        windowSeconds: 10 * 60,
        scope: "composite",
        failureMode: "closed",
        description: "Public demo preview views per IP and token.",
    },
    "public-pdf-download": {
        id: "public-pdf-download",
        algorithm: "sliding-window",
        limit: 30,
        windowSeconds: 10 * 60,
        scope: "composite",
        failureMode: "closed",
        description: "Public PDF downloads per IP and resource key.",
    },
    "public-audit-submit": {
        id: "public-audit-submit",
        algorithm: "sliding-window",
        limit: Number.parseInt(process.env.PUBLIC_AUDIT_SUBMIT_LIMIT ?? "5", 10) || 5,
        windowSeconds:
            Number.parseInt(process.env.PUBLIC_AUDIT_SUBMIT_WINDOW_SECONDS ?? "3600", 10) ||
            3600,
        scope: "ip",
        failureMode: "closed",
        description:
            "Public audit form submissions per IP (defaults: 5 per hour). Override with PUBLIC_AUDIT_SUBMIT_LIMIT / PUBLIC_AUDIT_SUBMIT_WINDOW_SECONDS.",
    },
    "administrator-note-create": {
        id: "administrator-note-create",
        algorithm: "sliding-window",
        limit: 20,
        windowSeconds: 10 * 60,
        scope: "composite",
        failureMode: "open",
        description: "Administrator notes per administrator and website.",
    },
    "audit-compare": {
        id: "audit-compare",
        algorithm: "token-bucket",
        limit: 60,
        windowSeconds: 10 * 60,
        burst: 20,
        scope: "administrator",
        failureMode: "open",
        description: "Audit comparison requests per administrator.",
    },
};

function applyEnvOverrides(policy: RateLimitPolicy): RateLimitPolicy {
    const env = getRateLimitEnv();
    const next = { ...policy };

    if (policy.id === "auth-login-ip") {
        if (env.loginIpLimit) next.limit = env.loginIpLimit;
        if (env.loginIpWindowSeconds) next.windowSeconds = env.loginIpWindowSeconds;
    }
    if (policy.id === "auth-login-account") {
        if (env.loginAccountLimit) next.limit = env.loginAccountLimit;
        if (env.loginAccountWindowSeconds) next.windowSeconds = env.loginAccountWindowSeconds;
    }
    if (policy.id === "audit-start" || policy.id === "crawl-start") {
        if (env.auditStartLimit) next.limit = env.auditStartLimit;
        if (env.auditStartWindowSeconds) next.windowSeconds = env.auditStartWindowSeconds;
    }
    if (policy.id === "pagespeed-run") {
        if (env.pagespeedLimit) next.limit = env.pagespeedLimit;
        if (env.pagespeedWindowSeconds) next.windowSeconds = env.pagespeedWindowSeconds;
    }
    if (policy.id === "pagespeed-global-daily" && env.pagespeedGlobalDailyLimit) {
        next.limit = env.pagespeedGlobalDailyLimit;
    }
    if (policy.id === "ai-analysis-run") {
        if (env.aiLimit) next.limit = env.aiLimit;
        if (env.aiWindowSeconds) next.windowSeconds = env.aiWindowSeconds;
    }
    if (policy.id === "ai-analysis-global-daily" && env.aiGlobalDailyLimit) {
        next.limit = env.aiGlobalDailyLimit;
    }
    if (policy.id === "demo-generate") {
        if (env.demoLimit) next.limit = env.demoLimit;
        if (env.demoWindowSeconds) next.windowSeconds = env.demoWindowSeconds;
    }
    if (policy.id === "public-report-view") {
        if (env.publicReportLimit) next.limit = env.publicReportLimit;
        if (env.publicReportWindowSeconds) next.windowSeconds = env.publicReportWindowSeconds;
    }

    return next;
}

export function getRateLimitPolicy(policyId: RateLimitPolicyId): RateLimitPolicy {
    const base = BASE_POLICIES[policyId];
    if (!base) {
        throw new Error(`Unknown rate-limit policy: ${policyId}`);
    }
    return applyEnvOverrides(base);
}

export function listRateLimitPolicies(): RateLimitPolicy[] {
    return (Object.keys(BASE_POLICIES) as RateLimitPolicyId[]).map((id) =>
        getRateLimitPolicy(id),
    );
}
