"use client";

import { useEffect, useState } from "react";

export function useDcTocScrollSpy<T extends string>(toc: readonly { id: T; label: string }[]) {
    const [activeId, setActiveId] = useState<T>(toc[0].id);

    useEffect(() => {
        const sections = toc
            .map(({ id }) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);
        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]?.target.id) {
                    setActiveId(visible[0].target.id as T);
                }
            },
            { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [toc]);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
    };

    return { activeId, scrollToSection };
}
