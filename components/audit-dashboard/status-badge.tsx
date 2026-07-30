import type { AuditStageStatusValue } from "@/src/types/audit-dashboard";
import { formatAuditStageStatus } from "@/src/lib/audit-dashboard-labels";

const STATUS_CLASSES: Record<AuditStageStatusValue, string> = {
    "not-started": "badge-ghost",
    queued: "badge-info",
    processing: "badge-info",
    complete: "badge-success",
    partial: "badge-warning",
    failed: "badge-error",
    unavailable: "badge-ghost",
};

type StatusBadgeProps = {
    status: AuditStageStatusValue | string;
    label?: string;
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
    const value = status as AuditStageStatusValue;
    const display = label ?? formatAuditStageStatus(value);
    const className = STATUS_CLASSES[value] ?? "badge-ghost";

    return <span className={`badge badge-sm ${className}`}>{display}</span>;
}
