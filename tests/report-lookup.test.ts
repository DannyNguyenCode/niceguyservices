import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
    REPORT_LOOKUP_CODE_TTL_MS,
    REPORT_LOOKUP_GENERIC_REQUEST_MESSAGE,
    REPORT_LOOKUP_MAX_ATTEMPTS,
} from "@/src/services/report-lookup/constants";
import {
    generateVerificationCode,
    hashVerificationCode,
    isValidVerificationCodeFormat,
    verificationCodesEqual,
} from "@/src/services/report-lookup/crypto";
import { requestReportLookupCode } from "@/src/services/report-lookup/request-lookup-code";
import { verifyReportLookupCode } from "@/src/services/report-lookup/verify-lookup-code";
import { listAuthenticatedLookupReports } from "@/src/services/report-lookup/list-lookup-reports";
import {
    requestLookupCodeSchema,
    verifyLookupCodeSchema,
} from "@/src/services/report-lookup/validation";
import { buildReportLookupVerificationEmail } from "@/src/services/report-lookup/verification-email";
import { getRateLimitPolicy } from "@/src/services/rate-limit/rate-limit-policies";
import { requireRateLimit } from "@/src/services/rate-limit/require-rate-limit";
import { RateLimitError } from "@/src/services/rate-limit/rate-limit-error";
import { resetRateLimitState } from "@/src/services/rate-limit/reset-rate-limit-state";
import { resetRateLimitEnvCacheForTests } from "@/src/config/env";
import {
    generateReportToken,
    hashReportToken,
    isValidReportTokenFormat,
} from "@/src/services/public-reports/hash-report-token";
import { isPublicReportAccessible } from "@/src/services/public-reports/validate-public-report-sources";
import type { SerializableReportLookupVerification } from "@/src/data/report-lookup-verifications";

const ORIGINAL_ENV = { ...process.env };
const TEST_SECRET = "test-report-lookup-secret";

beforeEach(() => {
    process.env = {
        ...ORIGINAL_ENV,
        NODE_ENV: "test",
        AUTH_SECRET: TEST_SECRET,
        RATE_LIMIT_PROVIDER: "memory",
        RATE_LIMIT_BYPASS_MODE: "disabled",
        RATE_LIMIT_HASH_SECRET: "test-hash-secret",
    };
    resetRateLimitState();
    resetRateLimitEnvCacheForTests();
});

afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    resetRateLimitState();
    resetRateLimitEnvCacheForTests();
});

function makeVerification(
    overrides: Partial<SerializableReportLookupVerification> & {
        codeHash: string;
        normalizedEmail: string;
    },
): SerializableReportLookupVerification {
    const now = Date.now();
    return {
        id: overrides.id ?? "507f1f77bcf86cd799439011",
        normalizedEmail: overrides.normalizedEmail,
        codeHash: overrides.codeHash,
        expiresAt:
            overrides.expiresAt ??
            new Date(now + REPORT_LOOKUP_CODE_TTL_MS).toISOString(),
        attemptCount: overrides.attemptCount ?? 0,
        consumedAt: overrides.consumedAt ?? null,
        createdAt: overrides.createdAt ?? new Date(now).toISOString(),
    };
}

describe("report lookup crypto", () => {
    it("generates exactly six numeric digits including leading zeroes", () => {
        for (let i = 0; i < 40; i += 1) {
            const code = generateVerificationCode();
            assert.equal(code.length, 6);
            assert.equal(isValidVerificationCodeFormat(code), true);
            assert.match(code, /^\d{6}$/);
        }
    });

    it("never stores plaintext — hash differs from code and is stable", () => {
        const code = "042817";
        const email = "owner@example.com";
        const hash = hashVerificationCode(code, email, TEST_SECRET);
        assert.notEqual(hash, code);
        assert.equal(hash.includes(code), false);
        assert.equal(hash, hashVerificationCode(code, email, TEST_SECRET));
        assert.equal(verificationCodesEqual(hash, hashVerificationCode(code, email, TEST_SECRET)), true);
        assert.equal(
            verificationCodesEqual(hash, hashVerificationCode("000000", email, TEST_SECRET)),
            false,
        );
    });
});

