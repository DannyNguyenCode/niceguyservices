import "server-only";

import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { PublicAuditStatusToken } from "@/src/models/PublicAuditStatusToken";
import { PUBLIC_AUDIT_STATUS_TOKEN_TTL_HOURS } from "@/src/services/public-audit-status/constants";
import {
    generatePublicAuditStatusToken,
    hashPublicAuditStatusToken,
} from "@/src/services/public-audit-status/hash-status-token";

export type SerializablePublicAuditStatusToken = {
    id: string;
    tokenHash: string;
    tokenPrefix: string;
    websiteId: string;
    auditRunId: string;
    auditJobId: string;
    normalizedDomain: string;
    expiresAt: string;
    revokedAt: string | null;
    createdAt: string;
};

function assertObjectId(id: string, message = "Invalid ID."): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(message);
    }
    return new mongoose.Types.ObjectId(id);
}

function serialize(
    doc: {
        _id: { toString(): string };
        tokenHash: string;
        tokenPrefix: string;
        websiteId: { toString(): string };
        auditRunId: { toString(): string };
        auditJobId: { toString(): string };
        normalizedDomain: string;
        expiresAt: Date;
        revokedAt?: Date | null;
        createdAt: Date;
    },
): SerializablePublicAuditStatusToken {
    return {
        id: String(doc._id),
        tokenHash: String(doc.tokenHash),
        tokenPrefix: String(doc.tokenPrefix),
        websiteId: String(doc.websiteId),
        auditRunId: String(doc.auditRunId),
        auditJobId: String(doc.auditJobId),
        normalizedDomain: String(doc.normalizedDomain),
        expiresAt: doc.expiresAt.toISOString(),
        revokedAt: doc.revokedAt ? doc.revokedAt.toISOString() : null,
        createdAt: doc.createdAt.toISOString(),
    };
}

export async function createPublicAuditStatusTokenRecord(input: {
    websiteId: string;
    auditRunId: string;
    auditJobId: string;
    normalizedDomain: string;
    now?: Date;
}): Promise<{ rawToken: string; record: SerializablePublicAuditStatusToken }> {
    await connectToDatabase();
    const { rawToken, tokenHash, tokenPrefix } = generatePublicAuditStatusToken();
    const now = input.now ?? new Date();
    const expiresAt = new Date(
        now.getTime() + PUBLIC_AUDIT_STATUS_TOKEN_TTL_HOURS * 60 * 60 * 1000,
    );

    const created = await PublicAuditStatusToken.create({
        tokenHash,
        tokenPrefix,
        websiteId: assertObjectId(input.websiteId),
        auditRunId: assertObjectId(input.auditRunId),
        auditJobId: assertObjectId(input.auditJobId),
        normalizedDomain: input.normalizedDomain.trim().toLowerCase(),
        expiresAt,
        revokedAt: null,
    });

    return {
        rawToken,
        record: serialize(created),
    };
}

export async function getValidPublicAuditStatusTokenByRawToken(
    rawToken: string,
    now: Date = new Date(),
): Promise<SerializablePublicAuditStatusToken | null> {
    await connectToDatabase();
    const tokenHash = hashPublicAuditStatusToken(rawToken);
    const doc = await PublicAuditStatusToken.findOne({
        tokenHash,
        revokedAt: null,
        expiresAt: { $gt: now },
    }).lean();

    if (!doc) {
        return null;
    }

    return serialize(doc as Parameters<typeof serialize>[0]);
}
