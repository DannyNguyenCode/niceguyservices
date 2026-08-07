import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { redactSensitiveUrl } from "@/src/services/cursor-analysis/redact-sensitive-url";
import {
    applyVercelAutomationBypass,
    shouldUseVercelProtectionBypass,
    VERCEL_PROTECTION_BYPASS_QUERY_PARAM,
} from "@/src/services/cursor-analysis/vercel-automation-bypass";
import {
    buildAnalysisCallbackUrl,
    buildSignedPackageUrl,
    verifyAuditPackageToken,
} from "@/src/services/cursor-analysis/package-token";
import { resetCursorAnalysisConfigForTests } from "@/src/services/cursor-analysis/config";

const ORIGINAL_ENV = { ...process.env };

function setEnv(values: Record<string, string | undefined>) {
    process.env = { ...ORIGINAL_ENV, ...values };
    resetCursorAnalysisConfigForTests();
}

beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    resetCursorAnalysisConfigForTests();
});

afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    resetCursorAnalysisConfigForTests();
});

describe("vercel automation protection bypass", () => {
    const baseUrl = "https://niceguyservices-git-audittool-user.vercel.app";
    const packageInput = {
        auditId: "audit_123",
        analysisRequestId: "req_456",
        publicBaseUrl: baseUrl,
    };

  it("TEST A — preview + bypass secret appends bypass to package and callback URLs", () => {
        setEnv({
            VERCEL_ENV: "preview",
            VERCEL_AUTOMATION_BYPASS_SECRET: "test-bypass",
            AUDIT_PACKAGE_SIGNING_SECRET: "test-package-secret",
        });

        assert.equal(shouldUseVercelProtectionBypass(), true);

        const packageUrl = buildSignedPackageUrl(packageInput);
        const callbackUrl = buildAnalysisCallbackUrl({
            auditId: packageInput.auditId,
            publicBaseUrl: baseUrl,
        });

        const packageParsed = new URL(packageUrl);
        const callbackParsed = new URL(callbackUrl);

        assert.equal(
            packageParsed.searchParams.get(VERCEL_PROTECTION_BYPASS_QUERY_PARAM),
            "test-bypass",
        );
        assert.equal(
            callbackParsed.searchParams.get(VERCEL_PROTECTION_BYPASS_QUERY_PARAM),
            "test-bypass",
        );
        assert.ok(packageParsed.searchParams.get("token"));
    });

    it("TEST B — production never appends bypass even when secret exists", () => {
        setEnv({
            VERCEL_ENV: "production",
            VERCEL_AUTOMATION_BYPASS_SECRET: "test-bypass",
            AUDIT_PACKAGE_SIGNING_SECRET: "test-package-secret",
        });

        assert.equal(shouldUseVercelProtectionBypass(), false);

        const packageUrl = buildSignedPackageUrl(packageInput);
        const callbackUrl = buildAnalysisCallbackUrl({
            auditId: packageInput.auditId,
            publicBaseUrl: "https://niceguyservices.vercel.app",
        });

        assert.equal(packageUrl.includes(VERCEL_PROTECTION_BYPASS_QUERY_PARAM), false);
        assert.equal(callbackUrl.includes(VERCEL_PROTECTION_BYPASS_QUERY_PARAM), false);
        assert.ok(new URL(packageUrl).searchParams.get("token"));
    });

    it("TEST C — production without bypass secret behaves normally", () => {
        setEnv({
            VERCEL_ENV: "production",
            AUDIT_PACKAGE_SIGNING_SECRET: "test-package-secret",
        });
        delete process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

        const packageUrl = buildSignedPackageUrl(packageInput);
        const callbackUrl = buildAnalysisCallbackUrl({
            auditId: packageInput.auditId,
            publicBaseUrl: "https://niceguyservices.vercel.app",
        });

        assert.equal(shouldUseVercelProtectionBypass(), false);
        assert.equal(packageUrl.includes(VERCEL_PROTECTION_BYPASS_QUERY_PARAM), false);
        assert.equal(callbackUrl.includes(VERCEL_PROTECTION_BYPASS_QUERY_PARAM), false);
    });

    it("TEST D — preview without bypass secret leaves URLs unchanged", () => {
        setEnv({
            VERCEL_ENV: "preview",
            AUDIT_PACKAGE_SIGNING_SECRET: "test-package-secret",
        });
        delete process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

        const packageUrl = buildSignedPackageUrl(packageInput);
        const callbackUrl = buildAnalysisCallbackUrl({
            auditId: packageInput.auditId,
            publicBaseUrl: baseUrl,
        });

        assert.equal(shouldUseVercelProtectionBypass(), false);
        assert.equal(packageUrl.includes(VERCEL_PROTECTION_BYPASS_QUERY_PARAM), false);
        assert.equal(callbackUrl.includes(VERCEL_PROTECTION_BYPASS_QUERY_PARAM), false);
        assert.equal(packageUrl.includes("undefined"), false);
        assert.equal(callbackUrl.includes("undefined"), false);
    });

    it("TEST E — local development never appends bypass", () => {
        setEnv({
            VERCEL_ENV: "development",
            VERCEL_AUTOMATION_BYPASS_SECRET: "test-bypass",
            AUDIT_PACKAGE_SIGNING_SECRET: "test-package-secret",
        });

        const packageUrl = applyVercelAutomationBypass(
            `${baseUrl}/api/audits/audit_123/analysis-package?token=signed-token`,
        );

        assert.equal(shouldUseVercelProtectionBypass(), false);
        assert.equal(packageUrl.includes(VERCEL_PROTECTION_BYPASS_QUERY_PARAM), false);
    });

    it("TEST E — absent VERCEL_ENV never appends bypass", () => {
        setEnv({
            VERCEL_AUTOMATION_BYPASS_SECRET: "test-bypass",
            AUDIT_PACKAGE_SIGNING_SECRET: "test-package-secret",
        });
        delete process.env.VERCEL_ENV;

        const packageUrl = applyVercelAutomationBypass(
            `${baseUrl}/api/audits/audit_123/analysis-package?token=signed-token`,
        );

        assert.equal(shouldUseVercelProtectionBypass(), false);
        assert.equal(packageUrl.includes(VERCEL_PROTECTION_BYPASS_QUERY_PARAM), false);
    });

    it("TEST F — existing signed package token remains valid after bypass is appended", () => {
        setEnv({
            VERCEL_ENV: "preview",
            VERCEL_AUTOMATION_BYPASS_SECRET: "test-bypass",
            AUDIT_PACKAGE_SIGNING_SECRET: "test-package-secret",
        });

        const packageUrl = buildSignedPackageUrl(packageInput);
        const token = new URL(packageUrl).searchParams.get("token");
        assert.ok(token);

        const payload = verifyAuditPackageToken(token!, packageInput.auditId, packageInput.analysisRequestId);
        assert.equal(payload.analysisRequestId, packageInput.analysisRequestId);
    });

    it("TEST F — preserves unrelated existing query parameters", () => {
        setEnv({
            VERCEL_ENV: "preview",
            VERCEL_AUTOMATION_BYPASS_SECRET: "test-bypass",
        });

        const input =
            "https://preview.example.com/api/audits/audit_123/analysis-package?token=signed-token&foo=bar";
        const output = applyVercelAutomationBypass(input);
        const parsed = new URL(output);

        assert.equal(parsed.searchParams.get("token"), "signed-token");
        assert.equal(parsed.searchParams.get("foo"), "bar");
        assert.equal(parsed.searchParams.get(VERCEL_PROTECTION_BYPASS_QUERY_PARAM), "test-bypass");
    });

    it("TEST G — redacts sensitive URL query parameters", () => {
        const redacted = redactSensitiveUrl(
            "https://preview.example.com/api/audits/audit_123/analysis-package?token=signed-token&x-vercel-protection-bypass=secret-value",
        );
        const parsed = new URL(redacted);

        assert.equal(parsed.searchParams.get("token"), "[redacted]");
        assert.equal(parsed.searchParams.get(VERCEL_PROTECTION_BYPASS_QUERY_PARAM), "[redacted]");
        assert.equal(redacted.includes("secret-value"), false);
        assert.equal(redacted.includes("signed-token"), false);
    });
});
