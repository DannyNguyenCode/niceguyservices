export function getPdfFilename(input: {
    businessName?: string | null;
    normalizedDomain?: string | null;
    revisionNumber: number;
}): string {
    const raw = (input.businessName?.trim() || input.normalizedDomain?.trim() || "website")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);

    return `${raw || "website"}-website-audit-r${input.revisionNumber}.pdf`;
}
