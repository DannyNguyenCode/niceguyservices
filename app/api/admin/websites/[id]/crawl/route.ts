import { NextResponse } from "next/server";
import { runWebsiteCrawl } from "@/src/services/run-website-crawl";
import {
    guardAdministratorWriteRoute,
    resolveRouteAdministratorIdentity,
} from "@/src/services/rate-limit/admin-route-guards";
import { handleRouteRateLimitError } from "@/src/services/rate-limit/handle-route-rate-limit-error";
import { isTrustedInternalWorker } from "@/src/services/rate-limit/administrator-context";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
    const writeGuard = await guardAdministratorWriteRoute(request);
    if (writeGuard) {
        return writeGuard;
    }

    const { id } = await context.params;

    try {
        const result = await runWebsiteCrawl(id, {
            administratorIdentity: await resolveRouteAdministratorIdentity(request),
            internalWorker: isTrustedInternalWorker(request),
        });

        if (!result.ok) {
            const status =
                result.code === "not-found"
                    ? 404
                    : result.code === "duplicate"
                      ? 409
                      : result.code === "invalid-url" || result.code === "disabled"
                        ? 400
                        : 500;

            return NextResponse.json(
                { ok: false, message: result.message, code: result.code },
                { status },
            );
        }

        if (result.accepted) {
            return NextResponse.json(
                {
                    ok: true,
                    accepted: true,
                    jobId: result.auditJobId,
                    auditJobId: result.auditJobId,
                    crawlId: result.crawlId,
                    auditRunId: result.auditRunId,
                    reused: result.reused ?? false,
                    message: result.message,
                },
                { status: 202 },
            );
        }

        return NextResponse.json({
            ok: true,
            crawlId: result.crawlId,
            auditRunId: result.auditRunId,
            auditJobId: result.auditJobId,
            reused: result.reused ?? false,
            message: result.message,
        });
    } catch (error) {
        const rateLimitResponse = await handleRouteRateLimitError(error, {
            policyId: "crawl-start",
            websiteId: id,
        });
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        console.error("Crawl API route failed:", error);
        return NextResponse.json(
            {
                ok: false,
                message: "Unable to start the crawl right now. Please try again.",
                code: "database",
            },
            { status: 500 },
        );
    }
}
