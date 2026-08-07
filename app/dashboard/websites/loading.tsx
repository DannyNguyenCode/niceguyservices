export default function DashboardWebsitesLoading() {
    return (
        <section className="rounded-2xl bg-base-100 p-6 shadow-sm sm:p-8" aria-busy="true">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="grid grid-cols-1 gap-2">
                    <div className="h-7 w-40 animate-pulse rounded-lg bg-base-200" />
                    <div className="h-4 w-72 max-w-full animate-pulse rounded-lg bg-base-200" />
                </div>
                <div className="h-10 w-32 animate-pulse rounded-lg bg-base-200" />
            </div>
            <div className="grid grid-cols-1 gap-3">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-12 animate-pulse rounded-xl bg-base-200"
                    />
                ))}
            </div>
            <p className="sr-only">Loading websites…</p>
        </section>
    );
}
