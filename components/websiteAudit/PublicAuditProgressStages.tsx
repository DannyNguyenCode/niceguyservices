"use client";

import type { PublicAuditProgressStageView } from "@/components/websiteAudit/public-audit-submit-status";

function StageGlyph({ state }: { state: string }) {
    if (state === "complete") {
        return (
            <span
                className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-success"
                aria-hidden
            >
                ✓
            </span>
        );
    }
    if (state === "processing") {
        return (
            <span className="flex h-5 w-5 items-center justify-center" aria-hidden>
                <span className="loading-indicator h-4 w-4 rounded-full border-2 border-primary/25 border-t-primary motion-safe:animate-spin motion-reduce:animate-none" />
            </span>
        );
    }
    if (state === "failed") {
        return (
            <span
                className="flex h-5 w-5 items-center justify-center rounded-full bg-error/15 text-error text-xs font-bold"
                aria-hidden
            >
                !
            </span>
        );
    }
    return (
        <span
            className="flex h-5 w-5 items-center justify-center rounded-full border border-base-content/20 text-base-content/35"
            aria-hidden
        >
            ○
        </span>
    );
}

type PublicAuditProgressStagesProps = {
    stages: PublicAuditProgressStageView[];
    compact?: boolean;
};

/** Shared stage tracker for modal + inline progress (same mapped backend state). */
export default function PublicAuditProgressStages({
    stages,
    compact = false,
}: PublicAuditProgressStagesProps) {
    if (stages.length === 0) return null;

    return (
        <ol
            className={`w-full text-left ${compact ? "space-y-2.5" : "space-y-3"}`}
            aria-label="Audit progress"
        >
            {stages.map((stage) => (
                <li
                    key={stage.id}
                    className="flex items-start gap-3"
                    data-stage={stage.id}
                    data-state={stage.state}
                >
                    <StageGlyph state={stage.state} />
                    <div className="min-w-0 flex-1">
                        <p
                            className={`text-sm font-medium ${
                                stage.state === "pending"
                                    ? "text-base-content/45"
                                    : "text-base-content"
                            }`}
                        >
                            {stage.label}
                        </p>
                        {stage.state === "processing" || stage.state === "failed" ? (
                            <p className="mt-0.5 text-xs leading-relaxed text-base-content/65">
                                {stage.description}
                            </p>
                        ) : null}
                    </div>
                </li>
            ))}
        </ol>
    );
}
