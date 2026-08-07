"use server";

import { revalidatePath } from "next/cache";
import { runNiceGuyAnalysis } from "@/src/services/run-niceguy-analysis";
import { requireAdministratorSession } from "@/src/services/auth/administrator-session";
import { mapRateLimitErrorToActionState } from "@/src/services/rate-limit/map-rate-limit-action-state";

export type RunNiceGuyActionState = {
    ok: boolean;
    message?: string;
    overallScore?: number;
    rateLimited?: boolean;
    retryAfterSeconds?: number;
    resetAt?: string;
};

// Auth enforced via requireAdministratorSession below.
export async function runNiceGuyAnalysisAction(
    websiteId: string,
): Promise<RunNiceGuyActionState> {
    await requireAdministratorSession(`/dashboard/websites/${websiteId}`);

    try {
        const result = await runNiceGuyAnalysis(websiteId);

        if (result.success) {
            revalidatePath("/dashboard");
            revalidatePath("/dashboard/websites");
            revalidatePath(`/dashboard/websites/${websiteId}`);

            try {
                const { maybeAdvanceOrchestrationAfterEvidenceChange } = await import(
                    "@/src/services/audit-pipeline/maybe-advance-after-evidence"
                );
                await maybeAdvanceOrchestrationAfterEvidenceChange({ websiteId });
            } catch {
                // Orchestration advance is best-effort after manual Nice Guy scoring.
            }

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
