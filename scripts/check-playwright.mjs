import { chromium } from "playwright";

const launchOptions = {
    headless: process.env.PLAYWRIGHT_HEADLESS !== "false",
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?.trim()
        ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH.trim() }
        : {}),
};

try {
    const browser = await chromium.launch(launchOptions);
    const page = await browser.newPage();
    await page.goto("about:blank");
    const version = browser.version();
    await browser.close();
    console.log("STATUS: ready");
    console.log("BROWSER:", version);
} catch (error) {
    console.log("STATUS: failed");
    console.log("ERROR:", error instanceof Error ? error.message : String(error));
    console.log("HINT: Run npm run playwright:install");
    process.exit(1);
}
