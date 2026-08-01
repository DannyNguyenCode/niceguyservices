export type AuditAnalysisTriggerResult = {
    accepted: boolean;
    externalJobId?: string;
    error?: string;
};

export interface AuditAnalysisProvider {
    readonly name: string;
    requestAnalysis(input: {
        auditId: string;
        analysisRequestId: string;
        packageUrl: string;
        callbackUrl: string;
    }): Promise<AuditAnalysisTriggerResult>;
}
