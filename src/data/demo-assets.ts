import "server-only";

import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { DemoAsset } from "@/src/models/DemoAsset";
import type { SerializableDemoAsset } from "@/src/services/demo/types";

function assertObjectId(id: string, message = "Invalid ID."): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(message);
    }
    return new mongoose.Types.ObjectId(id);
}

function toSerializable(doc: Record<string, unknown>): SerializableDemoAsset {
    return {
        id: String(doc._id),
        demoProjectId: String(doc.demoProjectId),
        demoGenerationId: doc.demoGenerationId ? String(doc.demoGenerationId) : null,
        type: doc.type as SerializableDemoAsset["type"],
        source: doc.source as SerializableDemoAsset["source"],
        originalAssetId: doc.originalAssetId ? String(doc.originalAssetId) : null,
        provider: doc.provider ? String(doc.provider) : null,
        secureUrl: doc.secureUrl ? String(doc.secureUrl) : null,
        publicId: doc.publicId ? String(doc.publicId) : null,
        filename: doc.filename ? String(doc.filename) : null,
        mimeType: doc.mimeType ? String(doc.mimeType) : null,
        bytes: typeof doc.bytes === "number" ? doc.bytes : null,
        approvedForDemo: Boolean(doc.approvedForDemo),
        usageMode: (doc.usageMode as SerializableDemoAsset["usageMode"]) ?? "reference-only",
        usageNotes: doc.usageNotes ? String(doc.usageNotes) : null,
        label: doc.label ? String(doc.label) : null,
        pageType: doc.pageType ? String(doc.pageType) : null,
        createdAt: new Date(doc.createdAt as Date).toISOString(),
        updatedAt: new Date(doc.updatedAt as Date).toISOString(),
    };
}

export async function createDemoAsset(input: {
    demoProjectId: string;
    demoGenerationId?: string | null;
    type: SerializableDemoAsset["type"];
    source: SerializableDemoAsset["source"];
    originalAssetId?: string | null;
    secureUrl?: string | null;
    label?: string | null;
    pageType?: string | null;
    approvedForDemo?: boolean;
    usageMode?: SerializableDemoAsset["usageMode"];
}): Promise<SerializableDemoAsset> {
    await connectToDatabase();
    const doc = await DemoAsset.create({
        demoProjectId: assertObjectId(input.demoProjectId),
        demoGenerationId: input.demoGenerationId
            ? assertObjectId(input.demoGenerationId)
            : null,
        type: input.type,
        source: input.source,
        originalAssetId: input.originalAssetId ? assertObjectId(input.originalAssetId) : null,
        secureUrl: input.secureUrl ?? null,
        label: input.label ?? null,
        pageType: input.pageType ?? null,
        approvedForDemo: input.approvedForDemo ?? false,
        usageMode: input.usageMode ?? "reference-only",
    });
    return toSerializable(doc.toObject() as Record<string, unknown>);
}

export async function getDemoAssetsForProject(
    demoProjectId: string,
): Promise<SerializableDemoAsset[]> {
    if (!mongoose.Types.ObjectId.isValid(demoProjectId)) return [];
    await connectToDatabase();
    const docs = await DemoAsset.find({ demoProjectId: assertObjectId(demoProjectId) })
        .sort({ createdAt: -1 })
        .lean();
    return docs.map((doc) => toSerializable(doc as Record<string, unknown>));
}

export async function approveDemoAsset(id: string): Promise<SerializableDemoAsset | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    await connectToDatabase();
    const doc = await DemoAsset.findByIdAndUpdate(
        id,
        { $set: { approvedForDemo: true, usageMode: "demo-content" } },
        { new: true },
    ).lean();
    return doc ? toSerializable(doc as Record<string, unknown>) : null;
}

export async function rejectDemoAsset(id: string): Promise<SerializableDemoAsset | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    await connectToDatabase();
    const doc = await DemoAsset.findByIdAndUpdate(
        id,
        { $set: { approvedForDemo: false, usageMode: "do-not-use" } },
        { new: true },
    ).lean();
    return doc ? toSerializable(doc as Record<string, unknown>) : null;
}

export async function seedDemoAssetsFromReport(input: {
    demoProjectId: string;
    screenshots: Array<{
        screenshotId: string;
        secureUrl: string;
        pageType: string;
        altText: string;
    }>;
    logoUrl?: string | null;
}): Promise<SerializableDemoAsset[]> {
    const created: SerializableDemoAsset[] = [];
    for (const screenshot of input.screenshots) {
        created.push(
            await createDemoAsset({
                demoProjectId: input.demoProjectId,
                type: "screenshot",
                source: "audit",
                originalAssetId: screenshot.screenshotId,
                secureUrl: screenshot.secureUrl,
                label: screenshot.altText,
                pageType: screenshot.pageType,
                approvedForDemo: false,
                usageMode: "reference-only",
            }),
        );
    }
    if (input.logoUrl) {
        created.push(
            await createDemoAsset({
                demoProjectId: input.demoProjectId,
                type: "logo",
                source: "audit",
                secureUrl: input.logoUrl,
                label: "Business logo",
                approvedForDemo: false,
                usageMode: "reference-only",
            }),
        );
    }
    return created;
}
