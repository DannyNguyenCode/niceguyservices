import "server-only";

import mongoose from "mongoose";
import type {
    PageType,
    ScreenshotStatus,
    ScreenshotType,
} from "@/src/schemas/enums";
import { connectToDatabase } from "@/src/lib/mongodb";
import { Screenshot, type ScreenshotLean } from "@/src/models/Screenshot";

export type SerializableScreenshot = {
    id: string;
    websiteId: string;
    crawlId: string;
    type: ScreenshotType;
    pageType: PageType;
    pageUrl: string;
    viewport: {
        width: number;
        height: number;
        deviceScaleFactor: number;
    };
    storageType: ScreenshotLean["storageType"];
    filePath: string;
    publicUrl: string;
    cloudinaryPublicId: string;
    cloudinaryAssetId: string;
    cloudinaryVersion: number | null;
    secureUrl: string;
    width: number | null;
    height: number | null;
    format: string;
    fileSizeBytes: number | null;
    status: ScreenshotStatus;
    errorMessage: string | null;
    visualStability: {
        attempted: boolean;
        stabilized: boolean;
        timedOut: boolean;
        reason: string;
        elapsedMs: number;
        samples: number;
        unfinishedFiniteAnimations: number;
        infiniteAnimations: number;
    } | null;
    generatedAt: string | null;
    createdAt: string;
    updatedAt: string;
};

function assertObjectId(id: string): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID.");
    }
    return new mongoose.Types.ObjectId(id);
}

function toSerializable(doc: ScreenshotLean): SerializableScreenshot {
    return {
        id: String(doc._id),
        websiteId: String(doc.websiteId),
        crawlId: String(doc.crawlId),
        type: doc.type,
        pageType: doc.pageType,
        pageUrl: doc.pageUrl || "",
        viewport: doc.viewport,
        storageType: doc.storageType,
        filePath: doc.filePath || "",
        publicUrl: doc.publicUrl || "",
        cloudinaryPublicId: doc.cloudinaryPublicId || "",
        cloudinaryAssetId: doc.cloudinaryAssetId || "",
        cloudinaryVersion: doc.cloudinaryVersion ?? null,
        secureUrl: doc.secureUrl || "",
        width: doc.width ?? null,
        height: doc.height ?? null,
        format: doc.format || "",
        fileSizeBytes: doc.fileSizeBytes ?? null,
        status: doc.status,
        errorMessage: doc.errorMessage ?? null,
        visualStability: doc.visualStability
            ? {
                  attempted: Boolean(doc.visualStability.attempted),
                  stabilized: Boolean(doc.visualStability.stabilized),
                  timedOut: Boolean(doc.visualStability.timedOut),
                  reason: String(doc.visualStability.reason ?? "unsupported"),
                  elapsedMs: Number(doc.visualStability.elapsedMs ?? 0),
                  samples: Number(doc.visualStability.samples ?? 0),
                  unfinishedFiniteAnimations: Number(
                      doc.visualStability.unfinishedFiniteAnimations ?? 0,
                  ),
                  infiniteAnimations: Number(doc.visualStability.infiniteAnimations ?? 0),
              }
            : null,
        generatedAt: doc.generatedAt
            ? new Date(doc.generatedAt).toISOString()
            : null,
        createdAt: new Date(doc.createdAt).toISOString(),
        updatedAt: new Date(doc.updatedAt).toISOString(),
    };
}

function mapLean(doc: ScreenshotLean & { _id: unknown; websiteId: unknown; crawlId: unknown }) {
    return {
        ...doc,
        _id: String(doc._id),
        websiteId: String(doc.websiteId),
        crawlId: String(doc.crawlId),
    } as ScreenshotLean;
}

