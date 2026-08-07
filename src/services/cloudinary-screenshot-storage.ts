import "server-only";

import { buildCloudinaryScreenshotPublicId, validateScreenshotSaveInput } from "@/src/lib/cloudinary-screenshot-path";
import { getCloudinaryAuditFolderPrefix } from "@/src/lib/cloudinary-config";
import { getCloudinaryClient } from "@/src/lib/cloudinary";
import type {
    ScreenshotSaveInput,
    ScreenshotSaveResult,
    ScreenshotStorage,
} from "@/src/services/screenshot-storage";
export class CloudinaryScreenshotStorage implements ScreenshotStorage {
    async save(input: ScreenshotSaveInput): Promise<ScreenshotSaveResult> {
        validateScreenshotSaveInput(input);

        const cloudinary = getCloudinaryClient();
        const { folder, filename, publicId } = buildCloudinaryScreenshotPublicId({
            folderPrefix: getCloudinaryAuditFolderPrefix(),
            websiteId: input.websiteId,
            auditRunId: input.auditRunId,
            filename: input.filename,
        });

        const uploadResult = await new Promise<Record<string, unknown>>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder,
                        public_id: filename,
                        resource_type: "image",
                        format: "png",
                        overwrite: false,
                        unique_filename: false,
                    },
                    (error, result) => {
                        if (error || !result) {
                            reject(
                                error ??
                                    new Error("Cloudinary upload did not return a result."),
                            );
                            return;
                        }
                        resolve(result as unknown as Record<string, unknown>);
                    },
                );

                uploadStream.end(input.buffer);
            },
        );

        return {
            storageType: "cloudinary",
            cloudinaryPublicId: String(uploadResult.public_id ?? publicId),
            cloudinaryAssetId: uploadResult.asset_id
                ? String(uploadResult.asset_id)
                : undefined,
            cloudinaryVersion:
                typeof uploadResult.version === "number"
                    ? uploadResult.version
                    : Number(uploadResult.version) || undefined,
            secureUrl: String(uploadResult.secure_url ?? ""),
            publicUrl: String(uploadResult.secure_url ?? ""),
            width:
                typeof uploadResult.width === "number"
                    ? uploadResult.width
                    : undefined,
            height:
                typeof uploadResult.height === "number"
                    ? uploadResult.height
                    : undefined,
            format: uploadResult.format ? String(uploadResult.format) : "png",
            fileSizeBytes:
                typeof uploadResult.bytes === "number"
                    ? uploadResult.bytes
                    : input.buffer.byteLength,
        };
    }
}

let storageInstance: CloudinaryScreenshotStorage | null = null;

export function getScreenshotStorage(): CloudinaryScreenshotStorage {
    if (!storageInstance) {
        storageInstance = new CloudinaryScreenshotStorage();
    }
    return storageInstance;
}
