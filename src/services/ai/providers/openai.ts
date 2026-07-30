import "server-only";

import { AI_CONFIG } from "@/src/lib/ai-config";
import type {
    AiProvider,
    GenerateStructuredInput,
    GenerateStructuredResult,
} from "@/src/services/ai/types";

type OpenAiChatResponse = {
    id?: string;
    model?: string;
    choices?: Array<{
        message?: {
            content?: string | null;
        };
    }>;
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
    };
    error?: {
        message?: string;
        type?: string;
    };
};

function isRetryableStatus(status: number): boolean {
    return status === 429 || status >= 500;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractJsonObject(text: string): unknown {
    const trimmed = text.trim();
    if (trimmed.startsWith("{")) {
        return JSON.parse(trimmed);
    }

    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
        return JSON.parse(trimmed.slice(start, end + 1));
    }

    throw new Error("AI_INVALID_RESPONSE");
}

export class OpenAiProvider implements AiProvider {
    readonly name = "openai";

    async generateStructured<TOutput>(
        input: GenerateStructuredInput,
        parse: (raw: unknown) => TOutput,
    ): Promise<GenerateStructuredResult<TOutput>> {
        const apiKey = process.env.AI_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim();
        if (!apiKey) {
            throw new Error("AI_CONFIGURATION_ERROR");
        }

        const startedAt = Date.now();
        let lastError: Error | null = null;

        for (let attempt = 0; attempt <= AI_CONFIG.maxRetries; attempt += 1) {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), AI_CONFIG.timeoutMs);

            if (input.signal) {
                if (input.signal.aborted) {
                    clearTimeout(timeout);
                    throw new Error("AI_REQUEST_TIMEOUT");
                }
                input.signal.addEventListener("abort", () => controller.abort(), { once: true });
            }

            try {
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: AI_CONFIG.model,
                        temperature: input.temperature ?? 0.2,
                        max_tokens: input.maxOutputTokens ?? 4096,
                        response_format: { type: "json_object" },
                        messages: [
                            { role: "system", content: input.systemPrompt },
                            {
                                role: "user",
                                content: `${input.userPrompt}\n\nReturn JSON for schema: ${input.schemaName}`,
                            },
                        ],
                    }),
                    signal: controller.signal,
                });

                if (!response.ok) {
                    if (isRetryableStatus(response.status) && attempt < AI_CONFIG.maxRetries) {
                        await sleep(AI_CONFIG.retryDelaysMs[attempt] ?? 3_000);
                        continue;
                    }
                    if (response.status === 429) {
                        throw new Error("AI_RATE_LIMIT");
                    }
                    throw new Error("AI_PROVIDER_ERROR");
                }

                const payload = (await response.json()) as OpenAiChatResponse;
                const content = payload.choices?.[0]?.message?.content;
                if (!content) {
                    throw new Error("AI_INVALID_RESPONSE");
                }

                const raw = extractJsonObject(content);
                const output = parse(raw);

                return {
                    output,
                    model: payload.model ?? AI_CONFIG.model,
                    promptTokens: payload.usage?.prompt_tokens,
                    completionTokens: payload.usage?.completion_tokens,
                    totalTokens: payload.usage?.total_tokens,
                    durationMs: Date.now() - startedAt,
                    providerRequestId: payload.id ?? null,
                };
            } catch (error) {
                if (error instanceof Error) {
                    if (error.name === "AbortError") {
                        throw new Error("AI_REQUEST_TIMEOUT");
                    }
                    if (
                        error.message.startsWith("AI_") &&
                        error.message !== "AI_INVALID_RESPONSE"
                    ) {
                        throw error;
                    }
                    lastError = error;
                }

                if (attempt < AI_CONFIG.maxRetries) {
                    await sleep(AI_CONFIG.retryDelaysMs[attempt] ?? 3_000);
                    continue;
                }
            } finally {
                clearTimeout(timeout);
            }
        }

        if (lastError?.message.includes("JSON")) {
            throw new Error("AI_INVALID_RESPONSE");
        }

        throw new Error("AI_PROVIDER_ERROR");
    }
}
