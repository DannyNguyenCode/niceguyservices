import "server-only";

import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { DemoGeneration } from "@/src/models/DemoGeneration";
import {
    DEMO_GENERATION_VERSION,
    DEMO_SPEC_VERSION,
} from "@/src/services/demo/constants";
import type {
    DemoGenerationStatus,
    SerializableDemoGeneration,
} from "@/src/services/demo/types";

const ACTIVE_STATUSES: DemoGenerationStatus[] = [
    "queued",
    "preparing",
    "generating",
    "validating",
];

function assertObjectId(id: string, message = "Invalid ID."): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(message);
    }
    return new mongoose.Types.ObjectId(id);
}

function toSerializable(doc: Record<string, unknown>): SerializableDemoGeneration {
    const source = (doc.source as Record<string, unknown>) ?? {};
    const provider = (doc.provider as Record<string, unknown>) ?? {};
    const workspace = (doc.workspace as Record<string, unknown>) ?? {};
    const output = (doc.output as Record<string, unknown>) ?? {};
    const validation = (doc.validation as Record<string, unknown>) ?? {};

    return {
        id: String(doc._id),
        demoProjectId: String(doc.demoProjectId),
        websiteId: String(doc.websiteId),
        publicReportId: String(doc.publicReportId),
        status: doc.status as DemoGenerationStatus,
        generationVersion: String(doc.generationVersion),
        specVersion: String(doc.specVersion),
        source: {
            snapshotChecksum: String(source.snapshotChecksum),
            publicReportRevision: Number(source.publicReportRevision),
            heroSuggestionIds: ((source.heroSuggestionIds as unknown[]) ?? []).map(String),
            screenshotIds: ((source.screenshotIds as unknown[]) ?? []).map(String),
        },
        provider: {
            name: String(provider.name),
            model: provider.model ? String(provider.model) : null,
            providerRequestId: provider.providerRequestId
                ? String(provider.providerRequestId)
                : null,
            providerRunUrl: provider.providerRunUrl ? String(provider.providerRunUrl) : null,
        },
        workspace: {
            repository: workspace.repository ? String(workspace.repository) : null,
            branch: workspace.branch ? String(workspace.branch) : null,
            commitSha: workspace.commitSha ? String(workspace.commitSha) : null,
            outputPath: workspace.outputPath ? String(workspace.outputPath) : null,
        },
        output: {
            framework: output.framework ? String(output.framework) : null,
            packageManager: output.packageManager ? String(output.packageManager) : null,
            pagesGenerated: ((output.pagesGenerated as unknown[]) ?? []).map(String),
            componentsGenerated: ((output.componentsGenerated as unknown[]) ?? []).map(String),
            filesChanged: ((output.filesChanged as unknown[]) ?? []).map(String),
            previewUrl: output.previewUrl ? String(output.previewUrl) : null,
            buildStatus: output.buildStatus ? String(output.buildStatus) : null,
            buildOutput: output.buildOutput ? String(output.buildOutput) : null,
        },
        validation: {
            passed: Boolean(validation.passed),
            errors: ((validation.errors as unknown[]) ?? []).map((item) => {
                const record = item as Record<string, unknown>;
                return {
                    code: String(record.code),
                    message: String(record.message),
                    filePath: record.filePath ? String(record.filePath) : null,
                };
            }),
            warnings: ((validation.warnings as unknown[]) ?? []).map((item) => {
                const record = item as Record<string, unknown>;
                return {
                    code: String(record.code),
                    message: String(record.message),
                    filePath: record.filePath ? String(record.filePath) : null,
                };
            }),
        },
        startedAt: doc.startedAt ? new Date(doc.startedAt as Date).toISOString() : null,
        completedAt: doc.completedAt ? new Date(doc.completedAt as Date).toISOString() : null,
        durationMs: typeof doc.durationMs === "number" ? doc.durationMs : null,
        errorCode: doc.errorCode ? String(doc.errorCode) : null,
        errorMessage: doc.errorMessage ? String(doc.errorMessage) : null,
        createdAt: new Date(doc.createdAt as Date).toISOString(),
        updatedAt: new Date(doc.updatedAt as Date).toISOString(),
    };
}

export async function createDemoGeneration(input: {
    demoProjectId: string;
    websiteId: string;
    publicReportId: string;
    source: SerializableDemoGeneration["source"];
    providerName: string;
    providerModel?: string | null;
}): Promise<SerializableDemoGeneration> {
    await connectToDatabase();
    const doc = await DemoGeneration.create({
        demoProjectId: assertObjectId(input.demoProjectId),
        websiteId: assertObjectId(input.websiteId),
        publicReportId: assertObjectId(input.publicReportId),
        status: "queued",
        generationVersion: DEMO_GENERATION_VERSION,
        specVersion: DEMO_SPEC_VERSION,
        source: {
            snapshotChecksum: input.source.snapshotChecksum,
            publicReportRevision: input.source.publicReportRevision,
            heroSuggestionIds: input.source.heroSuggestionIds.map((id) => assertObjectId(id)),
            screenshotIds: input.source.screenshotIds.map((id) => assertObjectId(id)),
        },
        provider: {
            name: input.providerName,
            model: input.providerModel ?? null,
        },
    });
    return toSerializable(doc.toObject() as Record<string, unknown>);
}

