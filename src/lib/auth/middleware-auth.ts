import { verifyAdministratorSessionToken } from "@/src/lib/auth/session-token";

const PLACEHOLDER_SECRETS = new Set([
    "",
    "your-auth-secret",
]);

export const ADMIN_SESSION_COOKIE = "ngwd_admin_session";

export function isAuthSecretConfigured(): boolean {
    const secret = process.env.AUTH_SECRET?.trim();
    return Boolean(secret && !PLACEHOLDER_SECRETS.has(secret));
}

export async function hasValidAdministratorSessionCookie(
    token: string | undefined,
): Promise<boolean> {
    if (!token || !isAuthSecretConfigured()) {
        return false;
    }

    const secret = process.env.AUTH_SECRET!.trim();
    const payload = await verifyAdministratorSessionToken(token, secret);
    return Boolean(payload);
}
