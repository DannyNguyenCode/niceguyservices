import { NextResponse } from "next/server";
import { getAppEnv, getAppVersion } from "@/src/config/app-env";
import { getRateLimitEnv } from "@/src/config/env";
import { connectToDatabase } from "@/src/lib/mongodb";
import { isCloudinaryConfigured } from "@/src/lib/cloudinary-config";
import { isPageSpeedConfigured } from "@/src/lib/pagespeed-config";
import { isAiConfigured } from "@/src/lib/ai-config";
import { isPdfRendererConfigured } from "@/src/services/pdf-reports/env";
import { resolveRequestId } from "@/src/lib/request-id";
import { sanitizeErrorMessage } from "@/src/lib/safe-log";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isAuthorizedInternalRequest(request: Request): boolean {
    const secret = process.env.INTERNAL_WORKER_SECRET?.trim();
    if (!secret) {
        return false;
    }
    return request.headers.get("x-internal-worker-secret") === secret;
}

export async function GET(request: Request) {
    const requestId = resolveRequestId(request.headers);

    if (!isAuthorizedInternalRequest(request)) {
        return NextResponse.json(
            {
                error: {
                    code: "UNAUTHORIZED",
                    message: "Internal health check is not available.",
                    requestId,
                },
            },
            { status: 401, headers: { "Cache-Control": "private, no-store" } },
        );
    }

    const checks: Record<string, { ok: boolean; message?: string }> = {};
    let ready = true;

    try {
        getAppEnv();
        checks.environment = { ok: true };
    } catch (error) {
        ready = false;
        checks.environment = { ok: false, message: sanitizeErrorMessage(error) };
    }

    try {
        await connectToDatabase();
        checks.mongodb = { ok: true };
    } catch (error) {
        ready = false;
        checks.mongodb = { ok: false, message: sanitizeErrorMessage(error) };
    }

    try {
        const rateLimit = getRateLimitEnv();
        if (
            process.env.NODE_ENV === "production" &&
            (rateLimit.provider === "memory" || rateLimit.provider === "noop")
        ) {
            throw new Error("Production requires distributed rate limiting.");
        }
        checks.rateLimit = { ok: true };
    } catch (error) {
        ready = false;
        checks.rateLimit = { ok: false, message: sanitizeErrorMessage(error) };
    }

    checks.cloudinary = { ok: isCloudinaryConfigured() };
    checks.pagespeed = { ok: isPageSpeedConfigured() };
    checks.ai = { ok: isAiConfigured() };
    checks.pdf = { ok: isPdfRendererConfigured() };

    if (!checks.cloudinary.ok || !checks.pagespeed.ok || !checks.ai.ok || !checks.pdf.ok) {
        ready = false;
    }

    return NextResponse.json(
        {
            status: ready ? "ready" : "degraded",
            service: "website-audit-platform",
            version: getAppVersion(),
            timestamp: new Date().toISOString(),
            requestId,
            checks,
        },
        {
            status: ready ? 200 : 503,
            headers: {
                "Cache-Control": "private, no-store",
                "x-request-id": requestId,
            },
        },
    );
}
