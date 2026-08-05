import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
    resetCursorAnalysisConfigForTests,
    getCursorAnalysisConfig,
    getCursorConfigurationStatus,
    isAnalysisProviderEnabled,
} from "@/src/services/cursor-analysis/config";
import { canTransitionAnalysisStatus } from "@/src/services/cursor-analysis/state-machine";
import {
    authenticateAnalysisCallback,
    validateCallbackTokenAgainstAnalysis,
} from "@/src/services/cursor-analysis/callback-auth";
import {
    buildCallbackAuthToken,
    verifyCallbackAuthToken,
} from "@/src/services/cursor-analysis/callback-token";
import {
    buildAuditPackageToken,
    verifyAuditPackageToken,
} from "@/src/services/cursor-analysis/package-token";
import { buildCursorAuditPackage } from "@/src/services/cursor-analysis/build-cursor-audit-package";
import { calculateCursorAnalysisReadiness } from "@/src/services/cursor-analysis/readiness";
import {
    cursorAuditPackageSchema,
    cursorAuditResultSchema,
    validateCursorAuditPackage,
    validateCursorAuditResult,
} from "@/src/services/cursor-analysis/schemas";
import { getMockAnalysisProvider } from "@/src/services/cursor-analysis/providers/mock-analysis-provider";

const ORIGINAL_ENV = { ...process.env };

function configureTestEnv() {
    process.env.AI_ANALYSIS_PROVIDER = "mock";
    process.env.AUDIT_PACKAGE_SIGNING_SECRET = "test-package-secret";
    process.env.CURSOR_ANALYSIS_CALLBACK_SECRET = "test-callback-secret";
    process.env.APP_PUBLIC_URL = "https://audit.example.com";
    resetCursorAnalysisConfigForTests();
}

beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    configureTestEnv();
});

afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    resetCursorAnalysisConfigForTests();
});

function buildCompleteFixtures() {
    const crawlId = "crawl_1";
    const auditRun = {
        id: "audit_1",
        websiteId: "website_1",
        source: { websiteUrl: "https://example.com" },
        createdAt: "2026-08-01T10:00:00.000Z",
        completedAt: "2026-08-01T12:00:00.000Z",
    } as never;

    const website = {
        id: "website_1",
        originalUrl: "https://example.com",
        businessName: "Example",
        industry: "Services",
    } as never;

    const crawl = {
        id: crawlId,
        status: "complete",
        requestedUrl: "https://example.com",
        finalUrl: "https://example.com/",
        homepageTitle: "Example",
        metaDescription: "Example business",
        internalLinks: [],
        externalLinks: [],
        emailsFound: [],
        phoneNumbersFound: [],
        socialLinks: [],
        pagesDiscovered: 1,
        pagesCrawled: 1,
        hasAboutPage: false,
        hasContactPage: true,
        hasServicesPage: false,
        hasPrivacyPolicy: false,
        hasTerms: false,
        pageResults: [
            {
                url: "https://example.com/",
                pageType: "home",
                statusCode: 200,
                title: "Example",
                visibleText: "Welcome",
                headings: ["Welcome"],
            },
        ],
    } as never;

    const screenshots = [
        {
            id: "shot_d",
            crawlId,
            status: "complete",
            type: "desktop-viewport",
            pageType: "home",
            secureUrl: "https://res.cloudinary.com/demo/desktop.png",
            width: 1440,
            height: 900,
            viewport: { width: 1440, height: 900 },
            generatedAt: "2026-08-01T12:00:00.000Z",
            createdAt: "2026-08-01T12:00:00.000Z",
        },
        {
            id: "shot_m",
            crawlId,
            status: "complete",
            type: "mobile-viewport",
            pageType: "home",
            secureUrl: "https://res.cloudinary.com/demo/mobile.png",
            width: 390,
            height: 844,
            viewport: { width: 390, height: 844 },
            generatedAt: "2026-08-01T12:00:00.000Z",
            createdAt: "2026-08-01T12:00:00.000Z",
        },
    ] as never;

    const pageSpeed = {
        mobile: {
            crawlId,
            status: "complete",
            strategy: "mobile",
            requestedUrl: "https://example.com",
            finalUrl: "https://example.com/",
            scores: { performance: 62 },
            labMetrics: {},
            fieldData: null,
            coreWebVitals: {},
            opportunities: [],
            diagnostics: [],
            failedAudits: [],
            passedAuditCount: 0,
            failedAuditCount: 0,
            notApplicableAuditCount: 0,
        },
        desktop: {
            crawlId,
            status: "complete",
            strategy: "desktop",
            requestedUrl: "https://example.com",
            finalUrl: "https://example.com/",
            scores: { performance: 78 },
            labMetrics: {},
            fieldData: null,
            coreWebVitals: {},
            opportunities: [],
            diagnostics: [],
            failedAudits: [],
            passedAuditCount: 0,
            failedAuditCount: 0,
            notApplicableAuditCount: 0,
        },
    } as never;

    const niceGuy = {
        status: "complete",
        scoringVersion: "niceguy-v2",
        overallScore: 71,
        categories: { businessClarity: { score: 70 } },
        summary: { checksPassed: 30, checksUnavailable: 2 },
        completeness: {
            isComplete: true,
            label: "Complete",
            provisionalScore: 71,
            blockers: [],
            overallEvidenceCoverage: 92,
        },
        methodology: {
            scoringVersion: "niceguy-v2",
            rubricVersion: "v2",
            applicabilityVersion: "v2",
            disclaimer: "Scores are evidence-based.",
            businessType: {
                detected: "local_service",
                confidence: "high",
                evidence: [],
                applied: "local_service",
            },
            deterministicCheckCount: 30,
            aiAssistedCheckCount: 5,
            limitations: [],
        },
        generatedAt: "2026-08-01T12:00:00.000Z",
    } as never;

    return { auditRun, website, crawl, screenshots, pageSpeed, niceGuy };
}

