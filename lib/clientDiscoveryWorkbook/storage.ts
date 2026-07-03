import type { WorkbookAnswers } from "./types";

export const WORKBOOK_DRAFT_KEY = "ng-client-discovery-workbook-v1";

export function loadWorkbookDraft(): WorkbookAnswers | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(WORKBOOK_DRAFT_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as unknown;
        if (!parsed || typeof parsed !== "object") return null;
        const out: WorkbookAnswers = {};
        for (const [key, value] of Object.entries(parsed)) {
            if (typeof value === "string") out[key] = value;
        }
        return out;
    } catch {
        return null;
    }
}

export function saveWorkbookDraft(answers: WorkbookAnswers): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(WORKBOOK_DRAFT_KEY, JSON.stringify(answers));
}

export function clearWorkbookDraft(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(WORKBOOK_DRAFT_KEY);
}
