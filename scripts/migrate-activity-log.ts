#!/usr/bin/env node
/**
 * Dry-run migration helper for legacy activity_log documents.
 * Usage:
 *   npx tsx scripts/migrate-activity-log.ts
 *   npx tsx scripts/migrate-activity-log.ts --apply
 */

import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { ActivityLog } from "@/src/models/ActivityLog";
import {
    getActivityCategoryForEvent,
    getActivitySeverityForEvent,
} from "@/src/constants/activity-events";
import { ACTIVITY_LOG_TYPE_LABELS } from "@/src/schemas/enums";

const apply = process.argv.includes("--apply");

async function main() {
    await connectToDatabase();

    const legacyDocs = await ActivityLog.find({
        $or: [
            { title: { $exists: false } },
            { category: { $exists: false } },
            { severity: { $exists: false } },
            { occurredAt: { $exists: false } },
        ],
    }).lean();

    console.log(`Found ${legacyDocs.length} legacy activity records.`);

    if (!apply) {
        console.log("Dry run only. Re-run with --apply to update records.");
        await mongoose.disconnect();
        return;
    }

    let updated = 0;
    for (const doc of legacyDocs) {
        const record = doc as Record<string, unknown>;
        const eventType = String(record.type);
        await ActivityLog.updateOne(
            { _id: new mongoose.Types.ObjectId(String(record._id)) },
            {
                $set: {
                    title:
                        typeof record.title === "string" && record.title.trim()
                            ? record.title
                            : (ACTIVITY_LOG_TYPE_LABELS[
                                  eventType as keyof typeof ACTIVITY_LOG_TYPE_LABELS
                              ] ?? eventType),
                    category: record.category ?? getActivityCategoryForEvent(eventType),
                    severity: record.severity ?? getActivitySeverityForEvent(eventType),
                    occurredAt: record.occurredAt ?? record.createdAt ?? new Date(),
                    actor:
                        typeof record.actor === "string"
                            ? {
                                  type: record.actor === "admin" ? "administrator" : record.actor,
                                  id: null,
                                  name: null,
                              }
                            : record.actor,
                },
            },
        );
        updated += 1;
    }

    console.log(`Updated ${updated} activity records.`);
    await mongoose.disconnect();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
