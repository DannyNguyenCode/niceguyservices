import { getWebsiteDashboardCounts } from "@/src/data/websites";

export default async function DashboardOverviewPage() {
    // TODO: Require admin authentication before rendering dashboard routes.
    let counts = {
        totalActiveWebsites: 0,
        auditsCompleted: 0,
        demosPublished: 0,
        outreachEmailsSent: 0,
        pendingReviews: 0,
    };
    let loadError: string | null = null;

    try {
        counts = await getWebsiteDashboardCounts();
    } catch (error) {
        console.error("Failed to load dashboard counts:", error);
        loadError =
            error instanceof Error && error.message.includes("MONGODB_URI is missing")
                ? "Database is not configured. Set MONGODB_URI in .env.local and restart the server."
                : "Unable to load dashboard counts right now.";
    }

    const stats = [
        { label: "Total websites", value: counts.totalActiveWebsites },
        { label: "Audits completed", value: counts.auditsCompleted },
        { label: "Demos published", value: counts.demosPublished },
        { label: "Outreach emails sent", value: counts.outreachEmailsSent },
        { label: "Pending reviews", value: counts.pendingReviews },
    ];

    return (
        <div className="grid grid-cols-1 gap-6">
            {loadError ? (
                <p className="rounded-2xl bg-error/10 p-5 text-sm text-error" role="alert">
                    {loadError}
                </p>
            ) : null}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
                {stats.map((stat) => (
                    <section key={stat.label} className="rounded-2xl bg-base-100 p-6 shadow-sm">
                        <p className="text-sm text-base-content/60">{stat.label}</p>
                        <p className="mt-3 text-3xl font-semibold text-base-content">
                            {stat.value}
                        </p>
                    </section>
                ))}
            </div>

            <p className="rounded-2xl bg-base-100 p-5 text-sm leading-relaxed text-base-content/75 shadow-sm">
                Pending reviews count websites where the audit is complete and outreach is still{" "}
                <span className="font-medium text-base-content">not contacted</span> or{" "}
                <span className="font-medium text-base-content">draft ready</span>.
            </p>
        </div>
    );
}
