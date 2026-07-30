import "server-only";

function parsePositiveInt(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const CRAWL_CONFIG = {
    maxPages: parsePositiveInt(process.env.CRAWL_MAX_PAGES, 20),
    maxDepth: parsePositiveInt(process.env.CRAWL_MAX_DEPTH, 3),
    timeoutMs: parsePositiveInt(process.env.CRAWL_TIMEOUT_MS, 30_000),
    maxInternalLinksStored: 200,
    maxExternalLinksStored: 100,
    maxVisibleTextCharactersPerPage: 15_000,
    maxRedirects: 5,
    contentSettleMs: 1_500,
    desktopViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
    mobileViewport: { width: 390, height: 844, deviceScaleFactor: 1 },
    desktopUserAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    mobileUserAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
} as const;
