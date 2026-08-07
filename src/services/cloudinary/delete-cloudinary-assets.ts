import "server-only";

import { getCloudinaryClient } from "@/src/lib/cloudinary";
import { logWarn } from "@/src/lib/safe-log";

export async function deleteCloudinaryAssetBestEffort(
    publicId: string | null | undefined,
    resourceType: "image" | "raw" | "video" = "image",
): Promise<void> {
    const trimmed = publicId?.trim();
    if (!trimmed) {
        return;
    }

    try {
        const cloudinary = getCloudinaryClient();
        await cloudinary.uploader.destroy(trimmed, { resource_type: resourceType });
    } catch (error) {
        logWarn("cloudinary.asset_delete_failed", {
            publicId: trimmed,
            resourceType,
            message: error instanceof Error ? error.message.slice(0, 200) : "unknown",
        });
    }
}

export async function deleteCloudinaryAssetsByPrefixBestEffort(
    prefix: string,
    resourceType: "image" | "raw" | "video" = "image",
): Promise<void> {
    const trimmed = prefix.trim().replace(/\/+$/g, "");
    if (!trimmed) {
        return;
    }

    try {
        const cloudinary = getCloudinaryClient();
        await cloudinary.api.delete_resources_by_prefix(trimmed, {
            resource_type: resourceType,
        });
    } catch (error) {
        logWarn("cloudinary.prefix_delete_failed", {
            prefix: trimmed,
            resourceType,
            message: error instanceof Error ? error.message.slice(0, 200) : "unknown",
        });
    }
}