describe("cursor analysis schemas v1.1", () => {
    it("accepts the example package fixture", () => {
        const example = JSON.parse(
            readFileSync("audit-agent/examples/example-package.json", "utf8"),
        );
        assert.doesNotThrow(() => validateCursorAuditPackage(example));
        assert.equal(example.schemaVersion, "1.1");
    });

    it("accepts the example result fixture", () => {
        const example = JSON.parse(
            readFileSync("audit-agent/examples/example-result.json", "utf8"),
        );
        assert.doesNotThrow(() => validateCursorAuditResult(example));
    });

    it("rejects invalid assessment confidence", () => {
        const example = JSON.parse(
            readFileSync("audit-agent/examples/example-result.json", "utf8"),
        );
        example.assessment.confidence = 1.5;
        assert.equal(cursorAuditResultSchema.safeParse(example).success, false);
    });

    it("enforces issue array limits", () => {
        const example = JSON.parse(
            readFileSync("audit-agent/examples/example-result.json", "utf8"),
        );
        example.issues = Array.from({ length: 21 }, () => example.issues[0]);
        assert.equal(cursorAuditResultSchema.safeParse(example).success, false);
    });

    it("rejects missing required package fields", () => {
        const parsed = cursorAuditPackageSchema.safeParse({
            schemaVersion: "1.1",
            audit: { auditId: "audit_1" },
        });
        assert.equal(parsed.success, false);
    });
});