describe("report lookup validation", () => {
    it("normalizes email like public audit submissions", () => {
        const parsed = requestLookupCodeSchema.safeParse({
            email: "  Owner@Example.COM ",
        });
        assert.equal(parsed.success, true);
        if (parsed.success) {
            assert.equal(parsed.data.email, "owner@example.com");
        }
    });

    it("requires exactly six numeric digits for verify", () => {
        assert.equal(
            verifyLookupCodeSchema.safeParse({
                email: "owner@example.com",
                code: "12345",
            }).success,
            false,
        );
        assert.equal(
            verifyLookupCodeSchema.safeParse({
                email: "owner@example.com",
                code: "123456",
            }).success,
            true,
        );
    });
});

describe("report lookup request-code", () => {
    it("valid email + published report initiates verification email flow", async () => {
        const emails: Array<{ to: string; code: string }> = [];
        const created: Array<{ normalizedEmail: string; codeHash: string }> = [];

        const result = await requestReportLookupCode(
            { email: "Customer@Example.com" },
            {
                hasEligibleReport: async () => true,
                invalidateActive: async () => undefined,
                createVerification: async (input) => {
                    created.push(input);
                    return makeVerification({
                        ...input,
                        id: "1",
                    });
                },
                sendEmail: async (payload) => {
                    emails.push(payload);
                },
                getSecret: () => TEST_SECRET,
                generateCode: () => "042817",
            },
        );

        assert.equal(result.success, true);
        assert.equal(result.codeIssued, true);
        assert.equal(result.message, REPORT_LOOKUP_GENERIC_REQUEST_MESSAGE);
        assert.equal(emails.length, 1);
        assert.equal(emails[0]?.to, "customer@example.com");
        assert.equal(emails[0]?.code, "042817");
        assert.equal(created[0]?.codeHash.includes("042817"), false);
        assert.equal(
            created[0]?.codeHash,
            hashVerificationCode("042817", "customer@example.com", TEST_SECRET),
        );
    });

    it("unknown email returns the same public response and does not send email", async () => {
        let sent = false;
        const result = await requestReportLookupCode(
            { email: "unknown@example.com" },
            {
                hasEligibleReport: async () => false,
                sendEmail: async () => {
                    sent = true;
                },
                createVerification: async () => {
                    throw new Error("should not create verification");
                },
            },
        );

        assert.equal(result.success, true);
        assert.equal(result.codeIssued, false);
        assert.equal(result.message, REPORT_LOOKUP_GENERIC_REQUEST_MESSAGE);
        assert.equal(sent, false);
    });

    it("email with only unpublished reports does not send email or disclose reports", async () => {
        let sent = false;
        const result = await requestReportLookupCode(
            { email: "draft-only@example.com" },
            {
                hasEligibleReport: async () => false,
                sendEmail: async () => {
                    sent = true;
                },
            },
        );
        assert.equal(result.codeIssued, false);
        assert.equal(result.message, REPORT_LOOKUP_GENERIC_REQUEST_MESSAGE);
        assert.equal(sent, false);
    });
});

