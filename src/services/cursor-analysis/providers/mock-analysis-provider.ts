import "server-only";

import type {
    AuditAnalysisProvider,
    TriggerAnalysisInput,
    TriggerAnalysisResult,
} from "@/src/services/cursor-analysis/providers/types";
import { logAnalysisEvent } from "@/src/services/cursor-analysis/logging";

/**
 * Test-only provider that accepts trigger requests without contacting Cursor.
 */
export class MockAnalysisProvider implements AuditAnalysisProvider {
    readonly name = "mock";
    private readonly responses = new Map<string, TriggerAnalysisResult>();
    private lastInput: TriggerAnalysisInput | null = null;

    async triggerAnalysis(input: TriggerAnalysisInput): Promise<TriggerAnalysisResult> {
        this.lastInput = input;
        const override = this.responses.get(input.analysisRequestId);
        const result = override ?? {
            accepted: true,
            externalJobId: `mock-${input.analysisRequestId}`,
        };

        logAnalysisEvent("mock_trigger", {
            auditId: input.auditId,
            analysisRequestId: input.analysisRequestId,
            provider: this.name,
            packageVersion: input.packageVersion,
            promptVersion: input.promptVersion,
        });

        return result;
    }

    setResponse(analysisRequestId: string, result: TriggerAnalysisResult): void {
        this.responses.set(analysisRequestId, result);
    }

    getLastInput(): TriggerAnalysisInput | null {
        return this.lastInput;
    }

    reset(): void {
        this.responses.clear();
        this.lastInput = null;
    }
}

let sharedMockProvider: MockAnalysisProvider | null = null;

export function getMockAnalysisProvider(): MockAnalysisProvider {
    if (!sharedMockProvider) {
        sharedMockProvider = new MockAnalysisProvider();
    }
    return sharedMockProvider;
}

export function resetMockAnalysisProviderForTests(): void {
    sharedMockProvider?.reset();
    sharedMockProvider = null;
}