describe("cursor analysis package builder", () => {
    it("builds a valid version 1.1 package with completeness and methodology", () => {
        const fixtures = buildCompleteFixtures();
        const pkg = buildCursorAuditPackage({
            ...fixtures,
            analysisRequestId: "req_1",
        });

        assert.equal(pkg.schemaVersion, "1.1");
        assert.equal(pkg.packageVersion, "1.1");
        assert.ok(pkg.niceGuyMetrics.completeness);
        assert.equal(pkg.niceGuyMetrics.completeness.evidenceCoverage, 0.92);
        assert.ok(pkg.niceGuyMetrics.methodology);
        assert.ok(pkg.screenshots.desktop);
        assert.ok(pkg.screenshots.mobile);
        assert.equal(pkg.audit.analysisRequestId, "req_1");
        assert.doesNotThrow(() => validateCursorAuditPackage(pkg));
    });

    it("does not expose credentials in the package", () => {
        const fixtures = buildCompleteFixtures();
        const pkg = buildCursorAuditPackage({
            ...fixtures,
            analysisRequestId: "req_1",
        });
        const serialized = JSON.stringify(pkg);
        assert.equal(serialized.includes("mongodb"), false);
        assert.equal(serialized.includes("api_key"), false);
        assert.equal(serialized.includes("cloudinary_api"), false);
    });

    it("rejects missing required evidence", () => {
        const fixtures = buildCompleteFixtures();
        assert.throws(() =>
            buildCursorAuditPackage({
                ...fixtures,
                niceGuy: null,
                analysisRequestId: "req_1",
            }),
        );
    });
});

describe("cursor analysis package token", () => {
    it("round-trips a valid token", () => {
        const token = buildAuditPackageToken({
            auditId: "audit_123",
            analysisRequestId: "req_456",
            ttlMs: 60_000,
        });

        const payload = verifyAuditPackageToken(token, "audit_123");
        assert.equal(payload.analysisRequestId, "req_456");
    });

    it("rejects tampered tokens", () => {
        const token = buildAuditPackageToken({
            auditId: "audit_123",
            analysisRequestId: "req_456",
            ttlMs: 60_000,
        });
        assert.throws(() => verifyAuditPackageToken(`${token}x`, "audit_123"));
    });

    it("rejects expired tokens", () => {
        const token = buildAuditPackageToken({
            auditId: "audit_123",
            analysisRequestId: "req_456",
            ttlMs: -1_000,
        });
        assert.throws(() => verifyAuditPackageToken(token, "audit_123"));
    });

    it("rejects audit ID mismatches", () => {
        const token = buildAuditPackageToken({
            auditId: "audit_123",
            analysisRequestId: "req_456",
            ttlMs: 60_000,
        });
        assert.throws(() => verifyAuditPackageToken(token, "audit_other"));
    });

    it("rejects analysis request ID mismatches when expected", () => {
        const token = buildAuditPackageToken({
            auditId: "audit_123",
            analysisRequestId: "req_456",
            ttlMs: 60_000,
        });
        assert.throws(() =>
            verifyAuditPackageToken(token, "audit_123", "req_other"),
        );
    });
});

describe("cursor analysis readiness", () => {
    it("reports structured blockers for incomplete audits", () => {
        const readiness = calculateCursorAnalysisReadiness({
            auditId: "audit_1",
            auditedUrl: "https://example.com",
            website: { id: "website_1", businessName: "Example", industry: "", originalUrl: "https://example.com" } as never,
            crawl: null,
            screenshots: [],
            pageSpeed: { mobile: null, desktop: null },
            niceGuy: null,
        });

        assert.equal(readiness.ready, false);
        assert.ok(readiness.blockers.some((item) => item.code === "CRAWL_INCOMPLETE"));
        assert.ok(readiness.blockers.some((item) => item.code === "DESKTOP_SCREENSHOT_MISSING"));
    });
});

describe("cursor analysis state machine", () => {
    it("allows expected transitions", () => {
        assert.equal(canTransitionAnalysisStatus("not_started", "queued"), true);
        assert.equal(canTransitionAnalysisStatus("queued", "triggered"), true);
        assert.equal(canTransitionAnalysisStatus("triggered", "analyzing"), true);
        assert.equal(canTransitionAnalysisStatus("analyzing", "validating"), true);
        assert.equal(canTransitionAnalysisStatus("validating", "completed"), true);
        assert.equal(canTransitionAnalysisStatus("failed", "retry_pending"), true);
        assert.equal(canTransitionAnalysisStatus("retry_pending", "queued"), true);
    });

    it("rejects invalid transitions", () => {
        assert.equal(canTransitionAnalysisStatus("completed", "queued"), false);
        assert.equal(canTransitionAnalysisStatus("not_started", "completed"), false);
    });
});

