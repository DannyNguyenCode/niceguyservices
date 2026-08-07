import {
    getPlaywrightLaunchOptions,
    resolveChromiumRuntime,
} from "../src/lib/playwright-config";

async function main(): Promise<void> {
    const launchOptions = await getPlaywrightLaunchOptions();

    try {
        const { chromium } = await import("playwright-core");
        const browser = await chromium.launch(launchOptions);
        const page = await browser.newPage();
        await page.goto("about:blank");
        const version = browser.version();
        await browser.close();
        console.log("STATUS: ready");
        console.log("RUNTIME:", resolveChromiumRuntime());
        console.log("BROWSER:", version);
    } catch (error) {
        console.log("STATUS: failed");
        console.log("ERROR:", error instanceof Error ? error.message : String(error));
        console.log("HINT: On Windows/macOS run npm run playwright:install for local Chromium.");
        console.log("HINT: On Linux or WSL, Sparticuz is used automatically.");
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("FAIL playwright:check:", error instanceof Error ? error.message : String(error));
    process.exit(1);
});
