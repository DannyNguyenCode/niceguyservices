import "server-only";

import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { normalizeWebsiteUrl } from "@/src/lib/normalize-domain";
import type {
    CreateWebsiteInput,
    UpdateWebsiteInput,
} from "@/src/lib/website-validation";
import { Website, type WebsiteLean } from "@/src/models/Website";
import { ACTIVITY_EVENTS } from "@/src/constants/activity-events";
import type { ActivityActorType } from "@/src/constants/activity-events";
import { createActivityEvent } from "@/src/services/activity/create-activity-event";

export class WebsiteDataError extends Error {
    readonly code:
        | "validation"
        | "duplicate"
        | "not-found"
        | "invalid-id"
        | "database";

    constructor(
        code: WebsiteDataError["code"],
        message: string,
        options?: { cause?: unknown },
    ) {
        super(message, options);
        this.name = "WebsiteDataError";
        this.code = code;
    }
}

export type SerializableWebsite = {
    id: string;
    businessName: string;
    originalUrl: string;
    normalizedDomain: string;
    businessEmail: string;
    industry: string;
    location: string;
    source: WebsiteLean["source"];
    status: WebsiteLean["status"];
    auditStatus: WebsiteLean["auditStatus"];
    crawlStatus: WebsiteLean["crawlStatus"];
    pageSpeedStatus: WebsiteLean["pageSpeedStatus"];
    latestPageSpeedRunAt: string | null;
    niceGuyStatus: WebsiteLean["niceGuyStatus"];
    latestNiceGuyRunAt: string | null;
    aiAnalysisStatus: WebsiteLean["aiAnalysisStatus"];
    latestAiAnalysisRunAt: string | null;
    demoStatus: WebsiteLean["demoStatus"];
    outreachStatus: WebsiteLean["outreachStatus"];
    publicReportStatus: WebsiteLean["publicReportStatus"];
    latestPublicReportAt: string | null;
    latestPublishedReportAt: string | null;
    pdfReportStatus: WebsiteLean["pdfReportStatus"];
    latestPdfReportAt: string | null;
    outreachDraftStatus: WebsiteLean["outreachDraftStatus"];
    latestOutreachDraftAt: string | null;
    demoProjectStatus: WebsiteLean["demoProjectStatus"];
    latestDemoAt: string | null;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
};

export type WebsiteDashboardCounts = {
    totalActiveWebsites: number;
    auditsCompleted: number;
    demosPublished: number;
    outreachEmailsSent: number;
    pendingReviews: number;
};

function isDuplicateKeyError(error: unknown): boolean {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: number }).code === 11000
    );
}

function assertObjectId(id: string): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new WebsiteDataError("invalid-id", "Website not found.");
    }
    return new mongoose.Types.ObjectId(id);
}

function toIsoString(value: unknown): string | null {
    if (value == null || value === "") {
        return null;
    }

    const date = value instanceof Date ? value : new Date(value as string | number);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    try {
        return date.toISOString();
    } catch {
        return null;
    }
}

function toRequiredIsoString(value: unknown): string {
    return toIsoString(value) ?? new Date(0).toISOString();
}

