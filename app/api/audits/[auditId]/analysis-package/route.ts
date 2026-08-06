import { NextResponse } from "next/server";
import {
    AUDIT_PACKAGE_TOKEN_ERROR_CODES,
    AuditPackageTokenError,
    getDeploymentIdentityDiagnostics,
    getPackageSigningSecretDiagnostics,
    inspectPackageUrlDiagnostics,
    verifyAuditPackageToken,
} from "@/src/services/cursor-analysis/package-token";
import { loadCursorAuditPackageForToken } from "@/src/services/cursor-analysis/request-cursor-analysis";
import { VERCEL_PROTECTION_BYPASS_QUERY_PARAM } from "@/src/services/cursor-analysis/vercel-automation-bypass";

export const dynamic = "force-dynamic";

export const AUDIT_PACKAGE_INTERNAL_ERROR_CODE = "AUDIT_PACKAGE_INTERNAL_ERROR";

type RouteContext = {
    params: Promise<{ auditId: string }>;
};

type PackageLoader = typeof loadCursorAuditPackageForToken;

/**
 * Analysis-package GET handler.
 * Auth failures → 401/403. Post-auth package/DB failures → 500.
 * `loadPackage` is injectable for focused route tests only.
 */
export async function handleAnalysisPackageRequest(input: {
    auditId: string;
    requestUrl: string;
    loadPackage?: PackageLoader;
}): Promise<NextResponse> {
    const requestUrl = new URL(input.requestUrl);
    const token = requestUrl.searchParams.get("token");
    const deployment = getDeploymentIdentityDiagnostics();
    const secretDiagnostics = getPackageSigningSecretDiagnostics();
    const urlDiagnostics = inspectPackageUrlDiagnostics(input.requestUrl);
    const loadPackage = input.loadPackage ?? loadCursorAuditPackageForToken;

    console.info(
        "[AUDIT_PACKAGE_REQUEST_RECEIVED]",
        JSON.stringify({
            requestedAuditId: input.auditId,
            requestedAnalysisRequestId: null,
            hostname: requestUrl.hostname,
            pathname: requestUrl.pathname,
            hasToken: Boolean(token),
            receivedTokenLength: token?.length ?? 0,
            hasVercelProtectionBypass: requestUrl.searchParams.has(
                VERCEL_PROTECTION_BYPASS_QUERY_PARAM,
            ),
            queryParameterNames: urlDiagnostics.queryParameterNames,
            currentUnixTimestampMs: Date.now(),
            timestampUnit: "milliseconds",
            ...secretDiagnostics,
            ...deployment,
        }),
    );

    if (!token) {
        console.error(
            "[AUDIT_PACKAGE_AUTH_REJECTED]",
            JSON.stringify({
                requestedAuditId: input.auditId,
                code: AUDIT_PACKAGE_TOKEN_ERROR_CODES.MISSING,
                receivedTokenLength: 0,
                ...secretDiagnostics,
                ...deployment,
            }),
        );
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: AUDIT_PACKAGE_TOKEN_ERROR_CODES.MISSING,
                    message: "Package token is required.",
                },
            },
            { status: 401 },
        );
    }

    let payload;
    try {
        payload = verifyAuditPackageToken(token, input.auditId);
    } catch (error) {
        if (error instanceof AuditPackageTokenError) {
            console.error(
                "[AUDIT_PACKAGE_AUTH_REJECTED]",
                JSON.stringify({
                    requestedAuditId: input.auditId,
                    code: error.code,
                    receivedTokenLength: token.length,
                    status: error.status,
                    ...secretDiagnostics,
                    ...deployment,
                }),
            );
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: error.code,
                        message: error.publicMessage,
                    },
                },
                { status: error.status },
            );
        }

        console.error(
            "[AUDIT_PACKAGE_AUTH_REJECTED]",
            JSON.stringify({
                requestedAuditId: input.auditId,
                code: AUDIT_PACKAGE_TOKEN_ERROR_CODES.INTERNAL_ERROR,
                receivedTokenLength: token.length,
                errorName: error instanceof Error ? error.name : "unknown",
                ...secretDiagnostics,
                ...deployment,
            }),
        );
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: AUDIT_PACKAGE_TOKEN_ERROR_CODES.INTERNAL_ERROR,
                    message: "Invalid package token.",
                },
            },
            { status: 401 },
        );
    }

    try {
        const auditPackage = await loadPackage({
            auditRunId: input.auditId,
            analysisRequestId: payload.analysisRequestId,
        });

        if (!auditPackage) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: "NOT_FOUND",
                        message: "Audit package is unavailable or incomplete.",
                    },
                },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, package: auditPackage });
    } catch (error) {
        const errorName = error instanceof Error ? error.name : "unknown";
        const errorMessage = error instanceof Error ? error.message : "unknown";
        console.error(
            "[AUDIT_PACKAGE_PROCESSING_FAILED]",
            JSON.stringify({
                requestedAuditId: input.auditId,
                analysisRequestId: payload.analysisRequestId,
                code: AUDIT_PACKAGE_INTERNAL_ERROR_CODE,
                errorName,
                // Safe, truncated message only — never stacks, URIs, tokens, or query bodies.
                errorMessage: errorMessage.slice(0, 300),
                ...secretDiagnostics,
                ...deployment,
            }),
        );

        return NextResponse.json(
            {
                success: false,
                error: {
                    code: AUDIT_PACKAGE_INTERNAL_ERROR_CODE,
                    message: "Failed to retrieve analysis package.",
                },
            },
            { status: 500 },
        );
    }
}

export async function GET(request: Request, context: RouteContext) {
    const { auditId } = await context.params;
    return handleAnalysisPackageRequest({
        auditId,
        requestUrl: request.url,
    });
}
