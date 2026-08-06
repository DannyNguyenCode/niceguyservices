import "server-only";

import {
    StartAuditJobError,
    startAuditOrchestration,
} from "@/src/services/audit-pipeline/start-audit-job";
import {
    createWebsite,
    getWebsiteById,
    getWebsiteByNormalizedDomain,
    WebsiteDataError,
    type SerializableWebsite,
} from "@/src/data/websites";
import { normalizeWebsiteUrl } from "@/src/lib/normalize-domain";
import { createActivityEvent } from "@/src/services/activity/create-activity-event";
import {
    evaluatePublicAuditEligibility,
    type PublicAuditBlockReason,
    type PublicAuditEligibility,
} from "@/src/services/public-audit-protection/evaluate-public-audit-eligibility";
import { PUBLIC_AUDIT_LIMITS } from "@/src/services/public-audit-protection/constants";
import { logPublicAuditSecurityEvent } from "@/src/services/public-audit-protection/log-public-audit-security-event";

export type PublicAuditSubmissionResult = {
    websiteId: string | null;
    auditRunId: string | null;
    jobId: string | null;
    orchestrationStarted: boolean;
    reusedWebsite: boolean;
    reusedJob: boolean;
    /** Set when expensive orchestration was intentionally not started. */
    blockReason: PublicAuditBlockReason | null;
};

export type SubmitAndStartPublicAuditDeps = {
    createWebsite?: typeof createWebsite;
    getWebsiteByNormalizedDomain?: typeof getWebsiteByNormalizedDomain;
    getWebsiteById?: typeof getWebsiteById;
    startOrchestration?: typeof startAuditOrchestration;
    createActivityEvent?: typeof createActivityEvent;
    evaluateEligibility?: (
        input: { normalizedDomain: string; now?: Date },
    ) => Promise<PublicAuditEligibility>;
};

function isActiveOrchestrationStatus(status: string): boolean {
    return (
        status === "queued" ||
        status === "processing" ||
        status === "waiting_for_external"
    );
}

function blockedResult(input: {
    websiteId: string | null;
    reason: PublicAuditBlockReason;
    reusedWebsite: boolean;
}): PublicAuditSubmissionResult {
    return {
        websiteId: input.websiteId,
        auditRunId: null,
        jobId: null,
        orchestrationStarted: false,
        reusedWebsite: input.reusedWebsite,
        reusedJob: false,
        blockReason: input.reason,
    };
}

/**
 * Persist a customer public-audit submission and start the SAME durable
 * orchestration used by admin "Save & Start Audit", when eligible.
 *
 * Never runs the pipeline inside the caller request (forceAsync).
 * Domain active-run / 7-day successful-completion cooldown prevent duplicate
 * expensive work. Does not grant report ownership to a different email.
 */
