import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { publicAuditRequestSchema } from "@/src/lib/website-validation";
import type { SerializableWebsite } from "@/src/data/websites";
import { getRateLimitPolicy } from "@/src/services/rate-limit/rate-limit-policies";
import { submitAndStartPublicAuditRequest } from "@/src/services/audit-pipeline/submit-and-start-public-audit";
import type { SerializableAuditJob } from "@/src/services/audit-pipeline/types";
import { normalizeAuditConfiguration } from "@/src/data/audit-jobs";
import { AUDIT_PIPELINE_STAGES } from "@/src/services/audit-pipeline/constants";
import { normalizeWebsiteUrl } from "@/src/lib/normalize-domain";
import {
    PUBLIC_AUDIT_GENERIC_ACCEPTED_MESSAGE,
    PUBLIC_AUDIT_GENERIC_DEDUPED_MESSAGE,
    PUBLIC_AUDIT_LIMITS,
    PUBLIC_AUDIT_RATE_LIMITED_MESSAGE,
} from "@/src/services/public-audit-protection/constants";

function websiteStub(overrides?: Partial<SerializableWebsite>): SerializableWebsite {
    return {
        id: "507f1f77bcf86cd799439011",
        businessName: "",
        originalUrl: "https://example.com",
        normalizedDomain: "example.com",
        businessEmail: "owner@example.com",
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

describe("public audit request validation", () => {
    it("requires a valid website URL and business email", () => {
        const parsed = publicAuditRequestSchema.safeParse({
            websiteUrl: "https://example.com",
            businessEmail: "owner@example.com",
        });

        assert.equal(parsed.success, true);
        if (parsed.success) {
            assert.equal(parsed.data.businessEmail, "owner@example.com");
        }
    });

    it("rejects missing business email", () => {
        const parsed = publicAuditRequestSchema.safeParse({
            websiteUrl: "https://example.com",
            businessEmail: "",
        });

        assert.equal(parsed.success, false);
    });

    it("rejects invalid website URLs", () => {
        const parsed = publicAuditRequestSchema.safeParse({
            websiteUrl: "not-a-url",
            businessEmail: "owner@example.com",
        });

        assert.equal(parsed.success, false);
    });
});

describe("public audit auto-start", () => {
    it("persists the request and starts durable orchestration asynchronously", async () => {
        const orchestrationCalls: Array<Record<string, unknown>> = [];
        const created = websiteStub();

        const result = await submitAndStartPublicAuditRequest(
            {
                websiteUrl: "https://example.com",
                businessEmail: "owner@example.com",
            },
            {
                evaluateEligibility: async () => ({ eligible: true, websiteId: null }),
                createWebsite: async () => created,
                startOrchestration: async (input) => {
                    orchestrationCalls.push(input as unknown as Record<string, unknown>);
                    return {
                        job: jobStub(),
                        auditRunId: "507f1f77bcf86cd799439012",
                        websiteId: created.id,
                        reused: false,
                        statusUrl: "/api/admin/audit-jobs/x",
                    };
                },
            },
        );

        assert.equal(result.websiteId, created.id);
        assert.equal(result.orchestrationStarted, true);
        assert.equal(result.auditRunId, "507f1f77bcf86cd799439012");
        assert.equal(result.jobId, "507f1f77bcf86cd799439013");
        assert.equal(result.blockReason, null);
        assert.equal(orchestrationCalls.length, 1);
        assert.equal(orchestrationCalls[0]?.forceAsync, true);
        assert.deepEqual(orchestrationCalls[0]?.trigger, {
            type: "system",
            actorId: null,
            actorName: "public-audit-submission",
        });
    });

    it("does not start orchestration when an active domain audit exists", async () => {
        const existing = websiteStub();
        let orchestrationCalls = 0;
        let createCalls = 0;

        const result = await submitAndStartPublicAuditRequest(
            {
                websiteUrl: "https://example.com",
                businessEmail: "other@example.com",
            },
            {
                evaluateEligibility: async () => ({
                    eligible: false,
                    reason: "domain_active",
                    websiteId: existing.id,
                }),
                createWebsite: async () => {
                    createCalls += 1;
                    return existing;
                },
                createActivityEvent: async () => null,
                startOrchestration: async () => {
                    orchestrationCalls += 1;
                    return {
                        job: jobStub({ status: "processing" }),
                        auditRunId: "507f1f77bcf86cd799439012",
                        websiteId: existing.id,
                        reused: true,
                        statusUrl: "/api/admin/audit-jobs/x",
                    };
                },
            },
        );

        assert.equal(createCalls, 0);
        assert.equal(orchestrationCalls, 0);
        assert.equal(result.orchestrationStarted, false);
        assert.equal(result.blockReason, "domain_active");
        assert.equal(result.auditRunId, null);
        assert.equal(result.jobId, null);
    });

    it("keeps the saved request when orchestration scheduling fails", async () => {
        const created = websiteStub();
        const activities: Array<{ title?: string }> = [];

        const result = await submitAndStartPublicAuditRequest(
            {
                websiteUrl: "https://example.com",
                businessEmail: "owner@example.com",
            },
            {
                evaluateEligibility: async () => ({ eligible: true, websiteId: null }),
                createWebsite: async () => created,
                createActivityEvent: async (input) => {
                    activities.push(input);
                    return null;
                },
                startOrchestration: async () => {
                    throw new Error("worker unavailable");
                },
            },
        );

        assert.equal(result.websiteId, created.id);
        assert.equal(result.orchestrationStarted, false);
        assert.equal(result.auditRunId, null);
        assert.equal(result.blockReason, null);
        assert.equal(
            activities.some((item) => item.title === "Public audit orchestration failed to start"),
            true,
        );
    });
});

describe("shared orchestration entry point", () => {
    it("exposes startAuditOrchestration as the same function as startAuditJob", async () => {
        const mod = await import("@/src/services/audit-pipeline/start-audit-job");
        assert.equal(mod.startAuditOrchestration, mod.startAuditJob);
    });
});

describe("public audit submit rate limit policies", () => {
    it("keeps layered IP and email policies aligned with PUBLIC_AUDIT_LIMITS", () => {
        const hourly = getRateLimitPolicy("public-audit-submit");
        const daily = getRateLimitPolicy("public-audit-submit-ip-day");
        const email = getRateLimitPolicy("public-audit-submit-email");

        assert.equal(hourly.scope, "ip");
        assert.equal(hourly.limit, PUBLIC_AUDIT_LIMITS.ipPerHour);
        assert.equal(hourly.windowSeconds, 3600);

        assert.equal(daily.limit, PUBLIC_AUDIT_LIMITS.ipPer24Hours);
        assert.equal(daily.windowSeconds, 86400);

        assert.equal(email.limit, PUBLIC_AUDIT_LIMITS.emailPer24Hours);
        assert.equal(email.windowSeconds, 86400);
    });
});

describe("domain normalization for abuse protection", () => {
    it("treats www, protocol, trailing slash, and query variants as the same domain", () => {
        const variants = [
            "https://example.com",
            "http://example.com",
            "https://www.example.com/",
            "https://example.com/",
            "https://example.com/?foo=bar",
        ];
        const domains = variants.map((url) => normalizeWebsiteUrl(url).normalizedDomain);
        assert.ok(domains.every((domain) => domain === "example.com"));
    });

    it("keeps true subdomains distinct from apex", () => {
        assert.equal(normalizeWebsiteUrl("https://shop.example.com").normalizedDomain, "shop.example.com");
        assert.equal(normalizeWebsiteUrl("https://example.com").normalizedDomain, "example.com");
    });
});

describe("public response copy stays enumeration-safe", () => {
    it("uses generic accepted and deduped messages without audit IDs", () => {
        for (const message of [
            PUBLIC_AUDIT_GENERIC_ACCEPTED_MESSAGE,
            PUBLIC_AUDIT_GENERIC_DEDUPED_MESSAGE,
            PUBLIC_AUDIT_RATE_LIMITED_MESSAGE,
        ]) {
            assert.equal(/auditRun|report token|another customer/i.test(message), false);
            assert.equal(/507f1f77/i.test(message), false);
        }
    });
});
