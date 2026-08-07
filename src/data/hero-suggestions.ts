import "server-only";

import mongoose from "mongoose";
import type { HeroSuggestionStatus } from "@/src/schemas/enums";
import { AI_HERO_SUGGESTION_VERSION } from "@/src/lib/ai-config";
import { connectToDatabase } from "@/src/lib/mongodb";
import { HeroSuggestion } from "@/src/models/HeroSuggestion";
import type { HeroSuggestionsOutput } from "@/src/services/ai/types";

export type SerializableHeroSuggestion = {
    id: string;
    websiteId: string;
    crawlId: string;
    niceGuyMetricId: string;
    aiSummaryId: string;
    auditRunId: string | null;
    status: HeroSuggestionStatus;
    promptVersion: string;
    suggestionVersion: string;
    optionNumber: number;
    conceptName: string;
    headline: string;
    supportingCopy: string;
    primaryCta: { label: string; hrefSuggestion: string | null };
    secondaryCta: { label: string; hrefSuggestion: string | null } | null;
    trustSupport: string | null;
    designDirection: {
        layout: string;
        hierarchy: string;
        imagery: string;
        mobileBehavior: string;
        accessibilityNotes: string[];
    };
    rationale: string;
    targetProblems: Array<{
        checkId: string;
        category: string;
        explanation: string;
    }>;
    constraints: string[];
    generatedAt: string | null;
    createdAt: string;
    updatedAt: string;
};

function assertObjectId(id: string, message = "Invalid ID."): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(message);
    }
    return new mongoose.Types.ObjectId(id);
}

function toSerializable(doc: Record<string, unknown>): SerializableHeroSuggestion {
    const primaryCta = (doc.primaryCta as Record<string, unknown>) ?? {};
    const secondaryCta = doc.secondaryCta as Record<string, unknown> | null | undefined;
    const designDirection = (doc.designDirection as Record<string, unknown>) ?? {};

    return {
        id: String(doc._id),
        websiteId: String(doc.websiteId),
        crawlId: String(doc.crawlId),
        niceGuyMetricId: String(doc.niceGuyMetricId),
        aiSummaryId: String(doc.aiSummaryId),
        auditRunId: doc.auditRunId ? String(doc.auditRunId) : null,
        status: doc.status as HeroSuggestionStatus,
        promptVersion: String(doc.promptVersion ?? ""),
        suggestionVersion: String(doc.suggestionVersion ?? AI_HERO_SUGGESTION_VERSION),
        optionNumber: Number(doc.optionNumber ?? 0),
        conceptName: String(doc.conceptName ?? ""),
        headline: String(doc.headline ?? ""),
        supportingCopy: String(doc.supportingCopy ?? ""),
        primaryCta: {
            label: String(primaryCta.label ?? ""),
            hrefSuggestion: primaryCta.hrefSuggestion ? String(primaryCta.hrefSuggestion) : null,
        },
        secondaryCta: secondaryCta
            ? {
                  label: String(secondaryCta.label ?? ""),
                  hrefSuggestion: secondaryCta.hrefSuggestion
                      ? String(secondaryCta.hrefSuggestion)
                      : null,
              }
            : null,
        trustSupport: doc.trustSupport ? String(doc.trustSupport) : null,
        designDirection: {
            layout: String(designDirection.layout ?? ""),
            hierarchy: String(designDirection.hierarchy ?? ""),
            imagery: String(designDirection.imagery ?? ""),
            mobileBehavior: String(designDirection.mobileBehavior ?? ""),
            accessibilityNotes: (designDirection.accessibilityNotes as string[]) ?? [],
        },
        rationale: String(doc.rationale ?? ""),
        targetProblems:
            (doc.targetProblems as SerializableHeroSuggestion["targetProblems"]) ?? [],
        constraints: (doc.constraints as string[]) ?? [],
        generatedAt: doc.generatedAt ? new Date(doc.generatedAt as Date).toISOString() : null,
        createdAt: new Date(doc.createdAt as Date).toISOString(),
        updatedAt: new Date(doc.updatedAt as Date).toISOString(),
    };
}

