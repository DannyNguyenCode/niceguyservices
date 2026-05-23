"use client";

import { useEffect } from "react";

export function useDcAuditButtonHover() {
    useEffect(() => {
        const buttons = document.querySelectorAll(".dc-audit-btn");
        const onEnter = (e: Event) => {
            const btn = e.currentTarget as HTMLElement;
            btn.style.boxShadow = "2px 2px 0px 0px #414845";
        };
        const onLeave = (e: Event) => {
            const btn = e.currentTarget as HTMLElement;
            btn.style.boxShadow = "none";
        };
        buttons.forEach((btn) => {
            btn.addEventListener("mouseenter", onEnter);
            btn.addEventListener("mouseleave", onLeave);
        });
        return () => {
            buttons.forEach((btn) => {
                btn.removeEventListener("mouseenter", onEnter);
                btn.removeEventListener("mouseleave", onLeave);
            });
        };
    }, []);
}
