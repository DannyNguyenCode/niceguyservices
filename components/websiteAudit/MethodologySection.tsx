import AuditSectionCard from "@/components/websiteAudit/AuditSectionCard";

type MethodologySectionProps = {
    items: string[];
};

export default function MethodologySection({ items }: MethodologySectionProps) {
    return (
        <AuditSectionCard
            title="Methodology"
            description="This placeholder explains the blend of technical review and practical small-business criteria behind each audit."
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {items.map((item, index) => (
                    <div key={`${item}-${index}`} className="rounded-2xl bg-base-200 p-5 shadow-sm">
                        <p className="text-sm leading-relaxed text-base-content/80">{item}</p>
                    </div>
                ))}
            </div>
        </AuditSectionCard>
    );
}
