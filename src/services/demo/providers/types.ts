import type { DemoSpecification } from "@/src/services/demo/types";

export type DemoWorkspace = {
    rootPath: string;
    repository: string | null;
    branch: string;
};

export interface DemoGenerationProvider {
    name: string;

    generateDemo(input: {
        specification: DemoSpecification;
        workspace: DemoWorkspace;
        instructions: string;
        generationId: string;
        demoProjectId: string;
    }): Promise<{
        providerRequestId?: string | null;
        branch?: string | null;
        commitSha?: string | null;
        filesChanged: string[];
        outputPath?: string | null;
        durationMs: number;
        files: Array<{ path: string; content: string }>;
        pagesGenerated: string[];
        componentsGenerated: string[];
    }>;
}
