import { redactSensitiveUrl } from "@/src/services/cursor-analysis/redact-sensitive-url";

type AnalysisLogContext = {
    auditId?: string;
    analysisRequestId?: string;
    provider?: string;
    packageVersion?: string;
    promptVersion?: string;
    status?: string;
    errorCode?: string;
    attempt?: number;
    vercelProtectionBypass?: boolean;
};

function sanitizeContext(context: AnalysisLogContext): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(context)) {
        if (value !== undefined && value !== null) {
            sanitized[key] = value;
        }
    }
    return sanitized;
}

function sanitizeLogMessage(message: string | undefined): string | undefined {
    if (!message) return undefined;
    return redactSensitiveUrl(message).slice(0, 500);
}

export function logAnalysisEvent(
    event: string,
    context: AnalysisLogContext,
    message?: string,
): void {
    const sanitizedMessage = sanitizeLogMessage(message);
    const payload = {
        event,
        ...sanitizeContext(context),
        ...(sanitizedMessage ? { message: sanitizedMessage } : {}),
    };
    console.info("[cursor-analysis]", JSON.stringify(payload));
}

export function logAnalysisError(
    event: string,
    context: AnalysisLogContext,
    message?: string,
): void {
    const sanitizedMessage = sanitizeLogMessage(message);
    const payload = {
        event,
        ...sanitizeContext(context),
        ...(sanitizedMessage ? { message: sanitizedMessage } : {}),
    };
    console.error("[cursor-analysis]", JSON.stringify(payload));
}
