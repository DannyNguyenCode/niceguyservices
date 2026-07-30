import AuditSectionCard from "@/components/websiteAudit/AuditSectionCard";
import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import type { SerializableScreenshot } from "@/src/data/screenshots";

function formatFileSize(bytes: number | null): string {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatLabel(value: string): string {
    return value.replace(/-/g, " ");
}

type WebsiteScreenshotsSectionProps = {
    screenshots: SerializableScreenshot[];
    crawlStatus: string;
};

export default function WebsiteScreenshotsSection({
    screenshots,
    crawlStatus,
}: WebsiteScreenshotsSectionProps) {
    const completed = screenshots.filter((shot) => shot.status === "complete");
    const screenshotStatus =
        completed.length === 4
            ? "Complete"
            : completed.length > 0
              ? "Partial"
              : crawlStatus === "failed"
                ? "Failed"
                : "Not available";

    const orderedTypes = [
        "desktop-viewport",
        "desktop-full",
        "mobile-viewport",
        "mobile-full",
    ] as const;

    const byType = new Map(completed.map((shot) => [shot.type, shot]));

    return (
        <AuditSectionCard title="Screenshots">
            <div className="mb-6 rounded-2xl bg-base-200 p-5 shadow-sm">
                <p className="text-sm text-base-content/60">Screenshot status</p>
                <p className="mt-2 text-sm text-base-content">{screenshotStatus}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {orderedTypes.map((type) => {
                    const shot = byType.get(type);
                    return (
                        <div key={type} className="rounded-2xl bg-base-200 p-5 shadow-sm">
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-base-content">
                                        {formatLabel(type)}
                                    </p>
                                    {shot ? (
                                        <p className="mt-1 text-sm text-base-content/60">
                                            {shot.viewport.width}×{shot.viewport.height}
                                        </p>
                                    ) : null}
                                </div>
                                {shot?.secureUrl ? (
                                    <a
                                        href={shot.secureUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-ghost btn-xs"
                                    >
                                        Open full image
                                    </a>
                                ) : null}
                            </div>

                            {shot?.secureUrl ? (
                                <div className="overflow-hidden rounded-xl bg-base-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={shot.secureUrl}
                                        alt={`${formatLabel(type)} screenshot`}
                                        width={shot.width ?? shot.viewport.width}
                                        height={shot.height ?? shot.viewport.height}
                                        className="h-auto max-h-72 w-full object-contain object-top"
                                        loading="lazy"
                                    />
                                </div>
                            ) : (
                                <div className="flex min-h-44 items-center justify-center rounded-xl bg-base-100 p-4 text-center text-sm text-base-content/65">
                                    {shot?.status === "failed"
                                        ? shot.errorMessage || "Screenshot failed"
                                        : "Screenshot not available"}
                                </div>
                            )}

                            {shot ? (
                                <dl className="mt-4 grid grid-cols-1 gap-2 text-sm">
                                    <div className="flex justify-between gap-3">
                                        <dt className="text-base-content/60">Generated</dt>
                                        <dd>
                                            {shot.generatedAt
                                                ? formatWebsiteDate(shot.generatedAt)
                                                : "—"}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between gap-3">
                                        <dt className="text-base-content/60">File size</dt>
                                        <dd>{formatFileSize(shot.fileSizeBytes)}</dd>
                                    </div>
                                </dl>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </AuditSectionCard>
    );
}
