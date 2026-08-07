import type { AuditRelationWarning } from "@/src/types/audit-dashboard";

type AuditWarningsProps = {
    relationWarnings: AuditRelationWarning[];
};

export default function AuditWarnings({ relationWarnings }: AuditWarningsProps) {
    if (relationWarnings.length === 0) {
        return null;
    }

    return (
        <section className="rounded-2xl border border-warning/40 bg-warning/5 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-warning">Data consistency warnings</h2>
            <ul className="mt-3 grid grid-cols-1 gap-2">
                {relationWarnings.map((warning) => (
                    <li key={warning.code} className="text-sm text-base-content/80" role="status">
                        {warning.message}
                    </li>
                ))}
            </ul>
        </section>
    );
}
