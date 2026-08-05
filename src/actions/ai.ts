"use server";



import { revalidatePath } from "next/cache";

import {

    rejectHeroSuggestion,

    restoreHeroSuggestion,

    selectHeroSuggestion,

} from "@/src/data/hero-suggestions";

import { createActivityLog } from "@/src/data/activity-logs";

import { requireAdministratorSession } from "@/src/services/auth/administrator-session";

import { mapRateLimitErrorToActionState } from "@/src/services/rate-limit/map-rate-limit-action-state";

import {

    getCursorConfigurationStatus,

    isAnalysisProviderEnabled,

} from "@/src/services/cursor-analysis/config";

import { requestCursorAnalysisForAuditRun } from "@/src/services/cursor-analysis/request-cursor-analysis";



export type RunAiAnalysisActionState = {

    ok: boolean;

    message?: string;

    status?: "triggered" | "queued";

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

        if (!auditRunId) {

            return {

                ok: false,

                message: "Select an audit run before generating analysis.",

            };

        }



        if (!isAnalysisProviderEnabled()) {

            const cursorStatus = getCursorConfigurationStatus();

            return {

                ok: false,

                message: `Cursor analysis is not fully configured on this deployment. Missing: ${cursorStatus.missing.join(", ")}. Add these in Vercel for Preview and Production, then redeploy.`,

                missing: cursorStatus.missing,

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

            message: "Analysis triggered. Results will appear when the callback completes.",

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

