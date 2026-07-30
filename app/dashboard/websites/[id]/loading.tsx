export default function DashboardWebsiteLoading() {
    return (
        <div className="grid grid-cols-1 gap-6" aria-busy="true" aria-label="Loading audit dashboard">
            <section className="rounded-2xl bg-base-100 p-6 shadow-sm sm:p-8">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton mt-4 h-8 w-64" />
                <div className="skeleton mt-3 h-4 w-48" />
            </section>

            <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
                <div className="skeleton h-6 w-40" />
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="skeleton h-28 rounded-xl" />
                    ))}
                </div>
            </section>

            <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
                <div className="skeleton h-6 w-48" />
                <div className="skeleton mt-4 h-16 w-full" />
            </section>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="skeleton h-24 rounded-2xl" />
                ))}
            </div>

            <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
                <div className="skeleton h-6 w-32" />
                <div className="skeleton mt-4 h-40 w-full" />
            </section>
        </div>
    );
}
