import "server-only";

import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { ReportLookupVerification } from "@/src/models/ReportLookupVerification";
import {
    REPORT_LOOKUP_CODE_TTL_MS,
    REPORT_LOOKUP_MAX_ATTEMPTS,
} from "@/src/services/report-lookup/constants";

export type SerializableReportLookupVerification = {
    id: string;
    normalizedEmail: string;
    codeHash: string;
    expiresAt: string;
    attemptCount: number;
    consumedAt: string | null;
    createdAt: string;
};

function toSerializable(
    doc: Record<string, unknown>,
): SerializableReportLookupVerification {
    return {
        id: String(doc._id),
        normalizedEmail: String(doc.normalizedEmail ?? ""),
        codeHash: String(doc.codeHash ?? ""),
        expiresAt: new Date(doc.expiresAt as Date).toISOString(),
        attemptCount: Number(doc.attemptCount ?? 0),
        consumedAt: doc.consumedAt ? new Date(doc.consumedAt as Date).toISOString() : null,
        createdAt: new Date(doc.createdAt as Date).toISOString(),
    };
}

export async function invalidateActiveLookupVerifications(
    normalizedEmail: string,
): Promise<void> {
    await connectToDatabase();
    const now = new Date();
    await ReportLookupVerification.updateMany(
        {
            normalizedEmail,
            consumedAt: null,
        },
        { $set: { consumedAt: now } },
    );
}

export async function createLookupVerification(input: {
    normalizedEmail: string;
    codeHash: string;
    now?: Date;
}): Promise<SerializableReportLookupVerification> {
    await connectToDatabase();
    const now = input.now ?? new Date();
    const created = await ReportLookupVerification.create({
        normalizedEmail: input.normalizedEmail,
        codeHash: input.codeHash,
        expiresAt: new Date(now.getTime() + REPORT_LOOKUP_CODE_TTL_MS),
        attemptCount: 0,
        consumedAt: null,
        createdAt: now,
    });

    return toSerializable(created.toObject() as Record<string, unknown>);
}

export async function getActiveLookupVerification(
    normalizedEmail: string,
    now = new Date(),
): Promise<SerializableReportLookupVerification | null> {
    await connectToDatabase();
    const doc = await ReportLookupVerification.findOne({
        normalizedEmail,
        consumedAt: null,
        expiresAt: { $gt: now },
        attemptCount: { $lt: REPORT_LOOKUP_MAX_ATTEMPTS },
    })
        .sort({ createdAt: -1 })
        .lean();

    if (!doc) return null;
    return toSerializable(doc as Record<string, unknown>);
}

/**
 * Latest non-consumed verification for the email (may be expired or locked).
 * Used so verify can distinguish expired / locked / invalid code.
 */
export async function getLatestOpenLookupVerification(
    normalizedEmail: string,
): Promise<SerializableReportLookupVerification | null> {
    await connectToDatabase();
    const doc = await ReportLookupVerification.findOne({
        normalizedEmail,
        consumedAt: null,
    })
        .sort({ createdAt: -1 })
        .lean();

    if (!doc) return null;
    return toSerializable(doc as Record<string, unknown>);
}

export async function incrementLookupVerificationAttempts(
    id: string,
): Promise<SerializableReportLookupVerification | null> {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const updated = await ReportLookupVerification.findOneAndUpdate(
        { _id: id, consumedAt: null },
        { $inc: { attemptCount: 1 } },
        { new: true },
    ).lean();
    if (!updated) return null;
    return toSerializable(updated as Record<string, unknown>);
}

export async function consumeLookupVerification(id: string, now = new Date()): Promise<boolean> {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const updated = await ReportLookupVerification.findOneAndUpdate(
        { _id: id, consumedAt: null },
        { $set: { consumedAt: now } },
        { new: true },
    ).lean();
    return Boolean(updated);
}
