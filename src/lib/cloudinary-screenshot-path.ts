import { assertObjectId } from "@/src/lib/assert-object-id";
import { ScreenshotPathError } from "@/src/lib/errors/audit-platform-error";

export type ScreenshotSaveValidationInput = {
    websiteId: string;
    auditRunId: string;
    crawlId: string;
    filename: string;
    buffer: Buffer;
};

export function validateScreenshotSaveInput(input: ScreenshotSaveValidationInput): void {
    if (!input.buffer || input.buffer.byteLength === 0) {
        throw new ScreenshotPathError("Screenshot image data is required.");
    }
    assertObjectId(input.websiteId, "website ID");
    assertObjectId(input.auditRunId, "audit run ID");
    assertObjectId(input.crawlId, "crawl ID");
    sanitizeScreenshotFilename(input.filename);
}

export function sanitizeScreenshotFilename(filename: string): string {
    const withoutExtension = filename.replace(/\.png$/i, "").trim();
    if (!withoutExtension) {
        throw new ScreenshotPathError("Screenshot filename is required.");
    }

    const sanitized = withoutExtension.replace(/[^a-zA-Z0-9._-]/g, "-");
    if (!sanitized) {
        throw new ScreenshotPathError("Screenshot filename is invalid.");
    }

    return sanitized;
}

export function buildCloudinaryScreenshotFolder(input: {
    folderPrefix: string;
    websiteId: string;
    auditRunId: string;
}): string {
    assertObjectId(input.websiteId, "website ID");
    assertObjectId(input.auditRunId, "audit run ID");

    const prefix = input.folderPrefix.trim().replace(/\/+$/g, "");
    if (!prefix) {
        throw new ScreenshotPathError("Cloudinary folder prefix is required.");
    }

    return `${prefix}/${input.websiteId}/${input.auditRunId}`;
}

export function buildCloudinaryScreenshotPublicId(input: {
    folderPrefix: string;
    websiteId: string;
    auditRunId: string;
    filename: string;
}): { folder: string; filename: string; publicId: string } {
    const folder = buildCloudinaryScreenshotFolder(input);
    const filename = sanitizeScreenshotFilename(input.filename);
    return {
        folder,
        filename,
        publicId: `${folder}/${filename}`,
    };
}
