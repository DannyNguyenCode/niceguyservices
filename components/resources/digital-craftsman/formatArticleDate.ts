/** Parse YYYY-MM-DD from article meta without timezone day-shift. */
export function parseArticleDate(isoDate: string): Date {
    const [year, month, day] = isoDate.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export function formatArticleDate(isoDate: string): string {
    return new Intl.DateTimeFormat("en-CA", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(parseArticleDate(isoDate));
}

export function articleDateToIsoDateTime(isoDate: string): string {
    return `${isoDate}T00:00:00.000Z`;
}
