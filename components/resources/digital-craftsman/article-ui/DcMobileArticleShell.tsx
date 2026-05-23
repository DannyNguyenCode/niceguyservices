"use client";

import type { ReactNode } from "react";
import { useDcArticleProgress } from "../useDcArticleProgress";
import { useDcAuditButtonHover } from "../useDcAuditButtonHover";

export function DcMobileArticleShell({ children }: { children: ReactNode }) {
    const { articleRef, progressRef } = useDcArticleProgress();
    useDcAuditButtonHover();

    return (
        <main className="relative mx-auto max-w-[1120px] px-4 py-8 md:hidden">
            <article
                ref={articleRef}
                className="relative mx-auto max-w-3xl overflow-hidden rounded-lg border border-[#c1c8c4] bg-white shadow-sm"
            >
                <div className="absolute top-0 left-0 z-10 h-0.5 w-full bg-transparent" aria-hidden>
                    <div
                        ref={progressRef}
                        className="h-full bg-[#416359] transition-[width] duration-100 ease-linear"
                        style={{ width: "0%" }}
                    />
                </div>
                {children}
            </article>
        </main>
    );
}
