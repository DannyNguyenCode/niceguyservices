import "server-only";

import { NextResponse } from "next/server";
import {
    createAuthConfigurationUnavailableResponse,
    requireAdministratorApiAccess,
} from "@/src/lib/auth/api-auth";
import { isTrustedInternalWorker } from "@/src/services/rate-limit/administrator-context";
import { handleRouteRateLimitError } from "@/src/services/rate-limit/handle-route-rate-limit-error";
import {
    enforceAdministratorReadRateLimit,
    enforceAdministratorWriteRateLimit,
} from "@/src/services/rate-limit/enforce-action-rate-limit";
import type { RateLimitPolicyId } from "@/src/validation/rate-limit";

async function guardAdministratorAuthRoute(request: Request): Promise<NextResponse | null> {
    const authResult = await requireAdministratorApiAccess(request);
    if (authResult instanceof NextResponse) {
        return authResult;
    }
    return null;
}

export async function guardAdministratorReadRoute(request: Request): Promise<NextResponse | null> {
    const authGuard = await guardAdministratorAuthRoute(request);
    if (authGuard) {
        return authGuard;
    }

    if (isTrustedInternalWorker(request)) {
        return null;
    }
    try {
        await enforceAdministratorReadRateLimit(request);
        return null;
    } catch (error) {
        return handleRouteRateLimitError(error, { policyId: "admin-read" });
    }
}

export async function guardAdministratorWriteRoute(request: Request): Promise<NextResponse | null> {
    const authGuard = await guardAdministratorAuthRoute(request);
    if (authGuard) {
        return authGuard;
    }

    if (isTrustedInternalWorker(request)) {
        return null;
    }
    try {
        await enforceAdministratorWriteRateLimit(request);
        return null;
    } catch (error) {
        return handleRouteRateLimitError(error, { policyId: "admin-write" });
    }
}

export { createAuthConfigurationUnavailableResponse };

export async function resolveRouteAdministratorIdentity(request: Request): Promise<string> {
    const { resolveAdministratorRateLimitIdentity } = await import(
        "@/src/services/rate-limit/administrator-context"
    );
    return resolveAdministratorRateLimitIdentity(request);
}

export async function runWithRouteRateLimit<T>(input: {
    request: Request;
    policyId: RateLimitPolicyId;
    websiteId?: string;
    cost?: number;
    auditRunId?: string | null;
    handler: () => Promise<T>;
}): Promise<T | NextResponse> {
    if (!isTrustedInternalWorker(input.request)) {
        try {
            const { enforceAdministratorActionRateLimit } = await import(
                "@/src/services/rate-limit/enforce-action-rate-limit"
            );
            await enforceAdministratorActionRateLimit({
                policyId: input.policyId,
                websiteId: input.websiteId,
                cost: input.cost,
                request: input.request,
            });
        } catch (error) {
            const response = await handleRouteRateLimitError(error, {
                policyId: input.policyId,
                websiteId: input.websiteId ?? null,
                auditRunId: input.auditRunId ?? null,
            });
            if (response) {
                return response;
            }
            throw error;
        }
    }

    return input.handler();
}
