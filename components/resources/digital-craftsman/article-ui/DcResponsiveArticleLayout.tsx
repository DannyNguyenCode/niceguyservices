"use client";

import type { ReactNode } from "react";
import type { DcArticleMeta } from "../types";
import { DcArticleSidebar, DcRelatedGuides } from "../DcArticleSidebar";
import { useDcArticleProgress } from "../useDcArticleProgress";
import { useDcAuditButtonHover } from "../useDcAuditButtonHover";
import { useDcTocScrollSpy } from "../useDcTocScrollSpy";

/**
 * One article landmark and one content tree. Sidebar and related guides are
 * layout chrome shown from md breakpoints via CSS, not a second article copy.
 */
export function DcResponsiveArticleLayout({
    meta,
    children,
}: {
    meta: DcArticleMeta;
    children: ReactNode;
}) {
    const { activeId, scrollToSection } = useDcTocScrollSpy(meta.toc);
    const { articleRef, progressRef } = useDcArticleProgress();
    useDcAuditButtonHover();

    return (
        <main className="dc-article-main mx-auto max-w-[1120px] px-4 py-8 md:px-6 md:py-16">
            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
                <div className="hidden md:block md:col-span-3">
                    <DcArticleSidebar
                        toc={meta.toc}
                        activeId={activeId}
                        onTocClick={scrollToSection}
                        ctaTitle={meta.sidebarCta?.title ?? "Need a strategy?"}
                        ctaBody={
                            meta.sidebarCta?.body ??
                            "Tailored SEO roadmaps for trade professionals and small biz."
                        }
                    />
                </div>
                <article
                    ref={articleRef}
                    className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-[#c1c8c4] bg-white shadow-sm md:col-span-6 md:mx-0 md:max-w-none md:overflow-visible md:rounded-none md:border-0 md:bg-transparent md:shadow-none"
                >
                    <div
                        className="absolute top-0 left-0 z-10 h-0.5 w-full bg-transparent md:sticky md:top-16"
                        aria-hidden
                    >
                        <div
                            ref={progressRef}
                            className="h-full bg-[#416359] transition-[width] duration-100 ease-linear"
                            style={{ width: "0%" }}
                        />
                    </div>
                    {children}
                </article>
                <div className="hidden md:block md:col-span-3">
                    <DcRelatedGuides guides={meta.related} />
                </div>
            </div>
        </main>
    );
}
