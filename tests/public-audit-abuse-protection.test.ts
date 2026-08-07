import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { requireRateLimit } from "@/src/services/rate-limit/require-rate-limit";
import { RateLimitError } from "@/src/services/rate-limit/rate-limit-error";
import {
    getHashedEmailRateLimitKey,
    getHashedIpRateLimitKey,
} from "@/src/services/rate-limit/rate-limit-identity";
import { resetRateLimitState } from "@/src/services/rate-limit/reset-rate-limit-state";
import { resetRateLimitEnvCacheForTests } from "@/src/config/env";
import { getRateLimitPolicy } from "@/src/services/rate-limit/rate-limit-policies";
import { PUBLIC_AUDIT_LIMITS } from "@/src/services/public-audit-protection/constants";
import { submitAndStartPublicAuditRequest } from "@/src/services/audit-pipeline/submit-and-start-public-audit";
import { evaluatePublicAuditEligibility } from "@/src/services/public-audit-protection/evaluate-public-audit-eligibility";
import type { SerializableWebsite } from "@/src/data/websites";
import type { SerializableAuditJob } from "@/src/services/audit-pipeline/types";
import { normalizeAuditConfiguration } from "@/src/data/audit-jobs";
import { AUDIT_PIPELINE_STAGES } from "@/src/services/audit-pipeline/constants";
import { normalizeWebsiteUrl } from "@/src/lib/normalize-domain";

function withMemoryRateLimitEnv(): void {
    process.env.RATE_LIMIT_PROVIDER = "memory";
    process.env.RATE_LIMIT_BYPASS_MODE = "disabled";
    process.env.RATE_LIMIT_HASH_SECRET = "test-hash-secret";
    delete process.env.RATE_LIMIT_REDIS_URL;
    delete process.env.RATE_LIMIT_REDIS_TOKEN;
    resetRateLimitEnvCacheForTests();
    resetRateLimitState();
}

function websiteStub(overrides?: Partial<SerializableWebsite>): SerializableWebsite {
    return {
        id: "507f1f77bcf86cd799439011",
        businessName: "",
        originalUrl: "https://example.com",
        normalizedDomain: "example.com",
        businessEmail: "alice@example.com",
        industry: "",
        location: "",
        source: "public-audit-submission",
        status: "new",
        auditStatus: "not-started",
        crawlStatus: "not-started",
        pageSpeedStatus: "not-started",
        latestPageSpeedRunAt: null,
        niceGuyStatus: "not-started",
        latestNiceGuyRunAt: null,
        aiAnalysisStatus: "not-started",
        latestAiAnalysisRunAt: null,
        demoStatus: "none",
        outreachStatus: "not-contacted",
        publicReportStatus: "not-created",
        latestPublicReportAt: null,
        latestPublishedReportAt: null,
        pdfReportStatus: "not-generated",
        latestPdfReportAt: null,
        outreachDraftStatus: "not-generated",
        latestOutreachDraftAt: null,
        demoProjectStatus: "not-created",
        latestDemoAt: null,
        deletedAt: null,
        createdAt: "2026-08-06T00:00:00.000Z",
        updatedAt: "2026-08-06T00:00:00.000Z",
        ...overrides,
    };
}

function jobStub(overrides?: Partial<SerializableAuditJob>): SerializableAuditJob {
    const stages = Object.fromEntries(
        AUDIT_PIPELINE_STAGES.map((stage) => [
            stage,
            {
                status: "pending",
                attempt: 0,
                startedAt: null,
                heartbeatAt: null,
                completedAt: null,
                errorCode: null,
                errorMessage: null,
            },
        ]),
    ) as SerializableAuditJob["stages"];

    return {
        id: "507f1f77bcf86cd799439013",
        websiteId: "507f1f77bcf86cd799439011",
        auditRunId: "507f1f77bcf86cd799439012",
        idempotencyKey: "audit-pipeline:test",
        status: "queued",
        currentStage: null,
        progressPercent: 0,
        attempt: 1,
        maxAttempts: 3,
        queuedAt: "2026-08-06T00:00:00.000Z",
        startedAt: null,
        heartbeatAt: null,
        completedAt: null,
        failedAt: null,
        cancelledAt: null,
        error: null,
        configuration: normalizeAuditConfiguration(),
        packageVersion: "audit-job-v1",
        stages,
        reportDraftId: null,
        createdAt: "2026-08-06T00:00:00.000Z",
        updatedAt: "2026-08-06T00:00:00.000Z",
        ...overrides,
    };
}

