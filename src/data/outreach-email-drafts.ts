import "server-only";

import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import {
    OUTREACH_EMAIL_VERSION,
    OUTREACH_PROMPT_VERSION,
    DEFAULT_OUTREACH_STRATEGY,
} from "@/src/services/outreach/constants";
import { OutreachEmailDraft } from "@/src/models/OutreachEmailDraft";
import type {
    OutreachDraftStatus,
    OutreachStrategy,
    SerializableOutreachEmailDraft,
} from "@/src/services/outreach/types";

function assertObjectId(id: string, message = "Invalid ID."): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(message);
    }
    return new mongoose.Types.ObjectId(id);
}

function toSerializable(doc: Record<string, unknown>): SerializableOutreachEmailDraft {
    const generation = doc.generation as Record<string, unknown> | null | undefined;
    const recipient = (doc.recipient as Record<string, unknown>) ?? {};
    const source = doc.source as Record<string, unknown>;
    const strategy = (doc.strategy as OutreachStrategy) ?? DEFAULT_OUTREACH_STRATEGY;

    return {
        id: String(doc._id),
        websiteId: String(doc.websiteId),
        publicReportId: String(doc.publicReportId),
        pdfReportId: doc.pdfReportId ? String(doc.pdfReportId) : null,
        aiSummaryId: doc.aiSummaryId ? String(doc.aiSummaryId) : null,
        status: doc.status as OutreachDraftStatus,
        outreachVersion: String(doc.outreachVersion),
        promptVersion: String(doc.promptVersion),
        isCurrentApproved: Boolean(doc.isCurrentApproved),
        source: {
            publicReportVersion: String(source.publicReportVersion),
            publicReportRevision: Number(source.publicReportRevision),
            snapshotChecksum: String(source.snapshotChecksum),
            pdfVersion: source.pdfVersion ? String(source.pdfVersion) : null,
            pdfFilename: source.pdfFilename ? String(source.pdfFilename) : null,
        },
        recipient: {
            name: recipient.name ? String(recipient.name) : null,
            role: recipient.role ? String(recipient.role) : null,
            email: recipient.email ? String(recipient.email) : null,
            businessName: recipient.businessName ? String(recipient.businessName) : null,
        },
        strategy,
        subject: String(doc.subject ?? ""),
        bodyText: String(doc.bodyText ?? ""),
        evidence: ((doc.evidence as unknown[]) ?? []).map((item) => {
            const record = item as Record<string, unknown>;
            return {
                type: record.type as SerializableOutreachEmailDraft["evidence"][number]["type"],
                sourceId: record.sourceId ? String(record.sourceId) : null,
                label: String(record.label),
                value: record.value as string | number | null | undefined,
                sourcePath: record.sourcePath ? String(record.sourcePath) : null,
            };
        }),
        claimWarnings: ((doc.claimWarnings as unknown[]) ?? []).map((item) => {
            const record = item as Record<string, unknown>;
            return {
                code: String(record.code),
                message: String(record.message),
            };
        }),
        generation: generation?.provider
            ? {
                  provider: String(generation.provider),
                  model: generation.model ? String(generation.model) : null,
                  providerRequestId: generation.providerRequestId
                      ? String(generation.providerRequestId)
                      : null,
                  generatedAt: new Date(generation.generatedAt as Date).toISOString(),
                  durationMs:
                      typeof generation.durationMs === "number" ? generation.durationMs : null,
                  retryCount: Number(generation.retryCount ?? 0),
              }
            : null,
        editHistory: ((doc.editHistory as unknown[]) ?? []).map((item) => {
            const record = item as Record<string, unknown>;
            return {
                subject: String(record.subject),
                bodyText: String(record.bodyText),
                editedAt: new Date(record.editedAt as Date).toISOString(),
                editSource: record.editSource as "generated" | "administrator" | "regenerated",
            };
        }),
        approvedAt: doc.approvedAt ? new Date(doc.approvedAt as Date).toISOString() : null,
        rejectedAt: doc.rejectedAt ? new Date(doc.rejectedAt as Date).toISOString() : null,
        archivedAt: doc.archivedAt ? new Date(doc.archivedAt as Date).toISOString() : null,
        errorCode: doc.errorCode ? String(doc.errorCode) : null,
        errorMessage: doc.errorMessage ? String(doc.errorMessage) : null,
        createdAt: new Date(doc.createdAt as Date).toISOString(),
        updatedAt: new Date(doc.updatedAt as Date).toISOString(),
    };
}

