import Link from "next/link";
import type { Metadata } from "next";
import DashboardSignOutButton from "@/components/auth/DashboardSignOutButton";
import { isAuthConfigured } from "@/src/lib/auth/config";
import { getCurrentAdministrator, requireAdministratorSession } from "@/src/services/auth/administrator-session";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: true,
    },
};

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    if (isAuthConfigured()) {
        await requireAdministratorSession("/dashboard");
    }

    const administrator = isAuthConfigured() ? await getCurrentAdministrator() : null;

    return (
        <div className="min-h-screen bg-base-200 text-base-content">
            <header className="border-b border-base-300 bg-base-100">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8">
                    <div>
                        <p className="text-sm text-base-content/60">Nice Guy Web Design</p>
                        <h1 className="text-2xl font-semibold">Website Audit Dashboard</h1>
                        {administrator ? (
                            <p className="mt-1 text-sm text-base-content/70">
                                Signed in as {administrator.name}
                            </p>
                        ) : null}
                    </div>
                    <nav className="flex flex-wrap gap-3" aria-label="Dashboard">
                        <Link href="/dashboard" className="btn btn-ghost">
                            Overview
                        </Link>
                        <Link href="/dashboard/websites" className="btn btn-ghost">
                            Websites
                        </Link>
                        <Link href="/dashboard/websites/new" className="btn btn-primary">
                            New website
                        </Link>
                        {isAuthConfigured() ? <DashboardSignOutButton /> : null}
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8">{children}</main>
        </div>
    );
}