export async function createScreenshotRecord(input: {
    websiteId: string;
    crawlId: string;
    auditRunId?: string | null;
    type: ScreenshotType;
    pageType?: PageType;
    pageUrl?: string;
    viewport: SerializableScreenshot["viewport"];
}): Promise<SerializableScreenshot> {
    await connectToDatabase();

    const created = await Screenshot.create({
        websiteId: assertObjectId(input.websiteId),
        crawlId: assertObjectId(input.crawlId),
        auditRunId: input.auditRunId ? assertObjectId(input.auditRunId) : null,
        type: input.type,
        pageType: input.pageType ?? "home",
        pageUrl: input.pageUrl ?? "",
        viewport: input.viewport,
        storageType: "cloudinary",
        status: "pending",
        generatedAt: null,
        errorMessage: null,
    });

    return toSerializable(
        mapLean({
            ...(created.toObject() as unknown as ScreenshotLean),
            _id: String(created._id),
            websiteId: String(created.websiteId),
            crawlId: String(created.crawlId),
        }),
    );
}

export async function completeScreenshotRecord(
    screenshotId: string,
    payload: Partial<{
        storageType: ScreenshotLean["storageType"];
        filePath: string;
        publicUrl: string;
        cloudinaryPublicId: string;
        cloudinaryAssetId: string;
        cloudinaryVersion: number;
        secureUrl: string;
        width: number;
        height: number;
        format: string;
        fileSizeBytes: number;
        visualStability: NonNullable<SerializableScreenshot["visualStability"]>;
    }>,
): Promise<SerializableScreenshot> {
    await connectToDatabase();
    const updated = await Screenshot.findByIdAndUpdate(
        assertObjectId(screenshotId),
        {
            $set: {
                ...payload,
                status: "complete",
                generatedAt: new Date(),
                errorMessage: null,
            },
        },
        { new: true, runValidators: true },
    ).lean<ScreenshotLean | null>();

    if (!updated) {
        throw new Error("Screenshot record not found.");
    }

    return toSerializable(
        mapLean(updated as ScreenshotLean & { _id: unknown; websiteId: unknown; crawlId: unknown }),
    );
}

export async function failScreenshotRecord(
    screenshotId: string,
    errorMessage: string,
): Promise<SerializableScreenshot> {
    await connectToDatabase();
    const updated = await Screenshot.findByIdAndUpdate(
        assertObjectId(screenshotId),
        {
            $set: {
                status: "failed",
                errorMessage,
            },
        },
        { new: true, runValidators: true },
    ).lean<ScreenshotLean | null>();

    if (!updated) {
        throw new Error("Screenshot record not found.");
    }

    return toSerializable(
        mapLean(updated as ScreenshotLean & { _id: unknown; websiteId: unknown; crawlId: unknown }),
    );
}

export async function getScreenshotsForCrawl(
    crawlId: string,
): Promise<SerializableScreenshot[]> {
    await connectToDatabase();
    let objectId: mongoose.Types.ObjectId;
    try {
        objectId = assertObjectId(crawlId);
    } catch {
        return [];
    }

    const docs = await Screenshot.find({ crawlId: objectId })
        .sort({ createdAt: 1 })
        .lean<ScreenshotLean[]>();

    return docs.map((doc) =>
        toSerializable(
            mapLean(doc as ScreenshotLean & { _id: unknown; websiteId: unknown; crawlId: unknown }),
        ),
    );
}

export async function getScreenshotById(id: string): Promise<SerializableScreenshot | null> {
    await connectToDatabase();
    try {
        const doc = await Screenshot.findById(assertObjectId(id)).lean<ScreenshotLean | null>();
        if (!doc) return null;
        return toSerializable(
            mapLean(doc as ScreenshotLean & { _id: unknown; websiteId: unknown; crawlId: unknown }),
        );
    } catch {
        return null;
    }
}

export async function getLatestScreenshotsForWebsite(
    websiteId: string,
): Promise<SerializableScreenshot[]> {
    await connectToDatabase();
    let objectId: mongoose.Types.ObjectId;
    try {
        objectId = assertObjectId(websiteId);
    } catch {
        return [];
    }

    const latestCrawlScreenshot = await Screenshot.findOne({ websiteId: objectId })
        .sort({ createdAt: -1 })
        .select("crawlId")
        .lean<{ crawlId: mongoose.Types.ObjectId } | null>();

    if (!latestCrawlScreenshot?.crawlId) return [];

    return getScreenshotsForCrawl(String(latestCrawlScreenshot.crawlId));
}
