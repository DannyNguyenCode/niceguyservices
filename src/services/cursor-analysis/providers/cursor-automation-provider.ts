import "server-only";

import type {
    AuditAnalysisProvider,
    TriggerAnalysisInput,
    TriggerAnalysisResult,
} from "@/src/services/cursor-analysis/providers/types";
import {
    assertCursorAnalysisConfigured,
    getCursorAnalysisConfig,
} from "@/src/services/cursor-analysis/config";
import {
    CURSOR_ANALYSIS_EVENT,
    CURSOR_ANALYSIS_SCHEMA_VERSION,
} from "@/src/services/cursor-analysis/constants";
import { logAnalysisError, logAnalysisEvent } from "@/src/services/cursor-analysis/logging";
import { logCursorWebhookPackageReady } from "@/src/services/cursor-analysis/package-token";

const ACCEPTED_WEBHOOK_STATUSES = new Set([200, 201, 202, 204]);

function sanitizeProviderError(status: number, bodyText: string): string {
    const snippet = bodyText.trim().slice(0, 200);
    return snippet
        ? `Cursor webhook rejected the request (${status}): ${snippet}`
        : `Cursor webhook rejected the request (${status}).`;
}

export class CursorAutomationAnalysisProvider implements AuditAnalysisProvider {
    readonly name = "cursor-automation";

    async triggerAnalysis(input: TriggerAnalysisInput): Promise<TriggerAnalysisResult> {
        assertCursorAnalysisConfigured();
        const config = getCursorAnalysisConfig();

        const authHeader = config.webhookAuthHeader ?? "Authorization";
        const authScheme = config.webhookAuthScheme ?? "Bearer";
        const authValue = authScheme
            ? `${authScheme} ${config.webhookAuthToken}`
            : String(config.webhookAuthToken);

        const payload = {
            event: CURSOR_ANALYSIS_EVENT,
            schemaVersion: CURSOR_ANALYSIS_SCHEMA_VERSION,
            auditId: input.auditId,
            analysisRequestId: input.analysisRequestId,
            packageUrl: input.packageUrl,
            callbackUrl: input.callbackUrl,
            callbackAuthHeader: input.callbackAuthHeader,
            callbackAuthToken: input.callbackAuthToken,
            promptVersion: input.promptVersion,
            packageVersion: input.packageVersion,
        };

        logCursorWebhookPackageReady({
            auditId: input.auditId,
            analysisRequestId: input.analysisRequestId,
            packageUrl: input.packageUrl,
            callbackUrl: input.callbackUrl,
        });

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), config.webhookTimeoutMs);

        try {
            const response = await fetch(config.webhookUrl!, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    [authHeader]: authValue,
                },
                body: JSON.stringify(payload),
                signal: controller.signal,
            });

            const bodyText = await response.text();
            let body: Record<string, unknown> = {};
            if (bodyText) {
                try {
                    body = JSON.parse(bodyText) as Record<string, unknown>;
                } catch {
                    body = { message: bodyText.slice(0, 200) };
                }
            }

            if (!ACCEPTED_WEBHOOK_STATUSES.has(response.status)) {
                const error = sanitizeProviderError(response.status, bodyText);
                logAnalysisError(
                    "webhook_rejected",
                    {
                        auditId: input.auditId,
                        analysisRequestId: input.analysisRequestId,
                        provider: this.name,
                        errorCode: "TRIGGER_FAILED",
                    },
                    error,
                );
                return {
                    accepted: false,
                    error,
                    errorCode: "TRIGGER_FAILED",
                };
            }

            const externalJobId =
                typeof body.jobId === "string"
                    ? body.jobId
                    : typeof body.id === "string"
                      ? body.id
                      : undefined;

            logAnalysisEvent("webhook_accepted", {
                auditId: input.auditId,
                analysisRequestId: input.analysisRequestId,
                provider: this.name,
                packageVersion: input.packageVersion,
                promptVersion: input.promptVersion,
            });

            return {
                accepted: true,
                externalJobId,
            };
        } catch (error) {
            const message =
                error instanceof Error && error.name === "AbortError"
                    ? "Cursor webhook request timed out."
                    : "Cursor webhook could not be reached.";
            logAnalysisError(
                "webhook_error",
                {
                    auditId: input.auditId,
                    analysisRequestId: input.analysisRequestId,
                    provider: this.name,
                    errorCode: "TRIGGER_FAILED",
                },
                message,
            );
            return {
                accepted: false,
                error: message,
                errorCode: "TRIGGER_FAILED",
            };
        } finally {
            clearTimeout(timeout);
        }
    }
}
