"use server";

import { revalidatePath } from "next/cache";
import { runPageSpeedAnalysis } from "@/src/services/run-pagespeed-analysis";
import { requireAdministratorSession } from "@/src/services/auth/administrator-session";
import { mapRateLimitErrorToActionState } from "@/src/services/rate-limit/map-rate-limit-action-state";

export type RunPageSpeedActionState = {
    ok: boolean;
    message?: string;
    status?: "complete" | "partial" | "failed";
    /** True when GoogleMetric records were persisted (including failures). */
    persisted?: boolean;
    rateLimited?: boolean;
    retryAfterSeconds?: number;
    resetAt?: string;
};

function revalidatePageSpeedPaths(websiteId: string) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/websites");
    revalidatePath(`/dashboard/websites/${websiteId}`);
}

// Auth enforced via requireAdministratorSession below.
export async function runPageSpeedAnalysisAction(
    websiteId: string,
): Promise<RunPageSpeedActionState> {
    await requireAdministratorSession(`/dashboard/websites/${websiteId}`);

    try {
        const result = await runPageSpeedAnalysis(websiteId);

        if (result.success) {
            // Refresh for complete, partial, and failed — failed records must appear.
            revalidatePageSpeedPaths(websiteId);

            try {
                const { maybeAdvanceOrchestrationAfterEvidenceChange } = await import(
                    "@/src/services/audit-pipeline/maybe-advance-after-evidence"
                );
                await maybeAdvanceOrchestrationAfterEvidenceChange({ websiteId });
            } catch {
                // Orchestration advance is best-effort after manual PageSpeed.
            }

            const message =
                result.status === "complete"
                    ? "PageSpeed analysis completed for mobile and desktop."
                    : result.status === "partial"
                      ? "PageSpeed analysis completed with partial results."
                      : [
                            result.results.mobile.errorMessage,
                            result.results.desktop.errorMessage,
                        ]
                            .filter(Boolean)
                            .join(" ") || "PageSpeed analysis failed for mobile and desktop.";

            return {
                ok: result.status !== "failed",
                persisted: true,
                status: result.status,
                message,
            };
        }

        return {
            ok: false,
            persisted: false,
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
