import { NextResponse } from "next/server";
import {
    isAuthenticationConfigured,
    isProtectedDeploymentEnvironment,
} from "@/src/lib/auth/auth-requirements";
import { isTrustedInternalWorker } from "@/src/services/rate-limit/administrator-context";
import { ADMIN_SESSION_COOKIE } from "@/src/lib/auth/middleware-auth";
import type { AdministratorSession } from "@/src/services/auth/administrator-session";

export function createAuthConfigurationUnavailableResponse(): NextResponse {
    return NextResponse.json(
        {
            success: false,
            error: {
                code: "AUTH_CONFIGURATION_UNAVAILABLE",
                message: "Authentication is not configured for this environment.",
            },
        },
        {
            status: 503,
            headers: {
                "Cache-Control": "private, no-store",
            },
        },
    );
}

function readSessionTokenFromRequest(request: Request): string | undefined {
    const cookieHeader = request.headers.get("cookie");
    return cookieHeader
        ?.split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`))
        ?.slice(ADMIN_SESSION_COOKIE.length + 1);
}

export async function requireAdministratorApiAccess(
    request: Request,
): Promise<AdministratorSession | NextResponse> {
    if (isProtectedDeploymentEnvironment() && !isAuthenticationConfigured()) {
        return createAuthConfigurationUnavailableResponse();
    }

    if (isTrustedInternalWorker(request)) {
        return {
            administratorId: "internal-worker",
            email: "worker@internal",
            name: "Internal Worker",
            role: "owner",
            sessionVersion: 0,
        };
    }

    if (!isAuthenticationConfigured()) {
        return createAuthConfigurationUnavailableResponse();
    }

    const { verifyAdministratorSession } = await import(
        "@/src/services/auth/administrator-session"
    );

    const token = readSessionTokenFromRequest(request);
    const session = await verifyAdministratorSession(token);
    if (!session) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: "UNAUTHORIZED",
                    message: "Authentication required.",
                },
            },
            { status: 401 },
        );
    }

    return session;
}

export async function getAdministratorSessionFromRequest(
    request: Request,
): Promise<AdministratorSession | null> {
    if (!isAuthenticationConfigured()) {
        return null;
    }
    const { getAdministratorSessionFromToken } = await import(
        "@/src/services/auth/administrator-session"
    );
    return getAdministratorSessionFromToken(readSessionTokenFromRequest(request));
}
