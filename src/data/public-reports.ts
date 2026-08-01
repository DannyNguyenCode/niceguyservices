import "server-only";

import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { PUBLIC_REPORT_VERSION } from "@/src/lib/public-report-config";
import { PublicReport } from "@/src/models/PublicReport";
import type {
    PublicReportBranding,
    PublicReportSettings,
    PublicReportSourceSnapshot,
    PublicReportStatus,
    SerializablePublicReport,
} from "@/src/types/public-report";

function assertObjectId(id: string, message = "Invalid ID."): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(message);
    }
    return new mongoose.Types.ObjectId(id);
}

function toSerializable(doc: Record<string, unknown>): SerializablePublicReport {
    return {
        id: String(doc._id),
        websiteId: String(doc.websiteId),
        crawlId: String(doc.crawlId),
        niceGuyMetricId: String(doc.niceGuyMetricId),
        aiSummaryId: String(doc.aiSummaryId),
        auditRunId: doc.auditRunId ? String(doc.auditRunId) : null,
        sourceAuditRunId: doc.sourceAuditRunId ? String(doc.sourceAuditRunId) : null,
        sourceAuditNumber:
            doc.sourceAuditNumber === null || doc.sourceAuditNumber === undefined
                ? null
                : Number(doc.sourceAuditNumber),
        heroSuggestionIds: ((doc.heroSuggestionIds as unknown[]) ?? []).map(String),
        status: doc.status as PublicReportStatus,
        reportVersion: String(doc.reportVersion ?? PUBLIC_REPORT_VERSION),
        revisionNumber: Number(doc.revisionNumber ?? 1),
        tokenHash: doc.tokenHash ? String(doc.tokenHash) : null,
        tokenPrefix: doc.tokenPrefix ? String(doc.tokenPrefix) : null,
        publicPath: doc.publicPath ? String(doc.publicPath) : null,
        title: String(doc.title ?? ""),
        subtitle: doc.subtitle ? String(doc.subtitle) : null,
        settings: doc.settings as PublicReportSettings,
        branding: doc.branding as PublicReportBranding,
        sourceSnapshot: doc.sourceSnapshot as PublicReportSourceSnapshot,
        publishedAt: doc.publishedAt ? new Date(doc.publishedAt as Date).toISOString() : null,
        unpublishedAt: doc.unpublishedAt
            ? new Date(doc.unpublishedAt as Date).toISOString()
            : null,
        archivedAt: doc.archivedAt ? new Date(doc.archivedAt as Date).toISOString() : null,
        expiresAt: doc.expiresAt ? new Date(doc.expiresAt as Date).toISOString() : null,
        viewCount: Number(doc.viewCount ?? 0),
        uniqueViewEstimate: Number(doc.uniqueViewEstimate ?? 0),
        lastViewedAt: doc.lastViewedAt ? new Date(doc.lastViewedAt as Date).toISOString() : null,
        createdBy: doc.createdBy ? String(doc.createdBy) : null,
        createdAt: new Date(doc.createdAt as Date).toISOString(),
        updatedAt: new Date(doc.updatedAt as Date).toISOString(),
    };
}

export async function getNextRevisionNumber(websiteId: string): Promise<number> {
    await connectToDatabase();
    const latest = await PublicReport.findOne({ websiteId: assertObjectId(websiteId) })
        .sort({ revisionNumber: -1 })
        .select("revisionNumber")
        .lean();
    const current = Number(latest?.revisionNumber ?? 0);
    return Number.isFinite(current) ? current + 1 : 1;
}

