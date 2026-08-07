import { defineConfig, devices } from "@playwright/test";

const headless = process.env.PLAYWRIGHT_HEADLESS !== "false";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?.trim();

export default defineConfig({
    testDir: "tests/playwright",
    timeout: 60_000,
    expect: {
        timeout: 10_000,
    },
    fullyParallel: false,
    workers: 1,
    retries: process.env.CI ? 1 : 0,
    reporter: "list",
    use: {
        headless,
        ignoreHTTPSErrors: false,
        ...(executablePath ? { launchOptions: { executablePath } } : {}),
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
