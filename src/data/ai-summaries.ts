import "server-only";

import mongoose from "mongoose";
import type { AiSummaryStatus } from "@/src/schemas/enums";
import { AI_ANALYSIS_VERSION } from "@/src/lib/ai-config";
import { connectToDatabase } from "@/src/lib/mongodb";
import { AiSummary } from "@/src/models/AiSummary";
import type { AiSummaryOutput } from "@/src/services/ai/types";

export type SerializableAiSummary = {
    id: string;
    websiteId: string;
    crawlId: string;
    niceGuyMetricId: string;
    auditRunId: string | null;
    status: AiSummaryStatus;
    analysisVersion: string;
    promptVersion: string;
    sourceSnapshot: {
        scoringVersion: string;
        overallScore: number;
        categoryScores: Record<string, number | null>;
        mobilePageSpeedAvailable: boolean;
        desktopPageSpeedAvailable: boolean;
        screenshotCount: number;
        pageCount: number;
    };
    executiveSummary: string;
    businessImpactSummary: string;
    strengths: AiSummaryOutput["strengths"];
    weaknesses: AiSummaryOutput["weaknesses"];
    quickWins: AiSummaryOutput["quickWins"];
    longTermRecommendations: AiSummaryOutput["longTermRecommendations"];
    priorityOrder: AiSummaryOutput["priorityOrder"];
    disclaimers: string[];
    generatedAt: string | null;
    durationMs: number | null;
    errorCode: string | null;
    errorMessage: string | null;
    createdAt: string;
    updatedAt: string;
};

function assertObjectId(id: string, message = "Invalid ID."): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(message);
    }
    return new mongoose.Types.ObjectId(id);
}

function toSerializable(doc: Record<string, unknown>): SerializableAiSummary {
    const sourceSnapshot = (doc.sourceSnapshot as Record<string, unknown>) ?? {};
    const categoryScores =
        (sourceSnapshot.categoryScores as Record<string, number | null>) ?? {};
    const mobilePageSpeedAvailable = Boolean(
        sourceSnapshot.mobilePageSpeedAvailable ??
            (sourceSnapshot.pageSpeed as Record<string, boolean> | undefined)?.mobileAvailable,
    );
    const desktopPageSpeedAvailable = Boolean(
        sourceSnapshot.desktopPageSpeedAvailable ??
            (sourceSnapshot.pageSpeed as Record<string, boolean> | undefined)?.desktopAvailable,
    );

    return {
        id: String(doc._id),
        websiteId: String(doc.websiteId),
        crawlId: String(doc.crawlId),
        niceGuyMetricId: String(doc.niceGuyMetricId),
        auditRunId: doc.auditRunId ? String(doc.auditRunId) : null,
        status: doc.status as AiSummaryStatus,
        analysisVersion: String(doc.analysisVersion ?? AI_ANALYSIS_VERSION),
        promptVersion: String(doc.promptVersion ?? ""),
        sourceSnapshot: {
            scoringVersion: String(sourceSnapshot.scoringVersion ?? ""),
            overallScore: Number(sourceSnapshot.overallScore ?? 0),
            categoryScores,
            mobilePageSpeedAvailable,
            desktopPageSpeedAvailable,
            screenshotCount: Number(sourceSnapshot.screenshotCount ?? 0),
            pageCount: Number(sourceSnapshot.pageCount ?? 0),
        },
        executiveSummary: String(doc.executiveSummary ?? ""),
        businessImpactSummary: String(doc.businessImpactSummary ?? ""),
        strengths: (doc.strengths as SerializableAiSummary["strengths"]) ?? [],
        weaknesses: (doc.weaknesses as SerializableAiSummary["weaknesses"]) ?? [],
        quickWins: (doc.quickWins as SerializableAiSummary["quickWins"]) ?? [],
        longTermRecommendations:
            (doc.longTermRecommendations as SerializableAiSummary["longTermRecommendations"]) ??
            [],
        priorityOrder: (doc.priorityOrder as SerializableAiSummary["priorityOrder"]) ?? [],
        disclaimers: (doc.disclaimers as string[]) ?? [],
        generatedAt: doc.generatedAt ? new Date(doc.generatedAt as Date).toISOString() : null,
        durationMs: doc.durationMs != null ? Number(doc.durationMs) : null,
        errorCode: doc.errorCode ? String(doc.errorCode) : null,
        errorMessage: doc.errorMessage ? String(doc.errorMessage) : null,
        createdAt: new Date(doc.createdAt as Date).toISOString(),
        updatedAt: new Date(doc.updatedAt as Date).toISOString(),
    };
}

export async function createAiSummaryRecord(input: {
    websiteId: string;
    crawlId: string;
    niceGuyMetricId: string;
    auditRunId?: string | null;
    analysisVersion: string;
    promptVersion: string;
    sourceSnapshot: SerializableAiSummary["sourceSnapshot"];
    status?: AiSummaryStatus;
}): Promise<SerializableAiSummary> {
    await connectToDatabase();

    const created = await AiSummary.create({
        websiteId: assertObjectId(input.websiteId),
        crawlId: assertObjectId(input.crawlId),
        niceGuyMetricId: assertObjectId(input.niceGuyMetricId),
        auditRunId: input.auditRunId ? assertObjectId(input.auditRunId) : null,
        status: input.status ?? "queued",
        analysisVersion: input.analysisVersion,
        promptVersion: input.promptVersion,
        sourceSnapshot: input.sourceSnapshot,
    });

    return toSerializable(created.toObject() as Record<string, unknown>);
}

