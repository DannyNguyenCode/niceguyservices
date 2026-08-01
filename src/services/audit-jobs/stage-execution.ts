import "server-only";

import { getAuditOperationFlags, getDisabledAuditOperationMessage } from "@/src/config/app-env";

export type AuditStageName =
    | "crawl"
    | "pagespeed"
    | "niceguy"
    | "ai-analysis";

export function shouldExecuteAuditStageSynchronously(): boolean {
    return getAuditOperationFlags().syncExecution;
}

export function assertAuditStageEnabled(stage: AuditStageName): void {
    const flags = getAuditOperationFlags();
    const enabledByStage: Record<AuditStageName, boolean> = {
        crawl: flags.crawlEnabled,
        pagespeed: flags.pageSpeedEnabled,
        niceguy: flags.pageSpeedEnabled,
        "ai-analysis": flags.aiGenerationEnabled,
    };

    if (!enabledByStage[stage]) {
        const key =
            stage === "crawl"
                ? "crawlEnabled"
                : stage === "pagespeed" || stage === "niceguy"
                  ? "pageSpeedEnabled"
                  : "aiGenerationEnabled";
        throw new Error(getDisabledAuditOperationMessage(key));
    }
}
