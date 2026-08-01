import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { AUDIT_NAV_SECTIONS } from "../../src/lib/audit-sections";

const FIXTURE_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Audit dashboard fixture</title>
    <style>
      body { margin: 0; font-family: sans-serif; }
      .sticky { position: sticky; top: 0; background: white; padding: 12px; border-bottom: 1px solid #ddd; }
      section { min-height: 70vh; padding: 24px; border-bottom: 1px solid #eee; scroll-margin-top: 96px; }
      .long { word-break: break-all; }
    </style>
  </head>
  <body>
    <nav class="sticky" aria-label="Audit dashboard sections">
      <select id="audit-section-select" aria-label="Jump to section">
        ${AUDIT_NAV_SECTIONS.map(
            (section) => `<option value="${section.id}">${section.label}</option>`,
        ).join("")}
      </select>
      <div id="nav-buttons">
        ${AUDIT_NAV_SECTIONS.map(
            (section) =>
                `<button type="button" data-target="${section.id}">${section.label}</button>`,
        ).join("")}
      </div>
    </nav>
    ${AUDIT_NAV_SECTIONS.map(
        (section) =>
            `<section id="${section.id}"><h2 id="${section.headingId}">${section.label}</h2><p class="long">https://niceguyservices.vercel.app/with/a/very/long/path/that/should/wrap/without/horizontal/page/overflow</p></section>`,
    ).join("")}
    <script>
      function scrollToSection(id) {
        const element = document.getElementById(id);
        if (!element) return;
        element.scrollIntoView({ behavior: 'auto', block: 'start' });
        const heading = element.querySelector('h2');
        if (heading) heading.focus();
      }
      document.getElementById('audit-section-select').addEventListener('change', (event) => {
        scrollToSection(event.target.value);
      });
      for (const button of document.querySelectorAll('[data-target]')) {
        button.addEventListener('click', () => scrollToSection(button.getAttribute('data-target')));
      }
    </script>
  </body>
</html>`;

const VIEWPORTS = [
    { name: "phone-320", width: 320, height: 568 },
    { name: "phone-390", width: 390, height: 844 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "laptop-1024", width: 1024, height: 768 },
    { name: "desktop-1440", width: 1440, height: 900 },
] as const;

for (const viewport of VIEWPORTS) {
    test.describe(`dashboard sections @${viewport.name}`, () => {
        test.use({ viewport: { width: viewport.width, height: viewport.height } });

        test.beforeEach(async ({ page }) => {
            await page.setContent(FIXTURE_HTML, { waitUntil: "domcontentloaded" });
        });

        test("does not create page-level horizontal overflow", async ({ page }) => {
            const overflow = await page.evaluate(() => {
                return document.documentElement.scrollWidth > window.innerWidth + 1;
            });
            expect(overflow).toBe(false);
        });

        test("every navigation item reaches a valid section", async ({ page }) => {
            for (const section of AUDIT_NAV_SECTIONS) {
                await page.locator(`[data-target="${section.id}"]`).click();
                await expect(page.locator(`#${section.id}`)).toBeVisible();
                await expect(page.locator(`#${section.headingId}`)).toBeInViewport();
            }
        });

        test("mobile select navigates to the selected section", async ({ page }) => {
            await page.selectOption("#audit-section-select", "metrics");
            await expect(page.locator("#metrics")).toBeInViewport();
            await page.selectOption("#audit-section-select", "stage-execution-log");
            await expect(page.locator("#stage-execution-log")).toBeInViewport();
        });
    });
}

test("fixture file remains aligned with section config", () => {
    const html = readFileSync(resolve(__dirname, "../fixtures/dashboard-sections.html"), "utf8");
    for (const section of AUDIT_NAV_SECTIONS) {
        expect(html).toContain(`id="${section.id}"`);
    }
});