function toSerializable(doc: WebsiteLean): SerializableWebsite {
    return {
        id: String(doc._id),
        businessName: doc.businessName || "",
        originalUrl: doc.originalUrl,
        normalizedDomain: doc.normalizedDomain,
        businessEmail: doc.businessEmail || "",
        industry: doc.industry || "",
        location: doc.location || "",
        source: doc.source,
        status: doc.status,
        auditStatus: doc.auditStatus,
        crawlStatus: doc.crawlStatus ?? "not-started",
        pageSpeedStatus: doc.pageSpeedStatus ?? "not-started",
        latestPageSpeedRunAt: toIsoString(doc.latestPageSpeedRunAt),
        niceGuyStatus: doc.niceGuyStatus ?? "not-started",
        latestNiceGuyRunAt: toIsoString(doc.latestNiceGuyRunAt),
        aiAnalysisStatus: doc.aiAnalysisStatus ?? "not-started",
        latestAiAnalysisRunAt: toIsoString(doc.latestAiAnalysisRunAt),
        demoStatus: doc.demoStatus,
        outreachStatus: doc.outreachStatus,
        publicReportStatus: doc.publicReportStatus ?? "not-created",
        latestPublicReportAt: toIsoString(doc.latestPublicReportAt),
        latestPublishedReportAt: toIsoString(doc.latestPublishedReportAt),
        pdfReportStatus: doc.pdfReportStatus ?? "not-generated",
        latestPdfReportAt: toIsoString(doc.latestPdfReportAt),
        outreachDraftStatus: doc.outreachDraftStatus ?? "not-generated",
        latestOutreachDraftAt: toIsoString(doc.latestOutreachDraftAt),
        demoProjectStatus: doc.demoProjectStatus ?? "not-created",
        latestDemoAt: toIsoString(doc.latestDemoAt),
        deletedAt: toIsoString(doc.deletedAt),
        createdAt: toRequiredIsoString(doc.createdAt),
        updatedAt: toRequiredIsoString(doc.updatedAt),
    };
}

const activeFilter = { deletedAt: null };

async function findActiveByDomain(
    normalizedDomain: string,
    excludeId?: string,
): Promise<boolean> {
    const query: Record<string, unknown> = {
        ...activeFilter,
        normalizedDomain,
    };
    if (excludeId) {
        query._id = { $ne: assertObjectId(excludeId) };
    }
    const existing = await Website.findOne(query).select("_id").lean();
    return Boolean(existing);
}

export async function getWebsiteByNormalizedDomain(
    normalizedDomain: string,
): Promise<SerializableWebsite | null> {
    await connectToDatabase();
    const doc = await Website.findOne({
        ...activeFilter,
        normalizedDomain: normalizedDomain.trim().toLowerCase(),
    }).lean<WebsiteLean | null>();
    return doc ? toSerializable(doc) : null;
}

export type CreateWebsiteOptions = {
    activityActor?: { type: ActivityActorType };
    activityTitle?: string;
    activityDescription?: string;
};

export async function createWebsite(
    input: CreateWebsiteInput,
    options?: CreateWebsiteOptions,
): Promise<SerializableWebsite> {
    await connectToDatabase();

    const { normalizedDomain } = normalizeWebsiteUrl(input.websiteUrl);

    if (await findActiveByDomain(normalizedDomain)) {
        throw new WebsiteDataError(
            "duplicate",
            `A website for ${normalizedDomain} already exists.`,
        );
    }

    try {
        const created = await Website.create({
            businessName: input.businessName ?? "",
            originalUrl: input.websiteUrl.trim(),
            normalizedDomain,
            businessEmail: input.businessEmail ?? "",
            industry: input.industry ?? "",
            location: input.location ?? "",
            source: input.source,
            status: "new",
            auditStatus: "not-started",
            crawlStatus: "not-started",
            pageSpeedStatus: "not-started",
            latestPageSpeedRunAt: null,
            demoStatus: "none",
            outreachStatus: "not-contacted",
            publicReportStatus: "not-created",
            latestPublicReportAt: null,
            latestPublishedReportAt: null,
            deletedAt: null,
        });

        const website = toSerializable({
            ...created.toObject(),
            _id: String(created._id),
        } as WebsiteLean);

        await createActivityEvent({
            websiteId: website.id,
            eventType: ACTIVITY_EVENTS.WEBSITE_CREATED,
            title: options?.activityTitle ?? "Website created",
            description:
                options?.activityDescription ??
                `Website record created for ${website.normalizedDomain}.`,
            actor: options?.activityActor ?? { type: "administrator" },
            metadata: {
                normalizedDomain: website.normalizedDomain,
                source: website.source,
            },
        });

        return website;
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            throw new WebsiteDataError(
                "duplicate",
                `A website for ${normalizedDomain} already exists.`,
                { cause: error },
            );
        }
        throw new WebsiteDataError(
            "database",
            "Unable to create the website right now. Please try again.",
            { cause: error },
        );
    }
}

