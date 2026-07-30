import "server-only";

import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { DemoProject } from "@/src/models/DemoProject";
import {
    DEFAULT_APPROVED_FACTS,
    DEFAULT_CONTENT_POLICY,
    DEFAULT_DEMO_CONFIGURATION,
    DEMO_GENERATION_VERSION,
    DEMO_SPEC_VERSION,
} from "@/src/services/demo/constants";
import type {
    DemoApprovedFacts,
    DemoConfiguration,
    DemoContentPolicy,
    DemoProjectStatus,
    SerializableDemoProject,
} from "@/src/services/demo/types";

function assertObjectId(id: string, message = "Invalid ID."): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(message);
    }
    return new mongoose.Types.ObjectId(id);
}

function toSerializable(doc: Record<string, unknown>): SerializableDemoProject {
    const source = (doc.source as Record<string, unknown>) ?? {};
    const business = (doc.business as Record<string, unknown>) ?? {};
    const configuration = (doc.configuration as DemoConfiguration) ?? DEFAULT_DEMO_CONFIGURATION;
    const approvedFacts = (doc.approvedFacts as DemoApprovedFacts) ?? DEFAULT_APPROVED_FACTS;
    const contentPolicy = (doc.contentPolicy as DemoContentPolicy) ?? DEFAULT_CONTENT_POLICY;
    const editedHero = doc.editedHeroConcept as Record<string, unknown> | null | undefined;

    return {
        id: String(doc._id),
        websiteId: String(doc.websiteId),
        publicReportId: String(doc.publicReportId),
        aiSummaryId: doc.aiSummaryId ? String(doc.aiSummaryId) : null,
        status: doc.status as DemoProjectStatus,
        deploymentState: doc.deploymentState as SerializableDemoProject["deploymentState"],
        demoGenerationVersion: String(doc.demoGenerationVersion),
        demoSpecVersion: String(doc.demoSpecVersion),
        previewTokenPrefix: doc.previewTokenPrefix ? String(doc.previewTokenPrefix) : null,
        previewPath: doc.previewPath ? String(doc.previewPath) : null,
        source: {
            publicReportVersion: String(source.publicReportVersion),
            publicReportRevision: Number(source.publicReportRevision),
            snapshotChecksum: String(source.snapshotChecksum),
            heroSuggestionIds: ((source.heroSuggestionIds as unknown[]) ?? []).map(String),
            screenshotIds: ((source.screenshotIds as unknown[]) ?? []).map(String),
        },
        business: {
            originalBusinessName: business.originalBusinessName
                ? String(business.originalBusinessName)
                : null,
            demoBusinessName: String(business.demoBusinessName),
            domain: business.domain ? String(business.domain) : null,
            industry: business.industry ? String(business.industry) : null,
            location: business.location ? String(business.location) : null,
        },
        configuration,
        approvedFacts,
        contentPolicy,
        selectedHeroSuggestionId: doc.selectedHeroSuggestionId
            ? String(doc.selectedHeroSuggestionId)
            : null,
        editedHeroConcept: editedHero?.headline
            ? {
                  headline: String(editedHero.headline),
                  supportingCopy: String(editedHero.supportingCopy ?? ""),
                  primaryCta: String(editedHero.primaryCta ?? ""),
                  secondaryCta: editedHero.secondaryCta ? String(editedHero.secondaryCta) : null,
              }
            : null,
        currentGenerationId: doc.currentGenerationId ? String(doc.currentGenerationId) : null,
        rejectionReason: doc.rejectionReason ? String(doc.rejectionReason) : null,
        rejectionNotes: doc.rejectionNotes ? String(doc.rejectionNotes) : null,
        approvedAt: doc.approvedAt ? new Date(doc.approvedAt as Date).toISOString() : null,
        rejectedAt: doc.rejectedAt ? new Date(doc.rejectedAt as Date).toISOString() : null,
        archivedAt: doc.archivedAt ? new Date(doc.archivedAt as Date).toISOString() : null,
        createdAt: new Date(doc.createdAt as Date).toISOString(),
        updatedAt: new Date(doc.updatedAt as Date).toISOString(),
    };
}

export async function createDemoProject(input: {
    websiteId: string;
    publicReportId: string;
    aiSummaryId?: string | null;
    sourceAuditRunId?: string | null;
    sourceAuditNumber?: number | null;
    source: SerializableDemoProject["source"];
    business: SerializableDemoProject["business"];
    configuration?: Partial<DemoConfiguration>;
    approvedFacts?: Partial<DemoApprovedFacts>;
    contentPolicy?: Partial<DemoContentPolicy>;
    selectedHeroSuggestionId?: string | null;
    editedHeroConcept?: SerializableDemoProject["editedHeroConcept"];
    previewTokenHash?: string | null;
    previewTokenPrefix?: string | null;
    previewPath?: string | null;
}): Promise<SerializableDemoProject> {
    await connectToDatabase();

    const doc = await DemoProject.create({
        websiteId: assertObjectId(input.websiteId),
        publicReportId: assertObjectId(input.publicReportId),
        aiSummaryId: input.aiSummaryId ? assertObjectId(input.aiSummaryId) : null,
        sourceAuditRunId: input.sourceAuditRunId
            ? assertObjectId(input.sourceAuditRunId)
            : null,
        sourceAuditNumber: input.sourceAuditNumber ?? null,
        status: "draft",
        deploymentState: "preview-private",
        demoGenerationVersion: DEMO_GENERATION_VERSION,
        demoSpecVersion: DEMO_SPEC_VERSION,
        previewTokenHash: input.previewTokenHash ?? null,
        previewTokenPrefix: input.previewTokenPrefix ?? null,
        previewPath: input.previewPath ?? null,
        source: {
            publicReportVersion: input.source.publicReportVersion,
            publicReportRevision: input.source.publicReportRevision,
            snapshotChecksum: input.source.snapshotChecksum,
            heroSuggestionIds: input.source.heroSuggestionIds.map((id) => assertObjectId(id)),
            screenshotIds: input.source.screenshotIds.map((id) => assertObjectId(id)),
        },
        business: input.business,
        configuration: { ...DEFAULT_DEMO_CONFIGURATION, ...input.configuration },
        approvedFacts: { ...DEFAULT_APPROVED_FACTS, ...input.approvedFacts },
        contentPolicy: { ...DEFAULT_CONTENT_POLICY, ...input.contentPolicy },
        selectedHeroSuggestionId: input.selectedHeroSuggestionId
            ? assertObjectId(input.selectedHeroSuggestionId)
            : null,
        editedHeroConcept: input.editedHeroConcept,
    });

    return toSerializable(doc.toObject() as Record<string, unknown>);
}

