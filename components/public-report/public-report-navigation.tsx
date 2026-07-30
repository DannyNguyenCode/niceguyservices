"use client";

import type { SerializablePublicReport } from "@/src/types/public-report";

const SECTIONS = [
    { id: "overview", label: "Overview", setting: null },
    { id: "score", label: "Score", setting: "showOverallScore" },
    { id: "strengths", label: "Strengths", setting: "showStrengths" },
    { id: "priorities", label: "Priorities", setting: "showWeaknesses" },
    { id: "performance", label: "Performance", setting: "showPageSpeed" },
    { id: "categories", label: "Categories", setting: "showCategoryScores" },
    { id: "quick-wins", label: "Quick wins", setting: "showQuickWins" },
    { id: "long-term", label: "Long-term", setting: "showLongTermRecommendations" },
    { id: "plan", label: "Action plan", setting: "showPriorityPlan" },
    { id: "screenshots", label: "Screenshots", setting: "showScreenshots" },
    { id: "concepts", label: "Concepts", setting: "showHeroSuggestions" },
    { id: "methodology", label: "Methodology", setting: null },
] as const;

type PublicReportNavigationProps = {
    report: SerializablePublicReport;
};

export default function PublicReportNavigation({ report }: PublicReportNavigationProps) {
    const links = SECTIONS.filter((section) => {
        if (!section.setting) return true;
        return report.settings[section.setting];
    });

    function scrollTo(id: string) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return (
        <nav
            aria-label="Report sections"
            className="rounded-2xl bg-base-100 p-3 shadow-sm print:hidden"
        >
            <div className="md:hidden">
                <label className="sr-only" htmlFor="report-section-select">
                    Jump to section
                </label>
                <select
                    id="report-section-select"
                    className="select select-bordered select-sm w-full"
                    defaultValue=""
                    onChange={(event) => {
                        if (event.target.value) scrollTo(event.target.value);
                    }}
                >
                    <option value="" disabled>
                        Jump to section
                    </option>
                    {links.map((section) => (
                        <option key={section.id} value={section.id}>
                            {section.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="hidden flex-wrap gap-2 md:flex">
                {links.map((section) => (
                    <button
                        key={section.id}
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => scrollTo(section.id)}
                    >
                        {section.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}
