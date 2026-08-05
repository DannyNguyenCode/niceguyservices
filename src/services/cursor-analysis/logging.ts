type AnalysisLogContext = {
    auditId?: string;
    analysisRequestId?: string;
    provider?: string;
    packageVersion?: string;
    promptVersion?: string;
    status?: string;
    errorCode?: string;
    attempt?: number;
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

export function logAnalysisEvent(
    event: string,
    context: AnalysisLogContext,
    message?: string,
): void {
    const payload = {
        event,
        ...sanitizeContext(context),
        ...(message ? { message: message.slice(0, 500) } : {}),
    };
    console.info("[cursor-analysis]", JSON.stringify(payload));
}

export function logAnalysisError(
    event: string,
    context: AnalysisLogContext,
    message?: string,
): void {
    const payload = {
        event,
        ...sanitizeContext(context),
        ...(message ? { message: message.slice(0, 500) } : {}),
    };
    console.error("[cursor-analysis]", JSON.stringify(payload));
}
