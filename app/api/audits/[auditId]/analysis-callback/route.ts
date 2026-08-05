import { NextResponse } from "next/server";
import {
    CURSOR_ANALYSIS_CALLBACK_MAX_BYTES,
    getCursorAnalysisConfig,
} from "@/src/services/cursor-analysis/config";
import { handleCursorAnalysisCallback } from "@/src/services/cursor-analysis/request-cursor-analysis";

export const dynamic = "force-dynamic";

type RouteContext = {
    params: Promise<{ auditId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
    const { auditId } = await context.params;
    const config = getCursorAnalysisConfig();
    const headerName = config.callbackHeader ?? "x-cursor-callback-secret";
    const providedToken = request.headers.get(headerName);

    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > CURSOR_ANALYSIS_CALLBACK_MAX_BYTES) {
        return NextResponse.json(
            { success: false, error: { code: "PAYLOAD_TOO_LARGE", message: "Callback payload is too large." } },
            { status: 413 },
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { success: false, error: { code: "INVALID_JSON", message: "Callback body must be valid JSON." } },
            { status: 400 },
        );
    }

    const result = await handleCursorAnalysisCallback({
        auditRunId: auditId,
        providedToken,
        body,
    });

    if (!result.ok) {
        return NextResponse.json(
            { success: false, error: { code: result.code, message: result.message } },
            { status: result.status },
        );
    }

    return NextResponse.json({
        success: true,
        status: result.status,
    });
}