export async function getDemoGenerationById(id: string): Promise<SerializableDemoGeneration | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    await connectToDatabase();
    const doc = await DemoGeneration.findById(id).lean();
    return doc ? toSerializable(doc as Record<string, unknown>) : null;
}

export async function getDemoGenerationsForProject(
    demoProjectId: string,
): Promise<SerializableDemoGeneration[]> {
    if (!mongoose.Types.ObjectId.isValid(demoProjectId)) return [];
    await connectToDatabase();
    const docs = await DemoGeneration.find({
        demoProjectId: assertObjectId(demoProjectId),
    })
        .sort({ createdAt: -1 })
        .lean();
    return docs.map((doc) => toSerializable(doc as Record<string, unknown>));
}

export async function hasActiveDemoGeneration(demoProjectId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(demoProjectId)) return false;
    await connectToDatabase();
    const count = await DemoGeneration.countDocuments({
        demoProjectId: assertObjectId(demoProjectId),
        status: { $in: ACTIVE_STATUSES },
    });
    return count > 0;
}

export async function updateDemoGenerationStatus(
    id: string,
    status: DemoGenerationStatus,
    extra?: Partial<{
        startedAt: Date;
        workspace: SerializableDemoGeneration["workspace"];
        provider: Partial<SerializableDemoGeneration["provider"]>;
    }>,
): Promise<SerializableDemoGeneration | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    await connectToDatabase();
    const setUpdate: Record<string, unknown> = { status };
    if (extra?.startedAt) setUpdate.startedAt = extra.startedAt;
    if (extra?.workspace) {
        for (const [key, value] of Object.entries(extra.workspace)) {
            setUpdate[`workspace.${key}`] = value;
        }
    }
    if (extra?.provider) {
        for (const [key, value] of Object.entries(extra.provider)) {
            setUpdate[`provider.${key}`] = value;
        }
    }
    const doc = await DemoGeneration.findByIdAndUpdate(id, { $set: setUpdate }, { new: true }).lean();
    return doc ? toSerializable(doc as Record<string, unknown>) : null;
}

export async function completeDemoGeneration(
    id: string,
    input: {
        output: SerializableDemoGeneration["output"];
        validation: SerializableDemoGeneration["validation"];
        durationMs: number;
        workspace?: Partial<SerializableDemoGeneration["workspace"]>;
        provider?: Partial<SerializableDemoGeneration["provider"]>;
    },
): Promise<SerializableDemoGeneration | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    await connectToDatabase();
    const setUpdate: Record<string, unknown> = {
        status: "complete",
        completedAt: new Date(),
        durationMs: input.durationMs,
        "validation.passed": input.validation.passed,
        "validation.errors": input.validation.errors,
        "validation.warnings": input.validation.warnings,
        "output.framework": input.output.framework,
        "output.packageManager": input.output.packageManager,
        "output.pagesGenerated": input.output.pagesGenerated,
        "output.componentsGenerated": input.output.componentsGenerated,
        "output.filesChanged": input.output.filesChanged,
        "output.previewUrl": input.output.previewUrl,
        "output.buildStatus": input.output.buildStatus,
        "output.buildOutput": input.output.buildOutput,
    };
    if (input.workspace) {
        for (const [key, value] of Object.entries(input.workspace)) {
            setUpdate[`workspace.${key}`] = value;
        }
    }
    if (input.provider) {
        for (const [key, value] of Object.entries(input.provider)) {
            setUpdate[`provider.${key}`] = value;
        }
    }
    const doc = await DemoGeneration.findByIdAndUpdate(id, { $set: setUpdate }, { new: true }).lean();
    return doc ? toSerializable(doc as Record<string, unknown>) : null;
}

export async function failDemoGeneration(
    id: string,
    input: { errorCode: string; errorMessage: string; durationMs?: number | null },
): Promise<SerializableDemoGeneration | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    await connectToDatabase();
    const doc = await DemoGeneration.findByIdAndUpdate(
        id,
        {
            $set: {
                status: "failed",
                completedAt: new Date(),
                errorCode: input.errorCode,
                errorMessage: input.errorMessage,
                durationMs: input.durationMs ?? null,
            },
        },
        { new: true },
    ).lean();
    return doc ? toSerializable(doc as Record<string, unknown>) : null;
}

export async function cancelDemoGeneration(id: string): Promise<SerializableDemoGeneration | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    await connectToDatabase();
    const doc = await DemoGeneration.findByIdAndUpdate(
        id,
        { $set: { status: "cancelled", completedAt: new Date() } },
        { new: true },
    ).lean();
    return doc ? toSerializable(doc as Record<string, unknown>) : null;
}
