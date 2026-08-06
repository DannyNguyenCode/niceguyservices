import "server-only";

import type { Browser, Page, Response } from "playwright-core";
import { launchChromium, resolveChromiumRuntime } from "@/src/lib/playwright-config";
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
import {
    createPdfAttemptId,
    describePdfEnvironment,
    describeVercelAutomationBypass,
    logPdfError,
    logPdfEvent,
    logPdfStage,
    looksLikeVercelProtectionPage,
    sanitizeErrorMessage,
    sanitizeNavigationTarget,
} from "@/src/services/pdf-reports/pdf-diagnostics";
import {
    PdfStageError,
    classifyPrintHttpStatus,
} from "@/src/services/pdf-reports/pdf-stage-error";

async function waitForImages(page: Page): Promise<void> {
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

function attachSafePageListeners(page: Page, attemptId: string): void {
    page.on("pageerror", (error) => {
        logPdfError(attemptId, "pageerror", {
            errorName: error.name,
            message: sanitizeErrorMessage(error.message),
        });
    });

    page.on("console", (msg) => {
        if (msg.type() !== "error") return;
        logPdfError(attemptId, "console_error", {
            message: sanitizeErrorMessage(msg.text()),
        });
    });

    page.on("requestfailed", (request) => {
        try {
            const url = new URL(request.url());
            logPdfError(attemptId, "requestfailed", {
                method: request.method(),
                host: url.host,
                pathname: url.pathname.replace(
                    /\/internal\/reports\/[^/]+/i,
                    "/internal/reports/[redacted]",
                ),
                failure: sanitizeErrorMessage(request.failure()?.errorText),
            });
        } catch {
            logPdfError(attemptId, "requestfailed", {
                method: request.method(),
                failure: sanitizeErrorMessage(request.failure()?.errorText),
            });
        }
    });
}

async function safeCloseBrowser(browser: Browser | null, rootError: unknown): Promise<void> {
    if (!browser) return;
    try {
        await browser.close();
    } catch (closeError) {
        // Never replace the original failure with a cleanup error.
        void closeError;
        void rootError;
    }
}

async function classifyUnsuccessfulPrintResponse(input: {
    response: Response;
    page: Page;
    attemptId: string;
}): Promise<never> {
    const status = input.response.status();
    const statusText = input.response.statusText();
    const finalUrl = input.response.url();
    const nav = sanitizeNavigationTarget(finalUrl);

    let title: string | null = null;
    try {
        title = await input.page.title();
    } catch {
        title = null;
    }

    const protection = looksLikeVercelProtectionPage({
        status,
        title,
        finalUrl,
    });

    logPdfError(input.attemptId, "print_navigation_http", {
        stage: "PRINT_ROUTE_HTTP",
        host: nav.host,
        pathname: nav.pathname,
        status,
        statusText,
        title: title ? sanitizeErrorMessage(title, 120) : null,
        vercelProtectionSuspected: protection,
    });

    if (protection) {
        throw new PdfStageError("PDF_VERCEL_PROTECTION_BLOCKED", "PRINT_ROUTE_HTTP");
    }

    throw new PdfStageError(classifyPrintHttpStatus(status), "PRINT_ROUTE_HTTP");
}

export async function renderReportPdf(input: {
    publicReportId: string;
    pdfReportId: string;
    snapshotChecksum: string;
    attemptId?: string;
}): Promise<{
    buffer: Buffer;
    bytes: number;
    pageCount: number | null;
    engine: string;
    engineVersion: string | null;
    durationMs: number;
    attemptId: string;
}> {
    const attemptId = input.attemptId ?? createPdfAttemptId();
    const startedAt = Date.now();
    const timeout = getPdfRenderTimeoutMs();
    const envInfo = describePdfEnvironment();

    logPdfEvent(attemptId, "render_starting", {
        ...envInfo,
        chromiumRuntime: resolveChromiumRuntime(),
        timeoutMs: timeout,
    });

    const renderToken = buildPdfRenderToken({
        publicReportId: input.publicReportId,
        pdfReportId: input.pdfReportId,
        snapshotChecksum: input.snapshotChecksum,
    });

    const baseUrl = getPdfRenderBaseUrl();
    const urlBeforeBypass = `${baseUrl}/internal/reports/${input.publicReportId}/print?renderToken=${encodeURIComponent(renderToken)}`;
    const printUrl = applyVercelAutomationBypass(urlBeforeBypass);
    const bypassInfo = describeVercelAutomationBypass(urlBeforeBypass, printUrl);
    const navTarget = sanitizeNavigationTarget(printUrl);

    logPdfEvent(attemptId, "vercel_automation_bypass", bypassInfo);
    logPdfStage(attemptId, "PRINT_NAVIGATION", {
        phase: "prepared",
        host: navTarget.host,
        pathname: navTarget.pathname,
    });

    if (
        process.env.VERCEL_ENV === "preview" &&
        !bypassInfo.secretConfigured
    ) {
        logPdfError(attemptId, "preview_bypass_missing", {
            message:
                "Preview deployment without VERCEL_AUTOMATION_BYPASS_SECRET; print navigation may be blocked.",
        });
    }

    const maxAttempts = getPdfMaxRetries() + 1;
    let lastError: unknown = null;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        let browser: Browser | null = null;
        try {
            logPdfStage(attemptId, "CHROMIUM_LAUNCH", {
                attempt: attempt + 1,
                maxAttempts,
                runtime: resolveChromiumRuntime(),
            });

            try {
                browser = await launchChromium();
            } catch (launchError) {
                throw new PdfStageError("PDF_CHROMIUM_LAUNCH_FAILED", "CHROMIUM_LAUNCH", {
                    cause: launchError,
                    message: sanitizeErrorMessage(
                        launchError instanceof Error
                            ? launchError.message
                            : "Chromium launch failed",
                    ),
                });
            }

            logPdfEvent(attemptId, "chromium_launched", {
                version: browser.version(),
            });

            let context;
            let page: Page;
            try {
                logPdfStage(attemptId, "BROWSER_CONTEXT");
                context = await browser.newContext();
                page = await context.newPage();
            } catch (contextError) {
                throw new PdfStageError("PDF_BROWSER_CONTEXT_FAILED", "BROWSER_CONTEXT", {
                    cause: contextError,
                });
            }

            page.setDefaultTimeout(timeout);
            attachSafePageListeners(page, attemptId);

            logPdfStage(attemptId, "PRINT_NAVIGATION", {
                phase: "goto",
                host: navTarget.host,
                pathname: navTarget.pathname,
            });

            let response: Response | null = null;
            try {
                response = await page.goto(printUrl, {
                    waitUntil: "domcontentloaded",
                    timeout,
                });
            } catch (navError) {
                const message =
                    navError instanceof Error ? navError.message : String(navError);
                if (/timeout/i.test(message)) {
                    throw new PdfStageError("PDF_PRINT_NAVIGATION_FAILED", "PRINT_NAVIGATION", {
                        cause: navError,
                        message: "Navigation to internal print route timed out.",
                    });
                }
                throw new PdfStageError("PDF_PRINT_NAVIGATION_FAILED", "PRINT_NAVIGATION", {
                    cause: navError,
                });
            }

            if (!response) {
                throw new PdfStageError("PDF_PRINT_NAVIGATION_FAILED", "PRINT_NAVIGATION", {
                    message: "Navigation returned no response.",
                });
            }

            const status = response.status();
            const statusText = response.statusText();
            const responseNav = sanitizeNavigationTarget(response.url());
            logPdfEvent(attemptId, "print_navigation", {
                stage: "PRINT_ROUTE_HTTP",
                host: responseNav.host,
                pathname: responseNav.pathname,
                status,
                statusText,
            });

            if (!response.ok()) {
                await classifyUnsuccessfulPrintResponse({
                    response,
                    page,
                    attemptId,
                });
            }

            logPdfStage(attemptId, "REPORT_READY", { timeoutMs: timeout });
            try {
                await page.waitForSelector('[data-pdf-report-ready="true"]', { timeout });
            } catch (readyError) {
                let title: string | null = null;
                try {
                    title = await page.title();
                } catch {
                    title = null;
                }

                if (
                    looksLikeVercelProtectionPage({
                        status: response.status(),
                        title,
                        finalUrl: response.url(),
                    })
                ) {
                    throw new PdfStageError("PDF_VERCEL_PROTECTION_BLOCKED", "REPORT_READY", {
                        cause: readyError,
                    });
                }

                throw new PdfStageError("PDF_REPORT_READY_TIMEOUT", "REPORT_READY", {
                    cause: readyError,
                    message: "Expected [data-pdf-report-ready=true] did not appear in time.",
                });
            }

            await page.evaluate(() => document.fonts.ready);
            await waitForImages(page);

            logPdfStage(attemptId, "PDF_RENDER");
            let pdfBytes: Buffer;
            try {
                pdfBytes = Buffer.from(
                    await page.pdf({
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
                    }),
                );
            } catch (pdfError) {
                throw new PdfStageError("PDF_BUFFER_RENDER_FAILED", "PDF_RENDER", {
                    cause: pdfError,
                });
            }

            const engineVersion = browser.version();

            try {
                await context.close();
            } catch {
                // ignore
            }
            await safeCloseBrowser(browser, null);
            browser = null;

            if (!pdfBytes.length || pdfBytes.subarray(0, 5).toString() !== "%PDF-") {
                throw new PdfStageError("PDF_INVALID_BUFFER", "PDF_RENDER");
            }

            logPdfEvent(attemptId, "pdf_buffer_rendered", {
                bytes: pdfBytes.length,
                durationMs: Date.now() - startedAt,
            });

            return {
                buffer: pdfBytes,
                bytes: pdfBytes.length,
                pageCount: null,
                engine: PDF_RENDER_ENGINE,
                engineVersion,
                durationMs: Date.now() - startedAt,
                attemptId,
            };
        } catch (error) {
            lastError = error;
            logPdfError(attemptId, "render_attempt_failed", {
                attempt: attempt + 1,
                code: error instanceof PdfStageError ? error.code : "UNKNOWN",
                stage: error instanceof PdfStageError ? error.stage : "PDF_RENDER",
                errorName: error instanceof Error ? error.name : "Error",
                message: sanitizeErrorMessage(
                    error instanceof Error ? error.message : String(error),
                ),
            });
            await safeCloseBrowser(browser, error);
        }
    }

    if (lastError instanceof PdfStageError) {
        throw lastError;
    }

    if (lastError instanceof Error) {
        if (
            lastError.message === "browserType.launch" ||
            /launch/i.test(lastError.message)
        ) {
            throw new PdfStageError("PDF_CHROMIUM_LAUNCH_FAILED", "CHROMIUM_LAUNCH", {
                cause: lastError,
            });
        }
        if (isPdfErrorCodeMessage(lastError.message)) {
            throw lastError;
        }
    }

    throw new PdfStageError("PDF_RENDER_FAILED", "PDF_RENDER", { cause: lastError });
}

function isPdfErrorCodeMessage(message: string): boolean {
    return message.startsWith("PDF_");
}