describe("cursor analysis callback token", () => {
    it("round-trips a valid callback token", () => {
        const token = buildCallbackAuthToken({
            auditId: "audit_123",
            analysisRequestId: "req_456",
            ttlMs: 60_000,
        });

        const payload = verifyCallbackAuthToken(token, "audit_123");
        assert.equal(payload.analysisRequestId, "req_456");
    });

    it("rejects tampered callback tokens", () => {
        const token = buildCallbackAuthToken({
            auditId: "audit_123",
            analysisRequestId: "req_456",
            ttlMs: 60_000,
        });
        assert.throws(() => verifyCallbackAuthToken(`${token}x`, "audit_123"));
    });

    it("rejects expired callback tokens", () => {
        const token = buildCallbackAuthToken({
            auditId: "audit_123",
            analysisRequestId: "req_456",
            ttlMs: -1_000,
        });
        assert.throws(() => verifyCallbackAuthToken(token, "audit_123"));
    });

    it("rejects audit ID mismatches", () => {
        const token = buildCallbackAuthToken({
            auditId: "audit_123",
            analysisRequestId: "req_456",
            ttlMs: 60_000,
        });
        assert.throws(() => verifyCallbackAuthToken(token, "audit_other"));
    });

    it("rejects analysis request ID mismatches when expected", () => {
        const token = buildCallbackAuthToken({
            auditId: "audit_123",
            analysisRequestId: "req_456",
            ttlMs: 60_000,
        });
        assert.throws(() => verifyCallbackAuthToken(token, "audit_123", "req_other"));
    });
});

describe("cursor analysis callback auth", () => {
    it("accepts valid request-specific tokens", () => {
        const token = buildCallbackAuthToken({
            auditId: "audit_123",
            analysisRequestId: "req_456",
            ttlMs: 60_000,
        });
        const result = authenticateAnalysisCallback({
            providedToken: token,
            auditId: "audit_123",
            bodyAnalysisRequestId: "req_456",
        });
        assert.equal(result.ok, true);
        if (result.ok) {
            assert.equal(result.payload.analysisRequestId, "req_456");
        }
    });

    it("rejects missing authentication", () => {
        const result = authenticateAnalysisCallback({
            providedToken: null,
            auditId: "audit_123",
        });
        assert.equal(result.ok, false);
        if (!result.ok) assert.equal(result.code, "UNAUTHORIZED");
    });

    it("rejects invalid authentication", () => {
        const result = authenticateAnalysisCallback({
            providedToken: "not-a-valid-token",
            auditId: "audit_123",
        });
        assert.equal(result.ok, false);
        if (!result.ok) assert.equal(result.code, "CALLBACK_TOKEN_INVALID");
    });

    it("rejects expired tokens", () => {
        const token = buildCallbackAuthToken({
            auditId: "audit_123",
            analysisRequestId: "req_456",
            ttlMs: -1_000,
        });
        const result = authenticateAnalysisCallback({
            providedToken: token,
            auditId: "audit_123",
        });
        assert.equal(result.ok, false);
        if (!result.ok) assert.equal(result.code, "CALLBACK_TOKEN_EXPIRED");
    });

    it("rejects body analysis request ID mismatches", () => {
        const token = buildCallbackAuthToken({
            auditId: "audit_123",
            analysisRequestId: "req_456",
            ttlMs: 60_000,
        });
        const result = authenticateAnalysisCallback({
            providedToken: token,
            auditId: "audit_123",
            bodyAnalysisRequestId: "req_other",
        });
        assert.equal(result.ok, false);
        if (!result.ok) assert.equal(result.code, "CALLBACK_TOKEN_REQUEST_MISMATCH");
    });
});

