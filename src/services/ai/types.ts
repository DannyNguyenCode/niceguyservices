import type { z } from "zod";
import type {
    aiSummaryOutputSchema,
    heroSuggestionsOutputSchema,
} from "@/src/services/ai/schemas";

export type AiSummaryOutput = z.infer<typeof aiSummaryOutputSchema>;
export type HeroSuggestionsOutput = z.infer<typeof heroSuggestionsOutputSchema>;

export type GenerateStructuredInput = {
    systemPrompt: string;
    userPrompt: string;
    schemaName: string;
    temperature?: number;
    maxOutputTokens?: number;
    signal?: AbortSignal;
};

export type GenerateStructuredResult<TOutput> = {
    output: TOutput;
    model: string;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    durationMs: number;
    providerRequestId?: string | null;
};

export interface AiProvider {
    name: string;
    generateStructured<TOutput>(
        input: GenerateStructuredInput,
        parse: (raw: unknown) => TOutput,
    ): Promise<GenerateStructuredResult<TOutput>>;
}

export type AuditAnalysisInput = {
    website: {
        businessName?: string | null;
        url: string;
        industry?: string | null;
        location?: string | null;
    };
    crawl: {
        requestedUrl: string;
        finalUrl?: string | null;
        pageCount: number;
        pages: Array<{
            pageType: string;
            url: string;
            title?: string | null;
            metaDescription?: string | null;
            headings: string[];
            ctas: string[];
            formCount: number;
            visibleTextExcerpt: string;
            error?: string | null;
        }>;
        contactEvidence: {
            phoneCount: number;
            emailCount: number;
            socialLinkCount: number;
            hasContactPage: boolean;
            hasAboutPage: boolean;
            hasServicesPage: boolean;
        };
        discoveredPaths: string[];
    };
    pagespeed: {
        mobile?: {
            scores: Record<string, number | null | undefined>;
            keyMetrics: { lcp?: number | null; cls?: number | null; tbt?: number | null };
            opportunities: Array<{
                auditId: string;
                title: string;
                priority: string;
                estimatedSavingsMs?: number | null;
                estimatedSavingsBytes?: number | null;
            }>;
        } | null;
        desktop?: {
            scores: Record<string, number | null | undefined>;
            keyMetrics: { lcp?: number | null; cls?: number | null; tbt?: number | null };
            opportunities: Array<{
                auditId: string;
                title: string;
                priority: string;
                estimatedSavingsMs?: number | null;
                estimatedSavingsBytes?: number | null;
            }>;
        } | null;
    };
    niceGuy: {
        scoringVersion: string;
        overallScore: number;
        categories: Array<{
            id: string;
            name: string;
            score: number;
            confidence: number;
            checks: Array<{
                id: string;
                label: string;
                status: string;
                pointsAwarded: number;
                maximumPoints: number;
                recommendation?: string | null;
                priority?: string | null;
                evidence: string[];
                missing: string[];
            }>;
        }>;
    };
    screenshots: {
        available: boolean;
        count: number;
        visuallyAnalyzed: boolean;
    };
};

export type ValidCheckIds = Set<string>;
