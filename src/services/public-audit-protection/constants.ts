/**
 * Central policy for PUBLIC customer audit submissions.
 * Admin Save / Save & Start / manual stages are not governed by these limits.
 */
export const PUBLIC_AUDIT_LIMITS = {
    /** Max public requests per normalized email per rolling 24 hours. */
    emailPer24Hours: 3,
    /** Max public requests per IP per rolling hour. */
    ipPerHour: 5,
    /** Max public requests per IP per rolling 24 hours. */
    ipPer24Hours: 10,
    /** Cooldown after a successfully completed public customer audit for the same domain. */
    domainCooldownDays: 7,
    /**
     * AuditRun.trigger.actorName used when customer submissions start orchestration.
     * Used to identify customer-triggered completed audits for cooldown.
     */
    publicTriggerActorName: "public-audit-submission",
} as const;

/** Customer-facing note for the public submission form (keep aligned with emailPer24Hours). */
export const PUBLIC_AUDIT_CUSTOMER_DAILY_LIMIT_NOTE = `You can submit up to ${PUBLIC_AUDIT_LIMITS.emailPer24Hours} audit requests with the same email every 24 hours.`;

export const PUBLIC_AUDIT_GENERIC_ACCEPTED_MESSAGE =
    "Your audit request has been received and processing has started.";

export const PUBLIC_AUDIT_GENERIC_DEDUPED_MESSAGE =
    "Your audit request has been received. If a review is already in progress or was recently completed for this website, we will continue with that work.";

export const PUBLIC_AUDIT_GENERIC_RECEIVED_MESSAGE =
    "Thanks — your request was received. Our team will review your website and follow up by email.";

export const PUBLIC_AUDIT_RATE_LIMITED_MESSAGE =
    "Too many audit requests. Please try again later.";
