import { verifyAdministratorSessionToken } from "@/src/lib/auth/session-token";
import {
    isAuthenticationConfigured,
    resolveAuthSecretForRuntime,
} from "@/src/lib/auth/auth-requirements";

export const ADMIN_SESSION_COOKIE = "ngwd_admin_session";

export function isAuthSecretConfigured(): boolean {
    return isAuthenticationConfigured();
}

export function getRuntimeAuthSecret(): string | undefined {
    return resolveAuthSecretForRuntime();
}

export async function hasValidAdministratorSessionCookie(
    token: string | undefined,
): Promise<boolean> {
    if (!token || !isAuthSecretConfigured()) {
        return false;
    }

    const secret = resolveAuthSecretForRuntime();
    if (!secret) {
        return false;
    }

    const payload = await verifyAdministratorSessionToken(token, secret);
    return Boolean(payload);
}
