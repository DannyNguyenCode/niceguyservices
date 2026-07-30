"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { DEFAULT_DEMO_CONFIGURATION } from "@/src/services/demo/constants";
import type {
    DemoReadiness,
    SerializableDemoGeneration,
    SerializableDemoProject,
} from "@/src/services/demo/types";

type DemoWebsiteBuilderProps = {
    publicReportId: string;
    readiness: DemoReadiness;
    initialProject?: SerializableDemoProject | null;
    generations?: SerializableDemoGeneration[];
};

const PAGE_OPTIONS = ["home", "services", "about", "contact", "resources"] as const;
const VISUAL_DIRECTIONS = [
    "modern-professional",
    "warm-trustworthy",
    "bold-conversion",
    "clean-minimal",
    "custom",
] as const;

export default function DemoWebsiteBuilder({
    publicReportId,
    readiness,
    initialProject,
    generations = [],
}: DemoWebsiteBuilderProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const [project, setProject] = useState<SerializableDemoProject | null>(initialProject ?? null);
    const [pages, setPages] = useState<string[]>(
        initialProject?.configuration.pages ?? [...DEFAULT_DEMO_CONFIGURATION.pages],
    );
    const [visualDirection, setVisualDirection] = useState(
        initialProject?.configuration.visualDirection ?? DEFAULT_DEMO_CONFIGURATION.visualDirection,
    );
    const [contentMode, setContentMode] = useState(
        initialProject?.contentPolicy.mode ?? "approved-facts-with-rewritten-copy",
    );
    const [selectedHeroId, setSelectedHeroId] = useState<string | null>(
        initialProject?.selectedHeroSuggestionId ?? null,
    );
    const [previewPath, setPreviewPath] = useState<string | null>(initialProject?.previewPath ?? null);

    const latestGeneration = generations[0] ?? null;

    function togglePage(page: string) {
        setPages((current) =>
            current.includes(page) ? current.filter((item) => item !== page) : [...current, page],
        );
    }

    function createProject() {
        setMessage("Creating demo project…");
        startTransition(async () => {
            const response = await fetch(`/api/admin/reports/${publicReportId}/demo-project`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    configuration: { pages, visualDirection },
                    contentPolicy: { mode: contentMode },
                    selectedHeroSuggestionId: selectedHeroId,
                }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                setMessage(result.error?.message ?? "Demo project creation failed.");
                return;
            }
            setProject(result.project);
            setPreviewPath(result.previewPath ?? result.project.previewPath ?? null);
            setMessage("Demo project created.");
            router.refresh();
        });
    }

    function generateDemo() {
        if (!project?.id) return;
        setMessage("Generating demo…");
        startTransition(async () => {
            const response = await fetch(`/api/admin/demo-projects/${project.id}/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                setMessage(result.error?.message ?? "Demo generation failed.");
                return;
            }
            setMessage("Demo generated and ready for review.");
            router.refresh();
        });
    }

    async function runAction(action: "approve" | "reject" | "archive") {
        if (!project?.id) return;
        setMessage(`Running ${action}…`);
        startTransition(async () => {
            const response = await fetch(`/api/admin/demo-projects/${project.id}/${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body:
                    action === "reject"
                        ? JSON.stringify({ reason: "other", notes: "Rejected in dashboard review." })
                        : undefined,
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                setMessage(result.error?.message ?? "Action failed.");
                return;
            }
            setProject(result.project);
            setMessage(`Demo ${action}d.`);
            router.refresh();
        });
    }

    return (
        <div className="mt-6 grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="grid grid-cols-1 gap-2 text-sm">
                    <span className="font-medium">Pages</span>
                    <div className="flex flex-wrap gap-2">
                        {PAGE_OPTIONS.map((page) => (
                            <button
                                key={page}
                                type="button"
                                className={`btn btn-sm ${pages.includes(page) ? "btn-primary" : "btn-outline"}`}
                                onClick={() => togglePage(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </label>

                <label className="grid grid-cols-1 gap-2 text-sm">
                    <span className="font-medium">Visual direction</span>
                    <select
                        className="select select-bordered"
                        value={visualDirection}
                        onChange={(event) =>
                            setVisualDirection(
                                event.target.value as (typeof VISUAL_DIRECTIONS)[number],
                            )
                        }
                    >
                        {VISUAL_DIRECTIONS.map((direction) => (
                            <option key={direction} value={direction}>
                                {direction}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="grid grid-cols-1 gap-2 text-sm">
                    <span className="font-medium">Content mode</span>
                    <select
                        className="select select-bordered"
                        value={contentMode}
                        onChange={(event) =>
                            setContentMode(
                                event.target.value as
                                    | "placeholder-only"
                                    | "approved-facts-only"
                                    | "approved-facts-with-rewritten-copy",
                            )
                        }
                    >
                        <option value="placeholder-only">Placeholder only</option>
                        <option value="approved-facts-only">Approved facts only</option>
                        <option value="approved-facts-with-rewritten-copy">
                            Approved facts with rewritten copy
                        </option>
                    </select>
                </label>

                <label className="grid grid-cols-1 gap-2 text-sm">
                    <span className="font-medium">Hero concept</span>
                    <select
                        className="select select-bordered"
                        value={selectedHeroId ?? ""}
                        onChange={(event) => setSelectedHeroId(event.target.value || null)}
                    >
                        <option value="">No hero suggestion</option>
                        {readiness.availableHeroSuggestions.map((hero) => (
                            <option key={hero.id} value={hero.id}>
                                {hero.title}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="flex flex-wrap gap-3">
                {!project ? (
                    <button
                        type="button"
                        className="btn btn-primary"
                        disabled={!readiness.canCreateProject || isPending}
                        onClick={createProject}
                    >
                        Create demo project
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            className="btn btn-primary"
                            disabled={!readiness.canGenerate || isPending}
                            onClick={generateDemo}
                        >
                            Generate demo
                        </button>
                        {previewPath ? (
                            <a className="btn btn-outline" href={previewPath} target="_blank" rel="noreferrer">
                                Open preview
                            </a>
                        ) : null}
                        <button
                            type="button"
                            className="btn btn-outline"
                            disabled={project.status !== "review" || isPending}
                            onClick={() => runAction("approve")}
                        >
                            Approve demo
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline"
                            disabled={!["review", "approved"].includes(project.status) || isPending}
                            onClick={() => runAction("reject")}
                        >
                            Reject demo
                        </button>
                        <button
                            type="button"
                            className="btn btn-ghost"
                            disabled={isPending}
                            onClick={() => runAction("archive")}
                        >
                            Archive demo
                        </button>
                    </>
                )}
            </div>

            {project ? (
                <div className="rounded-xl bg-base-200 p-4 text-sm shadow-sm">
                    <p>
                        Status: <strong>{project.status}</strong> · Revision{" "}
                        {project.source.publicReportRevision} · Pages: {project.configuration.pages.join(", ")}
                    </p>
                    {latestGeneration ? (
                        <p className="mt-2 text-base-content/75">
                            Latest generation: {latestGeneration.status} · Provider{" "}
                            {latestGeneration.provider.name}
                            {latestGeneration.output.buildStatus
                                ? ` · Build ${latestGeneration.output.buildStatus}`
                                : ""}
                            {latestGeneration.validation.warnings.length
                                ? ` · ${latestGeneration.validation.warnings.length} warnings`
                                : ""}
                        </p>
                    ) : null}
                </div>
            ) : null}

            {message ? <p className="text-sm text-base-content/75">{message}</p> : null}
        </div>
    );
}
