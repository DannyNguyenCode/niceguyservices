/**
 * Legacy audit-history migration.
 *
 * Usage:
 *   npx tsx scripts/migrate-audit-history.ts
 *   npx tsx scripts/migrate-audit-history.ts --apply
 *
 * Dry-run by default. Never runs on application startup.
 */

import mongoose from "mongoose";
import { connectToDatabase } from "../src/lib/mongodb";
import { CrawlData } from "../src/models/CrawlData";
import { Website } from "../src/models/Website";
import { AuditRun } from "../src/models/AuditRun";
import { AUDIT_RUN_SCHEMA_VERSION } from "../src/services/audit-history/constants";

const apply = process.argv.includes("--apply");

async function main() {
    await connectToDatabase();

    const websites = await Website.find({ deletedAt: null }).select("_id originalUrl normalizedDomain businessName").lean();
    let createdRuns = 0;
    let linkedRecords = 0;
    const ambiguous: string[] = [];

    for (const website of websites) {
        const websiteId = String(website._id);
        const existingRuns = await AuditRun.countDocuments({ websiteId: website._id });
        if (existingRuns > 0) {
            continue;
        }

        const crawls = await CrawlData.find({ websiteId: website._id })
            .sort({ createdAt: 1 })
            .select("_id auditRunId createdAt status pagesCrawled")
            .lean();

        if (crawls.length === 0) {
            continue;
        }

        const grouped = crawls.filter((crawl) => !crawl.auditRunId);
        if (grouped.length === 0) {
            continue;
        }

        if (grouped.length > 1) {
            ambiguous.push(websiteId);
        }

        const auditNumber = 1;
        const crawlIds = grouped.map((crawl) => crawl._id);

        console.log(
            `${apply ? "APPLY" : "DRY-RUN"}: website ${websiteId} → legacy audit with ${crawlIds.length} crawl record(s)`,
        );

        if (!apply) {
            createdRuns += 1;
            linkedRecords += crawlIds.length;
            continue;
        }

        const auditRun = await AuditRun.create({
            websiteId: website._id,
            auditNumber,
            status: "partial",
            trigger: { type: "migration", actorId: null, actorName: null },
            source: {
                websiteUrl: website.originalUrl,
                normalizedUrl: website.normalizedDomain,
                businessName: website.businessName || null,
                domain: website.normalizedDomain,
            },
            configuration: {
                includeScreenshots: true,
                includePageSpeed: true,
                includeNiceGuyMetrics: true,
                includeAiAnalysis: true,
                pageSpeedStrategies: ["mobile", "desktop"],
            },
            versions: { auditSchemaVersion: AUDIT_RUN_SCHEMA_VERSION },
            references: { crawlDataIds: crawlIds },
            completion: {
                crawl: grouped.some((crawl) => crawl.status === "complete") ? "complete" : "partial",
                screenshots: "skipped",
                pageSpeed: "skipped",
                metrics: "skipped",
                ai: "skipped",
            },
            migrationWarning:
                "This audit was reconstructed from legacy records and may not represent one exact workflow execution.",
            startedAt: grouped[0]?.createdAt ?? null,
            completedAt: grouped[grouped.length - 1]?.createdAt ?? null,
            isCurrent: true,
        });

        await CrawlData.updateMany(
            { _id: { $in: crawlIds } },
            { $set: { auditRunId: auditRun._id } },
        );

        await Website.findByIdAndUpdate(website._id, {
            $set: {
                currentAuditRunId: auditRun._id,
                latestCompletedAuditRunId: auditRun._id,
                nextAuditNumber: 2,
                auditCount: 1,
            },
        });

        createdRuns += 1;
        linkedRecords += crawlIds.length;
    }

    console.log(`Websites scanned: ${websites.length}`);
    console.log(`Audit runs ${apply ? "created" : "planned"}: ${createdRuns}`);
    console.log(`Records ${apply ? "linked" : "to link"}: ${linkedRecords}`);
    console.log(`Ambiguous websites: ${ambiguous.length}`);
    if (ambiguous.length) {
        console.log(ambiguous.join(", "));
    }

    await mongoose.disconnect();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