export async function getAiSummaryById(id: string): Promise<SerializableAiSummary | null> {
    await connectToDatabase();
    try {
        const doc = await AiSummary.findById(assertObjectId(id)).lean();
        if (!doc) return null;
        return toSerializable(doc as Record<string, unknown>);
    } catch {
        return null;
    }
}

export async function getLatestAiSummaryForWebsite(
    websiteId: string,
): Promise<SerializableAiSummary | null> {
    await connectToDatabase();
    try {
        const doc = await AiSummary.findOne({
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

export async function getAiSummariesForCrawl(
    crawlId: string,
): Promise<SerializableAiSummary[]> {
    await connectToDatabase();
    try {
        const docs = await AiSummary.find({ crawlId: assertObjectId(crawlId) })
            .sort({ createdAt: -1 })
            .lean();
        return docs.map((doc) => toSerializable(doc as Record<string, unknown>));
    } catch {
        return [];
    }
}

import type { AuditHistoryItem } from "@/src/types/audit-dashboard";

export async function getAiSummariesForWebsite(
    websiteId: string,
    limit = 10,
): Promise<AuditHistoryItem[]> {
    await connectToDatabase();
    try {
        const docs = await AiSummary.find({ websiteId: assertObjectId(websiteId) })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        return docs.map((doc) => {
            const record = toSerializable(doc as Record<string, unknown>);
            return {
                id: record.id,
                status: record.status,
                label: "AI analysis",
                createdAt: record.createdAt,
                completedAt: record.generatedAt,
                durationMs: record.durationMs,
                crawlId: record.crawlId,
                version: record.analysisVersion,
                promptVersion: record.promptVersion,
            };
        });
    } catch {
        return [];
    }
}

export async function updateAiSummaryStatus(
    id: string,
    status: AiSummaryStatus,
): Promise<SerializableAiSummary> {
    await connectToDatabase();
    const updated = await AiSummary.findByIdAndUpdate(
        assertObjectId(id),
        { $set: { status } },
        { new: true, runValidators: true },
    ).lean();

    if (!updated) {
        throw new Error("AI summary record not found.");
    }

    return toSerializable(updated as Record<string, unknown>);
}

export async function completeAiSummaryRecord(
    id: string,
    payload: AiSummaryOutput & {
        durationMs: number;
        promptVersion: string;
        analysisVersion: string;
    },
): Promise<SerializableAiSummary> {
    await connectToDatabase();

    const updated = await AiSummary.findByIdAndUpdate(
        assertObjectId(id),
        {
            $set: {
                status: "complete",
                analysisVersion: payload.analysisVersion,
                promptVersion: payload.promptVersion,
                executiveSummary: payload.executiveSummary,
                businessImpactSummary: payload.businessImpactSummary,
                strengths: payload.strengths,
                weaknesses: payload.weaknesses,
                quickWins: payload.quickWins,
                longTermRecommendations: payload.longTermRecommendations,
                priorityOrder: payload.priorityOrder,
                disclaimers: payload.disclaimers,
                generatedAt: new Date(),
                durationMs: payload.durationMs,
                errorCode: null,
                errorMessage: null,
            },
        },
        { new: true, runValidators: true },
    ).lean();

    if (!updated) {
        throw new Error("AI summary record not found.");
    }

    return toSerializable(updated as Record<string, unknown>);
}

export async function failAiSummaryRecord(
    id: string,
    input: {
        errorCode: string;
        errorMessage: string;
        durationMs?: number | null;
    },
): Promise<SerializableAiSummary> {
    await connectToDatabase();

    const updated = await AiSummary.findByIdAndUpdate(
        assertObjectId(id),
        {
            $set: {
                status: "failed",
                errorCode: input.errorCode,
                errorMessage: input.errorMessage,
                durationMs: input.durationMs ?? null,
            },
        },
        { new: true, runValidators: true },
    ).lean();

    if (!updated) {
        throw new Error("AI summary record not found.");
    }

    return toSerializable(updated as Record<string, unknown>);
}

export async function hasActiveAiAnalysis(
    websiteId: string,
    crawlId: string,
    niceGuyMetricId: string,
): Promise<boolean> {
    await connectToDatabase();
    try {
        const count = await AiSummary.countDocuments({
            websiteId: assertObjectId(websiteId),
            crawlId: assertObjectId(crawlId),
            niceGuyMetricId: assertObjectId(niceGuyMetricId),
            status: { $in: ["queued", "processing"] },
        });
        return count > 0;
    } catch {
        return false;
    }
}

/** @deprecated Use `getLatestAiSummaryForWebsite`. */
export async function getAiSummaryByWebsiteId(
    websiteId: string,
): Promise<SerializableAiSummary | null> {
    return getLatestAiSummaryForWebsite(websiteId);
}

/** @deprecated Use `createAiSummaryRecord`. */
export async function createEmptyAiSummary(websiteId: string): Promise<SerializableAiSummary> {
    return createAiSummaryRecord({
        websiteId,
        crawlId: "000000000000000000000000",
        niceGuyMetricId: "000000000000000000000000",
        analysisVersion: AI_ANALYSIS_VERSION,
        promptVersion: "audit-analysis-v1",
        sourceSnapshot: {
            scoringVersion: "niceguy-v1",
            overallScore: 0,
            categoryScores: {},
            mobilePageSpeedAvailable: false,
            desktopPageSpeedAvailable: false,
            screenshotCount: 0,
            pageCount: 0,
        },
    });
}
