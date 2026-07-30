import { NextResponse } from "next/server";
import {
    ADMIN_SESSION_COOKIE,
    ADMIN_SESSION_MAX_AGE_SECONDS,
    isAuthConfigured,
} from "@/src/lib/auth/config";
import {
    authenticateAdministrator,
    createAdministratorSessionCookie,
} from "@/src/services/auth/administrator-session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    if (!isAuthConfigured()) {
        return NextResponse.json(
            { success: false, error: "Authentication is not configured." },
            { status: 503 },
        );
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

    const session = await authenticateAdministrator(email, password);
    if (!session) {
        return NextResponse.json(
            { success: false, error: "Invalid email or password." },
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
