import "server-only";

export const AI_ANALYSIS_VERSION = "audit-analysis-v1";
export const AI_HERO_SUGGESTION_VERSION = "hero-suggestions-v1";

function parsePositiveInt(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const AI_CONFIG = {
    provider: (process.env.AI_PROVIDER?.trim() || "openai").toLowerCase(),
    model: process.env.AI_MODEL?.trim() || "gpt-4o-mini",
    timeoutMs: parsePositiveInt(process.env.AI_REQUEST_TIMEOUT_MS, 120_000),
    maxRetries: parsePositiveInt(process.env.AI_MAX_RETRIES, 2),
    analysisPromptVersion:
        process.env.AI_ANALYSIS_PROMPT_VERSION?.trim() || AI_ANALYSIS_VERSION,
    heroPromptVersion:
        process.env.AI_HERO_PROMPT_VERSION?.trim() || AI_HERO_SUGGESTION_VERSION,
    retryDelaysMs: [1_000, 3_000],
} as const;

export function getAiApiKey(): string {
    const generic = process.env.AI_API_KEY?.trim();
    if (generic && generic !== "your-ai-api-key") return generic;

    const provider = AI_CONFIG.provider;
    if (provider === "openai") {
        const key = process.env.OPENAI_API_KEY?.trim();
        if (key && key !== "your-openai-api-key") return key;
    }
    if (provider === "anthropic") {
        const key = process.env.ANTHROPIC_API_KEY?.trim();
        if (key && key !== "your-anthropic-api-key") return key;
    }
    if (provider === "google") {
        const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
        if (key && key !== "your-google-ai-api-key") return key;
    }

    throw new Error("AI_CONFIGURATION_ERROR");
}

export function isAiConfigured(): boolean {
    try {
        getAiApiKey();
        return true;
    } catch {
        return false;
    }
}
