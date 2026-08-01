"use client";

import { useCallback, useEffect, useState } from "react";
import {
    AUDIT_AREA_TABS,
    AUDIT_NAV_SECTIONS,
    AUDIT_SECTION_SCROLL_MARGIN,
    getAuditSectionById,
} from "@/src/lib/audit-sections";

function focusSectionHeading(sectionId: string) {
    const section = getAuditSectionById(sectionId);
    if (!section) return;
    const heading = document.getElementById(section.headingId);
    if (heading instanceof HTMLElement) {
        if (!heading.hasAttribute("tabindex")) {
            heading.setAttribute("tabindex", "-1");
        }
        heading.focus({ preventScroll: true });
    }
}

export default function AuditNavigation() {
    const [activeSectionId, setActiveSectionId] = useState<string>(AUDIT_NAV_SECTIONS[0]?.id ?? "");

    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (!element) return;
        element.scrollIntoView({ behavior: "auto", block: "start" });
        window.setTimeout(() => focusSectionHeading(sectionId), 0);
        setActiveSectionId(sectionId);
    }, []);

    useEffect(() => {
        const sectionElements = AUDIT_NAV_SECTIONS.map((section) =>
            document.getElementById(section.id),
        ).filter((element): element is HTMLElement => Boolean(element));

        if (sectionElements.length === 0) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]?.target.id) {
                    setActiveSectionId(visible[0].target.id);
                }
            },
            {
                rootMargin: "-20% 0px -60% 0px",
                threshold: [0.1, 0.25, 0.5],
            },
        );

        for (const element of sectionElements) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <nav
            aria-label="Audit dashboard sections"
            className={`sticky top-4 z-10 rounded-2xl bg-base-100 p-3 shadow-sm ${AUDIT_SECTION_SCROLL_MARGIN}`}
        >
            <div className="mb-3 flex flex-wrap gap-2 border-b border-base-200 pb-3">
                {AUDIT_AREA_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        className="btn btn-ghost btn-xs sm:btn-sm"
                        onClick={() => scrollToSection(tab.sectionId)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="md:hidden">
                <label className="sr-only" htmlFor="audit-section-select">
                    Jump to section
                </label>
                <select
                    id="audit-section-select"
                    className="select select-bordered select-sm w-full"
                    value={activeSectionId}
                    onChange={(event) => scrollToSection(event.target.value)}
                >
                    {AUDIT_NAV_SECTIONS.map((section) => (
                        <option key={section.id} value={section.id}>
                            {section.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="hidden flex-wrap gap-2 md:flex" role="list">
                {AUDIT_NAV_SECTIONS.map((section) => {
                    const isActive = activeSectionId === section.id;
                    return (
                        <button
                            key={section.id}
                            type="button"
                            role="listitem"
                            className={`btn btn-ghost btn-xs ${isActive ? "btn-active" : ""}`}
                            aria-current={isActive ? "location" : undefined}
                            onClick={() => scrollToSection(section.id)}
                        >
                            {section.label}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
