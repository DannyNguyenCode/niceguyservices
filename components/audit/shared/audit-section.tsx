import type { ReactNode } from "react";
import { AUDIT_SECTION_SCROLL_MARGIN } from "@/src/lib/audit-sections";

type AuditSectionProps = {
    id: string;
    headingId?: string;
    title?: string;
    description?: string;
    children: ReactNode;
    className?: string;
    headingLevel?: "h2" | "h3";
};

export default function AuditSection({
    id,
    headingId,
    title,
    description,
    children,
    className = "",
    headingLevel = "h2",
}: AuditSectionProps) {
    const Heading = headingLevel;

    return (
        <section
            id={id}
            aria-labelledby={title && headingId ? headingId : undefined}
            className={`rounded-2xl bg-base-100 p-4 shadow-sm sm:p-6 ${AUDIT_SECTION_SCROLL_MARGIN} ${className}`}
        >
            {title ? (
                <div className="mb-4">
                    <Heading id={headingId} className="text-lg font-semibold text-base-content">
                        {title}
                    </Heading>
                    {description ? (
                        <p className="mt-2 text-sm text-base-content/70">{description}</p>
                    ) : null}
                </div>
            ) : null}
            {children}
        </section>
    );
}
