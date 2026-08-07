export type AuditPlatformErrorCode =
    | "VALIDATION_ERROR"
    | "NORMALIZE_DOMAIN_ERROR"
    | "SCREENSHOT_PATH_ERROR"
    | "INVALID_OBJECT_ID"
    | "AUTH_VALIDATION_ERROR"
    | "CONFIGURATION_ERROR";

export class AuditPlatformError extends Error {
    readonly code: AuditPlatformErrorCode;

    constructor(code: AuditPlatformErrorCode, message: string, options?: { cause?: unknown }) {
        super(message, options);
        this.name = "AuditPlatformError";
        this.code = code;
    }
}

export class NormalizeDomainError extends AuditPlatformError {
    constructor(message: string) {
        super("NORMALIZE_DOMAIN_ERROR", message);
        this.name = "NormalizeDomainError";
    }
}

export class ScreenshotPathError extends AuditPlatformError {
    constructor(message: string) {
        super("SCREENSHOT_PATH_ERROR", message);
        this.name = "ScreenshotPathError";
    }
}

export class InvalidObjectIdError extends AuditPlatformError {
    constructor(label: string) {
        super("INVALID_OBJECT_ID", `Invalid ${label}.`);
        this.name = "InvalidObjectIdError";
    }
}

export class AuthValidationError extends AuditPlatformError {
    constructor(message: string) {
        super("AUTH_VALIDATION_ERROR", message);
        this.name = "AuthValidationError";
    }
}

export function toSafeErrorMessage(
    error: unknown,
    fallback = "Something went wrong.",
): string {
    if (error instanceof AuditPlatformError) {
        return error.message;
    }
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return fallback;
}
