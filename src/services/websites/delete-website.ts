import "server-only";

import mongoose from "mongoose";
import { assertObjectId } from "@/src/lib/assert-object-id";
import { getCloudinaryAuditFolderPrefix, isCloudinaryConfigured } from "@/src/lib/cloudinary-config";
import { connectToDatabase } from "@/src/lib/mongodb";
import { ActivityLog } from "@/src/models/ActivityLog";
import { AiMetadata } from "@/src/models/AiMetadata";
import { AiSummary } from "@/src/models/AiSummary";
import { AuditJob } from "@/src/models/AuditJob";
import { AuditRun } from "@/src/models/AuditRun";
import { CrawlData } from "@/src/models/CrawlData";
import { Demo } from "@/src/models/Demo";
import { DemoAsset } from "@/src/models/DemoAsset";
import { DemoGeneration } from "@/src/models/DemoGeneration";
import { DemoProject } from "@/src/models/DemoProject";
import { GoogleMetric } from "@/src/models/GoogleMetric";
import { HeroSuggestion } from "@/src/models/HeroSuggestion";
import { NiceGuyMetric } from "@/src/models/NiceGuyMetric";
import { OutreachEmail } from "@/src/models/OutreachEmail";
import { OutreachEmailDraft } from "@/src/models/OutreachEmailDraft";
import { Pdf } from "@/src/models/Pdf";
import { PdfReport } from "@/src/models/PdfReport";
import { PublicReport } from "@/src/models/PublicReport";
import { Screenshot } from "@/src/models/Screenshot";
import { Website } from "@/src/models/Website";
import {
    deleteCloudinaryAssetBestEffort,
    deleteCloudinaryAssetsByPrefixBestEffort,
} from "@/src/services/cloudinary/delete-cloudinary-assets";

export type WebsiteDeletionCounts = Record<string, number>;

function toWebsiteObjectId(websiteId: string): mongoose.Types.ObjectId {
    assertObjectId(websiteId, "website ID");
    return new mongoose.Types.ObjectId(websiteId);
}

export function buildWebsiteAuditCloudinaryPrefix(websiteId: string): string {
    const prefix = getCloudinaryAuditFolderPrefix().trim().replace(/\/+$/g, "");
    return `${prefix}/${websiteId}`;
}

async function deleteWebsiteCloudinaryAssets(websiteId: string): Promise<void> {
    if (!isCloudinaryConfigured()) {
        return;
    }

    const websiteObjectId = toWebsiteObjectId(websiteId);

    const [screenshots, pdfReports, demoProjects] = await Promise.all([
        Screenshot.find({ websiteId: websiteObjectId })
            .select("cloudinaryPublicId storageType")
            .lean<Array<{ cloudinaryPublicId?: string; storageType?: string }>>(),
        PdfReport.find({ websiteId: websiteObjectId })
            .select("file.publicId file.resourceType")
            .lean<Array<{ file?: { publicId?: string | null; resourceType?: string | null } }>>(),
        DemoProject.find({ websiteId: websiteObjectId }).select("_id").lean<Array<{ _id: mongoose.Types.ObjectId }>>(),
    ]);

    await deleteCloudinaryAssetsByPrefixBestEffort(buildWebsiteAuditCloudinaryPrefix(websiteId), "image");

    const cloudinaryPublicIds = new Set<string>();
    for (const screenshot of screenshots) {
        if (screenshot.storageType === "cloudinary" && screenshot.cloudinaryPublicId?.trim()) {
            cloudinaryPublicIds.add(screenshot.cloudinaryPublicId.trim());
        }
    }

    for (const publicId of cloudinaryPublicIds) {
        await deleteCloudinaryAssetBestEffort(publicId, "image");
    }

    for (const report of pdfReports) {
        const publicId = report.file?.publicId?.trim();
        if (!publicId) continue;
        const resourceType =
            report.file?.resourceType === "raw" ||
            report.file?.resourceType === "video" ||
            report.file?.resourceType === "image"
                ? report.file.resourceType
                : "raw";
        await deleteCloudinaryAssetBestEffort(publicId, resourceType);
    }

    if (demoProjects.length > 0) {
        const demoProjectIds = demoProjects.map((project) => project._id);
        const demoAssets = await DemoAsset.find({
            demoProjectId: { $in: demoProjectIds },
        })
            .select("publicId provider")
            .lean<Array<{ publicId?: string | null; provider?: string | null }>>();

        for (const asset of demoAssets) {
            if (asset.provider !== "cloudinary") continue;
            await deleteCloudinaryAssetBestEffort(asset.publicId, "image");
        }
    }
}

