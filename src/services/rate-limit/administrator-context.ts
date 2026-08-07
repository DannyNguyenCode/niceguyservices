import "server-only";

import { headers } from "next/headers";
import { getAdministratorSessionFromToken } from "@/src/services/auth/administrator-session";
import { ADMIN_SESSION_COOKIE } from "@/src/lib/auth/middleware-auth";
import { isAuthConfigured } from "@/src/lib/auth/config";
import {
    getAdministratorRateLimitKey,
    getClientIp,
    getClientIpFromHeaders,
    getHashedIpRateLimitKey,
} from "@/src/services/rate-limit/rate-limit-identity";

export async function getAuthenticatedAdministratorId(
    request?: Request | null,
): Promise<string | null> {
    if (!isAuthConfigured()) {
        return null;
    }

    if (request) {
        const cookieHeader = request.headers.get("cookie");
        const token = cookieHeader
            ?.split(";")
            .map((part) => part.trim())
            .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`))
            ?.slice(ADMIN_SESSION_COOKIE.length + 1);
        const session = await getAdministratorSessionFromToken(token);
        return session?.administratorId ?? null;
    }

    const headerStore = await headers();
    const token = headerStore.get("cookie")
        ?.split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`))
        ?.slice(ADMIN_SESSION_COOKIE.length + 1);
    const session = await getAdministratorSessionFromToken(token);
    return session?.administratorId ?? null;
}

export async function resolveAdministratorRateLimitIdentity(
    request?: Request | null,
): Promise<string> {
    const administratorId = await getAuthenticatedAdministratorId(request);
    if (administratorId) {
        return getAdministratorRateLimitKey(administratorId);
    }

    const ip = request ? getClientIp(request) : await getClientIpFromHeaders();
    if (ip) {
        return getAdministratorRateLimitKey(getHashedIpRateLimitKey(ip));
    }

    return getAdministratorRateLimitKey("unauthenticated");
}

export async function resolveAdministratorIdentityFromHeaders(): Promise<string> {
    const headerStore = await headers();
    const request = new Request("http://rate-limit.local", { headers: headerStore });
    return resolveAdministratorRateLimitIdentity(request);
}

export function isTrustedInternalWorker(request: Request): boolean {
    const secret = process.env.INTERNAL_WORKER_SECRET?.trim();
    if (!secret) {
        return false;
    }
    const provided = request.headers.get("x-internal-worker-secret");
    return Boolean(provided && provided === secret);
}
