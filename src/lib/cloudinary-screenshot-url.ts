/**
 * Build a Cloudinary thumbnail URL for dashboard previews.
 * Falls back to the original URL when transformation cannot be applied.
 */
export function buildScreenshotThumbnailUrl(
    secureUrl: string,
    options?: { width?: number; height?: number },
): string {
    const width = options?.width ?? 640;
    const height = options?.height ?? 480;

    try {
        const url = new URL(secureUrl);
        if (!url.hostname.includes("res.cloudinary.com")) {
            return secureUrl;
        }

        const parts = url.pathname.split("/");
        const uploadIndex = parts.findIndex((part) => part === "upload");
        if (uploadIndex === -1) {
            return secureUrl;
        }

        const transform = `c_limit,w_${width},h_${height},q_auto,f_auto`;
        const next = [...parts];
        next.splice(uploadIndex + 1, 0, transform);
        url.pathname = next.join("/");
        return url.toString();
    } catch {
        return secureUrl;
    }
}
