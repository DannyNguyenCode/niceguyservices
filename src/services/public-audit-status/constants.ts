/** Opaque public audit status token (customer progress polling). */
export const MIN_PUBLIC_AUDIT_STATUS_TOKEN_LENGTH = 32;
export const MAX_PUBLIC_AUDIT_STATUS_TOKEN_LENGTH = 128;

/** Status tokens expire after this many hours (TTL index). */
export const PUBLIC_AUDIT_STATUS_TOKEN_TTL_HOURS = 48;

/** sessionStorage key for refresh recovery of an in-flight public audit. */
export const PUBLIC_AUDIT_STATUS_SESSION_STORAGE_KEY = "ngwd.public-audit-status.v1";

export const PUBLIC_AUDIT_STATUS_POLL_INTERVAL_MS = 4000;
export const PUBLIC_AUDIT_STATUS_POLL_MAX_INTERVAL_MS = 15000;
export const PUBLIC_AUDIT_STATUS_POLL_BACKOFF_FACTOR = 1.5;