describe("report lookup verify-code", () => {
    it("correct code verifies and creates lookup authorization", async () => {
        const email = "owner@example.com";
        const code = "123456";
        const codeHash = hashVerificationCode(code, email, TEST_SECRET);
        let consumed = false;

        const result = await verifyReportLookupCode(
            { email, code },
            {
                getLatestOpen: async () =>
                    makeVerification({ normalizedEmail: email, codeHash }),
                consume: async () => {
                    consumed = true;
                    return true;
                },
                establishSession: async (normalizedEmail) => ({
                    normalizedEmail,
                    expiresAt: new Date(Date.now() + 20 * 60_000).toISOString(),
                }),
                getSecret: () => TEST_SECRET,
            },
        );

        assert.equal(result.success, true);
        assert.equal(result.session.normalizedEmail, email);
        assert.equal(consumed, true);
    });

    it("incorrect code fails and increments attempts", async () => {
        const email = "owner@example.com";
        const codeHash = hashVerificationCode("123456", email, TEST_SECRET);
        let attempts = 0;

        await assert.rejects(
            () =>
                verifyReportLookupCode(
                    { email, code: "000000" },
                    {
                        getLatestOpen: async () =>
                            makeVerification({
                                normalizedEmail: email,
                                codeHash,
                                attemptCount: attempts,
                            }),
                        incrementAttempts: async () => {
                            attempts += 1;
                            return makeVerification({
                                normalizedEmail: email,
                                codeHash,
                                attemptCount: attempts,
                            });
                        },
                        getSecret: () => TEST_SECRET,
                    },
                ),
            (error: Error & { code?: string }) => {
                assert.equal(error.name, "ReportLookupVerifyError");
                assert.equal(error.code, "INVALID_CODE");
                return true;
            },
        );
        assert.equal(attempts, 1);
    });

    it("expired code fails", async () => {
        const email = "owner@example.com";
        const code = "123456";
        const codeHash = hashVerificationCode(code, email, TEST_SECRET);

        await assert.rejects(
            () =>
                verifyReportLookupCode(
                    { email, code },
                    {
                        getLatestOpen: async () =>
                            makeVerification({
                                normalizedEmail: email,
                                codeHash,
                                expiresAt: new Date(Date.now() - 1000).toISOString(),
                            }),
                        getSecret: () => TEST_SECRET,
                        now: () => new Date(),
                    },
                ),
            (error: Error & { code?: string }) => {
                assert.equal(error.code, "EXPIRED_CODE");
                return true;
            },
        );
    });

    it("consumed code cannot be reused", async () => {
        const email = "owner@example.com";

        await assert.rejects(
            () =>
                verifyReportLookupCode(
                    { email, code: "123456" },
                    {
                        getLatestOpen: async () => null,
                        getSecret: () => TEST_SECRET,
                    },
                ),
            (error: Error & { code?: string }) => {
                assert.equal(error.code, "INVALID_CODE");
                return true;
            },
        );
    });

    it("too many incorrect attempts locks the issued code", async () => {
        const email = "owner@example.com";
        const codeHash = hashVerificationCode("123456", email, TEST_SECRET);

        await assert.rejects(
            () =>
                verifyReportLookupCode(
                    { email, code: "000000" },
                    {
                        getLatestOpen: async () =>
                            makeVerification({
                                normalizedEmail: email,
                                codeHash,
                                attemptCount: REPORT_LOOKUP_MAX_ATTEMPTS,
                            }),
                        getSecret: () => TEST_SECRET,
                    },
                ),
            (error: Error & { code?: string; status?: number }) => {
                assert.equal(error.code, "ATTEMPTS_EXCEEDED");
                assert.equal(error.status, 429);
                return true;
            },
        );
    });

    it("new code supersedes previous active codes", async () => {
        const invalidated: string[] = [];
        await requestReportLookupCode(
            { email: "owner@example.com" },
            {
                hasEligibleReport: async () => true,
                invalidateActive: async (email) => {
                    invalidated.push(email);
                },
                createVerification: async (input) =>
                    makeVerification({ ...input, id: "2" }),
                sendEmail: async () => undefined,
                getSecret: () => TEST_SECRET,
                generateCode: () => "654321",
            },
        );
        assert.deepEqual(invalidated, ["owner@example.com"]);
    });
});

