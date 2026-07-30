import { checkRateLimit } from "@/src/services/rate-limit/check-rate-limit";
import { requireRateLimit } from "@/src/services/rate-limit/require-rate-limit";
import { resolveAdministratorRateLimitIdentity } from "@/src/services/rate-limit/administrator-context";
import { getWebsiteRateLimitKey } from "@/src/services/rate-limit/rate-limit-identity";
import type { RateLimitPolicyId } from "@/src/validation/rate-limit";

export {
    calculateDemoGenerationCost,
    calculatePageSpeedCost,
    calculateScreenshotCost,
} from "@/src/services/rate-limit/cost-rules";

export async function enforceAdministratorActionRateLimit(input: {
    policyId: RateLimitPolicyId;
    websiteId?: string;
    administratorIdentity?: string;
    cost?: number;
    request?: Request | null;
    internalWorker?: boolean;
}): Promise<void> {
    if (input.internalWorker) {
        return;
    }

    const administratorIdentity =
        input.administratorIdentity ??
        (await resolveAdministratorRateLimitIdentity(input.request ?? null));

    const identifiers = [administratorIdentity];
    if (input.websiteId) {
        identifiers.push(getWebsiteRateLimitKey(input.websiteId));
    }

    await requireRateLimit({
        policyId: input.policyId,
        identifiers,
        cost: input.cost,
    });
}

export async function enforceAdministratorWriteRateLimit(
    request?: Request | null,
): Promise<void> {
    const administratorIdentity = await resolveAdministratorRateLimitIdentity(request ?? null);
    await requireRateLimit({
        policyId: "admin-write",
        identifiers: [administratorIdentity],
    });
}

export async function enforceAdministratorReadRateLimit(
    request?: Request | null,
): Promise<void> {
    const administratorIdentity = await resolveAdministratorRateLimitIdentity(request ?? null);
    await requireRateLimit({
        policyId: "admin-read",
        identifiers: [administratorIdentity],
    });
}

export async function checkProviderBudget(input: {
    policyId: "pagespeed-global-daily" | "ai-analysis-global-daily";
    cost?: number;
}): Promise<void> {
    await requireRateLimit({
        policyId: input.policyId,
        identifiers: ["global"],
        cost: input.cost,
    });
}

export async function peekAdministratorActionRateLimit(input: {
    policyId: RateLimitPolicyId;
    websiteId?: string;
    administratorIdentity?: string;
    request?: Request | null;
}) {
    const administratorIdentity =
        input.administratorIdentity ??
        (await resolveAdministratorRateLimitIdentity(input.request ?? null));
    const identifiers = [administratorIdentity];
    if (input.websiteId) {
        identifiers.push(getWebsiteRateLimitKey(input.websiteId));
    }
    return checkRateLimit({
        policyId: input.policyId,
        identifiers,
    });
}
