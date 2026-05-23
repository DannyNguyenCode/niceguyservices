"use client";

import type { ReactNode } from "react";
import type { DcArticleMeta } from "../types";
import { DcArticleSidebar, DcRelatedGuides } from "../DcArticleSidebar";
import { useDcTocScrollSpy } from "../useDcTocScrollSpy";
import { DcDesktopHero } from "./blocks";

export function DcDesktopArticleLayout({
    meta,
    children,
    footer,
}: {
    meta: DcArticleMeta;
    children: ReactNode;
    /** Optional next-steps block below article */
    footer?: ReactNode;
}) {
    const { activeId, scrollToSection } = useDcTocScrollSpy(meta.toc);

    return (
        <main className="dc-desktop-main mx-auto hidden max-w-[1120px] px-6 py-16 md:block">
            <div className="grid grid-cols-12 items-start gap-6">
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
                <div className="relative col-span-6">
                    <article className="max-w-none">
                        <DcDesktopHero
                            category={meta.desktopCategory}
                            title={meta.title}
                            readTime={meta.readTime}
                            dateModified={meta.dateModified}
                        />
                        {children}
                    </article>
                    {footer}
                </div>
                <DcRelatedGuides guides={meta.related} />
            </div>
        </main>
    );
}
