import "server-only";

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

/** Chromium launch options for audit crawls (from `.env`). */
export function getPlaywrightLaunchOptions(): {
    headless: boolean;
    executablePath?: string;
} {
    return {
        headless: parseBoolean(process.env.PLAYWRIGHT_HEADLESS, true),
        executablePath: readOptionalPath(
            process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
        ),
    };
}

export const PLAYWRIGHT_ENV_KEYS = {
    headless: "PLAYWRIGHT_HEADLESS",
    chromiumExecutablePath: "PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH",
    browsersPath: "PLAYWRIGHT_BROWSERS_PATH",
} as const;
