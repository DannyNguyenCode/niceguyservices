import { NextResponse } from "next/server";
import { runAuditWorkerCycle } from "@/src/services/audit-pipeline/audit-pipeline-worker";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let mismatch = 0;
    for (let i = 0; i < a.length; i += 1) {
        mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return mismatch === 0;
}

function isAuthorizedWorkerRequest(request: Request): boolean {
    const internalSecret = process.env.INTERNAL_WORKER_SECRET?.trim();
    const providedInternal = request.headers.get("x-internal-worker-secret")?.trim();
    if (internalSecret && providedInternal && timingSafeEqual(providedInternal, internalSecret)) {
        return true;
    }

    // Vercel Cron sends Authorization: Bearer <CRON_SECRET> when CRON_SECRET is configured.
    const cronSecret = process.env.CRON_SECRET?.trim();
    const authHeader = request.headers.get("authorization")?.trim();
    if (cronSecret && authHeader) {
        const expected = `Bearer ${cronSecret}`;
        if (timingSafeEqual(authHeader, expected)) {
            return true;
        }
    }

    return false;
}

/**
 * Vercel-compatible audit worker endpoint.
 * Invoked by Vercel Cron and by post-queue kicks via INTERNAL_WORKER_SECRET.
 */
export async function GET(request: Request): Promise<NextResponse> {
    if (!isAuthorizedWorkerRequest(request)) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "UNAUTHORIZED", message: "Authentication required." },
            },
            { status: 401 },
        );
    }

    try {
        const result = await runAuditWorkerCycle();
        return NextResponse.json(
            {
                success: true,
                processedJobs: result.processedJobs,
                recovered: result.recovered,
            },
            {
                status: 200,
                headers: { "Cache-Control": "private, no-store" },
            },
        );
    } catch (error) {
        console.error("[audit-worker] cycle failed", {
            message: error instanceof Error ? error.message : "unknown",
        });
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: "AUDIT_WORKER_FAILED",
                    message: "Audit worker cycle failed.",
                },
            },
            { status: 500 },
        );
    }
}

export async function POST(request: Request): Promise<NextResponse> {
    return GET(request);
}
