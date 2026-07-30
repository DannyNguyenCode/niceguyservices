import Link from "next/link";

export default function PublicReportUnavailable() {
    return (
        <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col justify-center px-4 py-16">
            <section className="rounded-2xl bg-base-100 p-8 shadow-sm" role="alert">
                <h1 className="text-2xl font-semibold text-base-content">This report is unavailable.</h1>
                <p className="mt-3 text-sm leading-relaxed text-base-content/75">
                    The link may have expired, been replaced, or no longer be published.
                </p>
                <div className="mt-6">
                    <Link href="/" className="btn btn-outline btn-sm">
                        Visit Nice Guy Web Design
                    </Link>
                </div>
            </section>
        </div>
    );
}