export async function getWebsites(): Promise<SerializableWebsite[]> {
    await connectToDatabase();

    const docs = await Website.find(activeFilter)
        .sort({ updatedAt: -1 })
        .lean<WebsiteLean[]>();

    return docs.map((doc) =>
        toSerializable({
            ...doc,
            _id: String(doc._id),
        }),
    );
}

export async function getWebsiteById(
    id: string,
): Promise<SerializableWebsite | null> {
    await connectToDatabase();

    let objectId: mongoose.Types.ObjectId;
    try {
        objectId = assertObjectId(id);
    } catch {
        return null;
    }

    const doc = await Website.findOne({
        _id: objectId,
        ...activeFilter,
    }).lean<WebsiteLean | null>();

    if (!doc) return null;

    return toSerializable({
        ...doc,
        _id: String(doc._id),
    });
}

export async function updateWebsite(
    id: string,
    input: UpdateWebsiteInput,
): Promise<SerializableWebsite> {
    await connectToDatabase();

    const objectId = assertObjectId(id);
    const existing = await Website.findOne({
        _id: objectId,
        ...activeFilter,
    });

    if (!existing) {
        throw new WebsiteDataError("not-found", "Website not found.");
    }

    const { normalizedDomain } = normalizeWebsiteUrl(input.websiteUrl);

    if (await findActiveByDomain(normalizedDomain, id)) {
        throw new WebsiteDataError(
            "duplicate",
            `A website for ${normalizedDomain} already exists.`,
        );
    }

    try {
        const updated = await Website.findOneAndUpdate(
            { _id: objectId, ...activeFilter },
            {
                $set: {
                    businessName: input.businessName ?? "",
                    originalUrl: input.websiteUrl.trim(),
                    normalizedDomain,
                    businessEmail: input.businessEmail ?? "",
                    industry: input.industry ?? "",
                    location: input.location ?? "",
                    source: input.source,
                    status: input.status,
                    auditStatus: input.auditStatus,
                    demoStatus: input.demoStatus,
                    outreachStatus: input.outreachStatus,
                },
            },
            { new: true, runValidators: true },
        ).lean<WebsiteLean | null>();

        if (!updated) {
            throw new WebsiteDataError("not-found", "Website not found.");
        }

        const changedFields: string[] = [];
        if ((existing.businessName ?? "") !== (input.businessName ?? "")) changedFields.push("businessName");
        if (existing.originalUrl !== input.websiteUrl.trim()) changedFields.push("websiteUrl");
        if ((existing.businessEmail ?? "") !== (input.businessEmail ?? "")) changedFields.push("businessEmail");
        if ((existing.industry ?? "") !== (input.industry ?? "")) changedFields.push("industry");
        if ((existing.location ?? "") !== (input.location ?? "")) changedFields.push("location");
        if (existing.source !== input.source) changedFields.push("source");
        if (existing.status !== input.status) changedFields.push("status");

        const website = toSerializable({
            ...updated,
            _id: String(updated._id),
        });

        if (changedFields.length > 0) {
            await createActivityEvent({
                websiteId: website.id,
                eventType: ACTIVITY_EVENTS.WEBSITE_UPDATED,
                title: "Website updated",
                description: `Updated fields: ${changedFields.join(", ")}.`,
                actor: { type: "administrator" },
                metadata: { changedFields },
            });
        }

        return website;
    } catch (error) {
        if (error instanceof WebsiteDataError) throw error;
        if (isDuplicateKeyError(error)) {
            throw new WebsiteDataError(
                "duplicate",
                `A website for ${normalizedDomain} already exists.`,
                { cause: error },
            );
        }
        throw new WebsiteDataError(
            "database",
            "Unable to update the website right now. Please try again.",
            { cause: error },
        );
    }
}

