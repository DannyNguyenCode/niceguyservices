"use server";

import { revalidatePath } from "next/cache";
import { runWebsiteCrawl } from "@/src/services/run-website-crawl";
import { requireAdministratorSession } from "@/src/services/auth/administrator-session";
import { mapRateLimitErrorToActionState } from "@/src/services/rate-limit/map-rate-limit-action-state";

export type RunCrawlActionState = {
    ok: boolean;
    message?: string;
    rateLimited?: boolean;
    retryAfterSeconds?: number;
    resetAt?: string;
};

export async function runWebsiteCrawlAction(
    websiteId: string,
): Promise<RunCrawlActionState> {
    await requireAdministratorSession(`/dashboard/websites/${websiteId}`);

    try {
        const result = await runWebsiteCrawl(websiteId);

        if (result.ok) {
            revalidatePath("/dashboard");
            revalidatePath("/dashboard/websites");
            revalidatePath(`/dashboard/websites/${websiteId}`);
        }

        return {
            ok: result.ok,
            message: result.message,
        };
    } catch (error) {
        const rateLimited = await mapRateLimitErrorToActionState(error, {
            policyId: "crawl-start",
            websiteId,
        });
        if (rateLimited) {
            return rateLimited;
        }
        throw error;
    }
}
