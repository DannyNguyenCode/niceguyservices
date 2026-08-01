import "server-only";

import type { AuditAnalysisProvider, AuditAnalysisTriggerResult } from "@/src/services/cursor-analysis/providers/types";
import {
    assertCursorAnalysisConfigured,
    getCursorAnalysisConfig,
} from "@/src/services/cursor-analysis/config";
import {
    CURSOR_ANALYSIS_EVENT,
    CURSOR_ANALYSIS_SCHEMA_VERSION,
} from "@/src/services/cursor-analysis/constants";

export class CursorAutomationAnalysisProvider implements AuditAnalysisProvider {
    readonly name = "cursor-automation";

    async requestAnalysis(input: {
        auditId: string;
        analysisRequestId: string;
        packageUrl: string;
        callbackUrl: string;
    }): Promise<AuditAnalysisTriggerResult> {
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
            callbackAuthorization: {
                type: "configured-secret-header",
                headerName: config.callbackHeader,
            },
        };

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30_000);

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

            if (!response.ok) {
                return {
                    accepted: false,
                    error: `Cursor webhook rejected the request (${response.status}).`,
                };
            }

            const externalJobId =
                typeof body.jobId === "string"
                    ? body.jobId
                    : typeof body.id === "string"
                      ? body.id
                      : undefined;

            return {
                accepted: true,
                externalJobId,
            };
        } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                return {
                    accepted: false,
                    error: "Cursor webhook request timed out.",
                };
            }
            return {
                accepted: false,
                error: "Cursor webhook could not be reached.",
            };
        } finally {
            clearTimeout(timeout);
        }
    }
}
