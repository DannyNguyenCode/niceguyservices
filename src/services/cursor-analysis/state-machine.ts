import type { CursorAnalysisStatus } from "@/src/services/cursor-analysis/constants";

const ALLOWED_TRANSITIONS: Record<CursorAnalysisStatus, CursorAnalysisStatus[]> = {
    not_started: ["queued"],
    // Fast-callback race: Cursor may POST before local "triggered" is persisted.
    queued: ["triggered", "validating", "failed", "retry_pending"],
    triggered: ["analyzing", "validating", "failed", "retry_pending"],
    analyzing: ["validating", "failed", "retry_pending"],
    validating: ["completed", "failed", "retry_pending"],
    completed: [],
    failed: ["retry_pending"],
    retry_pending: ["queued"],
};

export function canTransitionAnalysisStatus(
    from: CursorAnalysisStatus,
    to: CursorAnalysisStatus,
): boolean {
    return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertAnalysisTransition(
    from: CursorAnalysisStatus,
    to: CursorAnalysisStatus,
): void {
    if (!canTransitionAnalysisStatus(from, to)) {
        throw new Error(`INVALID_ANALYSIS_TRANSITION: ${from} -> ${to}`);
    }
}

export function getAllowedNextStatuses(
    status: CursorAnalysisStatus,
): CursorAnalysisStatus[] {
    return ALLOWED_TRANSITIONS[status] ?? [];
}
