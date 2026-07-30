import "server-only";

import { AI_CONFIG, getAiApiKey } from "@/src/lib/ai-config";
import type { AiProvider } from "@/src/services/ai/types";
import { OpenAiProvider } from "@/src/services/ai/providers/openai";

let cachedProvider: AiProvider | null = null;

export function getAiProvider(): AiProvider {
    if (cachedProvider) return cachedProvider;

    getAiApiKey();

    switch (AI_CONFIG.provider) {
        case "openai":
            cachedProvider = new OpenAiProvider();
            break;
        default:
            throw new Error("AI_CONFIGURATION_ERROR");
    }

    return cachedProvider;
}

export function resetAiProviderForTests(): void {
    cachedProvider = null;
}
