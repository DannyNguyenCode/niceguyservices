import "server-only";

import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { Demo, type DemoLean } from "@/src/models/Demo";

export type SerializableDemo = {
    id: string;
    websiteId: string;
    exists: boolean;
    published: boolean;
    title: string;
    description: string;
    url: string;
    previewImage: string;
    publishedAt: string | null;
};

function toSerializable(doc: DemoLean): SerializableDemo {
    return {
        id: String(doc._id),
        websiteId: String(doc.websiteId),
        exists: doc.exists ?? false,
        published: doc.published ?? false,
        title: doc.title || "",
        description: doc.description || "",
        url: doc.url || "",
        previewImage: doc.previewImage || "",
        publishedAt: doc.publishedAt ? new Date(doc.publishedAt).toISOString() : null,
    };
}

function assertObjectId(id: string): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid website ID.");
    }
    return new mongoose.Types.ObjectId(id);
}

export async function getDemoByWebsiteId(
    websiteId: string,
): Promise<SerializableDemo | null> {
    await connectToDatabase();

    let objectId: mongoose.Types.ObjectId;
    try {
        objectId = assertObjectId(websiteId);
    } catch {
        return null;
    }

    const doc = await Demo.findOne({ websiteId: objectId }).lean<DemoLean | null>();
    if (!doc) return null;

    return toSerializable({
        ...doc,
        _id: String(doc._id),
        websiteId: String(doc.websiteId),
    });
}

export async function createEmptyDemo(websiteId: string): Promise<SerializableDemo> {
    await connectToDatabase();

    const objectId = assertObjectId(websiteId);

    const created = await Demo.create({
        websiteId: objectId,
        exists: false,
        published: false,
        title: "",
        description: "",
        url: "",
        previewImage: "",
        publishedAt: null,
    });

    return toSerializable({
        ...created.toObject(),
        _id: String(created._id),
        websiteId: String(created.websiteId),
    } as DemoLean);
}
