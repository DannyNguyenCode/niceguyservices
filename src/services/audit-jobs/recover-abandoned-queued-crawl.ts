import "server-only";

import mongoose from "mongoose";
import { failCrawl } from "@/src/data/crawls";
import { CrawlData } from "@/src/models/CrawlData";
import { connectToDatabase } from "@/src/lib/mongodb";
import { updateWebsiteCrawlStatus } from "@/src/data/websites";
import { recoverOrphanedActiveAuditRunForWebsite } from "@/src/services/audit-history/recover-orphaned-audit-run";
import {
    AuditFinalizationError,
    finalizeAuditRun,
    updateAuditRunStage,
} from "@/src/services/audit-history/finalize-audit-run";

const ABANDONED_QUEUED_CRAWL_MESSAGE =
    "Crawl was queued but never started. Run the crawl again to continue.";

function toObjectId(websiteId: string): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(websiteId)) {
        throw new Error("Invalid website ID.");
    }
    return new mongoose.Types.ObjectId(websiteId);
}

/**
 * Clears crawl rows left in `queued` with no `startedAt` (serverless / no worker).
 * Allows a new crawl or audit start after a prior request returned early.
 */
export async function recoverAbandonedQueuedCrawlForWebsite(
    websiteId: string,
): Promise<boolean> {
    await connectToDatabase();
    const websiteObjectId = toObjectId(websiteId);

    const abandoned = await CrawlData.findOne({
        websiteId: websiteObjectId,
        status: "queued",
        startedAt: null,
    })
        .select("_id auditRunId")
        .lean<{ _id: unknown; auditRunId?: unknown } | null>();

    if (!abandoned) {
        return false;
    }

    const crawlId = String(abandoned._id);
    await failCrawl(crawlId, ABANDONED_QUEUED_CRAWL_MESSAGE);
    await updateWebsiteCrawlStatus(websiteId, "failed");

    const auditRunId = abandoned.auditRunId ? String(abandoned.auditRunId) : null;
    if (auditRunId) {
        await updateAuditRunStage(auditRunId, "crawl", "failed", "failed");
        try {
            await finalizeAuditRun({ auditRunId });
        } catch (error) {
            if (
                error instanceof AuditFinalizationError &&
                error.code === "AUDIT_HISTORY_ALREADY_FINALIZED"
            ) {
                return true;
            }
            throw error;
        }
    } else {
        await recoverOrphanedActiveAuditRunForWebsite(websiteId);
    }

    return true;
}