async function deleteWebsiteMongoRecords(websiteId: string): Promise<WebsiteDeletionCounts> {
    const websiteObjectId = toWebsiteObjectId(websiteId);
    const counts: WebsiteDeletionCounts = {};

    const demoProjectIds = await DemoProject.find({ websiteId: websiteObjectId })
        .distinct("_id")
        .lean<mongoose.Types.ObjectId[]>();

    const deleteSteps: Array<[string, () => Promise<number>]> = [
        [
            "demoAssets",
            async () =>
                (await DemoAsset.deleteMany({ demoProjectId: { $in: demoProjectIds } }))
                    .deletedCount ?? 0,
        ],
        [
            "demoGenerations",
            async () =>
                (await DemoGeneration.deleteMany({ websiteId: websiteObjectId })).deletedCount ?? 0,
        ],
        [
            "demoProjects",
            async () =>
                (await DemoProject.deleteMany({ websiteId: websiteObjectId })).deletedCount ?? 0,
        ],
        ["demos", async () => (await Demo.deleteMany({ websiteId: websiteObjectId })).deletedCount ?? 0],
        [
            "pdfReports",
            async () =>
                (await PdfReport.deleteMany({ websiteId: websiteObjectId })).deletedCount ?? 0,
        ],
        [
            "publicReports",
            async () =>
                (await PublicReport.deleteMany({ websiteId: websiteObjectId })).deletedCount ?? 0,
        ],
        [
            "outreachEmailDrafts",
            async () =>
                (await OutreachEmailDraft.deleteMany({ websiteId: websiteObjectId })).deletedCount ??
                0,
        ],
        [
            "outreachEmails",
            async () =>
                (await OutreachEmail.deleteMany({ websiteId: websiteObjectId })).deletedCount ?? 0,
        ],
        ["pdfs", async () => (await Pdf.deleteMany({ websiteId: websiteObjectId })).deletedCount ?? 0],
        [
            "screenshots",
            async () =>
                (await Screenshot.deleteMany({ websiteId: websiteObjectId })).deletedCount ?? 0,
        ],
        [
            "crawlData",
            async () =>
                (await CrawlData.deleteMany({ websiteId: websiteObjectId })).deletedCount ?? 0,
        ],
        [
            "googleMetrics",
            async () =>
                (await GoogleMetric.deleteMany({ websiteId: websiteObjectId })).deletedCount ?? 0,
        ],
        [
            "niceGuyMetrics",
            async () =>
                (await NiceGuyMetric.deleteMany({ websiteId: websiteObjectId })).deletedCount ?? 0,
        ],
        [
            "aiSummaries",
            async () =>
                (await AiSummary.deleteMany({ websiteId: websiteObjectId })).deletedCount ?? 0,
        ],
        [
            "aiMetadata",
            async () =>
                (await AiMetadata.deleteMany({ websiteId: websiteObjectId })).deletedCount ?? 0,
        ],
        [
            "heroSuggestions",
            async () =>
                (await HeroSuggestion.deleteMany({ websiteId: websiteObjectId })).deletedCount ?? 0,
        ],
        [
            "auditJobs",
            async () =>
                (await AuditJob.deleteMany({ websiteId: websiteObjectId })).deletedCount ?? 0,
        ],
        [
            "auditRuns",
            async () =>
                (await AuditRun.deleteMany({ websiteId: websiteObjectId })).deletedCount ?? 0,
        ],
        [
            "activityLogs",
            async () =>
                (await ActivityLog.deleteMany({ websiteId: websiteObjectId })).deletedCount ?? 0,
        ],
        [
            "website",
            async () => (await Website.deleteOne({ _id: websiteObjectId })).deletedCount ?? 0,
        ],
    ];

    for (const [key, deleteFn] of deleteSteps) {
        counts[key] = await deleteFn();
    }

    return counts;
}

export async function deleteWebsiteAndRelatedData(
    websiteId: string,
): Promise<WebsiteDeletionCounts> {
    await connectToDatabase();

    const websiteObjectId = toWebsiteObjectId(websiteId);
    const websiteExists = await Website.exists({ _id: websiteObjectId });
    if (!websiteExists) {
        throw new Error("WEBSITE_NOT_FOUND");
    }

    await deleteWebsiteCloudinaryAssets(websiteId);
    return deleteWebsiteMongoRecords(websiteId);
}
