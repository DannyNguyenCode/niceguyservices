import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import mongoose from "mongoose";
import {
    AUDIT_PACKAGE_INTERNAL_ERROR_CODE,
    handleAnalysisPackageRequest,
} from "@/app/api/audits/[auditId]/analysis-package/route";
import {
    buildPackageAccessUpdatePipeline,
} from "@/src/data/audit-run-analysis";
import { AuditRun } from "@/src/models/AuditRun";
import {
    AUDIT_PACKAGE_TOKEN_ERROR_CODES,
    buildAuditPackageToken,
} from "@/src/services/cursor-analysis/package-token";
import { resetCursorAnalysisConfigForTests } from "@/src/services/cursor-analysis/config";

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

const AUDIT_ID = "507f1f77bcf86cd799439011";
const ANALYSIS_REQUEST_ID = "req_package_route_1";

function packageRequestUrl(token: string | null): string {
    const url = new URL(
        `https://preview.example.com/api/audits/${AUDIT_ID}/analysis-package`,
    );
    if (token !== null) {
        url.searchParams.set("token", token);
    }
    return url.toString();
}

function validToken(overrides?: { ttlMs?: number; auditId?: string; analysisRequestId?: string }) {
    return buildAuditPackageToken({
        auditId: overrides?.auditId ?? AUDIT_ID,
        analysisRequestId: overrides?.analysisRequestId ?? ANALYSIS_REQUEST_ID,
        ttlMs: overrides?.ttlMs ?? 60_000,
    });
}

const SAMPLE_PACKAGE = {
    schemaVersion: "1.1",
    auditId: AUDIT_ID,
    analysisRequestId: ANALYSIS_REQUEST_ID,
};