export async function submitAndStartPublicAuditRequest(
    input: {
        websiteUrl: string;
        businessEmail: string;
        now?: Date;
    },
    deps: SubmitAndStartPublicAuditDeps = {},
): Promise<PublicAuditSubmissionResult> {
    const { normalizedDomain } = normalizeWebsiteUrl(input.websiteUrl);
    const create = deps.createWebsite ?? createWebsite;
    const findByDomain = deps.getWebsiteByNormalizedDomain ?? getWebsiteByNormalizedDomain;
    const findById = deps.getWebsiteById ?? getWebsiteById;
    const start = deps.startOrchestration ?? startAuditOrchestration;
    const logActivity = deps.createActivityEvent ?? createActivityEvent;
    const evaluate = deps.evaluateEligibility ?? evaluatePublicAuditEligibility;

    logPublicAuditSecurityEvent({
        event: "public_audit_request_received",
        normalizedDomain,
    });

    const eligibility = await evaluate({
        normalizedDomain,
        now: input.now,
    });

    if (!eligibility.eligible) {
        logPublicAuditSecurityEvent({
            event:
                eligibility.reason === "domain_active"
                    ? "public_audit_domain_active"
                    : "public_audit_domain_cooldown",
            normalizedDomain,
            websiteId: eligibility.websiteId,
            reason: eligibility.reason,
        });

        if (eligibility.websiteId) {
            await logActivity({
                websiteId: eligibility.websiteId,
                eventType: "website-updated",
                title:
                    eligibility.reason === "domain_active"
                        ? "Public audit blocked — active domain audit"
                        : "Public audit blocked — domain cooldown",
                description: `Public audit request for ${normalizedDomain} did not start a new pipeline (${eligibility.reason}).`,
                actor: { type: "system" },
                metadata: {
                    source: "public-audit-submission",
                    blockReason: eligibility.reason,
                    domainCooldownDays: PUBLIC_AUDIT_LIMITS.domainCooldownDays,
                },
            });
        }

        return blockedResult({
            websiteId: eligibility.websiteId,
            reason: eligibility.reason,
            reusedWebsite: Boolean(eligibility.websiteId),
        });
    }

    let website: SerializableWebsite;
    let reusedWebsite = false;

    if (eligibility.websiteId) {
        const existing =
            (await findById(eligibility.websiteId)) ??
            (await findByDomain(normalizedDomain));
        if (!existing || existing.deletedAt) {
            throw new WebsiteDataError(
                "not-found",
                "Website for public audit submission was not found.",
            );
        }
        website = existing;
        reusedWebsite = true;
        await logActivity({
            websiteId: website.id,
            eventType: "website-updated",
            title: "Public audit re-submission",
            description: `Public audit request received again for ${normalizedDomain}.`,
            actor: { type: "system" },
            metadata: { source: "public-audit-submission", reusedWebsite: true },
        });
    } else {
        try {
            website = await create(
                {
                    websiteUrl: input.websiteUrl,
                    businessEmail: input.businessEmail,
                    businessName: undefined,
                    industry: undefined,
                    location: undefined,
                    source: "public-audit-submission",
                },
                {
                    activityActor: { type: "system" },
                    activityTitle: "Public audit request received",
                    activityDescription: `Public audit request received for ${normalizedDomain}.`,
                },
            );
        } catch (error) {
            if (!(error instanceof WebsiteDataError) || error.code !== "duplicate") {
                throw error;
            }

            const existing = await findByDomain(normalizedDomain);
            if (!existing || existing.deletedAt) {
                throw error;
            }

            // Concurrent create race: re-check eligibility before starting work.
            const racedEligibility = await evaluate({
                normalizedDomain,
                now: input.now,
            });
            if (!racedEligibility.eligible) {
                logPublicAuditSecurityEvent({
                    event:
                        racedEligibility.reason === "domain_active"
                            ? "public_audit_domain_active"
                            : "public_audit_domain_cooldown",
                    normalizedDomain,
                    websiteId: racedEligibility.websiteId ?? existing.id,
                    reason: racedEligibility.reason,
                });
                return blockedResult({
                    websiteId: racedEligibility.websiteId ?? existing.id,
                    reason: racedEligibility.reason,
                    reusedWebsite: true,
                });
            }

            website = existing;
            reusedWebsite = true;
            await logActivity({
                websiteId: website.id,
                eventType: "website-updated",
                title: "Public audit re-submission",
                description: `Public audit request received again for ${normalizedDomain}.`,
                actor: { type: "system" },
                metadata: { source: "public-audit-submission", reusedWebsite: true },
            });
        }
    }

    logPublicAuditSecurityEvent({
        event: "public_audit_accepted",
        normalizedDomain,
        websiteId: website.id,
    });

    try {
        const started = await start({
            websiteId: website.id,
            trigger: {
                type: "system",
                actorId: null,
                actorName: PUBLIC_AUDIT_LIMITS.publicTriggerActorName,
            },
            forceAsync: true,
        });

        const orchestrationStarted = isActiveOrchestrationStatus(started.job.status);
        logPublicAuditSecurityEvent({
            event: "public_audit_orchestration_started",
            normalizedDomain,
            websiteId: website.id,
            orchestrationStarted,
        });

        return {
            websiteId: website.id,
            auditRunId: started.auditRunId,
            jobId: started.job.id,
            orchestrationStarted,
            reusedWebsite,
            reusedJob: started.reused,
            blockReason: null,
        };
    } catch (error) {
        logPublicAuditSecurityEvent({
            event: "public_audit_orchestration_start_failed",
            normalizedDomain,
            websiteId: website.id,
            orchestrationStarted: false,
        });

        await logActivity({
            websiteId: website.id,
            eventType: "audit-run-failed",
            title: "Public audit orchestration failed to start",
            description:
                error instanceof StartAuditJobError
                    ? error.message
                    : "Unable to schedule asynchronous audit orchestration after public submission.",
            actor: { type: "system" },
            metadata: {
                source: "public-audit-submission",
                code:
                    error instanceof StartAuditJobError
                        ? error.code
                        : "ORCHESTRATION_START_FAILED",
            },
        });

        return {
            websiteId: website.id,
            auditRunId: null,
            jobId: null,
            orchestrationStarted: false,
            reusedWebsite,
            reusedJob: false,
            blockReason: null,
        };
    }
}

export { StartAuditJobError };
