import "server-only";

import { hasActiveDemoGeneration } from "@/src/data/demo-generations";
import { getPublicReportById } from "@/src/data/public-reports";
import { evaluateDemoReadiness } from "@/src/services/demo/get-demo-readiness";
import type { DemoReadiness } from "@/src/services/demo/types";

export async function getDemoReadiness(input: {
    publicReportId: string;
    websiteActive: boolean;
    allowArchived?: boolean;
    demoProjectId?: string | null;
    selectedPages?: string[];
    contentPolicySelected?: boolean;
}): Promise<DemoReadiness> {
    const report = await getPublicReportById(input.publicReportId);
    const activeGeneration = input.demoProjectId
        ? await hasActiveDemoGeneration(input.demoProjectId)
        : false;

    return evaluateDemoReadiness({
        report,
        websiteActive: input.websiteActive,
        allowArchived: input.allowArchived,
        selectedPages: input.selectedPages,
        contentPolicySelected: input.contentPolicySelected,
        activeGeneration,
    });
}
