import "server-only";

import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { CrawlData } from "@/src/models/CrawlData";
import { GoogleMetric } from "@/src/models/GoogleMetric";
import { NiceGuyMetric } from "@/src/models/NiceGuyMetric";
import { recoverStaleJobs } from "@/src/services/audit-jobs/stage-job";

export async function recoverLegacyStageJobs(): Promise<{
    crawls: number;
    pagespeed: number;
    niceguy: number;
}> {
    await connectToDatabase();
    const [crawls, pagespeed, niceguy] = await Promise.all([
        recoverStaleJobs({
            model: CrawlData as mongoose.Model<unknown>,
            failureMessage: "Crawl job exceeded the stale processing timeout.",
        }),
        recoverStaleJobs({
            model: GoogleMetric as mongoose.Model<unknown>,
            failureMessage: "PageSpeed job exceeded the stale processing timeout.",
        }),
        recoverStaleJobs({
            model: NiceGuyMetric as mongoose.Model<unknown>,
            failureMessage: "Nice Guy scoring job exceeded the stale processing timeout.",
        }),
    ]);
    return { crawls, pagespeed, niceguy };
}
