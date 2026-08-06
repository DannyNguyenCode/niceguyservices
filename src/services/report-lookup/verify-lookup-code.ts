import "server-only";

import {
    consumeLookupVerification,
    getLatestOpenLookupVerification,
    incrementLookupVerificationAttempts,
} from "@/src/data/report-lookup-verifications";
import { getAuthSecret } from "@/src/lib/auth/config";
import {
    REPORT_LOOKUP_MAX_ATTEMPTS,
} from "@/src/services/report-lookup/constants";
import {
    hashVerificationCode,
    isValidVerificationCodeFormat,
    verificationCodesEqual,
} from "@/src/services/report-lookup/crypto";
import {
    establishReportLookupSession,
    type ReportLookupSession,
} from "@/src/services/report-lookup/lookup-session";
import { ReportLookupValidationError } from "@/src/services/report-lookup/request-lookup-code";
import { verifyLookupCodeSchema } from "@/src/services/report-lookup/validation";

export type VerifyLookupCodeResult = {
    success: true;
    message: string;
    session: ReportLookupSession;
};

export type VerifyLookupCodeDeps = {
    getLatestOpen?: typeof getLatestOpenLookupVerification;
    incrementAttempts?: typeof incrementLookupVerificationAttempts;
    consume?: typeof consumeLookupVerification;
    establishSession?: typeof establishReportLookupSession;
    getSecret?: () => string;
    now?: () => Date;
};

export class ReportLookupVerifyError extends Error {
    readonly status: number;
    readonly code: string;

    constructor(code: string, message: string, status = 401) {
        super(message);
        this.name = "ReportLookupVerifyError";
        this.code = code;
        this.status = status;
    }
}

/**
 * Verify a 6-digit code and establish a short-lived lookup session.
 * Codes are single-use; attempt limits and expiration are enforced server-side.
 */
export async function verifyReportLookupCode(
    input: unknown,
    deps: VerifyLookupCodeDeps = {},
): Promise<VerifyLookupCodeResult> {
    const parsed = verifyLookupCodeSchema.safeParse(input);
    if (!parsed.success) {
        const message =
            parsed.error.issues[0]?.message ?? "Please enter a valid email and code.";
        throw new ReportLookupValidationError(message);
    }

    const { email: normalizedEmail, code } = parsed.data;
    if (!isValidVerificationCodeFormat(code)) {
        throw new ReportLookupValidationError(
            "Please enter the 6-digit verification code.",
        );
    }

    const getLatest = deps.getLatestOpen ?? getLatestOpenLookupVerification;
    const increment = deps.incrementAttempts ?? incrementLookupVerificationAttempts;
    const consume = deps.consume ?? consumeLookupVerification;
    const establish = deps.establishSession ?? establishReportLookupSession;
    const now = (deps.now ?? (() => new Date))();

    const record = await getLatest(normalizedEmail);
    if (!record) {
        throw new ReportLookupVerifyError(
            "INVALID_CODE",
            "That verification code is invalid or expired. Please request a new code.",
        );
    }

    if (record.attemptCount >= REPORT_LOOKUP_MAX_ATTEMPTS) {
        throw new ReportLookupVerifyError(
            "ATTEMPTS_EXCEEDED",
            "Too many incorrect attempts. Please request a new verification code.",
            429,
        );
    }

    if (new Date(record.expiresAt).getTime() <= now.getTime()) {
        throw new ReportLookupVerifyError(
            "EXPIRED_CODE",
            "That verification code has expired. Please request a new code.",
        );
    }

    const secret = (deps.getSecret ?? getAuthSecret)();
    const expectedHash = hashVerificationCode(code, normalizedEmail, secret);
    const matches = verificationCodesEqual(expectedHash, record.codeHash);

    if (!matches) {
        const updated = await increment(record.id);
        const attempts = updated?.attemptCount ?? record.attemptCount + 1;
        if (attempts >= REPORT_LOOKUP_MAX_ATTEMPTS) {
            throw new ReportLookupVerifyError(
                "ATTEMPTS_EXCEEDED",
                "Too many incorrect attempts. Please request a new verification code.",
                429,
            );
        }
        throw new ReportLookupVerifyError(
            "INVALID_CODE",
            "That verification code is incorrect. Please try again.",
        );
    }

    const consumed = await consume(record.id, now);
    if (!consumed) {
        throw new ReportLookupVerifyError(
            "CONSUMED_CODE",
            "That verification code is no longer valid. Please request a new code.",
        );
    }

    const session = await establish(normalizedEmail);

    return {
        success: true,
        message: "Email verified. You can now view your published report(s).",
        session: {
            normalizedEmail: session.normalizedEmail,
            expiresAt: session.expiresAt,
        },
    };
}
