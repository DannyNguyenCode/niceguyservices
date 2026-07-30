import "server-only";

import { getCloudinaryClient } from "@/src/lib/cloudinary";

export async function deletePdfAsset(publicId: string | null | undefined): Promise<void> {
    if (!publicId?.trim()) {
        return;
    }

    try {
        const cloudinary = getCloudinaryClient();
        await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    } catch (error) {
        console.warn("PDF asset cleanup failed:", error);
        throw new Error("PDF_ASSET_DELETE_FAILED");
    }
}