describe("analysis-package route error boundaries", () => {
    it("1 — valid package token authenticates and returns 200 when package loads", async () => {
        const token = validToken();
        const response = await handleAnalysisPackageRequest({
            auditId: AUDIT_ID,
            requestUrl: packageRequestUrl(token),
            loadPackage: async () => SAMPLE_PACKAGE as never,
        });

        assert.equal(response.status, 200);
        const body = (await response.json()) as {
            success: boolean;
            package?: { auditId?: string; analysisRequestId?: string };
        };
        assert.equal(body.success, true);
        assert.equal(body.package?.auditId, AUDIT_ID);
        assert.equal(body.package?.analysisRequestId, ANALYSIS_REQUEST_ID);
    });

    it("2 — valid token + successful processing returns HTTP 200 with package structure", async () => {
        const token = validToken();
        const response = await handleAnalysisPackageRequest({
            auditId: AUDIT_ID,
            requestUrl: packageRequestUrl(token),
            loadPackage: async (input) => {
                assert.equal(input.auditRunId, AUDIT_ID);
                assert.equal(input.analysisRequestId, ANALYSIS_REQUEST_ID);
                return SAMPLE_PACKAGE as never;
            },
        });

        assert.equal(response.status, 200);
        const body = (await response.json()) as { success: boolean; package: unknown };
        assert.equal(body.success, true);
        assert.equal(typeof body.package, "object");
        assert.ok(body.package);
    });

    it("3 — invalid signature returns 401", async () => {
        const token = `${validToken()}x`;
        const response = await handleAnalysisPackageRequest({
            auditId: AUDIT_ID,
            requestUrl: packageRequestUrl(token),
            loadPackage: async () => {
                assert.fail("package loader must not run after auth failure");
            },
        });

        assert.equal(response.status, 401);
        const body = (await response.json()) as { error: { code: string } };
        assert.equal(body.error.code, AUDIT_PACKAGE_TOKEN_ERROR_CODES.SIGNATURE_INVALID);
    });

    it("4 — expired token returns 401", async () => {
        const token = validToken({ ttlMs: -1_000 });
        const response = await handleAnalysisPackageRequest({
            auditId: AUDIT_ID,
            requestUrl: packageRequestUrl(token),
            loadPackage: async () => {
                assert.fail("package loader must not run after auth failure");
            },
        });

        assert.equal(response.status, 401);
        const body = (await response.json()) as { error: { code: string } };
        assert.equal(body.error.code, AUDIT_PACKAGE_TOKEN_ERROR_CODES.EXPIRED);
    });

    it("5 — audit mismatch returns 401", async () => {
        const token = validToken({ auditId: "507f1f77bcf86cd799439099" });
        const response = await handleAnalysisPackageRequest({
            auditId: AUDIT_ID,
            requestUrl: packageRequestUrl(token),
            loadPackage: async () => {
                assert.fail("package loader must not run after auth failure");
            },
        });

        assert.equal(response.status, 401);
        const body = (await response.json()) as { error: { code: string } };
        assert.equal(body.error.code, AUDIT_PACKAGE_TOKEN_ERROR_CODES.AUDIT_MISMATCH);
    });

    it("6 — malformed token returns 401", async () => {
        const response = await handleAnalysisPackageRequest({
            auditId: AUDIT_ID,
            requestUrl: packageRequestUrl("not-a-valid-token"),
            loadPackage: async () => {
                assert.fail("package loader must not run after auth failure");
            },
        });

        assert.equal(response.status, 401);
        const body = (await response.json()) as { error: { code: string } };
        assert.equal(body.error.code, AUDIT_PACKAGE_TOKEN_ERROR_CODES.MALFORMED);
    });

    it("7 — Mongo/database failure AFTER successful auth returns 500 — NOT 401", async () => {
        const token = validToken();
        const response = await handleAnalysisPackageRequest({
            auditId: AUDIT_ID,
            requestUrl: packageRequestUrl(token),
            loadPackage: async () => {
                throw new Error(
                    "Cannot pass an array to query updates unless the `updatePipeline` option is set.",
                );
            },
        });

        assert.equal(response.status, 500);
        const body = (await response.json()) as {
            success: boolean;
            error: { code: string; message: string };
        };
        assert.equal(body.success, false);
        assert.equal(body.error.code, AUDIT_PACKAGE_INTERNAL_ERROR_CODE);
        assert.equal(body.error.message, "Failed to retrieve analysis package.");
        assert.equal(body.error.message.includes("updatePipeline"), false);
        assert.equal(body.error.message.includes("array"), false);
    });

    it("9 — complete path: valid token → processing → package → HTTP 200", async () => {
        const token = validToken();
        let loaderCalled = false;
        const response = await handleAnalysisPackageRequest({
            auditId: AUDIT_ID,
            requestUrl: packageRequestUrl(token),
            loadPackage: async (input) => {
                loaderCalled = true;
                assert.equal(input.analysisRequestId, ANALYSIS_REQUEST_ID);
                return {
                    ...SAMPLE_PACKAGE,
                    auditedUrl: "https://example.com",
                    packageVersion: "1.1",
                } as never;
            },
        });

        assert.equal(loaderCalled, true);
        assert.equal(response.status, 200);
        const body = (await response.json()) as {
            success: boolean;
            package: Record<string, unknown>;
        };
        assert.equal(body.success, true);
        assert.equal(body.package.auditId, AUDIT_ID);
        assert.equal(body.package.analysisRequestId, ANALYSIS_REQUEST_ID);
        assert.ok("packageVersion" in body.package);
    });
});

describe("recordPackageAccess Mongo update pipeline regression", () => {
    it("8a — reproduces original Mongoose 9 error when updatePipeline is omitted", () => {
        const objectId = new mongoose.Types.ObjectId(AUDIT_ID);
        const pipeline = buildPackageAccessUpdatePipeline(new Date());

        assert.throws(
            () => {
                AuditRun.findOneAndUpdate(
                    {
                        _id: objectId,
                        "analysis.analysisRequestId": ANALYSIS_REQUEST_ID,
                    },
                    pipeline,
                );
            },
            (error: unknown) =>
                error instanceof Error &&
                error.message.includes(
                    "Cannot pass an array to query updates unless the `updatePipeline` option is set.",
                ),
        );
    });

    it("8b — package access update constructs successfully with updatePipeline: true", () => {
        const objectId = new mongoose.Types.ObjectId(AUDIT_ID);
        const pipeline = buildPackageAccessUpdatePipeline(new Date());

        assert.doesNotThrow(() => {
            AuditRun.findOneAndUpdate(
                {
                    _id: objectId,
                    "analysis.analysisRequestId": ANALYSIS_REQUEST_ID,
                },
                pipeline,
                { updatePipeline: true },
            );
        });

        assert.equal(Array.isArray(pipeline), true);
        assert.equal(pipeline.length, 1);
        assert.ok(pipeline[0].$set["analysis.packageAccessCount"]);
        assert.ok(pipeline[0].$set["analysis.packageFirstAccessedAt"]);
        assert.ok(pipeline[0].$set["analysis.packageLastAccessedAt"]);
    });
});
