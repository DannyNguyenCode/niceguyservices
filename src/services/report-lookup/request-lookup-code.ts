import "server-only";

import { hasEligiblePublishedReportForEmail } from "@/src/data/report-lookup-reports";
import {
    createLookupVerification,
    invalidateActiveLookupVerifications,
} from "@/src/data/report-lookup-verifications";
import { getAuthSecret } from "@/src/lib/auth/config";
import { REPORT_LOOKUP_GENERIC_REQUEST_MESSAGE } from "@/src/services/report-lookup/constants";
import {
    generateVerificationCode,
    hashVerificationCode,
} from "@/src/services/report-lookup/crypto";
import { sendReportLookupVerificationEmail } from "@/src/services/report-lookup/verification-email";
import { requestLookupCodeSchema } from "@/src/services/report-lookup/validation";

export type RequestLookupCodeResult = {
    success: true;
    message: string;
    /** Present only when a code was actually issued (never for unknown emails). */
    codeIssued: boolean;
};

export type RequestLookupCodeDeps = {
    hasEligibleReport?: typeof hasEligiblePublishedReportForEmail;
    invalidateActive?: typeof invalidateActiveLookupVerifications;
    createVerification?: typeof createLookupVerification;
    sendEmail?: typeof sendReportLookupVerificationEmail;
    getSecret?: () => string;
    generateCode?: () => string;
};

/**
 * Request a verification code for customer report lookup.
 * Always returns the same public message to prevent email enumeration.
 * Only sends email when at least one eligible published report exists.
 */
export async function requestReportLookupCode(
    input: unknown,
    deps: RequestLookupCodeDeps = {},
): Promise<RequestLookupCodeResult> {
    const parsed = requestLookupCodeSchema.safeParse(input);
    if (!parsed.success) {
        const message =
            parsed.error.issues[0]?.message ?? "Please enter a valid email address.";
        throw new ReportLookupValidationError(message);
    }

    const normalizedEmail = parsed.data.email;
    const hasEligible =
        deps.hasEligibleReport ?? hasEligiblePublishedReportForEmail;
    const eligible = await hasEligible(normalizedEmail);

    if (!eligible) {
        return {
            success: true,
            message: REPORT_LOOKUP_GENERIC_REQUEST_MESSAGE,
            codeIssued: false,
        };
    }

    const secret = (deps.getSecret ?? getAuthSecret)();
    const code = (deps.generateCode ?? generateVerificationCode)();
    const codeHash = hashVerificationCode(code, normalizedEmail, secret);

    const invalidate = deps.invalidateActive ?? invalidateActiveLookupVerifications;
    const create = deps.createVerification ?? createLookupVerification;
    const sendEmail = deps.sendEmail ?? sendReportLookupVerificationEmail;

    await invalidate(normalizedEmail);
    await create({
        normalizedEmail,
        codeHash,
    });
    await sendEmail({ to: normalizedEmail, code });

    return {
        success: true,
        message: REPORT_LOOKUP_GENERIC_REQUEST_MESSAGE,
        codeIssued: true,
    };
}

export class ReportLookupValidationError extends Error {
    readonly status = 400;

    constructor(message: string) {
        super(message);
        this.name = "ReportLookupValidationError";
    }
}
