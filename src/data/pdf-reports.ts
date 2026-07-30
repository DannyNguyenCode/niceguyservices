import "server-only";

import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import {
    PDF_DEFAULT_MARGINS,
    PDF_PAPER_FORMAT,
    PDF_RENDER_ENGINE,
    PDF_REPORT_VERSION,
} from "@/src/services/pdf-reports/constants";
import { PdfReport, type PdfReportLean } from "@/src/models/PdfReport";
import type { PdfReportStatus, SerializablePdfReport } from "@/src/services/pdf-reports/types";

function assertObjectId(id: string, message = "Invalid ID."): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(message);
    }
    return new mongoose.Types.ObjectId(id);
}

function toSerializable(doc: PdfReportLean): SerializablePdfReport {
    const file = doc.file;
    return {
        id: String(doc._id),
        websiteId: String(doc.websiteId),
        publicReportId: String(doc.publicReportId),
        auditRunId: doc.auditRunId ? String(doc.auditRunId) : null,
        status: doc.status,
        pdfVersion: doc.pdfVersion,
        source: doc.source,
        render: {
            engine: doc.render.engine,
            engineVersion: doc.render.engineVersion,
            paperFormat: doc.render.paperFormat,
            landscape: doc.render.landscape,
            printBackground: doc.render.printBackground,
            preferCssPageSize: doc.render.preferCssPageSize,
            marginTop: doc.render.marginTop,
            marginRight: doc.render.marginRight,
            marginBottom: doc.render.marginBottom,
            marginLeft: doc.render.marginLeft,
        },
        file: file?.secureUrl
            ? {
                  provider: String(file.provider ?? ""),
                  secureUrl: String(file.secureUrl),
                  publicId: file.publicId ? String(file.publicId) : null,
                  resourceType: file.resourceType ? String(file.resourceType) : null,
                  format: String(file.format ?? "pdf"),
                  filename: String(file.filename ?? ""),
                  bytes: Number(file.bytes ?? 0),
                  pageCount: file.pageCount ?? null,
                  checksum: file.checksum ? String(file.checksum) : null,
              }
            : null,
        warnings: (doc.warnings ?? []).map((warning) => ({
            code: warning.code,
            message: warning.message,
        })),
        generatedAt: doc.generatedAt ? new Date(doc.generatedAt).toISOString() : null,
        startedAt: doc.startedAt ? new Date(doc.startedAt).toISOString() : null,
        completedAt: doc.completedAt ? new Date(doc.completedAt).toISOString() : null,
        durationMs: doc.durationMs ?? null,
        errorCode: doc.errorCode ?? null,
        errorMessage: doc.errorMessage ?? null,
        createdAt: new Date(doc.createdAt).toISOString(),
        updatedAt: new Date(doc.updatedAt).toISOString(),
    };
}

function mapLean(doc: Record<string, unknown>): PdfReportLean {
    return {
        _id: String(doc._id),
        websiteId: String(doc.websiteId),
        publicReportId: String(doc.publicReportId),
        auditRunId: doc.auditRunId ? String(doc.auditRunId) : null,
        status: doc.status as PdfReportLean["status"],
        pdfVersion: String(doc.pdfVersion),
        source: doc.source as PdfReportLean["source"],
        render: doc.render as PdfReportLean["render"],
        file: (doc.file as PdfReportLean["file"]) ?? null,
        warnings: (doc.warnings as PdfReportLean["warnings"]) ?? [],
        generatedAt: doc.generatedAt ? new Date(doc.generatedAt as Date) : null,
        startedAt: doc.startedAt ? new Date(doc.startedAt as Date) : null,
        completedAt: doc.completedAt ? new Date(doc.completedAt as Date) : null,
        durationMs: typeof doc.durationMs === "number" ? doc.durationMs : null,
        errorCode: doc.errorCode ? String(doc.errorCode) : null,
        errorMessage: doc.errorMessage ? String(doc.errorMessage) : null,
        createdAt: new Date(doc.createdAt as Date),
        updatedAt: new Date(doc.updatedAt as Date),
    };
}

export async function createPdfReportRecord(input: {
    websiteId: string;
    publicReportId: string;
    auditRunId?: string | null;
    sourceAuditRunId?: string | null;
    sourceAuditNumber?: number | null;
    snapshotChecksum: string;
    publicReportVersion: string;
    publicReportRevision: number;
    reportTitle: string;
}): Promise<SerializablePdfReport> {
    await connectToDatabase();

    const created = await PdfReport.create({
        websiteId: assertObjectId(input.websiteId),
        publicReportId: assertObjectId(input.publicReportId),
        auditRunId: input.auditRunId ? assertObjectId(input.auditRunId) : null,
        sourceAuditRunId: input.sourceAuditRunId
            ? assertObjectId(input.sourceAuditRunId)
            : input.auditRunId
              ? assertObjectId(input.auditRunId)
              : null,
        sourceAuditNumber: input.sourceAuditNumber ?? null,
        status: "queued",
        pdfVersion: PDF_REPORT_VERSION,
        source: {
            publicReportVersion: input.publicReportVersion,
            publicReportRevision: input.publicReportRevision,
            snapshotChecksum: input.snapshotChecksum,
            reportTitle: input.reportTitle,
        },
        render: {
            engine: PDF_RENDER_ENGINE,
            engineVersion: null,
            paperFormat: PDF_PAPER_FORMAT,
            landscape: false,
            printBackground: true,
            preferCssPageSize: true,
            marginTop: PDF_DEFAULT_MARGINS.top,
            marginRight: PDF_DEFAULT_MARGINS.right,
            marginBottom: PDF_DEFAULT_MARGINS.bottom,
            marginLeft: PDF_DEFAULT_MARGINS.left,
        },
        warnings: [],
    });

    return toSerializable(mapLean(created.toObject() as Record<string, unknown>));
}