export async function createOutreachDraft(input: {
    websiteId: string;
    publicReportId: string;
    pdfReportId?: string | null;
    aiSummaryId?: string | null;
    sourceAuditRunId?: string | null;
    sourceAuditNumber?: number | null;
    source: SerializableOutreachEmailDraft["source"];
    recipient: SerializableOutreachEmailDraft["recipient"];
    strategy: OutreachStrategy;
    subject: string;
    bodyText: string;
    evidence: SerializableOutreachEmailDraft["evidence"];
    claimWarnings: SerializableOutreachEmailDraft["claimWarnings"];
    generation: NonNullable<SerializableOutreachEmailDraft["generation"]>;
    editSource?: "generated" | "regenerated";
}): Promise<SerializableOutreachEmailDraft> {
    await connectToDatabase();
    const now = new Date();

    const created = await OutreachEmailDraft.create({
        websiteId: assertObjectId(input.websiteId),
        publicReportId: assertObjectId(input.publicReportId),
        pdfReportId: input.pdfReportId ? assertObjectId(input.pdfReportId) : null,
        aiSummaryId: input.aiSummaryId ? assertObjectId(input.aiSummaryId) : null,
        sourceAuditRunId: input.sourceAuditRunId
            ? assertObjectId(input.sourceAuditRunId)
            : null,
        sourceAuditNumber: input.sourceAuditNumber ?? null,
        status: "draft",
        isCurrentApproved: false,
        outreachVersion: OUTREACH_EMAIL_VERSION,
        promptVersion: OUTREACH_PROMPT_VERSION,
        source: input.source,
        recipient: input.recipient,
        strategy: input.strategy,
        subject: input.subject,
        bodyText: input.bodyText,
        evidence: input.evidence,
        claimWarnings: input.claimWarnings,
        generation: {
            ...input.generation,
            generatedAt: new Date(input.generation.generatedAt),
        },
        editHistory: [
            {
                subject: input.subject,
                bodyText: input.bodyText,
                editedAt: now,
                editSource: input.editSource ?? "generated",
            },
        ],
    });

    return toSerializable(created.toObject() as Record<string, unknown>);
}

export async function createFailedOutreachDraft(input: {
    websiteId: string;
    publicReportId: string;
    pdfReportId?: string | null;
    aiSummaryId?: string | null;
    source: SerializableOutreachEmailDraft["source"];
    recipient: SerializableOutreachEmailDraft["recipient"];
    strategy: OutreachStrategy;
    errorCode: string;
    errorMessage: string;
}): Promise<SerializableOutreachEmailDraft> {
    await connectToDatabase();

    const created = await OutreachEmailDraft.create({
        websiteId: assertObjectId(input.websiteId),
        publicReportId: assertObjectId(input.publicReportId),
        pdfReportId: input.pdfReportId ? assertObjectId(input.pdfReportId) : null,
        aiSummaryId: input.aiSummaryId ? assertObjectId(input.aiSummaryId) : null,
        status: "draft",
        isCurrentApproved: false,
        outreachVersion: OUTREACH_EMAIL_VERSION,
        promptVersion: OUTREACH_PROMPT_VERSION,
        source: input.source,
        recipient: input.recipient,
        strategy: input.strategy,
        subject: "(generation failed)",
        bodyText: "Draft generation failed. See error details.",
        evidence: [],
        claimWarnings: [],
        generation: null,
        errorCode: input.errorCode,
        errorMessage: input.errorMessage,
        editHistory: [],
    });

    return toSerializable(created.toObject() as Record<string, unknown>);
}

export async function getOutreachDraftById(id: string): Promise<SerializableOutreachEmailDraft | null> {
    await connectToDatabase();
    try {
        const doc = await OutreachEmailDraft.findById(assertObjectId(id)).lean();
        if (!doc) return null;
        return toSerializable(doc as Record<string, unknown>);
    } catch {
        return null;
    }
}

