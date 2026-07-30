import Link from "next/link";
import { notFound } from "next/navigation";
import WebsiteForm from "@/components/websiteAudit/WebsiteForm";
import { getWebsiteById } from "@/src/data/websites";

export default async function DashboardWebsiteEditPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // TODO: Require admin authentication before rendering dashboard routes.
    const { id } = await params;

    let website: Awaited<ReturnType<typeof getWebsiteById>> = null;
    try {
        website = await getWebsiteById(id);
    } catch (error) {
        console.error("Failed to load website for edit:", error);
        notFound();
    }

    if (!website) {
        notFound();
    }

    const businessLabel = website.businessName?.trim() || website.normalizedDomain;

    return (
        <section className="rounded-2xl bg-base-100 p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-base-content">
                        Edit {businessLabel}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-base-content/70">
                        Update website details and statuses. Changing the URL
                        re-normalizes the domain and checks for duplicates.
                    </p>
                </div>
                <Link href={`/dashboard/websites/${website.id}`} className="btn btn-ghost">
                    Back to detail
                </Link>
            </div>
            <WebsiteForm mode="edit" website={website} />
        </section>
    );
}