export async function softDeleteWebsite(id: string): Promise<void> {
    await connectToDatabase();

    const objectId = assertObjectId(id);
    const result = await Website.findOneAndUpdate(
        {
            _id: objectId,
            ...activeFilter,
        },
        {
            $set: {
                deletedAt: new Date(),
                status: "archived",
            },
        },
        { new: true },
    );

    if (!result) {
        throw new WebsiteDataError("not-found", "Website not found.");
    }

    await createActivityEvent({
        websiteId: id,
        eventType: ACTIVITY_EVENTS.WEBSITE_ARCHIVED,
        title: "Website archived",
        description: "Website was soft-deleted from active lists.",
        severity: "warning",
        actor: { type: "administrator" },
    });
}

export async function updateWebsitePageSpeedStatus(
    id: string,
    pageSpeedStatus: WebsiteLean["pageSpeedStatus"],
    latestPageSpeedRunAt?: Date | null,
): Promise<void> {
    await connectToDatabase();

    const objectId = assertObjectId(id);
    const update: Record<string, unknown> = { pageSpeedStatus };
    if (latestPageSpeedRunAt !== undefined) {
        update.latestPageSpeedRunAt = latestPageSpeedRunAt;
    }

    const result = await Website.findOneAndUpdate(
        { _id: objectId, ...activeFilter },
        { $set: update },
        { new: true },
    );

    if (!result) {
        throw new WebsiteDataError("not-found", "Website not found.");
    }
}

export async function updateWebsiteNiceGuyStatus(
    id: string,
    niceGuyStatus: WebsiteLean["niceGuyStatus"],
    latestNiceGuyRunAt?: Date | null,
): Promise<void> {
    await connectToDatabase();

    const objectId = assertObjectId(id);
    const update: Record<string, unknown> = { niceGuyStatus };
    if (latestNiceGuyRunAt !== undefined) {
        update.latestNiceGuyRunAt = latestNiceGuyRunAt;
    }

    const result = await Website.findOneAndUpdate(
        { _id: objectId, ...activeFilter },
        { $set: update },
        { new: true },
    );

    if (!result) {
        throw new WebsiteDataError("not-found", "Website not found.");
    }
}

export async function updateWebsiteAiAnalysisStatus(
    id: string,
    aiAnalysisStatus: WebsiteLean["aiAnalysisStatus"],
    latestAiAnalysisRunAt?: Date | null,
): Promise<void> {
    await connectToDatabase();

    const objectId = assertObjectId(id);
    const update: Record<string, unknown> = { aiAnalysisStatus };
    if (latestAiAnalysisRunAt !== undefined) {
        update.latestAiAnalysisRunAt = latestAiAnalysisRunAt;
    }

    const result = await Website.findOneAndUpdate(
        { _id: objectId, ...activeFilter },
        { $set: update },
        { new: true },
    );

    if (!result) {
        throw new WebsiteDataError("not-found", "Website not found.");
    }
}

export async function updateWebsiteCrawlStatus(
    id: string,
    crawlStatus: WebsiteLean["crawlStatus"],
): Promise<void> {
    await connectToDatabase();

    const objectId = assertObjectId(id);
    const result = await Website.findOneAndUpdate(
        { _id: objectId, ...activeFilter },
        { $set: { crawlStatus } },
        { new: true },
    );

    if (!result) {
        throw new WebsiteDataError("not-found", "Website not found.");
    }
}

export async function updateWebsitePublicReportStatus(
    id: string,
    publicReportStatus: WebsiteLean["publicReportStatus"],
    latestPublicReportAt?: Date | null,
): Promise<void> {
    await connectToDatabase();
    const objectId = assertObjectId(id);
    const update: Record<string, unknown> = { publicReportStatus };
    if (latestPublicReportAt !== undefined) {
        update.latestPublicReportAt = latestPublicReportAt;
    }

    const result = await Website.findOneAndUpdate(
        { _id: objectId, ...activeFilter },
        { $set: update },
        { new: true },
    );

    if (!result) {
        throw new WebsiteDataError("not-found", "Website not found.");
    }
}

