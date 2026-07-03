export function workbookPdfFilename(blank: boolean, businessName?: string): string {
    const slug = (businessName || "workbook")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    const suffix = blank ? "blank" : "answers";
    return `client-discovery-${slug || "workbook"}-${suffix}.pdf`;
}
