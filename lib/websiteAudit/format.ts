export function formatWebsiteDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function formatRelativeTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    const diffMs = date.getTime() - Date.now();
    const absSeconds = Math.round(Math.abs(diffMs) / 1000);
    const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (absSeconds < 60) return formatter.format(Math.round(diffMs / 1000), "second");
    if (absSeconds < 3600) return formatter.format(Math.round(diffMs / 60000), "minute");
    if (absSeconds < 86400) return formatter.format(Math.round(diffMs / 3600000), "hour");
    return formatter.format(Math.round(diffMs / 86400000), "day");
}