export async function getDemoProjectById(id: string): Promise<SerializableDemoProject | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    await connectToDatabase();
    const doc = await DemoProject.findById(id).lean();
    return doc ? toSerializable(doc as Record<string, unknown>) : null;
}

export async function getDemoProjectByPreviewTokenHash(
    tokenHash: string,
): Promise<SerializableDemoProject | null> {
    await connectToDatabase();
    const doc = await DemoProject.findOne({ previewTokenHash: tokenHash }).lean();
    return doc ? toSerializable(doc as Record<string, unknown>) : null;
}

export async function getDemoProjectsForWebsite(
    websiteId: string,
): Promise<SerializableDemoProject[]> {
    if (!mongoose.Types.ObjectId.isValid(websiteId)) return [];
    await connectToDatabase();
    const docs = await DemoProject.find({ websiteId: assertObjectId(websiteId) })
        .sort({ createdAt: -1 })
        .lean();
    return docs.map((doc) => toSerializable(doc as Record<string, unknown>));
}

export async function updateDemoProject(
    id: string,
    update: Partial<{
        status: DemoProjectStatus;
        configuration: Partial<DemoConfiguration>;
        approvedFacts: Partial<DemoApprovedFacts>;
        contentPolicy: Partial<DemoContentPolicy>;
        selectedHeroSuggestionId: string | null;
        editedHeroConcept: SerializableDemoProject["editedHeroConcept"];
        currentGenerationId: string | null;
        deploymentState: SerializableDemoProject["deploymentState"];
        previewPath: string | null;
    }>,
): Promise<SerializableDemoProject | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    await connectToDatabase();

    const setUpdate: Record<string, unknown> = {};
    if (update.status) setUpdate.status = update.status;
    if (update.deploymentState) setUpdate.deploymentState = update.deploymentState;
    if (update.currentGenerationId !== undefined) {
        setUpdate.currentGenerationId = update.currentGenerationId
            ? assertObjectId(update.currentGenerationId)
            : null;
    }
    if (update.selectedHeroSuggestionId !== undefined) {
        setUpdate.selectedHeroSuggestionId = update.selectedHeroSuggestionId
            ? assertObjectId(update.selectedHeroSuggestionId)
            : null;
    }
    if (update.editedHeroConcept !== undefined) setUpdate.editedHeroConcept = update.editedHeroConcept;
    if (update.previewPath !== undefined) setUpdate.previewPath = update.previewPath;
    if (update.configuration) {
        for (const [key, value] of Object.entries(update.configuration)) {
            setUpdate[`configuration.${key}`] = value;
        }
    }
    if (update.approvedFacts) {
        for (const [key, value] of Object.entries(update.approvedFacts)) {
            setUpdate[`approvedFacts.${key}`] = value;
        }
    }
    if (update.contentPolicy) {
        for (const [key, value] of Object.entries(update.contentPolicy)) {
            setUpdate[`contentPolicy.${key}`] = value;
        }
    }

    const doc = await DemoProject.findByIdAndUpdate(id, { $set: setUpdate }, { new: true }).lean();
    return doc ? toSerializable(doc as Record<string, unknown>) : null;
}

export async function approveDemoProject(id: string): Promise<SerializableDemoProject | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    await connectToDatabase();
    const doc = await DemoProject.findByIdAndUpdate(
        id,
        { $set: { status: "approved", approvedAt: new Date(), rejectedAt: null } },
        { new: true },
    ).lean();
    return doc ? toSerializable(doc as Record<string, unknown>) : null;
}

export async function rejectDemoProject(
    id: string,
    input: { reason: string; notes?: string | null },
): Promise<SerializableDemoProject | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    await connectToDatabase();
    const doc = await DemoProject.findByIdAndUpdate(
        id,
        {
            $set: {
                status: "rejected",
                rejectedAt: new Date(),
                rejectionReason: input.reason,
                rejectionNotes: input.notes ?? null,
            },
        },
        { new: true },
    ).lean();
    return doc ? toSerializable(doc as Record<string, unknown>) : null;
}

export async function archiveDemoProject(id: string): Promise<SerializableDemoProject | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    await connectToDatabase();
    const doc = await DemoProject.findByIdAndUpdate(
        id,
        {
            $set: {
                status: "archived",
                archivedAt: new Date(),
                deploymentState: "archived",
            },
        },
        { new: true },
    ).lean();
    return doc ? toSerializable(doc as Record<string, unknown>) : null;
}
