import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyPassword } from "@/src/lib/auth/password";
import {
    ADMIN_SESSION_COOKIE,
    ADMIN_SESSION_MAX_AGE_SECONDS,
    getAuthSecret,
    isAuthConfigured,
} from "@/src/lib/auth/config";
import { createAdministratorSessionToken, verifyAdministratorSessionToken } from "@/src/lib/auth/session-token";
import {
    getAdministratorByEmail,
    getAdministratorById,
    updateAdministratorLastLogin,
    type SerializableAdministrator,
} from "@/src/data/administrators";

export type AdministratorSession = {
    administratorId: string;
    email: string;
    name: string;
    role: string;
};

export async function authenticateAdministrator(
    email: string,
    password: string,
): Promise<AdministratorSession | null> {
    if (!isAuthConfigured()) {
        return null;
    }

    const administrator = await getAdministratorByEmail(email);
    if (!administrator || administrator.status !== "active") {
        return null;
    }

    if (!verifyPassword(password, administrator.passwordHash)) {
        return null;
    }

    await updateAdministratorLastLogin(String(administrator._id));

    return {
        administratorId: String(administrator._id),
        email: administrator.email,
        name: administrator.name,
        role: administrator.role,
    };
}

export async function createAdministratorSessionCookie(
    session: AdministratorSession,
): Promise<string> {
    return createAdministratorSessionToken(
        {
            sub: session.administratorId,
            email: session.email,
            name: session.name,
            role: session.role,
            maxAgeSeconds: ADMIN_SESSION_MAX_AGE_SECONDS,
        },
        getAuthSecret(),
    );
}

export async function getAdministratorSessionFromToken(
    token: string | undefined | null,
): Promise<AdministratorSession | null> {
    if (!token || !isAuthConfigured()) {
        return null;
    }

    const payload = await verifyAdministratorSessionToken(token, getAuthSecret());
    if (!payload) {
        return null;
    }

    return {
        administratorId: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
    };
}

export async function getAdministratorSession(): Promise<AdministratorSession | null> {
    const cookieStore = await cookies();
    return getAdministratorSessionFromToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function getCurrentAdministrator(): Promise<SerializableAdministrator | null> {
    const session = await getAdministratorSession();
    if (!session) {
        return null;
    }
    return getAdministratorById(session.administratorId);
}

export async function requireAdministratorSession(redirectTo?: string): Promise<AdministratorSession> {
    if (!isAuthConfigured()) {
        throw new Error("AUTH_NOT_CONFIGURED");
    }

    const session = await getAdministratorSession();
    if (!session) {
        const target = redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login";
        redirect(target);
    }

    return session;
}

export async function clearAdministratorSessionCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_SESSION_COOKIE);
}
