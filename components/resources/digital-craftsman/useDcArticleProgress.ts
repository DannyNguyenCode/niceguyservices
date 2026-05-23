"use client";

import { useEffect, useRef } from "react";

export function useDcArticleProgress() {
    const articleRef = useRef<HTMLElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const article = articleRef.current;
        const progressBar = progressRef.current;
        if (!article || !progressBar) return;

        const onScroll = () => {
            const winScroll = window.scrollY - article.offsetTop;
            const height = article.scrollHeight - window.innerHeight;
            if (winScroll > 0 && height > 0) {
                const scrolled = (winScroll / height) * 100;
                progressBar.style.width = `${Math.min(scrolled, 100)}%`;
            } else {
                progressBar.style.width = "0%";
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return { articleRef, progressRef };
}
