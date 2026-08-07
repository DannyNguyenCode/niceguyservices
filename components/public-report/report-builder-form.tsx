"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { DEFAULT_PUBLIC_REPORT_SETTINGS } from "@/src/lib/public-report-config";
import type { WebsiteAuditDashboardData } from "@/src/types/audit-dashboard";

type ReportBuilderPageProps = {
    websiteId: string;
    dashboard: WebsiteAuditDashboardData;
};

export default function ReportBuilderForm({ websiteId, dashboard }: ReportBuilderPageProps) {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [title, setTitle] = useState(
        `Website Audit for ${dashboard.website.businessName || dashboard.website.normalizedDomain}`,
    );
    const [subtitle, setSubtitle] = useState("Prepared by Nice Guy Web Design");

    const crawlId = dashboard.latest.crawl?.id;
    const niceGuyMetricId = dashboard.latest.niceGuy?.id;
    const aiSummaryId = dashboard.latest.aiSummary?.id;

    function handleCreate() {
        if (!crawlId || !niceGuyMetricId || !aiSummaryId) {
            setMessage("Required audit records are missing.");
            return;
        }

        setMessage(null);
        startTransition(async () => {
            const response = await fetch(`/api/admin/websites/${websiteId}/reports`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    crawlId,
                    niceGuyMetricId,
                    aiSummaryId,
                    title,
                    subtitle,
                    settings: DEFAULT_PUBLIC_REPORT_SETTINGS,
                }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                setMessage(result.error?.message ?? "Unable to create report.");
                return;
            }
            router.push(`/dashboard/reports/${result.reportId}/preview`);
            router.refresh();
        });
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
                <Link
                    href={`/dashboard/websites/${websiteId}`}
                    className="text-sm text-base-content/60 underline-offset-2 hover:underline"
                >
                    Back to website dashboard
                </Link>
                <h1 className="mt-3 text-2xl font-semibold text-base-content">Create public report</h1>
                <p className="mt-2 text-sm text-base-content/75">
                    A draft snapshot will be saved from the current related audit records.
                </p>
            </section>

            <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-base-content">Source audit</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-base-content/75 md:grid-cols-2">
                    <p>Crawl: {dashboard.latest.crawl?.status ?? "Not available"}</p>
                    <p>Nice Guy: {dashboard.latest.niceGuy?.overallScore ?? "Not available"}</p>
                    <p>AI summary: {dashboard.latest.aiSummary?.status ?? "Not available"}</p>
                    <p>Screenshots: {dashboard.latest.screenshots.length}</p>
                </div>
                {dashboard.relationWarnings.length > 0 ? (
                    <div className="mt-4 grid grid-cols-1 gap-2">
                        {dashboard.relationWarnings.map((warning) => (
                            <p key={warning.code} className="text-sm text-warning">
                                {warning.message}
                            </p>
                        ))}
                    </div>
                ) : null}
            </section>

            <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-base-content">Report details</h2>
                <div className="mt-4 grid grid-cols-1 gap-4">
                    <label className="grid grid-cols-1 gap-2">
                        <span className="text-sm text-base-content/70">Title</span>
                        <input
                            className="input input-bordered"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />
                    </label>
                    <label className="grid grid-cols-1 gap-2">
                        <span className="text-sm text-base-content/70">Subtitle</span>
                        <input
                            className="input input-bordered"
                            value={subtitle}
                            onChange={(event) => setSubtitle(event.target.value)}
                        />
                    </label>
                </div>
                <p className="mt-4 text-sm text-base-content/65">
                    Default section visibility and screenshot selection use the standard public report
                    settings. You can preview the saved draft before publishing.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleCreate}
                        disabled={isPending || !dashboard.readiness.isAuditReadyForReport}
                    >
                        {isPending ? "Creating draft..." : "Save draft snapshot"}
                    </button>
                </div>
                {message ? (
                    <p className="mt-3 text-sm text-error" role="alert">
                        {message}
                    </p>
                ) : null}
            </section>
        </div>
    );
}
