import Link from "next/link";
import WebsiteListCards from "@/components/audit-dashboard/website-list-cards";
import WebsiteListTable from "@/components/audit-dashboard/website-list-table";
import DashboardFlashMessage from "@/components/websiteAudit/DashboardFlashMessage";
import { getWebsites } from "@/src/data/websites";
import { toWebsiteListViewModels } from "@/src/lib/website-list-view-model";

export default async function DashboardWebsitesPage({
    searchParams,
}: {
    searchParams: Promise<{ created?: string; updated?: string; deleted?: string }>;
}) {
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

    let items: ReturnType<typeof toWebsiteListViewModels> = [];
    if (!loadError) {
        try {
            items = toWebsiteListViewModels(websites);
        } catch (error) {
            console.error("Failed to load websites:", error);
            loadError = "Unable to load websites right now. Please try again later.";
        }
    }

    return (
        <section className="rounded-2xl bg-base-100 p-4 shadow-sm sm:p-6 lg:p-8">
            <DashboardFlashMessage
                created={params.created}
                updated={params.updated}
                deleted={params.deleted}
            />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-base-content">Websites</h2>
                    <p className="mt-2 text-sm text-base-content/70">
                        Active website records sorted by most recently updated.
                    </p>
                </div>
                <Link href="/dashboard/websites/new" className="btn btn-primary w-full sm:w-auto">
                    Add website
                </Link>
            </div>

            {loadError ? (
                <p className="rounded-2xl bg-error/10 p-5 text-sm text-error" role="alert">
                    {loadError}
                </p>
            ) : items.length === 0 ? (
                <div className="rounded-2xl bg-base-200 p-8 text-center shadow-sm">
                    <h3 className="text-lg font-semibold text-base-content">No websites yet</h3>
                    <p className="mt-2 text-sm text-base-content/70">
                        Create the first website record to start tracking audits and outreach.
                    </p>
                    <Link href="/dashboard/websites/new" className="btn btn-primary mt-6 w-full sm:w-auto">
                        Create a website
                    </Link>
                </div>
            ) : (
                <>
                    <WebsiteListCards items={items} />
                    <WebsiteListTable items={items} />
                </>
            )}
        </section>
    );
}
