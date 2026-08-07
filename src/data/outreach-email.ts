import "server-only";

import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { OutreachEmail, type OutreachEmailLean } from "@/src/models/OutreachEmail";

export type SerializableOutreachEmail = {
    id: string;
    websiteId: string;
    subject: string;
    body: string;
    generated: boolean;
    approved: boolean;
    sent: boolean;
    sentAt: string | null;
    opened: boolean;
    openedAt: string | null;
    replied: boolean;
    repliedAt: string | null;
};

function toSerializable(doc: OutreachEmailLean): SerializableOutreachEmail {
    return {
        id: String(doc._id),
        websiteId: String(doc.websiteId),
        subject: doc.subject || "",
        body: doc.body || "",
        generated: doc.generated ?? false,
        approved: doc.approved ?? false,
        sent: doc.sent ?? false,
        sentAt: doc.sentAt ? new Date(doc.sentAt).toISOString() : null,
        opened: doc.opened ?? false,
        openedAt: doc.openedAt ? new Date(doc.openedAt).toISOString() : null,
        replied: doc.replied ?? false,
        repliedAt: doc.repliedAt ? new Date(doc.repliedAt).toISOString() : null,
    };
}

function assertObjectId(id: string): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid website ID.");
    }
    return new mongoose.Types.ObjectId(id);
}

export async function getOutreachEmailByWebsiteId(
    websiteId: string,
): Promise<SerializableOutreachEmail | null> {
    await connectToDatabase();

    let objectId: mongoose.Types.ObjectId;
    try {
        objectId = assertObjectId(websiteId);
    } catch {
        return null;
    }

    const doc = await OutreachEmail.findOne({ websiteId: objectId }).lean<OutreachEmailLean | null>();
    if (!doc) return null;

    return toSerializable({
        ...doc,
        _id: String(doc._id),
        websiteId: String(doc.websiteId),
    });
}

export async function createEmptyOutreachEmail(
    websiteId: string,
): Promise<SerializableOutreachEmail> {
    await connectToDatabase();

    const objectId = assertObjectId(websiteId);

    const created = await OutreachEmail.create({
        websiteId: objectId,
        subject: "",
        body: "",
        generated: false,
        approved: false,
        sent: false,
        sentAt: null,
        opened: false,
        openedAt: null,
        replied: false,
        repliedAt: null,
    });

    return toSerializable({
        ...created.toObject(),
        _id: String(created._id),
        websiteId: String(created.websiteId),
    } as OutreachEmailLean);
}
