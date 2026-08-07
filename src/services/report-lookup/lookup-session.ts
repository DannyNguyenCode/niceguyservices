import "server-only";

import { cookies } from "next/headers";
import { getAuthSecret } from "@/src/lib/auth/config";
import {
    createReportLookupSessionRecord,
    getValidReportLookupSessionByTokenHash,
} from "@/src/data/report-lookup-sessions";
import {
    REPORT_LOOKUP_SESSION_COOKIE,
    REPORT_LOOKUP_SESSION_MAX_AGE_SECONDS,
} from "@/src/services/report-lookup/constants";
import {
    generateLookupSessionToken,
    hashLookupSessionToken,
} from "@/src/services/report-lookup/crypto";

export type ReportLookupSession = {
    normalizedEmail: string;
    expiresAt: string;
};

function cookieSecure(): boolean {
    return (
        process.env.NODE_ENV === "production" ||
        process.env.VERCEL_ENV === "production" ||
        process.env.VERCEL_ENV === "preview"
    );
}

export async function createReportLookupSession(
    normalizedEmail: string,
): Promise<{ rawToken: string; expiresAt: Date }> {
    const secret = getAuthSecret();
    const rawToken = generateLookupSessionToken();
    const tokenHash = hashLookupSessionToken(rawToken, secret);
    const now = new Date();
    const record = await createReportLookupSessionRecord({
        tokenHash,
        normalizedEmail,
        now,
    });

    return {
        rawToken,
        expiresAt: new Date(record.expiresAt),
    };
}

export async function setReportLookupSessionCookie(rawToken: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(REPORT_LOOKUP_SESSION_COOKIE, rawToken, {
        httpOnly: true,
        secure: cookieSecure(),
        sameSite: "lax",
        path: "/",
        maxAge: REPORT_LOOKUP_SESSION_MAX_AGE_SECONDS,
    });
}

export async function clearReportLookupSessionCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(REPORT_LOOKUP_SESSION_COOKIE);
}

export async function readReportLookupSessionFromCookies(): Promise<ReportLookupSession | null> {
    const cookieStore = await cookies();
    const rawToken = cookieStore.get(REPORT_LOOKUP_SESSION_COOKIE)?.value;
    if (!rawToken) {
        return null;
    }

    let secret: string;
    try {
        secret = getAuthSecret();
    } catch {
        return null;
    }

    const tokenHash = hashLookupSessionToken(rawToken, secret);
    const record = await getValidReportLookupSessionByTokenHash(tokenHash);
    if (!record) {
        return null;
    }

    return {
        normalizedEmail: record.normalizedEmail,
        expiresAt: record.expiresAt,
    };
}

/**
 * Issue a new lookup session cookie after successful email verification.
 * Does not log the raw token.
 */
export async function establishReportLookupSession(
    normalizedEmail: string,
): Promise<ReportLookupSession> {
    const { rawToken, expiresAt } = await createReportLookupSession(normalizedEmail);
    await setReportLookupSessionCookie(rawToken);
    return {
        normalizedEmail,
        expiresAt: expiresAt.toISOString(),
    };
}
