"use server";

import { revalidatePath } from "next/cache";
import { runPageSpeedAnalysis } from "@/src/services/run-pagespeed-analysis";
import { requireAdministratorSession } from "@/src/services/auth/administrator-session";
import { mapRateLimitErrorToActionState } from "@/src/services/rate-limit/map-rate-limit-action-state";

export type RunPageSpeedActionState = {
    ok: boolean;
    message?: string;
    status?: "complete" | "partial";
    rateLimited?: boolean;
    retryAfterSeconds?: number;
    resetAt?: string;
};

// Auth enforced via requireAdministratorSession below.
export async function runPageSpeedAnalysisAction(
    websiteId: string,
): Promise<RunPageSpeedActionState> {
    await requireAdministratorSession(`/dashboard/websites/${websiteId}`);

    try {
        const result = await runPageSpeedAnalysis(websiteId);

        if (result.success) {
            revalidatePath("/dashboard");
            revalidatePath("/dashboard/websites");
            revalidatePath(`/dashboard/websites/${websiteId}`);

            return {
                ok: true,
                status: result.status,
                message:
                    result.status === "complete"
                        ? "PageSpeed analysis completed for mobile and desktop."
                        : "PageSpeed analysis completed with partial results.",
            };
        }

        return {
            ok: false,
            message: result.error.message,
        };
    } catch (error) {
        const rateLimited = await mapRateLimitErrorToActionState(error, {
            policyId: "pagespeed-run",
            websiteId,
        });
        if (rateLimited) {
            return rateLimited;
        }
        throw error;
    }
}
