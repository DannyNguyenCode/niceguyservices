type AuditSectionFallbackProps = {
    label: string;
};

export default function AuditSectionFallback({ label }: AuditSectionFallbackProps) {
    return (
        <div className="rounded-2xl bg-base-100 p-4 shadow-sm sm:p-6" aria-busy="true">
            <div className="h-6 w-40 animate-pulse rounded bg-base-200" />
            <div className="mt-4 h-24 animate-pulse rounded-xl bg-base-200" />
            <p className="sr-only">{label}</p>
        </div>
    );
}