export async function getOutreachDraftsForWebsite(
    websiteId: string,
): Promise<SerializableOutreachEmailDraft[]> {
    await connectToDatabase();
    const docs = await OutreachEmailDraft.find({ websiteId: assertObjectId(websiteId) })
        .sort({ createdAt: -1 })
        .lean();
    return docs.map((doc) => toSerializable(doc as Record<string, unknown>));
}

export async function getOutreachDraftsForPublicReport(
    publicReportId: string,
): Promise<SerializableOutreachEmailDraft[]> {
    await connectToDatabase();
    const docs = await OutreachEmailDraft.find({
        publicReportId: assertObjectId(publicReportId),
    })
        .sort({ createdAt: -1 })
        .lean();
    return docs.map((doc) => toSerializable(doc as Record<string, unknown>));
}

export async function getLatestApprovedOutreachDraft(
    websiteId: string,
): Promise<SerializableOutreachEmailDraft | null> {
    await connectToDatabase();
    const doc = await OutreachEmailDraft.findOne({
        websiteId: assertObjectId(websiteId),
        isCurrentApproved: true,
    })
        .sort({ approvedAt: -1 })
        .lean();
    if (!doc) return null;
    return toSerializable(doc as Record<string, unknown>);
}

export async function updateOutreachDraftContent(
    draftId: string,
    input: {
        subject: string;
        bodyText: string;
        recipient?: SerializableOutreachEmailDraft["recipient"];
    },
): Promise<SerializableOutreachEmailDraft | null> {
    await connectToDatabase();
    const now = new Date();
    const update: Record<string, unknown> = {
        subject: input.subject,
        bodyText: input.bodyText,
    };
    if (input.recipient) {
        update.recipient = input.recipient;
    }

    const doc = await OutreachEmailDraft.findOneAndUpdate(
        { _id: assertObjectId(draftId), status: "draft" },
        {
            $set: update,
            $push: {
                editHistory: {
                    subject: input.subject,
                    bodyText: input.bodyText,
                    editedAt: now,
                    editSource: "administrator",
                },
            },
        },
        { new: true },
    ).lean();

    if (!doc) return null;
    return toSerializable(doc as Record<string, unknown>);
}

export async function approveOutreachDraft(draftId: string): Promise<SerializableOutreachEmailDraft | null> {
    await connectToDatabase();
    const draft = await getOutreachDraftById(draftId);
    if (!draft || draft.status !== "draft") return null;

    await OutreachEmailDraft.updateMany(
        { websiteId: assertObjectId(draft.websiteId), isCurrentApproved: true },
        { $set: { isCurrentApproved: false } },
    );

    const now = new Date();
    const doc = await OutreachEmailDraft.findByIdAndUpdate(
        assertObjectId(draftId),
        {
            $set: {
                status: "approved",
                isCurrentApproved: true,
                approvedAt: now,
            },
        },
        { new: true },
    ).lean();

    if (!doc) return null;
    return toSerializable(doc as Record<string, unknown>);
}

export async function rejectOutreachDraft(draftId: string): Promise<SerializableOutreachEmailDraft | null> {
    await connectToDatabase();
    const doc = await OutreachEmailDraft.findOneAndUpdate(
        { _id: assertObjectId(draftId), status: "draft" },
        {
            $set: {
                status: "rejected",
                rejectedAt: new Date(),
                isCurrentApproved: false,
            },
        },
        { new: true },
    ).lean();
    if (!doc) return null;
    return toSerializable(doc as Record<string, unknown>);
}

export async function archiveOutreachDraft(draftId: string): Promise<SerializableOutreachEmailDraft | null> {
    await connectToDatabase();
    const doc = await OutreachEmailDraft.findOneAndUpdate(
        {
            _id: assertObjectId(draftId),
            status: { $in: ["draft", "approved", "rejected"] },
        },
        {
            $set: {
                status: "archived",
                archivedAt: new Date(),
                isCurrentApproved: false,
            },
        },
        { new: true },
    ).lean();
    if (!doc) return null;
    return toSerializable(doc as Record<string, unknown>);
}
