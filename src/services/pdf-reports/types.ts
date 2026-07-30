export type PdfReportStatus = "queued" | "processing" | "complete" | "failed" | "deleted";

export type SerializablePdfReport = {
    id: string;
    websiteId: string;
    publicReportId: string;
    auditRunId: string | null;
    status: PdfReportStatus;
    pdfVersion: string;
    source: {
        publicReportVersion: string;
        publicReportRevision: number;
        snapshotChecksum: string;
        reportTitle: string;
    };
    render: {
        engine: string;
        engineVersion: string | null;
        paperFormat: string;
        landscape: boolean;
        printBackground: boolean;
        preferCssPageSize: boolean;
        marginTop: string;
        marginRight: string;
        marginBottom: string;
        marginLeft: string;
    };
    file: {
        provider: string;
        secureUrl: string;
        publicId: string | null;
        resourceType: string | null;
        format: string;
        filename: string;
        bytes: number;
        pageCount: number | null;
        checksum: string | null;
    } | null;
    warnings: Array<{ code: string; message: string }>;
    generatedAt: string | null;
    startedAt: string | null;
    completedAt: string | null;
    durationMs: number | null;
    errorCode: string | null;
    errorMessage: string | null;
    createdAt: string;
    updatedAt: string;
};

export type PdfReadiness = {
    canGenerate: boolean;
    blockers: Array<{ code: string; message: string }>;
    matchingPdfExists: boolean;
    matchingPdfId: string | null;
    snapshotChecksum: string | null;
};

export type PdfRenderTokenPayload = {
    publicReportId: string;
    pdfReportId: string;
    snapshotChecksum: string;
    expiresAt: number;
};
