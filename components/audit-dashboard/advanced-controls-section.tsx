import AuditStageActions from "@/components/audit-dashboard/audit-stage-actions";
import AuditSection from "@/components/audit/shared/audit-section";
import { AUDIT_SECTIONS } from "@/src/lib/audit-sections";
import type { WebsiteAuditDashboardData } from "@/src/types/audit-dashboard";

type AdvancedControlsSectionProps = {
    websiteId: string;
    dashboard: WebsiteAuditDashboardData;
    hidden?: boolean;
};

export default function AdvancedControlsSection({
    websiteId,
    dashboard,
    hidden = false,
}: AdvancedControlsSectionProps) {
    if (hidden) {
        return null;
    }

    return (
        <AuditSection
            id="advanced-controls"
            headingId="advanced-controls-heading"
            title="Advanced controls"
            description="Manual stage controls for development, recovery, and debugging. These are not required for the normal Save and Start Audit workflow."
        >
            <details className="rounded-xl border border-base-200 bg-base-200/40 p-3 sm:p-4">
                <summary className="cursor-pointer text-sm font-medium text-base-content">
                    Manual stage controls (development and recovery)
                </summary>
                <div className="mt-4">
                    <AuditStageActions websiteId={websiteId} data={dashboard} embedded />
                </div>
            </details>
        </AuditSection>
    );
}
