/** Cookie for short-lived authenticated customer report lookup sessions. */
export const REPORT_LOOKUP_SESSION_COOKIE = "ngwd_report_lookup_session";

/** Verification code lifetime. */
export const REPORT_LOOKUP_CODE_TTL_MS = 10 * 60 * 1000;

/** Authenticated lookup session lifetime. */
export const REPORT_LOOKUP_SESSION_MAX_AGE_SECONDS = 20 * 60;

/** Incorrect verification attempts allowed per issued code. */
export const REPORT_LOOKUP_MAX_ATTEMPTS = 5;

/** Server-enforced resend cooldown (also mirrored by rate-limit policy). */
export const REPORT_LOOKUP_RESEND_COOLDOWN_SECONDS = 60;

export const REPORT_LOOKUP_GENERIC_REQUEST_MESSAGE =
    "If a published report is associated with that email, a verification code has been sent.";

export const REPORT_LOOKUP_CODE_DIGITS = 6;
