import "server-only";

import {
    getCursorConfigurationStatus,
    isCursorAutomationProvider,
    isMockAnalysisProvider,
} from "@/src/services/cursor-analysis/config";
import { CursorAutomationAnalysisProvider } from "@/src/services/cursor-analysis/providers/cursor-automation-provider";
import { getMockAnalysisProvider } from "@/src/services/cursor-analysis/providers/mock-analysis-provider";
import type { AuditAnalysisProvider } from "@/src/services/cursor-analysis/providers/types";

let cachedCursorProvider: CursorAutomationAnalysisProvider | null = null;

export type ProviderResolution =
    | { ok: true; provider: AuditAnalysisProvider }
    | { ok: false; code: string; message: string; missing?: string[] };

export function resolveAuditAnalysisProvider(): ProviderResolution {
    if (isMockAnalysisProvider()) {
        return { ok: true, provider: getMockAnalysisProvider() };
    }

    if (!isCursorAutomationProvider()) {
        return {
            ok: false,
            code: "PROVIDER_NOT_CONFIGURED",
            message: "No AI analysis provider is configured. Set AI_ANALYSIS_PROVIDER=cursor-automation or mock.",
        };
    }

    const status = getCursorConfigurationStatus();
    if (!status.configured) {
        return {
            ok: false,
            code: "CURSOR_ANALYSIS_NOT_CONFIGURED",
            message: `Cursor analysis is not configured. Missing: ${status.missing.join(", ")}`,
            missing: status.missing,
        };
    }

    if (!cachedCursorProvider) {
        cachedCursorProvider = new CursorAutomationAnalysisProvider();
    }

    return { ok: true, provider: cachedCursorProvider };
}

/** @deprecated Use resolveAuditAnalysisProvider() for typed configuration errors */
export function getAuditAnalysisProvider(): AuditAnalysisProvider | null {
    const resolution = resolveAuditAnalysisProvider();
    return resolution.ok ? resolution.provider : null;
}

export function resetAuditAnalysisProviderForTests(): void {
    cachedCursorProvider = null;
}
