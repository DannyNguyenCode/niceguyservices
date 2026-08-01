import { NextResponse } from "next/server";
import {
    ADMIN_SESSION_COOKIE,
    ADMIN_SESSION_MAX_AGE_SECONDS,
    isAuthConfigured,
} from "@/src/lib/auth/config";
import { isProtectedDeploymentEnvironment } from "@/src/lib/auth/auth-requirements";
import { createAuthConfigurationUnavailableResponse } from "@/src/lib/auth/api-auth";
import {
    authenticateAdministrator,
    createAdministratorSessionCookie,
} from "@/src/services/auth/administrator-session";
import { enforceLoginRateLimitsFromRequest } from "@/src/services/rate-limit/enforce-login-rate-limit";
import { normalizeLoginEmail } from "@/src/services/rate-limit/rate-limit-identity";
import { createRateLimitResponseFromError } from "@/src/services/rate-limit/create-rate-limit-response";

export const dynamic = "force-dynamic";

const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password.";

export async function POST(request: Request) {
    if (isProtectedDeploymentEnvironment() && !isAuthConfigured()) {
        return createAuthConfigurationUnavailableResponse();
    }

    if (!isAuthConfigured()) {
        return createAuthConfigurationUnavailableResponse();
    }

    let body: { email?: string; password?: string } = {};
    try {
        body = (await request.json()) as { email?: string; password?: string };
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid request body." },
            { status: 400 },
        );
    }

    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";

    if (!email || !password) {
        return NextResponse.json(
            { success: false, error: "Email and password are required." },
            { status: 400 },
        );
    }

    const normalizedEmail = normalizeLoginEmail(email);
    if (!normalizedEmail) {
        return NextResponse.json(
            { success: false, error: INVALID_CREDENTIALS_MESSAGE },
            { status: 401 },
        );
    }

    try {
        await enforceLoginRateLimitsFromRequest({
            email: normalizedEmail,
            request,
        });
    } catch (error) {
        const rateLimitResponse = createRateLimitResponseFromError(error);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }
        throw error;
    }

    const session = await authenticateAdministrator(normalizedEmail, password);
    if (!session) {
        return NextResponse.json(
            { success: false, error: INVALID_CREDENTIALS_MESSAGE },
            { status: 401 },
        );
    }

    const token = await createAdministratorSessionCookie(session);
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    });
    return response;
}
