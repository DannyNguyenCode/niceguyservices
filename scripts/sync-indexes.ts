/**
 * Sync MongoDB indexes defined on Mongoose models.
 *
 * Usage:
 *   npx tsx scripts/sync-indexes.ts
 *   npx tsx scripts/sync-indexes.ts --apply
 *
 * Dry-run by default. Never runs on application startup.
 */

import { connectToDatabase } from "../src/lib/mongodb";
import { ActivityLog } from "../src/models/ActivityLog";
import { AiMetadata } from "../src/models/AiMetadata";
import { AiSummary } from "../src/models/AiSummary";
import { AuditRun } from "../src/models/AuditRun";
import { CrawlData } from "../src/models/CrawlData";
import { DemoAsset } from "../src/models/DemoAsset";
import { DemoGeneration } from "../src/models/DemoGeneration";
import { DemoProject } from "../src/models/DemoProject";
import { GoogleMetric } from "../src/models/GoogleMetric";
import { HeroSuggestion } from "../src/models/HeroSuggestion";
import { NiceGuyMetric } from "../src/models/NiceGuyMetric";
import { OutreachEmailDraft } from "../src/models/OutreachEmailDraft";
import { PdfReport } from "../src/models/PdfReport";
import { PublicReport } from "../src/models/PublicReport";
import { Screenshot } from "../src/models/Screenshot";
import { Website } from "../src/models/Website";
import { Administrator } from "../src/models/Administrator";

const apply = process.argv.includes("--apply");

const MODELS = [
    { name: "Website", model: Website },
    { name: "CrawlData", model: CrawlData },
    { name: "Screenshot", model: Screenshot },
    { name: "GoogleMetric", model: GoogleMetric },
    { name: "NiceGuyMetric", model: NiceGuyMetric },
    { name: "AiSummary", model: AiSummary },
    { name: "HeroSuggestion", model: HeroSuggestion },
    { name: "AiMetadata", model: AiMetadata },
    { name: "PublicReport", model: PublicReport },
    { name: "PdfReport", model: PdfReport },
    { name: "OutreachEmailDraft", model: OutreachEmailDraft },
    { name: "DemoProject", model: DemoProject },
    { name: "DemoGeneration", model: DemoGeneration },
    { name: "DemoAsset", model: DemoAsset },
    { name: "ActivityLog", model: ActivityLog },
    { name: "AuditRun", model: AuditRun },
    { name: "Administrator", model: Administrator },
];

async function main() {
    await connectToDatabase();
    let failures = 0;

    for (const entry of MODELS) {
        const collection = entry.model.collection.name;
        try {
            if (apply) {
                const result = await entry.model.syncIndexes();
                console.log(`[apply] ${entry.name} (${collection}):`, result);
            } else {
                const diff = await entry.model.diffIndexes();
                console.log(`[dry-run] ${entry.name} (${collection}):`, diff);
            }
        } catch (error) {
            failures += 1;
            console.error(
                `[error] ${entry.name} (${collection}):`,
                error instanceof Error ? error.message : String(error),
            );
        }
    }

    if (failures > 0) {
        process.exitCode = 1;
    }
}

main()
    .then(() => process.exit(process.exitCode ?? 0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
