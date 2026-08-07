"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function DashboardWebsiteError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Audit dashboard error:", error);
    }, [error]);

    return (
        <section className="rounded-2xl bg-base-100 p-8 shadow-sm" role="alert">
            <h2 className="text-lg font-semibold text-base-content">
                Unable to load audit dashboard
            </h2>
            <p className="mt-3 text-sm text-base-content/75">
                The administrator dashboard could not be loaded. Try again or return to the
                websites list.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" className="btn btn-primary btn-sm" onClick={reset}>
                    Try again
                </button>
                <Link href="/dashboard/websites" className="btn btn-outline btn-sm">
                    Back to websites
                </Link>
            </div>
        </section>
    );
}
