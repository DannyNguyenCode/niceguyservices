export { DEMO_GENERATION_SYSTEM_PROMPT_V1, DEMO_GENERATION_USER_PROMPT_V1 } from "./demo-generation-system-v1";

export function buildDemoGenerationUserPrompt(input: {
    demoProjectId: string;
    generationId: string;
    publicReportRevision: number;
}): string {
    return `Generate demo project ${input.demoProjectId}, generation ${input.generationId}, from public report revision ${input.publicReportRevision}.

Read demo-spec.json for the full contract.
Read generation-instructions.md for administrator requirements.
Commit all generated application files to the workspace branch.`;
}