export async function createHeroSuggestionRecords(input: {
    websiteId: string;
    crawlId: string;
    niceGuyMetricId: string;
    aiSummaryId: string;
    auditRunId?: string | null;
    promptVersion: string;
    suggestionVersion: string;
    suggestions: HeroSuggestionsOutput["suggestions"];
}): Promise<SerializableHeroSuggestion[]> {
    await connectToDatabase();

    const docs = await HeroSuggestion.insertMany(
        input.suggestions.map((suggestion, index) => ({
            websiteId: assertObjectId(input.websiteId),
            crawlId: assertObjectId(input.crawlId),
            niceGuyMetricId: assertObjectId(input.niceGuyMetricId),
            aiSummaryId: assertObjectId(input.aiSummaryId),
            auditRunId: input.auditRunId ? assertObjectId(input.auditRunId) : null,
            status: "draft",
            promptVersion: input.promptVersion,
            suggestionVersion: input.suggestionVersion,
            optionNumber: index + 1,
            conceptName: suggestion.conceptName,
            headline: suggestion.headline,
            supportingCopy: suggestion.supportingCopy,
            primaryCta: suggestion.primaryCta,
            secondaryCta: suggestion.secondaryCta ?? null,
            trustSupport: suggestion.trustSupport ?? null,
            designDirection: suggestion.designDirection,
            rationale: suggestion.rationale,
            targetProblems: suggestion.targetProblems,
            constraints: suggestion.constraints,
            generatedAt: new Date(),
        })),
    );

    return docs.map((doc) => toSerializable(doc.toObject() as Record<string, unknown>));
}

export async function getHeroSuggestionsForSummary(
    aiSummaryId: string,
): Promise<SerializableHeroSuggestion[]> {
    await connectToDatabase();
    try {
        const docs = await HeroSuggestion.find({
            aiSummaryId: assertObjectId(aiSummaryId),
        })
            .sort({ optionNumber: 1 })
            .lean();
        return docs.map((doc) => toSerializable(doc as Record<string, unknown>));
    } catch {
        return [];
    }
}

export async function getLatestHeroSuggestionsForWebsite(
    websiteId: string,
): Promise<SerializableHeroSuggestion[]> {
    await connectToDatabase();
    try {
        const latest = await HeroSuggestion.findOne({
            websiteId: assertObjectId(websiteId),
        })
            .sort({ createdAt: -1 })
            .select("aiSummaryId")
            .lean();

        if (!latest?.aiSummaryId) return [];
        return getHeroSuggestionsForSummary(String(latest.aiSummaryId));
    } catch {
        return [];
    }
}

export async function updateHeroSuggestionStatus(
    id: string,
    status: HeroSuggestionStatus,
): Promise<SerializableHeroSuggestion> {
    await connectToDatabase();
    const updated = await HeroSuggestion.findByIdAndUpdate(
        assertObjectId(id),
        { $set: { status } },
        { new: true, runValidators: true },
    ).lean();

    if (!updated) {
        throw new Error("Hero suggestion not found.");
    }

    return toSerializable(updated as Record<string, unknown>);
}

export async function selectHeroSuggestion(
    id: string,
): Promise<SerializableHeroSuggestion> {
    await connectToDatabase();
    const objectId = assertObjectId(id);
    const suggestion = await HeroSuggestion.findById(objectId).lean();
    if (!suggestion) {
        throw new Error("Hero suggestion not found.");
    }

    await HeroSuggestion.updateMany(
        {
            aiSummaryId: suggestion.aiSummaryId,
            _id: { $ne: objectId },
            status: { $ne: "rejected" },
        },
        { $set: { status: "draft" } },
    );

    return updateHeroSuggestionStatus(id, "selected");
}

export async function rejectHeroSuggestion(
    id: string,
): Promise<SerializableHeroSuggestion> {
    return updateHeroSuggestionStatus(id, "rejected");
}

export async function restoreHeroSuggestion(
    id: string,
): Promise<SerializableHeroSuggestion> {
    return updateHeroSuggestionStatus(id, "draft");
}

/** @deprecated Use `getLatestHeroSuggestionsForWebsite`. */
export async function getHeroSuggestionsByWebsiteId(
    websiteId: string,
): Promise<SerializableHeroSuggestion[]> {
    return getLatestHeroSuggestionsForWebsite(websiteId);
}

/** @deprecated Use `createHeroSuggestionRecords`. */
export async function createEmptyHeroSuggestions(
    websiteId: string,
): Promise<SerializableHeroSuggestion[]> {
    return createHeroSuggestionRecords({
        websiteId,
        crawlId: "000000000000000000000000",
        niceGuyMetricId: "000000000000000000000000",
        aiSummaryId: "000000000000000000000000",
        promptVersion: "hero-suggestions-v1",
        suggestionVersion: AI_HERO_SUGGESTION_VERSION,
        suggestions: [],
    });
}
