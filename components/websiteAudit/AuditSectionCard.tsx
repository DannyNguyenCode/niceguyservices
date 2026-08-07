import type { ReactNode } from "react";

type AuditSectionCardProps = {
    title: string;
    description?: string;
    children: ReactNode;
    actions?: ReactNode;
};

export default function AuditSectionCard({
    title,
    description,
    children,
    actions,
}: AuditSectionCardProps) {
    return (
        <section className="rounded-2xl bg-base-100 p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-base-content">{title}</h2>
                    {description ? (
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-base-content/75">
                            {description}
                        </p>
                    ) : null}
                </div>
                {actions ? <div className="shrink-0">{actions}</div> : null}
            </div>
            {children}
        </section>
    );
}
