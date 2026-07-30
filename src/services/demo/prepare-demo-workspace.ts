import path from "node:path";
import { getDemoTemplateRepository, getDemoWorkspaceRoot } from "@/src/services/demo/env";
import type { DemoWorkspace } from "@/src/services/demo/providers/types";

export function prepareDemoWorkspace(input: {
    demoProjectId: string;
    generationId: string;
}): DemoWorkspace {
    const repository = getDemoTemplateRepository();
    const rootPath = getDemoWorkspaceRoot();
    const branch = `demo/${input.demoProjectId}/generation-${input.generationId}`;

    return {
        rootPath: path.resolve(rootPath),
        repository,
        branch,
    };
}