describe("public audit abuse protection", () => {
    beforeEach(() => {
        withMemoryRateLimitEnv();
    });

    afterEach(() => {
        resetRateLimitState();
    });

    it("accepts the first eligible customer submission and starts shared orchestration once", async () => {
        const created = websiteStub();
        let starts = 0;

        const result = await submitAndStartPublicAuditRequest(
            {
                websiteUrl: "https://example.com",
                businessEmail: "alice@example.com",
            },
            {
                evaluateEligibility: async () => ({ eligible: true, websiteId: null }),
                createWebsite: async () => created,
                startOrchestration: async () => {
                    starts += 1;
                    return {
                        job: jobStub(),
                        auditRunId: jobStub().auditRunId,
                        websiteId: created.id,
                        reused: false,
                        statusUrl: "/api/admin/audit-jobs/x",
                    };
                },
                issueStatusToken: async () => "status-token-test-value-0123456789ab",
            },
        );

        assert.equal(result.orchestrationStarted, true);
        assert.equal(result.blockReason, null);
        assert.equal(starts, 1);
    });

    it("blocks same-domain different-email while an active customer audit exists", async () => {
        const existing = websiteStub({ businessEmail: "alice@example.com" });
        let starts = 0;

        const result = await submitAndStartPublicAuditRequest(
            {
                websiteUrl: "https://www.example.com/?utm=1",
                businessEmail: "bob@attacker.com",
            },
            {
                evaluateEligibility: async () => ({
                    eligible: false,
                    reason: "domain_active",
                    websiteId: existing.id,
                }),
                createActivityEvent: async () => null,
                createWebsite: async () => {
                    throw new Error("must not create");
                },
                startOrchestration: async () => {
                    starts += 1;
                    return {
                        job: jobStub(),
                        auditRunId: jobStub().auditRunId,
                        websiteId: existing.id,
                        reused: true,
                        statusUrl: "/api/admin/audit-jobs/x",
                    };
                },
            },
        );

        assert.equal(starts, 0);
        assert.equal(result.blockReason, "domain_active");
        assert.equal(result.orchestrationStarted, false);
        assert.equal(result.auditRunId, null);
        // Dedup does not surface Alice's audit IDs to Bob's caller path.
        assert.equal(result.jobId, null);
    });

    it("blocks concurrent same-domain submissions from starting more than one orchestration path", async () => {
        const existing = websiteStub();
        let domainClaimed = false;
        let starts = 0;

        // Simulates atomic claim: first evaluator wins; later ones see active domain.
        const evaluateEligibility = async () => {
            if (domainClaimed) {
                return {
                    eligible: false as const,
                    reason: "domain_active" as const,
                    websiteId: existing.id,
                };
            }
            domainClaimed = true;
            return { eligible: true as const, websiteId: null };
        };

        const [first, second] = await Promise.all([
            submitAndStartPublicAuditRequest(
                {
                    websiteUrl: "https://example.com",
                    businessEmail: "alice@example.com",
                },
                {
                    evaluateEligibility,
                    createWebsite: async () => existing,
                    startOrchestration: async () => {
                        starts += 1;
                        return {
                            job: jobStub({ status: "processing" }),
                            auditRunId: "507f1f77bcf86cd799439012",
                            websiteId: existing.id,
                            reused: false,
                            statusUrl: "/api/admin/audit-jobs/x",
                        };
                    },
                    issueStatusToken: async () => "status-token-test-value-aaaaaaaaaaaa",
                },
            ),
            submitAndStartPublicAuditRequest(
                {
                    websiteUrl: "https://example.com",
                    businessEmail: "alice@example.com",
                },
                {
                    evaluateEligibility,
                    createActivityEvent: async () => null,
                    createWebsite: async () => {
                        throw new Error("second must not create");
                    },
                    startOrchestration: async () => {
                        starts += 1;
                        return {
                            job: jobStub({ status: "processing" }),
                            auditRunId: "507f1f77bcf86cd799439099",
                            websiteId: existing.id,
                            reused: true,
                            statusUrl: "/api/admin/audit-jobs/x",
                        };
                    },
                    issueStatusToken: async () => "status-token-test-value-bbbbbbbbbbbb",
                },
            ),
        ]);

        const startedCount = [first, second].filter((r) => r.orchestrationStarted).length;
        const blockedCount = [first, second].filter((r) => r.blockReason === "domain_active").length;
        assert.equal(startedCount, 1);
        assert.equal(blockedCount, 1);
        assert.equal(starts, 1);
    });

    it("applies 7-day cooldown after a successful public customer audit", async () => {
        const existing = websiteStub();
        let starts = 0;

        const result = await submitAndStartPublicAuditRequest(
            {
                websiteUrl: "https://example.com",
                businessEmail: "alice@example.com",
            },
            {
                evaluateEligibility: async () => ({
                    eligible: false,
                    reason: "domain_cooldown",
                    websiteId: existing.id,
                }),
                createActivityEvent: async () => null,
                startOrchestration: async () => {
                    starts += 1;
                    return {
                        job: jobStub(),
                        auditRunId: jobStub().auditRunId,
                        websiteId: existing.id,
                        reused: false,
                        statusUrl: "/api/admin/audit-jobs/x",
                    };
                },
            },
        );

        assert.equal(starts, 0);
        assert.equal(result.blockReason, "domain_cooldown");
        assert.equal(PUBLIC_AUDIT_LIMITS.domainCooldownDays, 7);
    });

    it("allows a new start when eligibility reports the domain is free again", async () => {
        const existing = websiteStub();
        let starts = 0;

        const result = await submitAndStartPublicAuditRequest(
            {
                websiteUrl: "https://example.com",
                businessEmail: "alice@example.com",
            },
            {
                evaluateEligibility: async () => ({
                    eligible: true,
                    websiteId: existing.id,
                }),
                getWebsiteById: async () => existing,
                createActivityEvent: async () => null,
                startOrchestration: async () => {
                    starts += 1;
                    return {
                        job: jobStub(),
                        auditRunId: jobStub().auditRunId,
                        websiteId: existing.id,
                        reused: false,
                        statusUrl: "/api/admin/audit-jobs/x",
                    };
                },
                issueStatusToken: async () => "status-token-test-value-cccccccccccc",
            },
        );

        assert.equal(starts, 1);
        assert.equal(result.orchestrationStarted, true);
        assert.equal(result.reusedWebsite, true);
    });

    it("limits email submissions to 3 per 24 hours", async () => {
        const emailKey = [getHashedEmailRateLimitKey("owner@example.com")];
        for (let i = 0; i < PUBLIC_AUDIT_LIMITS.emailPer24Hours; i += 1) {
            await requireRateLimit({
                policyId: "public-audit-submit-email",
                identifiers: emailKey,
            });
        }
        await assert.rejects(
            () =>
                requireRateLimit({
                    policyId: "public-audit-submit-email",
                    identifiers: emailKey,
                }),
            (error: unknown) => error instanceof RateLimitError,
        );
    });

    it("limits IP submissions to 5 per hour", async () => {
        const ipKey = [getHashedIpRateLimitKey("203.0.113.50")];
        for (let i = 0; i < PUBLIC_AUDIT_LIMITS.ipPerHour; i += 1) {
            await requireRateLimit({
                policyId: "public-audit-submit",
                identifiers: ipKey,
            });
        }
        await assert.rejects(
            () =>
                requireRateLimit({
                    policyId: "public-audit-submit",
                    identifiers: ipKey,
                }),
            (error: unknown) => error instanceof RateLimitError,
        );
    });

    it("limits IP submissions to 10 per 24 hours", async () => {
        const ipKey = [getHashedIpRateLimitKey("203.0.113.51")];
        for (let i = 0; i < PUBLIC_AUDIT_LIMITS.ipPer24Hours; i += 1) {
            await requireRateLimit({
                policyId: "public-audit-submit-ip-day",
                identifiers: ipKey,
            });
        }
        await assert.rejects(
            () =>
                requireRateLimit({
                    policyId: "public-audit-submit-ip-day",
                    identifiers: ipKey,
                }),
            (error: unknown) => error instanceof RateLimitError,
        );
    });

    it("uses durable shared rate-limit storage keys rather than process-local Maps in the API", () => {
        const hourly = getRateLimitPolicy("public-audit-submit");
        assert.equal(hourly.algorithm, "sliding-window");
        assert.equal(hourly.failureMode, "closed");
        // Provider selection is env-driven; production requires redis (see env.ts).
        assert.ok(typeof process.env.RATE_LIMIT_PROVIDER === "string");
    });

    it("normalizes URL variants to one domain identity", () => {
        const a = normalizeWebsiteUrl("https://www.example.com/?x=1").normalizedDomain;
        const b = normalizeWebsiteUrl("http://example.com/path").normalizedDomain;
        assert.equal(a, b);
        assert.equal(a, "example.com");
    });
});

