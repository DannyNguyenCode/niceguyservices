import "server-only";

import { connectToDatabase } from "@/src/lib/mongodb";
import { AuditRun } from "@/src/models/AuditRun";
import { getActiveAuditJobForWebsite } from "@/src/data/audit-jobs";
import { getWebsiteByNormalizedDomain, type SerializableWebsite } from "@/src/data/websites";
import { PUBLIC_AUDIT_LIMITS } from "@/src/services/public-audit-protection/constants";
import mongoose from "mongoose";

export type PublicAuditBlockReason = "domain_active" | "domain_cooldown";

export type PublicAuditEligibility =
    | { eligible: true; websiteId: string | null }
    | {
          eligible: false;
          reason: PublicAuditBlockReason;
          websiteId: string | null;
      };

export type EvaluatePublicAuditEligibilityDeps = {
    getWebsiteByNormalizedDomain?: (
        normalizedDomain: string,
    ) => Promise<SerializableWebsite | null>;
    getActiveAuditJobForWebsite?: typeof getActiveAuditJobForWebsite;
    findRecentCompletedPublicCustomerAudit?: typeof findRecentCompletedPublicCustomerAudit;
};

/**
 * Whether a successfully completed public-customer audit exists for this website
 * within the cooldown window. Failed/partial/cancelled audits do not count.
 */
export async function findRecentCompletedPublicCustomerAudit(input: {
    websiteId: string;
    now?: Date;
}): Promise<{ id: string; completedAt: string } | null> {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(input.websiteId)) {
        return null;
    }

    const now = input.now ?? new Date();
    const cutoff = new Date(
        now.getTime() - PUBLIC_AUDIT_LIMITS.domainCooldownDays * 24 * 60 * 60 * 1000,
    );

    const doc = await AuditRun.findOne({
        websiteId: new mongoose.Types.ObjectId(input.websiteId),
        status: "complete",
        isArchived: false,
        "trigger.type": "system",
        "trigger.actorName": PUBLIC_AUDIT_LIMITS.publicTriggerActorName,
        completedAt: { $gte: cutoff },
    })
        .select({ _id: 1, completedAt: 1 })
        .sort({ completedAt: -1 })
        .lean();

    if (!doc?.completedAt) {
        return null;
    }

    return {
        id: String(doc._id),
        completedAt: new Date(doc.completedAt as Date).toISOString(),
    };
}

/**
 * Evaluate whether a PUBLIC customer submission may start expensive orchestration
 * for the given normalized domain. Does not mutate state.
 *
 * Domain identity is independent of email — same-domain/different-email cannot
 * bypass active-run or cooldown protection.
 */
export async function evaluatePublicAuditEligibility(
    input: {
        normalizedDomain: string;
        now?: Date;
    },
    deps: EvaluatePublicAuditEligibilityDeps = {},
): Promise<PublicAuditEligibility> {
    const findWebsite = deps.getWebsiteByNormalizedDomain ?? getWebsiteByNormalizedDomain;
    const findActiveJob = deps.getActiveAuditJobForWebsite ?? getActiveAuditJobForWebsite;
    const findRecent =
        deps.findRecentCompletedPublicCustomerAudit ?? findRecentCompletedPublicCustomerAudit;

    const website = await findWebsite(input.normalizedDomain);
    if (!website || website.deletedAt) {
        return { eligible: true, websiteId: null };
    }

    const activeJob = await findActiveJob(website.id);
    if (activeJob) {
        return {
            eligible: false,
            reason: "domain_active",
            websiteId: website.id,
        };
    }

    const recent = await findRecent({
        websiteId: website.id,
        now: input.now,
    });
    if (recent) {
        return {
            eligible: false,
            reason: "domain_cooldown",
            websiteId: website.id,
        };
    }

    return { eligible: true, websiteId: website.id };
}
