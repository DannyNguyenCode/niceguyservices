import type { WorkbookField as WorkbookFieldType } from "@/lib/clientDiscoveryWorkbook/types";
import { workbookInputClass } from "./workbookLayoutConstants";

type WorkbookFieldProps = {
    field: WorkbookFieldType;
    value: string;
    error?: string;
    onChange: (name: string, value: string) => void;
};

export function WorkbookField({ field, value, error, onChange }: WorkbookFieldProps) {
    const id = `workbook-${field.name}`;

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="font-pm-body text-sm font-semibold text-(--pm-on-surface)">
                {field.label}
                {field.required ? (
                    <span className="ml-1 text-error" aria-hidden>
                        *
                    </span>
                ) : null}
                {field.required ? <span className="sr-only"> (required)</span> : null}
            </label>

            {field.type === "textarea" ? (
                <textarea
                    id={id}
                    name={field.name}
                    value={value}
                    rows={4}
                    required={field.required}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    className={`${workbookInputClass} min-h-[6rem] resize-y`}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
            ) : field.type === "select" ? (
                <select
                    id={id}
                    name={field.name}
                    value={value}
                    required={field.required}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    className={workbookInputClass}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                >
                    <option value="">Select an option</option>
                    {(field.options ?? []).map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={id}
                    name={field.name}
                    type={field.type}
                    value={value}
                    required={field.required}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    className={workbookInputClass}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
            )}
            {error ? (
                <p id={`${id}-error`} className="font-pm-body text-sm text-error" role="alert">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
