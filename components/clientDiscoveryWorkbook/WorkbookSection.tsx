import type { WorkbookSection as WorkbookSectionType } from "@/lib/clientDiscoveryWorkbook/types";
import { WorkbookField } from "./WorkbookField";
import { workbookSectionCardClass } from "./workbookLayoutConstants";

type WorkbookSectionProps = {
    section: WorkbookSectionType;
    sectionIndex: number;
    isActive: boolean;
    values: Record<string, string>;
    errors: Record<string, string>;
    onChange: (name: string, value: string) => void;
};

export function WorkbookSection({
    section,
    sectionIndex,
    isActive,
    values,
    errors,
    onChange,
}: WorkbookSectionProps) {
    return (
        <section
            id={section.id}
            className={`${workbookSectionCardClass} scroll-mt-52 transition-[border-color,box-shadow] duration-200 md:scroll-mt-56 ${
                isActive
                    ? "border-primary ring-2 ring-primary/25"
                    : "border-base-300"
            }`}
            aria-labelledby={`${section.id}-title`}
        >
            <div className="mb-5 flex flex-col gap-2 border-b border-base-300 pb-4">
                <p className="font-pm-body text-sm font-medium text-primary">
                    Section {sectionIndex + 1}
                </p>
                <h2
                    id={`${section.id}-title`}
                    className="font-pm-headline text-lg font-bold text-(--pm-on-surface)"
                >
                    {section.title}
                </h2>
                <p className="text-base leading-relaxed text-(--pm-on-surface-variant)">
                    {section.description}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                {section.fields.map((field) => {
                    const spanFull = field.type === "textarea";
                    return (
                        <div
                            key={field.name}
                            className={spanFull ? "md:col-span-2" : undefined}
                        >
                            <WorkbookField
                                field={field}
                                value={values[field.name] ?? ""}
                                error={errors[field.name]}
                                onChange={onChange}
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
