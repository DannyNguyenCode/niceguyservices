import "server-only";

import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { ReportLookupSession } from "@/src/models/ReportLookupSession";
import { REPORT_LOOKUP_SESSION_MAX_AGE_SECONDS } from "@/src/services/report-lookup/constants";

export type SerializableReportLookupSession = {
    id: string;
    tokenHash: string;
    normalizedEmail: string;
    expiresAt: string;
    revokedAt: string | null;
    createdAt: string;
};

function toSerializable(doc: Record<string, unknown>): SerializableReportLookupSession {
    return {
        id: String(doc._id),
        tokenHash: String(doc.tokenHash ?? ""),
        normalizedEmail: String(doc.normalizedEmail ?? ""),
        expiresAt: new Date(doc.expiresAt as Date).toISOString(),
        revokedAt: doc.revokedAt ? new Date(doc.revokedAt as Date).toISOString() : null,
        createdAt: new Date(doc.createdAt as Date).toISOString(),
    };
}

export async function createReportLookupSessionRecord(input: {
    tokenHash: string;
    normalizedEmail: string;
    now?: Date;
}): Promise<SerializableReportLookupSession> {
    await connectToDatabase();
    const now = input.now ?? new Date();
    const created = await ReportLookupSession.create({
        tokenHash: input.tokenHash,
        normalizedEmail: input.normalizedEmail,
        expiresAt: new Date(now.getTime() + REPORT_LOOKUP_SESSION_MAX_AGE_SECONDS * 1000),
        revokedAt: null,
        createdAt: now,
    });
    return toSerializable(created.toObject() as Record<string, unknown>);
}

export async function getValidReportLookupSessionByTokenHash(
    tokenHash: string,
    now = new Date(),
): Promise<SerializableReportLookupSession | null> {
    await connectToDatabase();
    const doc = await ReportLookupSession.findOne({
        tokenHash,
        revokedAt: null,
        expiresAt: { $gt: now },
    }).lean();
    if (!doc) return null;
    return toSerializable(doc as Record<string, unknown>);
}

export async function revokeReportLookupSessionsForEmail(
    normalizedEmail: string,
): Promise<void> {
    await connectToDatabase();
    const now = new Date();
    await ReportLookupSession.updateMany(
        { normalizedEmail, revokedAt: null },
        { $set: { revokedAt: now } },
    );
}

export async function revokeReportLookupSessionById(id: string): Promise<void> {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(id)) return;
    await ReportLookupSession.updateOne(
        { _id: id, revokedAt: null },
        { $set: { revokedAt: new Date() } },
    );
}
