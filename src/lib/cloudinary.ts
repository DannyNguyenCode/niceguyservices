import "server-only";

import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryCredentials } from "@/src/lib/cloudinary-config";

let configured = false;

function ensureCloudinaryConfigured(): void {
    if (configured) return;

    const { cloudName, apiKey, apiSecret } = getCloudinaryCredentials();

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    });

    configured = true;
}

export function getCloudinaryClient() {
    ensureCloudinaryConfigured();
    return cloudinary;
}