describe("cursor analysis callback token matching", () => {
    it("allows duplicate completion for the same request", () => {
        const result = validateCallbackTokenAgainstAnalysis({
            tokenPayload: {
                auditId: "audit_1",
                analysisRequestId: "req_1",
                expiresAt: Date.now() + 60_000,
            },
            activeAnalysisRequestId: "req_1",
            status: "completed",
            hasExistingResult: true,
        });
        assert.equal(result.ok, true);
        if (result.ok) assert.equal(result.kind, "duplicate");
    });

    it("rejects stale request tokens", () => {
        const result = validateCallbackTokenAgainstAnalysis({
            tokenPayload: {
                auditId: "audit_1",
                analysisRequestId: "req_old",
                expiresAt: Date.now() + 60_000,
            },
            activeAnalysisRequestId: "req_new",
            status: "triggered",
            hasExistingResult: false,
        });
        assert.equal(result.ok, false);
        if (!result.ok) assert.equal(result.code, "STALE_CALLBACK");
    });

    it("rejects reused tokens after failure", () => {
        const result = validateCallbackTokenAgainstAnalysis({
            tokenPayload: {
                auditId: "audit_1",
                analysisRequestId: "req_1",
                expiresAt: Date.now() + 60_000,
            },
            activeAnalysisRequestId: "req_1",
            status: "failed",
            hasExistingResult: false,
        });
        assert.equal(result.ok, false);
        if (!result.ok) assert.equal(result.code, "CALLBACK_TOKEN_REUSED");
    });

    it("allows active attempt tokens to proceed", () => {
        const result = validateCallbackTokenAgainstAnalysis({
            tokenPayload: {
                auditId: "audit_1",
                analysisRequestId: "req_1",
                expiresAt: Date.now() + 60_000,
            },
            activeAnalysisRequestId: "req_1",
            status: "triggered",
            hasExistingResult: false,
        });
        assert.equal(result.ok, true);
        if (result.ok) assert.equal(result.kind, "proceed");
    });
});

