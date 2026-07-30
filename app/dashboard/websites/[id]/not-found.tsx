import Link from "next/link";

export default function DashboardWebsiteNotFound() {
    return (
        <section className="rounded-2xl bg-base-100 p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-base-content">Website not found</h2>
            <p className="mt-3 text-sm leading-relaxed text-base-content/70">
                This website record does not exist, was archived, or the link is invalid.
            </p>
            <Link href="/dashboard/websites" className="btn btn-primary mt-6">
                Back to websites
            </Link>
        </section>
    );
}
