import { NextResponse } from "next/server";
import { enforcePublicReportLookupVerifyRateLimit } from "@/src/services/rate-limit/enforce-public-rate-limit";
import { handleRouteRateLimitError } from "@/src/services/rate-limit/handle-route-rate-limit-error";
import { ReportLookupValidationError } from "@/src/services/report-lookup/request-lookup-code";
import {
    ReportLookupVerifyError,
    verifyReportLookupCode,
} from "@/src/services/report-lookup/verify-lookup-code";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    try {
        await enforcePublicReportLookupVerifyRateLimit({ request });
    } catch (error) {
        const rateLimited = await handleRouteRateLimitError(error, {
            policyId: "public-report-lookup-verify-ip",
        });
        if (rateLimited) {
            return rateLimited;
        }
        throw error;
    }

    try {
        const result = await verifyReportLookupCode(body);
        return NextResponse.json({
            success: true,
            message: result.message,
            expiresAt: result.session.expiresAt,
        });
    } catch (error) {
        if (error instanceof ReportLookupValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        if (error instanceof ReportLookupVerifyError) {
            return NextResponse.json(
                { error: error.message, code: error.code },
                { status: error.status },
            );
        }
        console.error("[report-lookup] verify-code failed.");
        return NextResponse.json(
            { error: "Unable to verify that code. Please try again." },
            { status: 500 },
        );
    }
}
