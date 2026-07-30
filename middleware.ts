import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
    ADMIN_SESSION_COOKIE,
    hasValidAdministratorSessionCookie,
    isAuthSecretConfigured,
} from "@/src/lib/auth/middleware-auth";
import { resolveRequestId } from "@/src/lib/request-id";

const SECURITY_HEADERS: Record<string, string> = {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "X-Frame-Options": "DENY",
};

function applySecurityHeaders(response: NextResponse): NextResponse {
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        response.headers.set(key, value);
    }
  if (process.env.NODE_ENV === "production") {
        response.headers.set(
            "Strict-Transport-Security",
            "max-age=63072000; includeSubDomains; preload",
        );
    }
    return response;
}

export async function middleware(request: NextRequest) {
    const requestId = resolveRequestId(request.headers);
    const response = NextResponse.next({
        headers: {
            "x-request-id": requestId,
        },
    });

    applySecurityHeaders(response);

    const pathname = request.nextUrl.pathname;
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/admin")) {
        response.headers.set("Cache-Control", "private, no-store");
        response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    }

    if (isAuthSecretConfigured()) {
        const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
        const isAuthenticated = await hasValidAdministratorSessionCookie(token);

        if (pathname.startsWith("/dashboard") && !isAuthenticated) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return applySecurityHeaders(NextResponse.redirect(loginUrl));
        }

        if (pathname.startsWith("/api/admin") && !isAuthenticated) {
            const workerSecret = process.env.INTERNAL_WORKER_SECRET?.trim();
            const providedSecret = request.headers.get("x-internal-worker-secret");
            const trustedWorker = Boolean(
                workerSecret && providedSecret && providedSecret === workerSecret,
            );
            if (!trustedWorker) {
                return applySecurityHeaders(
                    NextResponse.json(
                        {
                            success: false,
                            error: {
                                code: "UNAUTHORIZED",
                                message: "Authentication required.",
                            },
                        },
                        { status: 401 },
                    ),
                );
            }
        }
    }

    if (pathname.startsWith("/report/") || pathname.startsWith("/demo-preview/")) {
        response.headers.set("Cache-Control", "private, no-store");
        response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    }

    return response;
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/admin/:path*",
        "/api/health",
        "/api/internal/:path*",
        "/report/:path*",
        "/demo-preview/:path*",
        "/login",
    ],
};
