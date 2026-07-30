import "server-only";

import { getAppEnv } from "@/src/config/app-env";

export const ADMIN_SESSION_COOKIE = "ngwd_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function isAuthConfigured(): boolean {
    return Boolean(getAppEnv().authSecret);
}

export function getAuthSecret(): string {
    const secret = getAppEnv().authSecret;
    if (!secret) {
        throw new Error("AUTH_NOT_CONFIGURED");
    }
    return secret;
}

export function getAuthUrl(): string {
    const env = getAppEnv();
    return env.authUrl || env.appUrl || env.publicAppUrl || "http://localhost:3000";
}