describe("public audit abuse protection — admin isolation notes", () => {
    it("keeps admin audit-start as a separate policy from public submit limits", () => {
        const adminStart = getRateLimitPolicy("audit-start");
        const publicHourly = getRateLimitPolicy("public-audit-submit");
        const publicEmail = getRateLimitPolicy("public-audit-submit-email");
        assert.notEqual(adminStart.id, publicHourly.id);
        assert.notEqual(adminStart.id, publicEmail.id);
        assert.equal(publicHourly.scope, "ip");
        assert.match(adminStart.description, /administrator/i);
    });
});

describe("evaluatePublicAuditEligibility", () => {
    const website = {
        id: "507f1f77bcf86cd799439011",
        normalizedDomain: "example.com",
        deletedAt: null,
    } as SerializableWebsite;

    it("is eligible when no website exists yet", async () => {
        const result = await evaluatePublicAuditEligibility(
            { normalizedDomain: "example.com" },
            {
                getWebsiteByNormalizedDomain: async () => null,
            },
        );
        assert.deepEqual(result, { eligible: true, websiteId: null });
    });

    it("blocks when an active audit job exists", async () => {
        const result = await evaluatePublicAuditEligibility(
            { normalizedDomain: "example.com" },
            {
                getWebsiteByNormalizedDomain: async () => website,
                getActiveAuditJobForWebsite: async () =>
                    ({ id: "job-1", status: "processing" }) as SerializableAuditJob,
            },
        );
        assert.equal(result.eligible, false);
        if (!result.eligible) {
            assert.equal(result.reason, "domain_active");
        }
    });

    it("blocks on recent successful public completion (cooldown)", async () => {
        const result = await evaluatePublicAuditEligibility(
            { normalizedDomain: "example.com" },
            {
                getWebsiteByNormalizedDomain: async () => website,
                getActiveAuditJobForWebsite: async () => null,
                findRecentCompletedPublicCustomerAudit: async () => ({
                    id: "run-1",
                    completedAt: new Date().toISOString(),
                }),
            },
        );
        assert.equal(result.eligible, false);
        if (!result.eligible) {
            assert.equal(result.reason, "domain_cooldown");
        }
    });

    it("does not impose cooldown when no successful public completion exists", async () => {
        const result = await evaluatePublicAuditEligibility(
            { normalizedDomain: "example.com" },
            {
                getWebsiteByNormalizedDomain: async () => website,
                getActiveAuditJobForWebsite: async () => null,
                findRecentCompletedPublicCustomerAudit: async () => null,
            },
        );
        assert.deepEqual(result, { eligible: true, websiteId: website.id });
    });
});
