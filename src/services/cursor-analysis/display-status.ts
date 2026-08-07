import type { CursorAnalysisStatus } from "@/src/services/cursor-analysis/constants";
import type { AiAnalysisStatus } from "@/src/types/website-audit";

export function mapCursorAnalysisStatusToAiStatus(
    status: CursorAnalysisStatus,
): AiAnalysisStatus {
    switch (status) {
        case "not_started":
            return "not-started";
        case "queued":
            return "queued";
        case "triggered":
        case "analyzing":
        case "validating":
            return "processing";
        case "completed":
            return "complete";
        case "failed":
        case "retry_pending":
            return "failed";
        default:
            return "not-started";
    }
}
