import "server-only";

import { createHash } from "crypto";
import { getCloudinaryClient } from "@/src/lib/cloudinary";
import { PDF_MAX_BYTES } from "@/src/services/pdf-reports/constants";
import { getPdfCloudinaryFolder } from "@/src/services/pdf-reports/env";

export type UploadReportPdfResult = {
    provider: "cloudinary";
    secureUrl: string;
    publicId: string;
    resourceType: "raw";
    format: "pdf";
    bytes: number;
    filename: string;
    checksum: string;
};

function assertPdfBuffer(buffer: Buffer): void {
    if (!buffer || buffer.length === 0) {
        throw new Error("PDF_INVALID_BUFFER");
    }
    if (buffer.subarray(0, 5).toString() !== "%PDF-") {
        throw new Error("PDF_INVALID_BUFFER");
    }
    if (buffer.length > PDF_MAX_BYTES) {
        throw new Error("PDF_FILE_TOO_LARGE");
    }
}

export async function uploadReportPdf(input: {
    buffer: Buffer;
    websiteId: string;
    revisionNumber: number;
    pdfReportId: string;
    filename: string;
}): Promise<UploadReportPdfResult> {
    assertPdfBuffer(input.buffer);

    const cloudinary = getCloudinaryClient();
    const folder = `${getPdfCloudinaryFolder()}/${input.websiteId}`;
    const publicId = `report-r${input.revisionNumber}-${input.pdfReportId}`;

    const uploadResult = await new Promise<Record<string, unknown>>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: publicId,
                resource_type: "raw",
                format: "pdf",
                overwrite: false,
                unique_filename: false,
            },
            (error, result) => {
                if (error || !result) {
                    reject(error ?? new Error("PDF_UPLOAD_FAILED"));
                    return;
                }
                resolve(result as unknown as Record<string, unknown>);
            },
        );

        uploadStream.end(input.buffer);
    });

    const secureUrl = String(uploadResult.secure_url ?? "");
    if (!secureUrl) {
        throw new Error("PDF_UPLOAD_FAILED");
    }

    const checksum = createHash("sha256").update(input.buffer).digest("hex");

    return {
        provider: "cloudinary",
        secureUrl,
        publicId: String(uploadResult.public_id ?? `${folder}/${publicId}`),
        resourceType: "raw",
        format: "pdf",
        bytes: input.buffer.length,
        filename: input.filename,
        checksum,
    };
}
