import Link from "next/link";
import { notFound } from "next/navigation";
import AuditRunsList from "@/components/audit-dashboard/audit-runs-list";
import { getWebsiteById } from "@/src/data/websites";

export default async function WebsiteAuditsPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ status?: string; includeArchived?: string }>;
}) {
    const { id } = await params;
    const query = await searchParams;
    const website = await getWebsiteById(id);
    if (!website) notFound();

    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <Link
                        className="text-sm text-base-content/70 hover:text-base-content"
                        href={`/dashboard/websites/${id}`}
                    >
                        ← Back to website
                    </Link>
                    <h1 className="mt-2 text-2xl font-semibold text-base-content">Audit history</h1>
                    <p className="mt-1 text-sm text-base-content/70">{website.businessName || website.originalUrl}</p>
                </div>
                <Link
                    className="btn btn-outline btn-sm"
                    href={`/dashboard/websites/${id}/audits/compare`}
                >
                    Compare audits
                </Link>
            </div>

            <AuditRunsList
                websiteId={id}
                initialStatus={query.status}
                initialIncludeArchived={query.includeArchived === "true"}
            />
        </div>
    );
}
