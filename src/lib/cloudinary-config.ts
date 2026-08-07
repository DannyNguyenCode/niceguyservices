import "server-only";

import { getDeploymentEnvironment } from "@/src/config/app-env";

/** Values in .env that mean “not configured yet” — replace with real Cloudinary credentials. */
const PLACEHOLDER_VALUES = new Set([
    "",
    "your-cloudinary-cloud-name",
    "your-cloudinary-api-key",
    "your-cloudinary-api-secret",
]);

export const CLOUDINARY_ENV_KEYS = {
    cloudName: "CLOUDINARY_CLOUD_NAME",
    apiKey: "CLOUDINARY_API_KEY",
    apiSecret: "CLOUDINARY_API_SECRET",
    auditFolderPrefix: "CLOUDINARY_AUDIT_FOLDER_PREFIX",
} as const;

export const CLOUDINARY_ENV_PLACEHOLDERS = {
    cloudName: "your-cloudinary-cloud-name",
    apiKey: "your-cloudinary-api-key",
    apiSecret: "your-cloudinary-api-secret",
    auditFolderPrefix: "nice-guy-web-design/audits",
} as const;

function readEnv(key: string): string {
    const value = process.env[key]?.trim() ?? "";
    if (PLACEHOLDER_VALUES.has(value)) {
        return "";
    }
    return value;
}

export function isCloudinaryConfigured(): boolean {
    return Boolean(
        readEnv(CLOUDINARY_ENV_KEYS.cloudName) &&
            readEnv(CLOUDINARY_ENV_KEYS.apiKey) &&
            readEnv(CLOUDINARY_ENV_KEYS.apiSecret),
    );
}

export function getCloudinaryAuditFolderPrefix(): string {
    const configured = readEnv(CLOUDINARY_ENV_KEYS.auditFolderPrefix);
    const base = configured || CLOUDINARY_ENV_PLACEHOLDERS.auditFolderPrefix;
    const environment = getDeploymentEnvironment();
    if (environment === "production") {
        return `${base}/production`;
    }
    if (environment === "preview") {
        return `${base}/preview`;
    }
    return `${base}/development`;
}

export function getCloudinaryCredentials(): {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
} {
    const cloudName = readEnv(CLOUDINARY_ENV_KEYS.cloudName);
    const apiKey = readEnv(CLOUDINARY_ENV_KEYS.apiKey);
    const apiSecret = readEnv(CLOUDINARY_ENV_KEYS.apiSecret);

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error(
            "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file (replace the placeholder values).",
        );
    }

    return { cloudName, apiKey, apiSecret };
}
