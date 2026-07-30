import "server-only";

import mongoose from "mongoose";
import type { AiMetadataRelatedType } from "@/src/schemas/enums";
import { connectToDatabase } from "@/src/lib/mongodb";
import { AiMetadata } from "@/src/models/AiMetadata";

export type SerializableAiMetadata = {
    id: string;
    websiteId: string;
    crawlId: string;
    auditRunId: string | null;
    relatedType: AiMetadataRelatedType;
    relatedId: string;
    provider: string;
    model: string;
    promptVersion: string;
    analysisVersion: string;
    promptTokens: number | null;
    completionTokens: number | null;
    totalTokens: number | null;
    durationMs: number | null;
    providerRequestId: string | null;
    retryCount: number;
    generatedAt: string;
    createdAt: string;
    updatedAt: string;
};

function assertObjectId(id: string, message = "Invalid ID."): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(message);
    }
    return new mongoose.Types.ObjectId(id);
}

function toSerializable(doc: Record<string, unknown>): SerializableAiMetadata {
    return {
        id: String(doc._id),
        websiteId: String(doc.websiteId),
        crawlId: String(doc.crawlId),
        auditRunId: doc.auditRunId ? String(doc.auditRunId) : null,
        relatedType: doc.relatedType as AiMetadataRelatedType,
        relatedId: String(doc.relatedId),
        provider: String(doc.provider ?? ""),
        model: String(doc.model ?? ""),
        promptVersion: String(doc.promptVersion ?? ""),
        analysisVersion: String(doc.analysisVersion ?? ""),
        promptTokens: doc.promptTokens != null ? Number(doc.promptTokens) : null,
        completionTokens:
            doc.completionTokens != null ? Number(doc.completionTokens) : null,
        totalTokens: doc.totalTokens != null ? Number(doc.totalTokens) : null,
        durationMs: doc.durationMs != null ? Number(doc.durationMs) : null,
        providerRequestId: doc.providerRequestId ? String(doc.providerRequestId) : null,
        retryCount: Number(doc.retryCount ?? 0),
        generatedAt: new Date(doc.generatedAt as Date).toISOString(),
        createdAt: new Date(doc.createdAt as Date).toISOString(),
        updatedAt: new Date(doc.updatedAt as Date).toISOString(),
    };
}

export async function createAiMetadataRecord(input: {
    websiteId: string;
    crawlId: string;
    auditRunId?: string | null;
    relatedType: AiMetadataRelatedType;
    relatedId: string;
    provider: string;
    model: string;
    promptVersion: string;
    analysisVersion: string;
    promptTokens?: number | null;
    completionTokens?: number | null;
    totalTokens?: number | null;
    durationMs?: number | null;
    providerRequestId?: string | null;
    retryCount?: number;
}): Promise<SerializableAiMetadata> {
    await connectToDatabase();

    const created = await AiMetadata.create({
        websiteId: assertObjectId(input.websiteId),
        crawlId: assertObjectId(input.crawlId),
        auditRunId: input.auditRunId ? assertObjectId(input.auditRunId) : null,
        relatedType: input.relatedType,
        relatedId: assertObjectId(input.relatedId),
        provider: input.provider,
        model: input.model,
        promptVersion: input.promptVersion,
        analysisVersion: input.analysisVersion,
        promptTokens: input.promptTokens ?? null,
        completionTokens: input.completionTokens ?? null,
        totalTokens: input.totalTokens ?? null,
        durationMs: input.durationMs ?? null,
        providerRequestId: input.providerRequestId ?? null,
        retryCount: input.retryCount ?? 0,
        generatedAt: new Date(),
    });

    return toSerializable(created.toObject() as Record<string, unknown>);
}

export async function getAiMetadataForRelatedRecord(
    relatedType: AiMetadataRelatedType,
    relatedId: string,
): Promise<SerializableAiMetadata | null> {
    await connectToDatabase();
    try {
        const doc = await AiMetadata.findOne({
            relatedType,
            relatedId: assertObjectId(relatedId),
        })
            .sort({ createdAt: -1 })
            .lean();
        if (!doc) return null;
        return toSerializable(doc as Record<string, unknown>);
    } catch {
        return null;
    }
}

/** @deprecated Use `getAiMetadataForRelatedRecord`. */
export async function getAiMetadataByWebsiteId(
    websiteId: string,
): Promise<SerializableAiMetadata | null> {
    await connectToDatabase();
    try {
        const doc = await AiMetadata.findOne({
            websiteId: assertObjectId(websiteId),
        })
            .sort({ createdAt: -1 })
            .lean();
        if (!doc) return null;
        return toSerializable(doc as Record<string, unknown>);
    } catch {
        return null;
    }
}

/** @deprecated */
export async function createEmptyAiMetadata(
    websiteId: string,
): Promise<SerializableAiMetadata> {
    return createAiMetadataRecord({
        websiteId,
        crawlId: "000000000000000000000000",
        relatedType: "ai-summary",
        relatedId: "000000000000000000000000",
        provider: "openai",
        model: "gpt-4o-mini",
        promptVersion: "audit-analysis-v1",
        analysisVersion: "audit-analysis-v1",
    });
}
