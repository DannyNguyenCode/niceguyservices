import { NextResponse } from "next/server";
import { verifyAuditPackageToken } from "@/src/services/cursor-analysis/package-token";
import { loadCursorAuditPackageForToken } from "@/src/services/cursor-analysis/request-cursor-analysis";

export const dynamic = "force-dynamic";

type RouteContext = {
    params: Promise<{ auditId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
    const { auditId } = await context.params;
    const token = new URL(request.url).searchParams.get("token");

    if (!token) {
        return NextResponse.json(
            { success: false, error: { code: "UNAUTHORIZED", message: "Package token is required." } },
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
        const message = error instanceof Error ? error.message : "Invalid package token.";
        const status = message.includes("EXPIRED")
            ? 401
            : message.includes("MISMATCH")
              ? 403
              : 401;

        return NextResponse.json(
            { success: false, error: { code: "UNAUTHORIZED", message: "Invalid or expired package token." } },
            { status },
        );
    }
}
