export type TriggerAnalysisInput = {
    auditId: string;
    analysisRequestId: string;
    packageUrl: string;
    callbackUrl: string;
    callbackAuthHeader: string;
    callbackAuthToken: string;
    promptVersion: string;
    packageVersion: string;
};

export type TriggerAnalysisResult = {
    accepted: boolean;
    externalJobId?: string;
    error?: string;
    errorCode?: string;
};

export interface AuditAnalysisProvider {
    readonly name: string;
    triggerAnalysis(input: TriggerAnalysisInput): Promise<TriggerAnalysisResult>;
}

/** @deprecated Use triggerAnalysis */
export type AuditAnalysisTriggerResult = TriggerAnalysisResult;

/** @deprecated Use AuditAnalysisProvider.triggerAnalysis */
export interface LegacyAuditAnalysisProvider {
    readonly name: string;
    requestAnalysis(input: {
        auditId: string;
        analysisRequestId: string;
        packageUrl: string;
        callbackUrl: string;
    }): Promise<TriggerAnalysisResult>;
}
