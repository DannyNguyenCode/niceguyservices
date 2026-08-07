export default function PublicReportLoading() {
    return (
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:px-6" aria-busy="true">
            <div className="skeleton h-40 rounded-2xl" />
            <div className="skeleton h-12 rounded-2xl" />
            <div className="skeleton h-64 rounded-2xl" />
            <div className="skeleton h-48 rounded-2xl" />
        </div>
    );
}
