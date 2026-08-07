import "server-only";

import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { Pdf, type PdfLean } from "@/src/models/Pdf";

export type SerializablePdf = {
    id: string;
    websiteId: string;
    generated: boolean;
    version: number;
    url: string;
    generatedAt: string | null;
};

function toSerializable(doc: PdfLean): SerializablePdf {
    return {
        id: String(doc._id),
        websiteId: String(doc.websiteId),
        generated: doc.generated ?? false,
        version: doc.version ?? 1,
        url: doc.url || "",
        generatedAt: doc.generatedAt ? new Date(doc.generatedAt).toISOString() : null,
    };
}

function assertObjectId(id: string): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid website ID.");
    }
    return new mongoose.Types.ObjectId(id);
}

export async function getPdfByWebsiteId(
    websiteId: string,
): Promise<SerializablePdf | null> {
    await connectToDatabase();

    let objectId: mongoose.Types.ObjectId;
    try {
        objectId = assertObjectId(websiteId);
    } catch {
        return null;
    }

    const doc = await Pdf.findOne({ websiteId: objectId }).lean<PdfLean | null>();
    if (!doc) return null;

    return toSerializable({
        ...doc,
        _id: String(doc._id),
        websiteId: String(doc.websiteId),
    });
}

export async function createEmptyPdf(websiteId: string): Promise<SerializablePdf> {
    await connectToDatabase();

    const objectId = assertObjectId(websiteId);

    const created = await Pdf.create({
        websiteId: objectId,
        generated: false,
        version: 1,
        url: "",
        generatedAt: null,
    });

    return toSerializable({
        ...created.toObject(),
        _id: String(created._id),
        websiteId: String(created.websiteId),
    } as PdfLean);
}
