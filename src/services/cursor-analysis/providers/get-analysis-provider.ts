import "server-only";

import { isCursorAutomationProvider } from "@/src/services/cursor-analysis/config";
import { CursorAutomationAnalysisProvider } from "@/src/services/cursor-analysis/providers/cursor-automation-provider";
import type { AuditAnalysisProvider } from "@/src/services/cursor-analysis/providers/types";

let cachedProvider: AuditAnalysisProvider | null = null;

export function getAuditAnalysisProvider(): AuditAnalysisProvider | null {
    if (!isCursorAutomationProvider()) {
        return null;
    }
    if (!cachedProvider) {
        cachedProvider = new CursorAutomationAnalysisProvider();
    }
    return cachedProvider;
}

export function resetAuditAnalysisProviderForTests(): void {
    cachedProvider = null;
}
