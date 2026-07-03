"use client";

import { useEffect, useRef } from "react";
import { WORKBOOK_CONTENT } from "@/lib/clientDiscoveryWorkbook/content";
import { isSectionComplete } from "@/lib/clientDiscoveryWorkbook/validation";
import type { WorkbookAnswers } from "@/lib/clientDiscoveryWorkbook/types";

type WorkbookProgressPanelProps = {
    answers: WorkbookAnswers;
    activeSectionId: string;
    onSectionClick: (sectionId: string) => void;
};

function sectionChipClass(active: boolean, done: boolean): string {
    if (active) {
        return "border-primary bg-primary/15 font-semibold text-primary shadow-sm";
    }
    if (done) {
        return "border-success bg-success/10 text-success";
    }
    return "border-base-300 bg-(--pm-surface) text-(--pm-on-surface-variant) hover:border-primary hover:text-primary";
}

export function WorkbookProgressPanel({
    answers,
    activeSectionId,
    onSectionClick,
}: WorkbookProgressPanelProps) {
    const total = WORKBOOK_CONTENT.sections.length;
    const completed = WORKBOOK_CONTENT.sections.filter((s) =>
        isSectionComplete(s.id, answers),
    ).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const chip = listRef.current?.querySelector<HTMLButtonElement>(
            `button[aria-current="true"]`,
        );
        chip?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, [activeSectionId]);

    return (
        <div className="flex flex-col gap-2 border-b border-base-300/60 pb-3" aria-label="Workbook progress">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-pm-body text-sm font-semibold text-(--pm-on-surface)">
                    {completed} of {total} sections complete
                </p>
                <p className="font-pm-body text-sm text-(--pm-on-surface-variant)">{percent}% complete</p>
            </div>
            <div
                className="h-1.5 w-full overflow-hidden rounded-full bg-(--pm-surface-container)"
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${percent} percent of sections complete`}
            >
                <div
                    className="h-full rounded-full bg-primary transition-[width] duration-300"
                    style={{ width: `${percent}%` }}
                />
            </div>
            <ul
                ref={listRef}
                className="flex gap-2 overflow-x-auto pb-0.5 md:flex-wrap md:overflow-visible"
            >
                {WORKBOOK_CONTENT.sections.map((section, index) => {
                    const done = isSectionComplete(section.id, answers);
                    const active = section.id === activeSectionId;
                    return (
                        <li key={section.id} className="shrink-0 md:shrink">
                            <button
                                type="button"
                                onClick={() => onSectionClick(section.id)}
                                aria-current={active ? "true" : undefined}
                                className={`rounded-full border px-3 py-1 font-pm-body text-xs font-medium whitespace-nowrap transition-colors ${sectionChipClass(active, done)}`}
                            >
                                {index + 1}. {section.title}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
