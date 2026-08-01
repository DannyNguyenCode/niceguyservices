"use server";

import { revalidatePath } from "next/cache";
import {
    rejectHeroSuggestion,
    restoreHeroSuggestion,
    selectHeroSuggestion,
} from "@/src/data/hero-suggestions";
import { createActivityLog } from "@/src/data/activity-logs";
import { runAiAnalysis } from "@/src/services/run-ai-analysis";
import { requireAdministratorSession } from "@/src/services/auth/administrator-session";
import { mapRateLimitErrorToActionState } from "@/src/services/rate-limit/map-rate-limit-action-state";
import { isCursorAutomationProvider } from "@/src/services/cursor-analysis/config";
import { requestCursorAnalysisForAuditRun } from "@/src/services/cursor-analysis/request-cursor-analysis";

export type RunAiAnalysisActionState = {
    ok: boolean;
    message?: string;
    status?: "complete" | "partial" | "triggered" | "queued";
    analysisRequestId?: string;
    missing?: string[];
    rateLimited?: boolean;
    retryAfterSeconds?: number;
    resetAt?: string;
};

export async function runAiAnalysisAction(
    websiteId: string,
    auditRunId?: string | null,
): Promise<RunAiAnalysisActionState> {
    await requireAdministratorSession(`/dashboard/websites/${websiteId}`);

    try {
        if (isCursorAutomationProvider()) {
            if (!auditRunId) {
                return {
                    ok: false,
                    message: "Select an audit run before generating Cursor analysis.",
                };
            }

            const result = await requestCursorAnalysisForAuditRun(auditRunId);
            revalidatePath("/dashboard");
            revalidatePath("/dashboard/websites");
            revalidatePath(`/dashboard/websites/${websiteId}`);

            if (!result.ok) {
                return {
                    ok: false,
                    message: result.message,
                    missing: result.missing,
                };
            }

            return {
                ok: true,
                status: "triggered",
                analysisRequestId: result.analysisRequestId,
                message: "Cursor analysis triggered. Results will appear when the callback completes.",
            };
        }

        const result = await runAiAnalysis(websiteId);

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/websites");
        revalidatePath(`/dashboard/websites/${websiteId}`);

        if (result.success) {
            return {
                ok: true,
                status: result.status,
                message:
                    result.status === "complete"
                        ? "AI analysis completed."
                        : "AI analysis partially completed. Review the saved results.",
            };
        }

        return {
            ok: false,
            message: result.error.message,
        };
    } catch (error) {
        const rateLimited = await mapRateLimitErrorToActionState(error, {
            policyId: "ai-analysis-run",
            websiteId,
        });
        if (rateLimited) {
            return rateLimited;
        }
        throw error;
    }
}

export async function selectHeroSuggestionAction(
    websiteId: string,
    heroSuggestionId: string,
): Promise<{ ok: boolean; message?: string }> {
    await requireAdministratorSession(`/dashboard/websites/${websiteId}`);

    const updated = await selectHeroSuggestion(heroSuggestionId);

    await createActivityLog({
        websiteId,
        type: "hero-suggestion-selected",
        description: `Hero suggestion "${updated.conceptName}" selected.`,
        actor: "admin",
        metadata: {
            heroSuggestionIds: [updated.id],
            aiSummaryId: updated.aiSummaryId,
        },
    });

    revalidatePath(`/dashboard/websites/${websiteId}`);
    return { ok: true, message: "Hero suggestion selected." };
}

export async function rejectHeroSuggestionAction(
    websiteId: string,
    heroSuggestionId: string,
): Promise<{ ok: boolean; message?: string }> {
    await requireAdministratorSession(`/dashboard/websites/${websiteId}`);

    const updated = await rejectHeroSuggestion(heroSuggestionId);

    await createActivityLog({
        websiteId,
        type: "hero-suggestion-rejected",
        description: `Hero suggestion "${updated.conceptName}" rejected.`,
        actor: "admin",
        metadata: {
            heroSuggestionIds: [updated.id],
            aiSummaryId: updated.aiSummaryId,
        },
    });

    revalidatePath(`/dashboard/websites/${websiteId}`);
    return { ok: true, message: "Hero suggestion rejected." };
}

export async function restoreHeroSuggestionAction(
    websiteId: string,
    heroSuggestionId: string,
): Promise<{ ok: boolean; message?: string }> {
    await requireAdministratorSession(`/dashboard/websites/${websiteId}`);

    const updated = await restoreHeroSuggestion(heroSuggestionId);

    await createActivityLog({
        websiteId,
        type: "hero-suggestion-restored",
        description: `Hero suggestion "${updated.conceptName}" restored to draft.`,
        actor: "admin",
        metadata: {
            heroSuggestionIds: [updated.id],
            aiSummaryId: updated.aiSummaryId,
        },
    });

    revalidatePath(`/dashboard/websites/${websiteId}`);
    return { ok: true, message: "Hero suggestion restored to draft." };
}
