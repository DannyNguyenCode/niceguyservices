import "server-only";

import type { Browser } from "playwright-core";
import { launchChromium } from "@/src/lib/playwright-config";
import { applyVercelAutomationBypass } from "@/src/services/cursor-analysis/vercel-automation-bypass";
import { buildPdfRenderToken } from "@/src/services/pdf-reports/build-pdf-render-token";
import {
    getPdfMaxRetries,
    getPdfRenderBaseUrl,
    getPdfRenderTimeoutMs,
} from "@/src/services/pdf-reports/env";
import {
    PDF_DEFAULT_MARGINS,
    PDF_PAPER_FORMAT,
    PDF_RENDER_ENGINE,
} from "@/src/services/pdf-reports/constants";

async function waitForImages(page: import("playwright-core").Page): Promise<void> {
    await page.evaluate(async () => {
        const images = Array.from(document.images);
        await Promise.all(
            images.map((image) => {
                if (image.complete) return Promise.resolve();
                return new Promise<void>((resolve) => {
                    image.addEventListener("load", () => resolve(), { once: true });
                    image.addEventListener("error", () => resolve(), { once: true });
                });
            }),
        );
    });
}

export async function renderReportPdf(input: {
    publicReportId: string;
    pdfReportId: string;
    snapshotChecksum: string;
}): Promise<{
    buffer: Buffer;
    bytes: number;
    pageCount: number | null;
    engine: string;
    engineVersion: string | null;
    durationMs: number;
}> {
    const startedAt = Date.now();
    const timeout = getPdfRenderTimeoutMs();
    const renderToken = buildPdfRenderToken(input);
    // Preview deployments with Vercel Authentication block headless Chromium unless
    // the official protection-bypass query param is present (same pattern as Cursor).
    const printUrl = applyVercelAutomationBypass(
        `${getPdfRenderBaseUrl()}/internal/reports/${input.publicReportId}/print?renderToken=${encodeURIComponent(renderToken)}`,
    );

    const maxAttempts = getPdfMaxRetries() + 1;
    let lastError: unknown = null;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        let browser: Browser | null = null;
        try {
            browser = await launchChromium();
            const context = await browser.newContext();
            const page = await context.newPage();
            page.setDefaultTimeout(timeout);

            const response = await page.goto(printUrl, { waitUntil: "domcontentloaded", timeout });
            if (!response || !response.ok()) {
                throw new Error("PDF_RENDER_ROUTE_FAILED");
            }

            await page.waitForSelector('[data-pdf-report-ready="true"]', { timeout });
            await page.evaluate(() => document.fonts.ready);
            await waitForImages(page);

            const pdfBytes = await page.pdf({
                format: PDF_PAPER_FORMAT,
                printBackground: true,
                preferCSSPageSize: true,
                displayHeaderFooter: false,
                margin: {
                    top: PDF_DEFAULT_MARGINS.top,
                    right: PDF_DEFAULT_MARGINS.right,
                    bottom: PDF_DEFAULT_MARGINS.bottom,
                    left: PDF_DEFAULT_MARGINS.left,
                },
            });

            const engineVersion = browser.version();

            await context.close();
            await browser.close();
            browser = null;

            const buffer = Buffer.from(pdfBytes);
            if (!buffer.length || buffer.subarray(0, 5).toString() !== "%PDF-") {
                throw new Error("PDF_INVALID_BUFFER");
            }

            return {
                buffer,
                bytes: buffer.length,
                pageCount: null,
                engine: PDF_RENDER_ENGINE,
                engineVersion,
                durationMs: Date.now() - startedAt,
            };
        } catch (error) {
            lastError = error;
            if (browser) {
                await browser.close().catch(() => undefined);
            }

            const message = error instanceof Error ? error.message : String(error);
            if (message.includes("Timeout") || message.includes("timeout")) {
                lastError = new Error("PDF_RENDER_TIMEOUT");
            }
        }
    }

    if (lastError instanceof Error) {
        if (lastError.message === "browserType.launch") {
            throw new Error("PDF_BROWSER_LAUNCH_FAILED");
        }
        throw lastError;
    }

    throw new Error("PDF_RENDER_FAILED");
}