describe("cursor analysis config", () => {
    it("defaults provider to unconfigured when Cursor is not configured", () => {
        delete process.env.AI_ANALYSIS_PROVIDER;
        delete process.env.CURSOR_AUTOMATION_WEBHOOK_URL;
        delete process.env.CURSOR_AUTOMATION_AUTH_TOKEN;
        delete process.env.CURSOR_ANALYSIS_CALLBACK_SECRET;
        delete process.env.AUDIT_PACKAGE_SIGNING_SECRET;
        delete process.env.APP_PUBLIC_URL;
        delete process.env.VERCEL_URL;
        resetCursorAnalysisConfigForTests();
        assert.equal(getCursorAnalysisConfig().provider, "unconfigured");
        assert.equal(isAnalysisProviderEnabled(), false);
    });

    it("reports missing cursor configuration", () => {
        process.env.AI_ANALYSIS_PROVIDER = "cursor-automation";
        delete process.env.CURSOR_AUTOMATION_WEBHOOK_URL;
        resetCursorAnalysisConfigForTests();
        const status = getCursorConfigurationStatus();
        assert.equal(status.configured, false);
        assert.ok(status.missing.includes("CURSOR_AUTOMATION_WEBHOOK_URL"));
    });

    it("defaults package and prompt versions to 1.1", () => {
        assert.equal(getCursorAnalysisConfig().packageVersion, "1.1");
        assert.equal(getCursorAnalysisConfig().promptVersion, "1.1");
    });

    it("auto-selects cursor-automation when Cursor infrastructure is fully configured", () => {
        delete process.env.AI_ANALYSIS_PROVIDER;
        delete process.env.AI_PROVIDER;
        process.env.CURSOR_AUTOMATION_WEBHOOK_URL = "https://api2.cursor.sh/automations/webhook/test";
        process.env.CURSOR_AUTOMATION_AUTH_TOKEN = "crsr_test_token";
        process.env.CURSOR_ANALYSIS_CALLBACK_SECRET = "callback-secret";
        process.env.AUDIT_PACKAGE_SIGNING_SECRET = "package-secret";
        process.env.APP_PUBLIC_URL = "https://preview.example.com";
        resetCursorAnalysisConfigForTests();
        assert.equal(getCursorAnalysisConfig().provider, "cursor-automation");
        assert.equal(isAnalysisProviderEnabled(), true);
    });

    it("uses VERCEL_URL when APP_PUBLIC_URL is unset", () => {
        delete process.env.APP_PUBLIC_URL;
        delete process.env.APP_URL;
        delete process.env.NEXT_PUBLIC_SITE_URL;
        process.env.VERCEL_URL = "niceguyservices-git-audittool-user.vercel.app";
        resetCursorAnalysisConfigForTests();
        assert.equal(getCursorAnalysisConfig().publicAppUrl, "https://niceguyservices-git-audittool-user.vercel.app");
    });

    it("strips Authorization Bearer prefix from webhook auth token", () => {
        process.env.CURSOR_AUTOMATION_AUTH_TOKEN =
            "Authorization: Bearer crsr_test_token";
        resetCursorAnalysisConfigForTests();
        assert.equal(getCursorAnalysisConfig().webhookAuthToken, "crsr_test_token");
    });

    it("ignores unsupported AI_ANALYSIS_PROVIDER values", () => {
        process.env.AI_ANALYSIS_PROVIDER = "openai";
        process.env.CURSOR_AUTOMATION_WEBHOOK_URL = "https://api2.cursor.sh/automations/webhook/test";
        process.env.CURSOR_AUTOMATION_AUTH_TOKEN = "crsr_test_token";
        process.env.CURSOR_ANALYSIS_CALLBACK_SECRET = "callback-secret";
        process.env.AUDIT_PACKAGE_SIGNING_SECRET = "package-secret";
        process.env.APP_PUBLIC_URL = "https://preview.example.com";
        resetCursorAnalysisConfigForTests();
        assert.equal(getCursorAnalysisConfig().provider, "cursor-automation");
        assert.equal(isAnalysisProviderEnabled(), true);
    });

    it("does not enable provider when only webhook URL is partially configured", () => {
        delete process.env.AI_ANALYSIS_PROVIDER;
        delete process.env.CURSOR_AUTOMATION_AUTH_TOKEN;
        delete process.env.CURSOR_ANALYSIS_CALLBACK_SECRET;
        delete process.env.AUDIT_PACKAGE_SIGNING_SECRET;
        delete process.env.APP_PUBLIC_URL;
        delete process.env.VERCEL_URL;
        process.env.CURSOR_AUTOMATION_WEBHOOK_URL = "https://api2.cursor.sh/automations/webhook/test";
        resetCursorAnalysisConfigForTests();
        assert.equal(getCursorAnalysisConfig().provider, "unconfigured");
        assert.equal(isAnalysisProviderEnabled(), false);
    });
});

describe("mock analysis provider", () => {
    it("accepts trigger requests without external calls", async () => {
        const provider = getMockAnalysisProvider();
        const result = await provider.triggerAnalysis({
            auditId: "audit_1",
            analysisRequestId: "req_1",
            packageUrl: "https://audit.example.com/package",
            callbackUrl: "https://audit.example.com/callback",
            callbackAuthHeader: "x-cursor-callback-secret",
            callbackAuthToken: buildCallbackAuthToken({
                auditId: "audit_1",
                analysisRequestId: "req_1",
            }),
            promptVersion: "1.1",
            packageVersion: "1.1",
        });
        assert.equal(result.accepted, true);
        assert.ok(result.externalJobId);
        assert.ok(provider.getLastInput()?.callbackAuthToken);
    });
});
