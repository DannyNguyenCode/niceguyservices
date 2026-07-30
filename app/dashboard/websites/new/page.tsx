import WebsiteForm from "@/components/websiteAudit/WebsiteForm";

export default function DashboardNewWebsitePage() {
    // TODO: Require admin authentication before rendering dashboard routes.
    return (
        <section className="rounded-2xl bg-base-100 p-6 shadow-sm sm:p-8">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-base-content">Create website record</h2>
                <p className="mt-2 text-sm leading-relaxed text-base-content/70">
                    Save a prospect or client website to MongoDB. URLs are normalized and
                    duplicate domains are blocked.
                </p>
            </div>
            <WebsiteForm mode="create" />
        </section>
    );
}
