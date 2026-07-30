export function readPdfRenderSecret(): string {
    const secret = process.env.PDF_RENDER_SECRET?.trim();
    if (!secret) {
        throw new Error("PDF_RENDER_SECRET is not configured.");
    }
    return secret;
}