export async function createPublicReportDraft(input: {
    websiteId: string;
    crawlId: string;
    niceGuyMetricId: string;
    aiSummaryId: string;
    auditRunId?: string | null;
    sourceAuditRunId?: string | null;
    sourceAuditNumber?: number | null;
    heroSuggestionIds: string[];
    title: string;
    subtitle?: string | null;
    settings: PublicReportSettings;
    branding: PublicReportBranding;
    sourceSnapshot: PublicReportSourceSnapshot;
    revisionNumber: number;
    createdBy?: string | null;
}): Promise<SerializablePublicReport> {
    await connectToDatabase();

    const created = await PublicReport.create({
        websiteId: assertObjectId(input.websiteId),
        crawlId: assertObjectId(input.crawlId),
        niceGuyMetricId: assertObjectId(input.niceGuyMetricId),
        aiSummaryId: assertObjectId(input.aiSummaryId),
        auditRunId: input.auditRunId ? assertObjectId(input.auditRunId) : null,
        sourceAuditRunId: input.sourceAuditRunId
            ? assertObjectId(input.sourceAuditRunId)
            : input.auditRunId
              ? assertObjectId(input.auditRunId)
              : null,
        sourceAuditNumber: input.sourceAuditNumber ?? null,
        heroSuggestionIds: input.heroSuggestionIds.map((id) => assertObjectId(id)),
        status: "draft",
        reportVersion: PUBLIC_REPORT_VERSION,
        revisionNumber: input.revisionNumber,
        title: input.title,
        subtitle: input.subtitle ?? null,
        settings: input.settings,
        branding: input.branding,
        sourceSnapshot: input.sourceSnapshot,
        createdBy: input.createdBy ?? "admin",
    });

    return toSerializable(created.toObject() as Record<string, unknown>);
}

export async function getPublicReportDraftForAuditRun(
    auditRunId: string,
): Promise<SerializablePublicReport | null> {
    await connectToDatabase();
    const auditRunObjectId = assertObjectId(auditRunId);
    const doc = await PublicReport.findOne({
        status: "draft",
        $or: [{ sourceAuditRunId: auditRunObjectId }, { auditRunId: auditRunObjectId }],
    })
        .sort({ createdAt: -1 })
        .lean();
    return doc ? toSerializable(doc as Record<string, unknown>) : null;
}

export async function getPublicReportById(id: string): Promise<SerializablePublicReport | null> {
    await connectToDatabase();
    try {
        const doc = await PublicReport.findById(assertObjectId(id)).lean();
        if (!doc) return null;
        return toSerializable(doc as Record<string, unknown>);
    } catch {
        return null;
    }
}

export async function getPublicReportByTokenHash(
    tokenHash: string,
): Promise<SerializablePublicReport | null> {
    await connectToDatabase();
    const doc = await PublicReport.findOne({ tokenHash }).lean();
    if (!doc) return null;
    return toSerializable(doc as Record<string, unknown>);
}

export async function getLatestPublicReportForWebsite(
    websiteId: string,
): Promise<SerializablePublicReport | null> {
    await connectToDatabase();
    try {
        const doc = await PublicReport.findOne({ websiteId: assertObjectId(websiteId) })
            .sort({ revisionNumber: -1 })
            .lean();
        if (!doc) return null;
        return toSerializable(doc as Record<string, unknown>);
    } catch {
        return null;
    }
}

export async function getPublishedPublicReportForWebsite(
    websiteId: string,
): Promise<SerializablePublicReport | null> {
    await connectToDatabase();
    try {
        const doc = await PublicReport.findOne({
            websiteId: assertObjectId(websiteId),
            status: "published",
        })
            .sort({ revisionNumber: -1 })
            .lean();
        if (!doc) return null;
        return toSerializable(doc as Record<string, unknown>);
    } catch {
        return null;
    }
}

export async function getPublicReportsForWebsite(
    websiteId: string,
    limit = 20,
): Promise<SerializablePublicReport[]> {
    await connectToDatabase();
    try {
        const docs = await PublicReport.find({ websiteId: assertObjectId(websiteId) })
            .sort({ revisionNumber: -1 })
            .limit(limit)
            .lean();
        return docs.map((doc) => toSerializable(doc as Record<string, unknown>));
    } catch {
        return [];
    }
}

