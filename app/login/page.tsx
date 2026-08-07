import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { isAuthConfigured } from "@/src/lib/auth/config";
import { getEnvAdministratorEmailForLoginForm } from "@/src/services/auth/ensure-env-administrator";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Administrator sign in",
    robots: { index: false, follow: false },
};

export default function LoginPage() {
    const authConfigured = isAuthConfigured();
    const defaultEmail = getEnvAdministratorEmailForLoginForm() ?? "";

    return (
        <div className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-10">
            <div className="w-full max-w-md rounded-2xl bg-base-100 p-8 shadow-sm">
                <p className="text-sm text-base-content/60">Nice Guy Web Design</p>
                <h1 className="mt-2 text-2xl font-semibold text-base-content">
                    Website Audit sign in
                </h1>
                <p className="mt-2 text-sm text-base-content/70">
                    Administrator access for the Website Audit dashboard.
                </p>

                {!authConfigured ? (
                    <p className="mt-6 rounded-xl bg-base-200 p-4 text-sm text-base-content/80">
                        Authentication is not configured. Set AUTH_SECRET in your environment,
                        run the administrator creation command, and restart the development server.
                    </p>
                ) : (
                    <div className="mt-6">
                        <Suspense fallback={<p className="text-sm text-base-content/70">Loading…</p>}>
                            <LoginForm defaultEmail={defaultEmail} />
                        </Suspense>
                    </div>
                )}
            </div>
        </div>
    );
}
