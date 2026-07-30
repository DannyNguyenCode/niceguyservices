"use client";

import {
    BarChart3,
    Camera,
    FileText,
    Gauge,
    Globe,
    Mail,
    Monitor,
    Search,
    Settings,
    Sparkles,
    User,
    File,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { formatRelativeTime, formatWebsiteDate } from "@/lib/websiteAudit/format";
import type { ActivityCategory, ActivitySeverity } from "@/src/constants/activity-events";
import { getActivitySummary } from "@/src/services/activity/get-activity-summary";
import type { SerializableActivityItem } from "@/src/services/activity/types";

const CATEGORY_OPTIONS: Array<{ value: ActivityCategory | "all"; label: string }> = [
    { value: "all", label: "All" },
    { value: "website", label: "Website" },
    { value: "crawl", label: "Crawl" },
    { value: "screenshot", label: "Screenshots" },
    { value: "pagespeed", label: "PageSpeed" },
    { value: "metrics", label: "Metrics" },
    { value: "ai", label: "AI" },
    { value: "report", label: "Reports" },
    { value: "pdf", label: "PDF" },
    { value: "outreach", label: "Outreach" },
    { value: "demo", label: "Demo" },
    { value: "administrator", label: "Administrator" },
    { value: "system", label: "System" },
];

const SEVERITY_OPTIONS: Array<{ value: ActivitySeverity | "all"; label: string }> = [
    { value: "all", label: "All" },
    { value: "info", label: "Info" },
    { value: "success", label: "Success" },
    { value: "warning", label: "Warning" },
    { value: "error", label: "Error" },
];

function categoryIcon(category: ActivityCategory) {
    switch (category) {
        case "website":
            return Globe;
        case "crawl":
            return Search;
        case "screenshot":
            return Camera;
        case "pagespeed":
            return Gauge;
        case "metrics":
            return BarChart3;
        case "ai":
            return Sparkles;
        case "report":
            return FileText;
        case "pdf":
            return File;
        case "outreach":
            return Mail;
        case "demo":
            return Monitor;
        case "administrator":
            return User;
        default:
            return Settings;
    }
}

function severityBadgeClass(severity: ActivitySeverity): string {
    switch (severity) {
        case "success":
            return "badge-success";
        case "warning":
            return "badge-warning";
        case "error":
            return "badge-error";
        default:
            return "badge-ghost";
    }
}

function resourceLink(item: SerializableActivityItem): { href: string; label: string } | null {
    if (item.crawlDataId) return { href: "#crawl", label: "View crawl" };
    if (item.publicReportId) return { href: "#public-reports", label: "View public report" };
    if (item.pdfReportId) return { href: "#pdf-reports", label: "View PDF" };
    if (item.outreachDraftId) return { href: "#outreach-email", label: "View outreach draft" };
    if (item.demoProjectId) return { href: "#demo-website", label: "View demo" };
    return null;
}

type ActivityTimelineProps = {
    websiteId: string;
    initialItems: SerializableActivityItem[];
    initialHasMore: boolean;
    initialNextCursor: string | null;
    pollWhileActive?: boolean;
};

export default function ActivityTimeline({
    websiteId,
    initialItems,
    initialHasMore,
    initialNextCursor,
    pollWhileActive = false,
}: ActivityTimelineProps) {
    const [items, setItems] = useState(initialItems);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
    const [category, setCategory] = useState<ActivityCategory | "all">("all");
    const [severity, setSeverity] = useState<ActivitySeverity | "all">("all");
    const [errorsOnly, setErrorsOnly] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteDescription, setNoteDescription] = useState("");
    const [isPending, startTransition] = useTransition();

    const summary = useMemo(() => getActivitySummary(items), [items]);

    const loadActivity = useCallback(
        async (options?: { before?: string | null; append?: boolean }) => {
            const params = new URLSearchParams();
            params.set("limit", "25");
            if (options?.before) params.set("before", options.before);
            if (category !== "all") params.set("category", category);
            if (severity !== "all") params.set("severity", severity);
            if (errorsOnly) params.set("errorsOnly", "true");

            const response = await fetch(
                `/api/admin/websites/${websiteId}/activity?${params.toString()}`,
            );
            const result = await response.json();
            if (!response.ok || !result.success) {
                setMessage(result.error?.message ?? "Unable to load activity.");
                return;
            }

            setItems((current) =>
                options?.append ? [...current, ...result.items] : result.items,
            );
            setHasMore(Boolean(result.hasMore));
            setNextCursor(result.nextCursor ?? null);
        },
        [websiteId, category, severity, errorsOnly],
    );

    useEffect(() => {
        startTransition(() => {
            void loadActivity();
        });
    }, [loadActivity]);

    useEffect(() => {
        if (!pollWhileActive || !summary.activeStage) return undefined;
        const interval = window.setInterval(() => {
            void loadActivity();
        }, 8000);
        return () => window.clearInterval(interval);
    }, [pollWhileActive, summary.activeStage, loadActivity]);

    function saveNote() {
        setMessage("Saving note…");
        startTransition(async () => {
            const response = await fetch(`/api/admin/websites/${websiteId}/activity/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: noteTitle, description: noteDescription }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                setMessage(result.error?.message ?? "Unable to save note.");
                return;
            }
            setNoteTitle("");
            setNoteDescription("");
            setMessage("Note saved.");
            await loadActivity();
        });
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <p className="text-xs text-base-content/65">Latest activity</p>
                    <p className="mt-1 text-sm font-medium">
                        {summary.latestEvent?.title ?? "No activity yet"}
                    </p>
                </div>
                <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <p className="text-xs text-base-content/65">Last success</p>
                    <p className="mt-1 text-sm font-medium">
                        {summary.latestSuccess?.title ?? "None recorded"}
                    </p>
                </div>
                <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <p className="text-xs text-base-content/65">Active stage</p>
                    <p className="mt-1 text-sm font-medium">
                        {summary.activeStage ?? "None"}
                    </p>
                </div>
                <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <p className="text-xs text-base-content/65">Attention</p>
                    <p className="mt-1 text-sm font-medium">
                        {summary.errorCount} errors · {summary.warningCount} warnings
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <label className="grid grid-cols-1 gap-1 text-sm">
                    <span className="font-medium">Category</span>
                    <select
                        className="select select-bordered select-sm"
                        value={category}
                        onChange={(event) =>
                            setCategory(event.target.value as ActivityCategory | "all")
                        }
                    >
                        {CATEGORY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="grid grid-cols-1 gap-1 text-sm">
                    <span className="font-medium">Severity</span>
                    <select
                        className="select select-bordered select-sm"
                        value={severity}
                        onChange={(event) =>
                            setSeverity(event.target.value as ActivitySeverity | "all")
                        }
                    >
                        {SEVERITY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex items-end gap-2 text-sm">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={errorsOnly}
                        onChange={(event) => setErrorsOnly(event.target.checked)}
                    />
                    <span>Show errors only</span>
                </label>
            </div>

            <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                <h3 className="text-sm font-medium">Add administrator note</h3>
                <div className="mt-3 grid grid-cols-1 gap-3">
                    <label className="grid grid-cols-1 gap-1 text-sm">
                        <span>Title</span>
                        <input
                            className="input input-bordered input-sm"
                            value={noteTitle}
                            onChange={(event) => setNoteTitle(event.target.value)}
                            maxLength={120}
                        />
                    </label>
                    <label className="grid grid-cols-1 gap-1 text-sm">
                        <span>Description</span>
                        <textarea
                            className="textarea textarea-bordered"
                            value={noteDescription}
                            onChange={(event) => setNoteDescription(event.target.value)}
                            maxLength={2000}
                        />
                    </label>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm w-fit"
                        disabled={isPending || !noteTitle.trim() || !noteDescription.trim()}
                        onClick={saveNote}
                    >
                        Save note
                    </button>
                </div>
            </div>

            {items.length === 0 ? (
                <p className="text-sm text-base-content/75">
                    {category !== "all" || severity !== "all" || errorsOnly
                        ? "No activity matches the selected filters."
                        : "No activity has been recorded for this website yet."}
                </p>
            ) : (
                <ol className="grid grid-cols-1 gap-4">
                    {items.map((item) => {
                        const Icon = categoryIcon(item.category);
                        const link = resourceLink(item);
                        return (
                            <li
                                key={item.id}
                                className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl bg-base-200 p-4 shadow-sm"
                            >
                                <div
                                    className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-base-100 shadow-sm"
                                    aria-hidden="true"
                                >
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-sm font-medium">{item.title}</p>
                                        <span className={`badge badge-sm ${severityBadgeClass(item.severity)}`}>
                                            {item.severity}
                                        </span>
                                        <span className="badge badge-sm badge-ghost">
                                            {item.category}
                                        </span>
                                    </div>
                                    {item.description ? (
                                        <p className="text-sm text-base-content/75">
                                            {item.description}
                                        </p>
                                    ) : null}
                                    <div className="flex flex-wrap gap-3 text-xs text-base-content/60">
                                        <span>{item.actor.name ?? item.actor.type}</span>
                                        <span>{formatRelativeTime(item.occurredAt)}</span>
                                        <span>{formatWebsiteDate(item.occurredAt)}</span>
                                    </div>
                                    {link ? (
                                        <a className="text-sm link link-primary w-fit" href={link.href}>
                                            {link.label}
                                        </a>
                                    ) : null}
                                </div>
                            </li>
                        );
                    })}
                </ol>
            )}

            {hasMore ? (
                <button
                    type="button"
                    className="btn btn-outline btn-sm w-fit"
                    disabled={isPending}
                    onClick={() =>
                        startTransition(() => {
                            void loadActivity({ before: nextCursor, append: true });
                        })
                    }
                >
                    Load more events
                </button>
            ) : null}

            {message ? <p className="text-sm text-base-content/75">{message}</p> : null}
        </div>
    );
}
