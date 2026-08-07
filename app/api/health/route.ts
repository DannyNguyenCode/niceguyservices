import { NextResponse } from "next/server";
import { getAppVersion, getDeploymentEnvironment } from "@/src/config/app-env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
    return NextResponse.json(
        {
            status: "ok",
            service: "website-audit-platform",
            environment: getDeploymentEnvironment(),
            version: getAppVersion(),
            timestamp: new Date().toISOString(),
        },
        {
            headers: {
                "Cache-Control": "private, no-store",
            },
        },
    );
}