export async function updatePublicReportDraft(
    reportId: string,
    input: Partial<{
        title: string;
        subtitle: string | null;
        settings: PublicReportSettings;
        branding: PublicReportBranding;
        sourceSnapshot: PublicReportSourceSnapshot;
        heroSuggestionIds: string[];
        expiresAt: string | null;
    }>,
): Promise<SerializablePublicReport> {
    await connectToDatabase();
    const update: Record<string, unknown> = {};
    if (input.title !== undefined) update.title = input.title;
    if (input.subtitle !== undefined) update.subtitle = input.subtitle;
    if (input.settings !== undefined) update.settings = input.settings;
    if (input.branding !== undefined) update.branding = input.branding;
    if (input.sourceSnapshot !== undefined) update.sourceSnapshot = input.sourceSnapshot;
    if (input.heroSuggestionIds !== undefined) {
        update.heroSuggestionIds = input.heroSuggestionIds.map((id) => assertObjectId(id));
    }
    if (input.expiresAt !== undefined) {
        update.expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
    }

    const updated = await PublicReport.findOneAndUpdate(
        { _id: assertObjectId(reportId), status: "draft" },
        { $set: update },
        { new: true, runValidators: true },
    ).lean();

    if (!updated) {
        throw new Error("Draft report not found or cannot be edited.");
    }

    return toSerializable(updated as Record<string, unknown>);
}

export async function publishPublicReportRecord(
    reportId: string,
    input: {
        tokenHash: string;
        tokenPrefix: string;
        publicPath: string;
    },
): Promise<SerializablePublicReport> {
    await connectToDatabase();
    const updated = await PublicReport.findOneAndUpdate(
        { _id: assertObjectId(reportId), status: { $in: ["draft", "unpublished"] } },
        {
            $set: {
                status: "published",
                tokenHash: input.tokenHash,
                tokenPrefix: input.tokenPrefix,
                publicPath: input.publicPath,
                publishedAt: new Date(),
                unpublishedAt: null,
                archivedAt: null,
            },
        },
        { new: true, runValidators: true },
    ).lean();

    if (!updated) {
        throw new Error("Report cannot be published.");
    }

    return toSerializable(updated as Record<string, unknown>);
}

export async function unpublishOtherPublishedReports(
    websiteId: string,
    exceptReportId: string,
): Promise<number> {
    await connectToDatabase();
    const result = await PublicReport.updateMany(
        {
            websiteId: assertObjectId(websiteId),
            status: "published",
            _id: { $ne: assertObjectId(exceptReportId) },
        },
        {
            $set: {
                status: "unpublished",
                unpublishedAt: new Date(),
            },
        },
    );
    return result.modifiedCount;
}

export async function unpublishPublicReportRecord(
    reportId: string,
): Promise<SerializablePublicReport> {
    await connectToDatabase();
    const updated = await PublicReport.findOneAndUpdate(
        { _id: assertObjectId(reportId), status: "published" },
        {
            $set: {
                status: "unpublished",
                unpublishedAt: new Date(),
            },
        },
        { new: true, runValidators: true },
    ).lean();

    if (!updated) {
        throw new Error("Published report not found.");
    }

    return toSerializable(updated as Record<string, unknown>);
}

export async function archivePublicReportRecord(
    reportId: string,
): Promise<SerializablePublicReport> {
    await connectToDatabase();
    const updated = await PublicReport.findOneAndUpdate(
        { _id: assertObjectId(reportId), status: { $ne: "archived" } },
        {
            $set: {
                status: "archived",
                archivedAt: new Date(),
            },
        },
        { new: true, runValidators: true },
    ).lean();

    if (!updated) {
        throw new Error("Report not found.");
    }

    return toSerializable(updated as Record<string, unknown>);
}

export async function rotatePublicReportTokenRecord(
    reportId: string,
    input: {
        tokenHash: string;
        tokenPrefix: string;
        publicPath: string;
    },
): Promise<SerializablePublicReport> {
    await connectToDatabase();
    const updated = await PublicReport.findOneAndUpdate(
        { _id: assertObjectId(reportId), status: "published" },
        {
            $set: {
                tokenHash: input.tokenHash,
                tokenPrefix: input.tokenPrefix,
                publicPath: input.publicPath,
            },
        },
        { new: true, runValidators: true },
    ).lean();

    if (!updated) {
        throw new Error("Published report not found.");
    }

    return toSerializable(updated as Record<string, unknown>);
}

export async function incrementPublicReportView(reportId: string): Promise<void> {
    await connectToDatabase();
    await PublicReport.updateOne(
        { _id: assertObjectId(reportId), status: "published" },
        {
            $inc: { viewCount: 1 },
            $set: { lastViewedAt: new Date() },
        },
    );
}
