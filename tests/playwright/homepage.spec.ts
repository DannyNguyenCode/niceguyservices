import { test, expect } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL?.trim() || "http://127.0.0.1:3000";

test.describe("homepage marketing surface", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(baseURL + "/", { waitUntil: "domcontentloaded" });
    });

    test("renders one correctly spaced H1 and valid hero CTAs (desktop)", async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });

        const headings = page.locator("main h1, h1#home-hero-heading");
        await expect(headings).toHaveCount(1);
        const h1 = page.locator("#home-hero-heading");
        await expect(h1).toBeVisible();
        const text = (await h1.innerText()).replace(/\s+/g, " ").trim();
        expect(text).toBe("We Build Websites That Grow Businesses");
        expect(text).not.toContain("WebsitesThat");

        const primary = page.getByRole("link", { name: /Start your project/i }).first();
        const secondary = page.getByRole("link", { name: /See our work/i }).first();
        await expect(primary).toBeVisible();
        await expect(secondary).toBeVisible();
        await expect(primary).toHaveAttribute("href", "/contact");
        await expect(secondary).toHaveAttribute("href", "/work");

        await expect(page.getByText(/reply within one business day/i).first()).toBeVisible();

        const emptyHrefs = await page.locator('a[href=""], a[href="#"]').count();
        expect(emptyHrefs).toBe(0);
    });

    test("keeps hero content visible immediately (including reduced motion)", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.reload({ waitUntil: "domcontentloaded" });

        const h1 = page.locator("#home-hero-heading");
        await expect(h1).toBeVisible();
        await expect(h1).toHaveCSS("opacity", "1");

        const primary = page.getByRole("link", { name: /Start your project/i }).first();
        await expect(primary).toBeVisible();
        await expect(primary).toHaveCSS("opacity", "1");
    });

    test("shows primary CTA without overlap at ~390px", async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.reload({ waitUntil: "domcontentloaded" });

        const primary = page.getByRole("link", { name: /Start your project/i }).first();
        await expect(primary).toBeVisible();
        const box = await primary.boundingBox();
        expect(box).toBeTruthy();
        if (box) {
            expect(box.x).toBeGreaterThanOrEqual(0);
            expect(box.x + box.width).toBeLessThanOrEqual(390 + 1);
            expect(box.y).toBeLessThan(844);
        }

        const h1 = page.locator("#home-hero-heading");
        await expect(h1).toBeVisible();
    });

    test("Work dropdown uses a button without chevron in the accessible name", async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        const work = page.getByRole("button", { name: /^Work$/ });
        await expect(work).toBeVisible();
        await expect(work).toHaveAttribute("aria-expanded", "false");
        await expect(work).toHaveAttribute("aria-haspopup", "menu");

        const name = await work.getAttribute("aria-label");
        expect(name).toBe("Work");
        expect(name).not.toMatch(/▾|¾|▼/);

        await work.click();
        await expect(work).toHaveAttribute("aria-expanded", "true");
        const featured = page.getByRole("menuitem", { name: /Featured Work/i });
        await expect(featured).toBeVisible();
        await expect(featured).toHaveAttribute("href", "/work");
        await page.keyboard.press("Escape");
        await expect(work).toHaveAttribute("aria-expanded", "false");
    });

    test("decorative hero browser image stays empty-alt / aria-hidden", async ({ page }) => {
        const browser = page.locator(".home-hero-browser");
        await expect(browser).toHaveAttribute("aria-hidden", "true");
        const img = browser.locator("img");
        await expect(img).toHaveAttribute("alt", "");
    });
});
