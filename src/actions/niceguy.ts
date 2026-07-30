"use server";

import { revalidatePath } from "next/cache";
import { runNiceGuyAnalysis } from "@/src/services/run-niceguy-analysis";
import { mapRateLimitErrorToActionState } from "@/src/services/rate-limit/map-rate-limit-action-state";

export type RunNiceGuyActionState = {
    ok: boolean;
    message?: string;
    overallScore?: number;
    rateLimited?: boolean;
    retryAfterSeconds?: number;
    resetAt?: string;
};

// TODO: Require admin authentication before allowing Nice Guy scoring in production.
export async function runNiceGuyAnalysisAction(
    websiteId: string,
): Promise<RunNiceGuyActionState> {
    try {
        const result = await runNiceGuyAnalysis(websiteId);

        if (result.success) {
            revalidatePath("/dashboard");
            revalidatePath("/dashboard/websites");
            revalidatePath(`/dashboard/websites/${websiteId}`);

            return {
                ok: true,
                overallScore: result.overallScore,
                message: `Nice Guy scoring completed with an overall score of ${result.overallScore}.`,
            };
        }

        return {
            ok: false,
            message: result.error.message,
        };
    } catch (error) {
        const rateLimited = await mapRateLimitErrorToActionState(error, {
            policyId: "metrics-run",
            websiteId,
        });
        if (rateLimited) {
            return rateLimited;
        }
        throw error;
    }
}
