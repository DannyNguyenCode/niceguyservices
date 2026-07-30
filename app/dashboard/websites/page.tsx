import Link from "next/link";
import DashboardFlashMessage from "@/components/websiteAudit/DashboardFlashMessage";
import SoftDeleteWebsiteButton from "@/components/websiteAudit/SoftDeleteWebsiteButton";
import {
    AuditStatusBadge,
    DemoStatusBadge,
    OutreachStatusBadge,
} from "@/components/websiteAudit/StatusBadges";
import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import { getWebsites } from "@/src/data/websites";

export default async function DashboardWebsitesPage({
    searchParams,
}: {
    searchParams: Promise<{ created?: string; updated?: string; deleted?: string }>;
}) {
    // TODO: Require admin authentication before rendering dashboard routes.
    const params = await searchParams;
    let websites: Awaited<ReturnType<typeof getWebsites>> = [];
    let loadError: string | null = null;

    try {
        websites = await getWebsites();
    } catch (error) {
        console.error("Failed to load websites:", error);
        loadError =
            error instanceof Error && error.message.includes("MONGODB_URI is missing")
                ? "Database is not configured. Set MONGODB_URI in .env.local and restart the server."
                : "Unable to load websites right now. Please try again later.";
    }

    return (
        <section className="rounded-2xl bg-base-100 p-6 shadow-sm sm:p-8">
            <DashboardFlashMessage
                created={params.created}
                updated={params.updated}
                deleted={params.deleted}
            />

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-base-content">Websites</h2>
                    <p className="mt-2 text-sm text-base-content/70">
                        Active website records sorted by most recently updated.
                    </p>
                </div>
                <Link href="/dashboard/websites/new" className="btn btn-primary">
                    Add website
                </Link>
            </div>

            {loadError ? (
                <p className="rounded-2xl bg-error/10 p-5 text-sm text-error" role="alert">
                    {loadError}
                </p>
            ) : websites.length === 0 ? (
                <div className="rounded-2xl bg-base-200 p-8 text-center shadow-sm">
                    <h3 className="text-lg font-semibold text-base-content">No websites yet</h3>
                    <p className="mt-2 text-sm text-base-content/70">
                        Create the first website record to start tracking audits and outreach.
                    </p>
                    <Link href="/dashboard/websites/new" className="btn btn-primary mt-6">
                        Create a website
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Business</th>
                                <th>Website</th>
                                <th>Business email</th>
                                <th>Audit status</th>
                                <th>Demo status</th>
                                <th>Outreach status</th>
                                <th>Last updated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {websites.map((record) => {
                                const businessLabel =
                                    record.businessName?.trim() || record.normalizedDomain;

                                return (
                                    <tr key={record.id}>
                                        <td className="font-medium">{businessLabel}</td>
                                        <td>
                                            <a
                                                href={record.originalUrl}
                                                className="link-hover link break-all"
                                            >
                                                {record.normalizedDomain}
                                            </a>
                                        </td>
                                        <td>{record.businessEmail || "Not provided"}</td>
                                        <td>
                                            <AuditStatusBadge status={record.auditStatus} />
                                        </td>
                                        <td>
                                            <DemoStatusBadge status={record.demoStatus} />
                                        </td>
                                        <td>
                                            <OutreachStatusBadge status={record.outreachStatus} />
                                        </td>
                                        <td>{formatWebsiteDate(record.updatedAt)}</td>
                                        <td>
                                            <div className="flex flex-wrap gap-2">
                                                <Link
                                                    href={`/dashboard/websites/${record.id}`}
                                                    className="btn btn-xs btn-outline"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/dashboard/websites/${record.id}/edit`}
                                                    className="btn btn-xs btn-ghost"
                                                >
                                                    Edit
                                                </Link>
                                                <SoftDeleteWebsiteButton
                                                    websiteId={record.id}
                                                    businessLabel={businessLabel}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
