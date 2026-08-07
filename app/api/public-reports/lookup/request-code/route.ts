import { NextResponse } from "next/server";
import { enforcePublicReportLookupRequestRateLimit } from "@/src/services/rate-limit/enforce-public-rate-limit";
import { handleRouteRateLimitError } from "@/src/services/rate-limit/handle-route-rate-limit-error";
import {
    REPORT_LOOKUP_GENERIC_REQUEST_MESSAGE,
    REPORT_LOOKUP_RESEND_COOLDOWN_SECONDS,
} from "@/src/services/report-lookup/constants";
import {
    ReportLookupValidationError,
    requestReportLookupCode,
} from "@/src/services/report-lookup/request-lookup-code";
import { reportLookupEmailSchema } from "@/src/services/report-lookup/validation";
import {
    TransactionalEmailNotConfiguredError,
    TransactionalEmailSendError,
} from "@/src/services/email/send-transactional-email";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const emailParse = reportLookupEmailSchema.safeParse(
        body && typeof body === "object" && "email" in body
            ? (body as { email: unknown }).email
            : undefined,
    );
    if (!emailParse.success) {
        return NextResponse.json(
            {
                error:
                    emailParse.error.issues[0]?.message ??
                    "Please enter a valid email address.",
            },
            { status: 400 },
        );
    }

    try {
        await enforcePublicReportLookupRequestRateLimit({
            request,
            normalizedEmail: emailParse.data,
        });
    } catch (error) {
        const rateLimited = await handleRouteRateLimitError(error, {
            policyId: "public-report-lookup-request-email",
        });
        if (rateLimited) {
            return NextResponse.json(
                {
                    error: `Please wait about ${REPORT_LOOKUP_RESEND_COOLDOWN_SECONDS} seconds before requesting another code.`,
                    retryAfterSeconds: REPORT_LOOKUP_RESEND_COOLDOWN_SECONDS,
                },
                {
                    status: 429,
                    headers: rateLimited.headers,
                },
            );
        }
        throw error;
    }

    try {
        const result = await requestReportLookupCode({ email: emailParse.data });
        return NextResponse.json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        if (error instanceof ReportLookupValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        if (error instanceof TransactionalEmailNotConfiguredError) {
            return NextResponse.json(
                { error: "Email is temporarily unavailable. Please try again later." },
                { status: 503 },
            );
        }
        if (error instanceof TransactionalEmailSendError) {
            return NextResponse.json(
                { error: "Could not send email. Please try again later." },
                { status: 502 },
            );
        }
        console.error("[report-lookup] request-code failed.");
        return NextResponse.json(
            {
                success: true,
                message: REPORT_LOOKUP_GENERIC_REQUEST_MESSAGE,
            },
            { status: 200 },
        );
    }
}
