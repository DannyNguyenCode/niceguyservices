import type { AuditFinding } from "@/src/types/website-audit";

const impactClasses: Record<AuditFinding["impact"], string> = {
    high: "badge badge-error badge-outline",
    medium: "badge badge-warning badge-outline",
    low: "badge badge-info badge-outline",
};

type AuditFindingCardProps = {
    finding: AuditFinding;
};

export default function AuditFindingCard({ finding }: AuditFindingCardProps) {
    return (
        <article className="rounded-2xl bg-base-200 p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
                <span className={impactClasses[finding.impact]}>{finding.impact} impact</span>
                <span className="badge badge-ghost">{finding.category}</span>
            </div>
            <h3 className="mt-4 text-base font-semibold text-base-content">{finding.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-base-content/75">
                {finding.summary}
            </p>
        </article>
    );
}