describe("report lookup session authorization", () => {
    it("lookup without authorization fails", async () => {
        await assert.rejects(
            () =>
                listAuthenticatedLookupReports({
                    readSession: async () => null,
                    listReports: async () => [],
                }),
            (error: Error) => {
                assert.equal(error.name, "ReportLookupUnauthorizedError");
                return true;
            },
        );
    });

    it("verified email A cannot retrieve reports belonging to email B", async () => {
        const result = await listAuthenticatedLookupReports({
            readSession: async () => ({
                normalizedEmail: "a@example.com",
                expiresAt: new Date(Date.now() + 60_000).toISOString(),
            }),
            listReports: async (email) => {
                assert.equal(email, "a@example.com");
                return [
                    {
                        businessName: "A Plumbing",
                        websiteUrl: "https://a.example",
                        auditDate: "2026-07-30T00:00:00.000Z",
                        publishedAt: "2026-07-30T00:00:00.000Z",
                        reportUrl: "/report/token-a",
                    },
                ];
            },
        });

        assert.equal(result.reports.length, 1);
        assert.equal(result.reports[0]?.businessName, "A Plumbing");
        assert.equal(result.session.normalizedEmail, "a@example.com");
    });

    it("lookup only returns published reports and supports multiple", async () => {
        const result = await listAuthenticatedLookupReports({
            readSession: async () => ({
                normalizedEmail: "multi@example.com",
                expiresAt: new Date(Date.now() + 60_000).toISOString(),
            }),
            listReports: async () => [
                {
                    businessName: "Example Plumbing",
                    websiteUrl: "https://exampleplumbing.ca",
                    auditDate: "2026-07-30T00:00:00.000Z",
                    publishedAt: "2026-07-30T00:00:00.000Z",
                    reportUrl: "/report/token-1",
                },
                {
                    businessName: "Another Business",
                    websiteUrl: "https://anotherbusiness.ca",
                    auditDate: "2026-08-05T00:00:00.000Z",
                    publishedAt: "2026-08-05T00:00:00.000Z",
                    reportUrl: "/report/token-2",
                },
            ],
        });

        assert.equal(result.reports.length, 2);
        assert.equal(
            result.reports.every((report) => report.reportUrl.startsWith("/report/")),
            true,
        );
    });
});

describe("report lookup rate limit / cooldown", () => {
    it("request-email cooldown policy allows one request per 60 seconds", async () => {
        const policy = getRateLimitPolicy("public-report-lookup-request-email");
        assert.equal(policy.limit, 1);
        assert.equal(policy.windowSeconds, 60);

        await requireRateLimit({
            policyId: "public-report-lookup-request-email",
            identifiers: ["account:test-email"],
        });

        await assert.rejects(
            () =>
                requireRateLimit({
                    policyId: "public-report-lookup-request-email",
                    identifiers: ["account:test-email"],
                }),
            (error: unknown) => error instanceof RateLimitError,
        );
    });
});

describe("report lookup email content", () => {
    it("verification email includes code and does not include report URL", () => {
        const content = buildReportLookupVerificationEmail("042817");
        assert.match(content.subject, /verification code/i);
        assert.match(content.text, /042817/);
        assert.equal(content.text.includes("/report/"), false);
        assert.equal(content.html.includes("/report/"), false);
    });
});

describe("existing public report token architecture remains intact", () => {
    it("token generation, hashing, and accessibility checks still work", () => {
        const token = generateReportToken();
        assert.equal(isValidReportTokenFormat(token.rawToken), true);
        assert.equal(hashReportToken(token.rawToken), token.tokenHash);
        assert.equal(
            isPublicReportAccessible({
                status: "published",
                expiresAt: null,
            }),
            true,
        );
        assert.equal(
            isPublicReportAccessible({
                status: "unpublished",
                expiresAt: null,
            }),
            false,
        );
        assert.equal(
            isPublicReportAccessible({
                status: "draft",
                expiresAt: null,
            }),
            false,
        );
    });
});

describe("report lookup logging safety", () => {
    it("does not include verification code or hash in public API success payloads", async () => {
        const result = await requestReportLookupCode(
            { email: "safe@example.com" },
            {
                hasEligibleReport: async () => true,
                invalidateActive: async () => undefined,
                createVerification: async (input) =>
                    makeVerification({ ...input, id: "safe" }),
                sendEmail: async () => undefined,
                getSecret: () => TEST_SECRET,
                generateCode: () => "999888",
            },
        );

        const serialized = JSON.stringify(result);
        assert.equal(serialized.includes("999888"), false);
        assert.equal(serialized.includes("codeHash"), false);
    });
});
