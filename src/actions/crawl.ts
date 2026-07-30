"use server";

import { revalidatePath } from "next/cache";
import { runWebsiteCrawl } from "@/src/services/run-website-crawl";
import { mapRateLimitErrorToActionState } from "@/src/services/rate-limit/map-rate-limit-action-state";

export type RunCrawlActionState = {
    ok: boolean;
    message?: string;
    rateLimited?: boolean;
    retryAfterSeconds?: number;
    resetAt?: string;
};

// TODO: Require admin authentication before allowing crawl triggers in production.
export async function runWebsiteCrawlAction(
    websiteId: string,
): Promise<RunCrawlActionState> {
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
