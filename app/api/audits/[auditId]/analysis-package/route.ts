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

type RouteContext = {
    params: Promise<{ auditId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
    const { auditId } = await context.params;
    const requestUrl = new URL(request.url);
    const token = requestUrl.searchParams.get("token");
    const deployment = getDeploymentIdentityDiagnostics();
    const secretDiagnostics = getPackageSigningSecretDiagnostics();
    const urlDiagnostics = inspectPackageUrlDiagnostics(request.url);

    console.info(
        "[AUDIT_PACKAGE_REQUEST_RECEIVED]",
        JSON.stringify({
            requestedAuditId: auditId,
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
            "[AUDIT_PACKAGE_TOKEN_MISSING]",
            JSON.stringify({
                requestedAuditId: auditId,
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

    try {
        const payload = verifyAuditPackageToken(token, auditId);
        const auditPackage = await loadCursorAuditPackageForToken({
            auditRunId: auditId,
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
        if (error instanceof AuditPackageTokenError) {
            console.error(
                "[AUDIT_PACKAGE_REQUEST_REJECTED]",
                JSON.stringify({
                    requestedAuditId: auditId,
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

        const legacyCode =
            error instanceof Error ? error.message : AUDIT_PACKAGE_TOKEN_ERROR_CODES.INTERNAL_ERROR;
        console.error(
            "[AUDIT_PACKAGE_REQUEST_REJECTED]",
            JSON.stringify({
                requestedAuditId: auditId,
                code: legacyCode,
                receivedTokenLength: token.length,
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
}
