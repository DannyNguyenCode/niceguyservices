import "server-only";

import sparticuzChromium from "@sparticuz/chromium";
import type { Browser } from "playwright-core";

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

/** Sparticuz ships a Linux binary; use it on Linux unless overridden. */
export function resolveChromiumRuntime(): "sparticuz" | "local" {
    if (readOptionalPath(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH)) {
        return "local";
    }

    if (process.env.PLAYWRIGHT_USE_SPARTICUZ === "1") {
        return "sparticuz";
    }

    if (process.env.PLAYWRIGHT_USE_SPARTICUZ === "0") {
        return "local";
    }

    return process.platform === "linux" ? "sparticuz" : "local";
}

/** Chromium launch options for audit crawls and PDF rendering. */
export async function getPlaywrightLaunchOptions(): Promise<{
    headless: boolean;
    executablePath: string;
    args: string[];
}> {
    const headless = parseBoolean(process.env.PLAYWRIGHT_HEADLESS, true);
    const customExecutable = readOptionalPath(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH);

    if (customExecutable) {
        return {
            headless,
            executablePath: customExecutable,
            args: [],
        };
    }

    if (resolveChromiumRuntime() === "sparticuz") {
        return {
            headless,
            executablePath: await sparticuzChromium.executablePath(),
            args: [...sparticuzChromium.args],
        };
    }

    const { chromium } = await import("playwright-core");
    return {
        headless,
        executablePath: chromium.executablePath(),
        args: [],
    };
}

export async function launchChromium(): Promise<Browser> {
    const { chromium } = await import("playwright-core");
    return chromium.launch(await getPlaywrightLaunchOptions());
}

export const PLAYWRIGHT_ENV_KEYS = {
    headless: "PLAYWRIGHT_HEADLESS",
    chromiumExecutablePath: "PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH",
    useSparticuz: "PLAYWRIGHT_USE_SPARTICUZ",
} as const;