export async function syncWebsitePublicReportSummary(websiteId: string): Promise<void> {
    await connectToDatabase();
    const { getPublishedPublicReportForWebsite, getLatestPublicReportForWebsite } =
        await import("@/src/data/public-reports");

    const [published, latest] = await Promise.all([
        getPublishedPublicReportForWebsite(websiteId),
        getLatestPublicReportForWebsite(websiteId),
    ]);

    const update: Record<string, unknown> = {
        publicReportStatus: published
            ? "published"
            : latest
              ? latest.status === "draft"
                  ? "draft"
                  : "unpublished"
              : "not-created",
        latestPublicReportAt: latest?.createdAt ? new Date(latest.createdAt) : null,
        latestPublishedReportAt: published?.publishedAt ? new Date(published.publishedAt) : null,
    };

    await Website.findOneAndUpdate(
        { _id: assertObjectId(websiteId), ...activeFilter },
        { $set: update },
    );
}

export async function updateWebsitePdfSummary(
    websiteId: string,
    pdfReportStatus: WebsiteLean["pdfReportStatus"],
    latestPdfReportAt?: Date | null,
): Promise<void> {
    await connectToDatabase();

    const update: Record<string, unknown> = { pdfReportStatus };
    if (latestPdfReportAt !== undefined) {
        update.latestPdfReportAt = latestPdfReportAt;
    }

    await Website.findOneAndUpdate(
        { _id: assertObjectId(websiteId), ...activeFilter },
        { $set: update },
    );
}

export async function updateWebsiteOutreachDraftSummary(
    websiteId: string,
    outreachDraftStatus: WebsiteLean["outreachDraftStatus"],
    latestOutreachDraftAt?: Date | null,
): Promise<void> {
    await connectToDatabase();

    const update: Record<string, unknown> = { outreachDraftStatus };
    if (latestOutreachDraftAt !== undefined) {
        update.latestOutreachDraftAt = latestOutreachDraftAt;
    }

    await Website.findOneAndUpdate(
        { _id: assertObjectId(websiteId), ...activeFilter },
        { $set: update },
    );
}

export async function updateWebsiteDemoProjectSummary(
    websiteId: string,
    demoProjectStatus: WebsiteLean["demoProjectStatus"],
    latestDemoAt?: Date | null,
): Promise<void> {
    await connectToDatabase();

    const update: Record<string, unknown> = { demoProjectStatus };
    if (latestDemoAt !== undefined) {
        update.latestDemoAt = latestDemoAt;
    }

    await Website.findOneAndUpdate(
        { _id: assertObjectId(websiteId), ...activeFilter },
        { $set: update },
    );
}

/**
 * Pending reviews = auditStatus is "complete" AND outreachStatus is
 * "not-contacted" or "draft-ready" (ready for outreach follow-up).
 */
export async function getWebsiteDashboardCounts(): Promise<WebsiteDashboardCounts> {
    await connectToDatabase();

    const [
        totalActiveWebsites,
        auditsCompleted,
        demosPublished,
        outreachEmailsSent,
        pendingReviews,
    ] = await Promise.all([
        Website.countDocuments(activeFilter),
        Website.countDocuments({ ...activeFilter, auditStatus: "complete" }),
        Website.countDocuments({ ...activeFilter, demoStatus: "published" }),
        Website.countDocuments({ ...activeFilter, outreachStatus: "sent" }),
        Website.countDocuments({
            ...activeFilter,
            auditStatus: "complete",
            outreachStatus: { $in: ["not-contacted", "draft-ready"] },
        }),
    ]);

    return {
        totalActiveWebsites,
        auditsCompleted,
        demosPublished,
        outreachEmailsSent,
        pendingReviews,
    };
}
