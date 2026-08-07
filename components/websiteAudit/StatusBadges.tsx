import type {
    AiAnalysisStatus,
    AuditStatus,
    CrawlStatus,
    DemoStatus,
    NiceGuyStatus,
    OutreachStatus,
    PageSpeedStatus,
    WebsiteStatus,
} from "@/src/types/website-audit";

function StatusBadge({
    label,
    tone,
}: {
    label: string;
    tone: "neutral" | "info" | "warning" | "success" | "error";
}) {
    const toneClass = {
        neutral: "badge-ghost",
        info: "badge-info badge-outline",
        warning: "badge-warning badge-outline",
        success: "badge-success badge-outline",
        error: "badge-error badge-outline",
    }[tone];

    return (
        <span className={`badge ${toneClass}`}>
            <span className="sr-only">Status: </span>
            {label}
        </span>
    );
}

function formatStatusLabel(value: string): string {
    return value.replace(/-/g, " ");
}

export function WebsiteStatusBadge({ status }: { status: WebsiteStatus }) {
    const tone =
        status === "ready" ? "success" : status === "archived" ? "neutral" : "info";
    return <StatusBadge label={formatStatusLabel(status)} tone={tone} />;
}

export function AuditStatusBadge({ status }: { status: AuditStatus }) {
    const tone =
        status === "complete"
            ? "success"
            : status === "failed"
              ? "error"
              : status === "not-started"
                ? "neutral"
                : "warning";
    return <StatusBadge label={formatStatusLabel(status)} tone={tone} />;
}

export function CrawlStatusBadge({ status }: { status: CrawlStatus }) {
    const tone =
        status === "complete"
            ? "success"
            : status === "failed"
              ? "error"
              : status === "not-started"
                ? "neutral"
                : "warning";
    return <StatusBadge label={formatStatusLabel(status)} tone={tone} />;
}

export function PageSpeedStatusBadge({ status }: { status: PageSpeedStatus }) {
    const tone =
        status === "complete"
            ? "success"
            : status === "partial"
              ? "warning"
              : status === "failed"
                ? "error"
                : status === "not-started"
                  ? "neutral"
                  : "warning";
    return <StatusBadge label={formatStatusLabel(status)} tone={tone} />;
}

export function NiceGuyStatusBadge({ status }: { status: NiceGuyStatus }) {
    const tone =
        status === "complete"
            ? "success"
            : status === "failed"
              ? "error"
              : status === "not-started"
                ? "neutral"
                : "warning";
    return <StatusBadge label={formatStatusLabel(status)} tone={tone} />;
}

export function AiAnalysisStatusBadge({ status }: { status: AiAnalysisStatus }) {
    const tone =
        status === "complete"
            ? "success"
            : status === "partial"
              ? "warning"
              : status === "failed"
                ? "error"
                : status === "not-started"
                  ? "neutral"
                  : "info";
    return <StatusBadge label={formatStatusLabel(status)} tone={tone} />;
}

export function DemoStatusBadge({ status }: { status: DemoStatus }) {
    const tone =
        status === "published"
            ? "success"
            : status === "none"
              ? "neutral"
              : "info";
    return <StatusBadge label={formatStatusLabel(status)} tone={tone} />;
}

export function OutreachStatusBadge({ status }: { status: OutreachStatus }) {
    const tone =
        status === "interested" || status === "replied"
            ? "success"
            : status === "sent" || status === "draft-ready"
              ? "info"
              : status === "do-not-contact"
                ? "error"
                : "neutral";
    return <StatusBadge label={formatStatusLabel(status)} tone={tone} />;
}
