type AuditSectionLabelProps = {
    index: string;
    children: string;
};

/** Small index + eyebrow row used on the public website audit landing page. */
export default function AuditSectionLabel({ index, children }: AuditSectionLabelProps) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs font-semibold tracking-wide text-primary">{index}</span>
            <span aria-hidden className="h-px w-6 bg-base-300" />
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-base-content/55">
                {children}
            </span>
        </div>
    );
}
