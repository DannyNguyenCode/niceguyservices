export type RateLimitedServiceOptions = {
    administratorIdentity?: string;
    internalWorker?: boolean;
    crawlId?: string;
    auditRunId?: string;
    managedByPipeline?: boolean;
    requirePageSpeed?: boolean;
};
