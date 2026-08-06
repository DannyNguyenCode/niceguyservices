import { NextResponse } from "next/server";
import {
    listAuthenticatedLookupReports,
    ReportLookupUnauthorizedError,
} from "@/src/services/report-lookup/list-lookup-reports";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const result = await listAuthenticatedLookupReports();
        return NextResponse.json({
            success: true,
            reports: result.reports,
            expiresAt: result.session.expiresAt,
        });
    } catch (error) {
        if (error instanceof ReportLookupUnauthorizedError) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        console.error("[report-lookup] list reports failed.");
        return NextResponse.json(
            { error: "Unable to load reports. Please try again." },
            { status: 500 },
        );
    }
}