export async function getPdfReportById(id: string): Promise<SerializablePdfReport | null> {
    await connectToDatabase();
    try {
        const doc = await PdfReport.findById(assertObjectId(id)).lean();
        if (!doc) return null;
        return toSerializable(mapLean(doc as Record<string, unknown>));
    } catch {
        return null;
    }
}

export async function getLatestPdfReportForWebsite(
    websiteId: string,
): Promise<SerializablePdfReport | null> {
    await connectToDatabase();
    try {
        const doc = await PdfReport.findOne({
            websiteId: assertObjectId(websiteId),
            status: { $ne: "deleted" },
        })
            .sort({ createdAt: -1 })
            .lean();
        if (!doc) return null;
        return toSerializable(mapLean(doc as Record<string, unknown>));
    } catch {
        return null;
    }
}

export async function getPdfReportsForWebsite(
    websiteId: string,
): Promise<SerializablePdfReport[]> {
    await connectToDatabase();
    try {
        const docs = await PdfReport.find({ websiteId: assertObjectId(websiteId) })
            .sort({ createdAt: -1 })
            .lean();
        return docs.map((doc) => toSerializable(mapLean(doc as Record<string, unknown>)));
    } catch {
        return [];
    }
}

export async function getPdfReportsForPublicReport(
    publicReportId: string,
): Promise<SerializablePdfReport[]> {
    await connectToDatabase();
    try {
        const docs = await PdfReport.find({
            publicReportId: assertObjectId(publicReportId),
        })
            .sort({ createdAt: -1 })
            .lean();
        return docs.map((doc) => toSerializable(mapLean(doc as Record<string, unknown>)));
    } catch {
        return [];
    }
}

export async function getCompletedPdfReportsForPublicReport(
    publicReportId: string,
): Promise<SerializablePdfReport[]> {
    await connectToDatabase();
    const docs = await PdfReport.find({
        publicReportId: assertObjectId(publicReportId),
        status: "complete",
    })
        .sort({ createdAt: -1 })
        .lean();
    return docs.map((doc) => toSerializable(mapLean(doc as Record<string, unknown>)));
}

export async function getMatchingCompletedPdfReport(input: {
    publicReportId: string;
    snapshotChecksum: string;
    pdfVersion?: string;
}): Promise<SerializablePdfReport | null> {
    await connectToDatabase();
    const doc = await PdfReport.findOne({
        publicReportId: assertObjectId(input.publicReportId),
        "source.snapshotChecksum": input.snapshotChecksum,
        pdfVersion: input.pdfVersion ?? PDF_REPORT_VERSION,
        status: "complete",
    })
        .sort({ createdAt: -1 })
        .lean();
    if (!doc) return null;
    return toSerializable(mapLean(doc as Record<string, unknown>));
}

export async function hasActivePdfGeneration(publicReportId: string): Promise<boolean> {
    await connectToDatabase();
    const count = await PdfReport.countDocuments({
        publicReportId: assertObjectId(publicReportId),
        status: { $in: ["queued", "processing"] },
    });
    return count > 0;
}

export async function updatePdfReportStatus(
    pdfReportId: string,
    status: PdfReportStatus,
    extra?: Record<string, unknown>,
): Promise<void> {
    await connectToDatabase();
    await PdfReport.findByIdAndUpdate(assertObjectId(pdfReportId), {
        $set: { status, ...extra },
    });
}

export async function completePdfReportRecord(
    pdfReportId: string,
    input: {
        file: NonNullable<SerializablePdfReport["file"]>;
        engineVersion?: string | null;
        pageCount?: number | null;
        durationMs: number;
        warnings?: Array<{ code: string; message: string }>;
    },
): Promise<SerializablePdfReport | null> {
    await connectToDatabase();
    const now = new Date();
    const doc = await PdfReport.findByIdAndUpdate(
        assertObjectId(pdfReportId),
        {
            $set: {
                status: "complete",
                file: {
                    ...input.file,
                    pageCount: input.pageCount ?? input.file.pageCount ?? null,
                },
                "render.engineVersion": input.engineVersion ?? null,
                generatedAt: now,
                completedAt: now,
                durationMs: input.durationMs,
                warnings: input.warnings ?? [],
                errorCode: null,
                errorMessage: null,
            },
        },
        { new: true },
    ).lean();
    if (!doc) return null;
    return toSerializable(mapLean(doc as Record<string, unknown>));
}

export async function failPdfReportRecord(
    pdfReportId: string,
    input: { errorCode: string; errorMessage: string; durationMs?: number | null },
): Promise<void> {
    await connectToDatabase();
    await PdfReport.findByIdAndUpdate(assertObjectId(pdfReportId), {
        $set: {
            status: "failed",
            errorCode: input.errorCode,
            errorMessage: input.errorMessage,
            completedAt: new Date(),
            durationMs: input.durationMs ?? null,
        },
    });
}

export async function markPdfReportDeleted(pdfReportId: string): Promise<void> {
    await connectToDatabase();
    await PdfReport.findByIdAndUpdate(assertObjectId(pdfReportId), {
        $set: { status: "deleted" },
    });
}

export async function startPdfReportProcessing(pdfReportId: string): Promise<void> {
    await connectToDatabase();
    await PdfReport.findByIdAndUpdate(assertObjectId(pdfReportId), {
        $set: {
            status: "processing",
            startedAt: new Date(),
        },
    });
}
