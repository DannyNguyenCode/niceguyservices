import "server-only";

import type { ScreenshotStorageType } from "@/src/schemas/enums";

export type ScreenshotSaveInput = {
    websiteId: string;
    auditRunId: string;
    crawlId: string;
    filename: string;
    buffer: Buffer;
};

export type ScreenshotSaveResult = {
    storageType: ScreenshotStorageType;
    filePath?: string;
    publicUrl?: string;
    cloudinaryPublicId?: string;
    cloudinaryAssetId?: string;
    cloudinaryVersion?: number;
    secureUrl?: string;
    width?: number;
    height?: number;
    format?: string;
    fileSizeBytes: number;
};

export interface ScreenshotStorage {
    save(input: ScreenshotSaveInput): Promise<ScreenshotSaveResult>;
}
