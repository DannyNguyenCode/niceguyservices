import "server-only";

import { getActiveAuditJobForWebsite } from "@/src/data/audit-jobs";
import { updateWebsiteCrawlStatus } from "@/src/data/websites";

export async function syncWebsiteAuditSummary(websiteId: string): Promise<void> {
    const activeJob = await getActiveAuditJobForWebsite(websiteId);
    if (!activeJob) {
        return;
    }

    if (
        activeJob.currentStage === "crawl" ||
        activeJob.stages.crawl.status === "processing" ||
        activeJob.stages.crawl.status === "queued"
    ) {
        await updateWebsiteCrawlStatus(websiteId, "processing");
        return;
    }

    if (activeJob.stages.crawl.status === "completed") {
        await updateWebsiteCrawlStatus(websiteId, "complete");
    }
}
