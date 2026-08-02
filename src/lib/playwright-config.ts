import "server-only";

import type { Browser } from "playwright";

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
    if (!value) return fallback;

    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes"].includes(normalized)) return true;
    if (["false", "0", "no"].includes(normalized)) return false;
    return fallback;
}

function readOptionalPath(value: string | undefined): string | undefined {
    const trimmed = value?.trim();
    return trimmed || undefined;
}

function isServerlessRuntime(): boolean {
    return Boolean(
        process.env.VERCEL ||
            process.env.AWS_LAMBDA_FUNCTION_NAME ||
            process.env.AWS_EXECUTION_ENV,
    );
}

/** Keep browser binaries inside the traced package directory on Vercel/Lambda. */
export function ensureBundledPlaywrightBrowsersPath(): void {
    if (!process.env.PLAYWRIGHT_BROWSERS_PATH?.trim() && isServerlessRuntime()) {
        process.env.PLAYWRIGHT_BROWSERS_PATH = "0";
    }
}

const SERVERLESS_CHROMIUM_ARGS = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
] as const;

/** Chromium launch options for audit crawls (from `.env`). */
export function getPlaywrightLaunchOptions(): {
    headless: boolean;
    executablePath?: string;
    args?: string[];
} {
    ensureBundledPlaywrightBrowsersPath();

    return {
        headless: parseBoolean(process.env.PLAYWRIGHT_HEADLESS, true),
        executablePath: readOptionalPath(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH),
        ...(isServerlessRuntime() ? { args: [...SERVERLESS_CHROMIUM_ARGS] } : {}),
    };
}

export async function launchChromium(): Promise<Browser> {
    ensureBundledPlaywrightBrowsersPath();
    const { chromium } = await import("playwright");
    return chromium.launch(getPlaywrightLaunchOptions());
}

export const PLAYWRIGHT_ENV_KEYS = {
    headless: "PLAYWRIGHT_HEADLESS",
    chromiumExecutablePath: "PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH",
    browsersPath: "PLAYWRIGHT_BROWSERS_PATH",
} as const;
