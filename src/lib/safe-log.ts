const SENSITIVE_KEY_PATTERN =
    /(password|secret|token|authorization|cookie|api[_-]?key|mongodb|connectionstring|privatekey|clientsecret|rendertoken|previewtoken|publictoken)/i;

export type SafeLogFields = Record<string, unknown>;

export function sanitizeLogFields(input: SafeLogFields): SafeLogFields {
    const output: SafeLogFields = {};

    for (const [key, value] of Object.entries(input)) {
        if (SENSITIVE_KEY_PATTERN.test(key)) {
            continue;
        }
        if (typeof value === "string" && value.length > 500) {
            output[key] = `${value.slice(0, 500)}…`;
            continue;
        }
        output[key] = value;
    }

    return output;
}

export function logInfo(event: string, fields: SafeLogFields = {}): void {
    console.info(
        JSON.stringify({
            level: "info",
            event,
            timestamp: new Date().toISOString(),
            ...sanitizeLogFields(fields),
        }),
    );
}

export function logWarn(event: string, fields: SafeLogFields = {}): void {
    console.warn(
        JSON.stringify({
            level: "warn",
            event,
            timestamp: new Date().toISOString(),
            ...sanitizeLogFields(fields),
        }),
    );
}

export function logError(event: string, fields: SafeLogFields = {}): void {
    console.error(
        JSON.stringify({
            level: "error",
            event,
            timestamp: new Date().toISOString(),
            ...sanitizeLogFields(fields),
        }),
    );
}

export function sanitizeErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
        return error.message.slice(0, 300);
    }
    return "An unexpected error occurred.";
}
