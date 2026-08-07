import { test, expect, chromium } from "@playwright/test";

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Website Audit Playwright Test</title>
    <meta name="description" content="Smoke test page for the audit crawler." />
  </head>
  <body>
    <h1>Playwright works</h1>
    <p>This page verifies browser launch, DOM access, and screenshots.</p>
    <a href="/contact">Contact</a>
  </body>
</html>`;

test.describe("Playwright setup", () => {
    test("chromium launches", async () => {
        const browser = await chromium.launch();
        expect(browser.version()).toBeTruthy();
        await browser.close();
    });

    test("reads page title and content from HTML", async ({ page }) => {
        await page.setContent(SAMPLE_HTML, { waitUntil: "domcontentloaded" });

        await expect(page).toHaveTitle(/Website Audit Playwright Test/i);
        await expect(page.locator("h1")).toHaveText("Playwright works");
        await expect(page.locator("meta[name='description']")).toHaveAttribute(
            "content",
            /audit crawler/i,
        );
    });

    test("captures desktop and mobile viewport screenshots", async ({ browser }) => {
        const desktopContext = await browser.newContext({
            viewport: { width: 1440, height: 900 },
        });
        const desktopPage = await desktopContext.newPage();
        await desktopPage.setContent(SAMPLE_HTML, { waitUntil: "domcontentloaded" });

        const desktopShot = await desktopPage.screenshot({ fullPage: false, type: "png" });
        expect(desktopShot.byteLength).toBeGreaterThan(500);

        const desktopFullShot = await desktopPage.screenshot({ fullPage: true, type: "png" });
        expect(desktopFullShot.byteLength).toBeGreaterThan(500);

        await desktopContext.close();

        const mobileContext = await browser.newContext({
            viewport: { width: 390, height: 844 },
            isMobile: true,
            hasTouch: true,
        });
        const mobilePage = await mobileContext.newPage();
        await mobilePage.setContent(SAMPLE_HTML, { waitUntil: "domcontentloaded" });

        const mobileShot = await mobilePage.screenshot({ fullPage: false, type: "png" });
        expect(mobileShot.byteLength).toBeGreaterThan(500);

        const mobileFullShot = await mobilePage.screenshot({ fullPage: true, type: "png" });
        expect(mobileFullShot.byteLength).toBeGreaterThan(500);

        await mobileContext.close();
    });

    test("loads a public HTTPS page @network", async ({ page }) => {
        test.skip(
            process.env.PLAYWRIGHT_NETWORK_TESTS !== "1",
            "Set PLAYWRIGHT_NETWORK_TESTS=1 in .env to run live network checks.",
        );

        const response = await page.goto("https://example.com", {
            waitUntil: "domcontentloaded",
        });

        expect(response?.ok()).toBeTruthy();
        await expect(page).toHaveTitle(/Example Domain/i);
    });
});
