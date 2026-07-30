import "server-only";

import { PAGESPEED_CONFIG, getPageSpeedApiKey } from "@/src/lib/pagespeed-config";
import type { PageSpeedStrategy } from "@/src/schemas/enums";

export class PageSpeedClientError extends Error {
    readonly code: string;

    constructor(code: string, message: string, options?: { cause?: unknown }) {
        super(message, options);
        this.name = "PageSpeedClientError";
        this.code = code;
    }
}

function isRetryableStatus(status: number): boolean {
    return [429, 500, 502, 503, 504].includes(status);
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseErrorBody(response: Response): Promise<string> {
    try {
        const json = (await response.json()) as { error?: { message?: string } };
        return json.error?.message ?? `HTTP ${response.status}`;
    } catch {
        return `HTTP ${response.status}`;
    }
}

export async function runPageSpeedTest(input: {
    url: string;
    strategy: PageSpeedStrategy;
    signal?: AbortSignal;
}): Promise<unknown> {
    const apiKey = getPageSpeedApiKey();
    const endpoint = new URL(PAGESPEED_CONFIG.endpoint);
    endpoint.searchParams.set("url", input.url);
    endpoint.searchParams.set("strategy", input.strategy);
    endpoint.searchParams.set("key", apiKey);

    for (const category of PAGESPEED_CONFIG.categories) {
        endpoint.searchParams.append("category", category);
    }

    let lastError: unknown;

    for (let attempt = 0; attempt <= PAGESPEED_CONFIG.maxRetries; attempt += 1) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), PAGESPEED_CONFIG.timeoutMs);

        const onAbort = () => controller.abort();
        input.signal?.addEventListener("abort", onAbort);

        try {
            const response = await fetch(endpoint.toString(), {
                method: "GET",
                signal: controller.signal,
                cache: "no-store",
            });

            if (!response.ok) {
                const detail = await parseErrorBody(response);
                if (response.status === 400) {
                    throw new PageSpeedClientError(
                        "PAGESPEED_URL_ERROR",
                        "Google PageSpeed could not analyze this URL.",
                    );
                }
                if (response.status === 401 || response.status === 403) {
                    throw new PageSpeedClientError(
                        "PAGESPEED_CONFIGURATION_ERROR",
                        "Google PageSpeed API credentials are invalid.",
                    );
                }
                if (response.status === 429) {
                    if (attempt < PAGESPEED_CONFIG.maxRetries) {
                        await sleep(PAGESPEED_CONFIG.retryDelaysMs[attempt] ?? 3_000);
                        continue;
                    }
                    throw new PageSpeedClientError(
                        "PAGESPEED_RATE_LIMIT",
                        "Google PageSpeed rate limit reached. Try again later.",
                    );
                }
                if (isRetryableStatus(response.status)) {
                    if (attempt < PAGESPEED_CONFIG.maxRetries) {
                        await sleep(PAGESPEED_CONFIG.retryDelaysMs[attempt] ?? 3_000);
                        continue;
                    }
                    throw new PageSpeedClientError(
                        "PAGESPEED_API_ERROR",
                        "Google PageSpeed could not complete the analysis.",
                    );
                }
                throw new PageSpeedClientError(
                    "PAGESPEED_API_ERROR",
                    "Google PageSpeed could not complete the analysis.",
                    { cause: detail },
                );
            }

            return await response.json();
        } catch (error) {
            lastError = error;
            if (error instanceof PageSpeedClientError) {
                if (
                    !["PAGESPEED_RATE_LIMIT", "PAGESPEED_API_ERROR"].includes(error.code) ||
                    attempt >= PAGESPEED_CONFIG.maxRetries
                ) {
                    throw error;
                }
                await sleep(PAGESPEED_CONFIG.retryDelaysMs[attempt] ?? 3_000);
                continue;
            }

            const isAbort =
                error instanceof Error &&
                (error.name === "AbortError" || error.message.includes("aborted"));

            if (isAbort) {
                throw new PageSpeedClientError(
                    "PAGESPEED_TIMEOUT",
                    "Google PageSpeed timed out before completing the analysis.",
                );
            }

            if (attempt < PAGESPEED_CONFIG.maxRetries) {
                await sleep(PAGESPEED_CONFIG.retryDelaysMs[attempt] ?? 3_000);
                continue;
            }

            throw new PageSpeedClientError(
                "PAGESPEED_NETWORK_ERROR",
                "Google PageSpeed could not be reached.",
                { cause: error },
            );
        } finally {
            clearTimeout(timeout);
            input.signal?.removeEventListener("abort", onAbort);
        }
    }

    throw lastError instanceof Error
        ? lastError
        : new PageSpeedClientError(
              "PAGESPEED_API_ERROR",
              "Google PageSpeed could not complete the analysis.",
          );
}
