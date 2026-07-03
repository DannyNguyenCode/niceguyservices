import { WORKBOOK_CONTENT } from "./content";
import type { WorkbookAnswers } from "./types";

export function isSectionComplete(sectionId: string, answers: WorkbookAnswers): boolean {
    const section = WORKBOOK_CONTENT.sections.find((s) => s.id === sectionId);
    if (!section) return false;
    const required = section.fields.filter((f) => f.required);
    if (required.length > 0) {
        return required.every((f) => (answers[f.name]?.trim().length ?? 0) > 0);
    }
    return section.fields.some((f) => (answers[f.name]?.trim().length ?? 0) > 0);
}

export function completedSectionCount(answers: WorkbookAnswers): number {
    return WORKBOOK_CONTENT.sections.filter((s) => isSectionComplete(s.id, answers)).length;
}

export function validateWorkbook(answers: WorkbookAnswers): Record<string, string> {
    const errors: Record<string, string> = {};

    for (const section of WORKBOOK_CONTENT.sections) {
        for (const field of section.fields) {
            const value = answers[field.name]?.trim() ?? "";
            if (field.required && !value) {
                errors[field.name] = "This field is required.";
                continue;
            }
            if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errors[field.name] = "Enter a valid email address.";
            }
        }
    }

    return errors;
}

export function downloadWorkbookJson(
    answers: WorkbookAnswers,
    submittedAt: string,
    businessName?: string,
): void {
    const payload = {
        workbook: "Client Discovery Workbook",
        submittedAt,
        answers,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
    });
    const slug = (businessName || "client")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    const date = submittedAt.slice(0, 10);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `client-discovery-${slug || "workbook"}-${date}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
}
