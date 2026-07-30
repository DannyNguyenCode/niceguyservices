import { NextResponse } from "next/server";
import { outreachRecipientSchema, outreachStrategySchema } from "@/src/services/outreach/schemas";
import { generateOutreachEmail } from "@/src/services/outreach/generate-outreach-email";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ reportId: string }> };

// TODO: Require admin authentication before allowing outreach generation in production.
export async function POST(request: Request, context: RouteContext) {
    const { reportId } = await context.params;

    let body: Record<string, unknown> = {};
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        body = {};
    }

    const strategyResult = outreachStrategySchema.safeParse(body.strategy ?? {});
    if (!strategyResult.success) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "OUTREACH_SCHEMA_VALIDATION_FAILED", message: "Invalid strategy." },
            },
            { status: 400 },
        );
    }

    const recipientResult = outreachRecipientSchema.safeParse(body.recipient ?? {});
    if (!recipientResult.success) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "OUTREACH_SCHEMA_VALIDATION_FAILED", message: "Invalid recipient." },
            },
            { status: 400 },
        );
    }

    try {
        const result = await generateOutreachEmail({
            publicReportId: reportId,
            pdfReportId: body.pdfReportId ? String(body.pdfReportId) : null,
            recipient: recipientResult.data,
            strategy: strategyResult.data,
            allowArchived: Boolean(body.allowArchived),
        });

        if (!result.success) {
            const status =
                result.error.code === "OUTREACH_REPORT_NOT_FOUND" ||
                result.error.code === "OUTREACH_WEBSITE_NOT_FOUND"
                    ? 404
                    : result.error.code === "OUTREACH_SOURCE_INCOMPLETE" ||
                        result.error.code === "OUTREACH_NO_SUPPORTED_FINDINGS"
                      ? 409
                      : 500;
            return NextResponse.json(result, { status });
        }

        return NextResponse.json({
            success: true,
            draftId: result.draft.id,
            draft: result.draft,
            status: result.draft.status,
            subject: result.draft.subject,
            bodyText: result.draft.bodyText,
            evidence: result.draft.evidence,
            claimWarnings: result.draft.claimWarnings,
        });
    } catch (error) {
        console.error("Generate outreach draft API failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: "OUTREACH_PROVIDER_FAILED",
                    message: "Unable to generate outreach draft.",
                },
            },
            { status: 500 },
        );
    }
}
