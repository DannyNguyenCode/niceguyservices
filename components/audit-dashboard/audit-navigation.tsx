"use client";

const SECTIONS = [
    { id: "overview", label: "Overview" },
    { id: "crawl", label: "Crawl" },
    { id: "screenshots", label: "Screenshots" },
    { id: "pagespeed", label: "PageSpeed" },
    { id: "niceguy", label: "Nice Guy" },
    { id: "ai-analysis", label: "AI Analysis" },
    { id: "activity", label: "Activity" },
    { id: "history", label: "History" },
] as const;

export default function AuditNavigation() {
    function scrollToSection(id: string) {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    return (
        <nav
            aria-label="Audit dashboard sections"
            className="sticky top-4 z-10 rounded-2xl bg-base-100 p-3 shadow-sm"
        >
            <div className="md:hidden">
                <label className="sr-only" htmlFor="audit-section-select">
                    Jump to section
                </label>
                <select
                    id="audit-section-select"
                    className="select select-bordered select-sm w-full"
                    defaultValue=""
                    onChange={(event) => {
                        if (event.target.value) {
                            scrollToSection(event.target.value);
                        }
                    }}
                >
                    <option value="" disabled>
                        Jump to section
                    </option>
                    {SECTIONS.map((section) => (
                        <option key={section.id} value={section.id}>
                            {section.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="hidden flex-wrap gap-2 md:flex">
                {SECTIONS.map((section) => (
                    <button
                        key={section.id}
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => scrollToSection(section.id)}
                    >
                        {section.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}
