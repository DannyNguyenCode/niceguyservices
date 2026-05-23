"use client";

import Link from "next/link";

type TocItem = { id: string; label: string };

export function DcArticleSidebar({
    toc,
    activeId,
    onTocClick,
    ctaTitle = "Need a strategy?",
    ctaBody = "Tailored SEO roadmaps for trade professionals and small biz.",
}: {
    toc: readonly TocItem[];
    activeId: string;
    onTocClick: (id: string) => void;
    ctaTitle?: string;
    ctaBody?: string;
}) {
    return (
        <aside className="col-span-3 sticky top-24">
            <div className="flex flex-col gap-8">
                <nav aria-label="In this article">
                    <h4 className="mb-4 text-sm font-medium tracking-widest text-[#414845] uppercase">
                        In this article
                    </h4>
                    <ul className="flex flex-col gap-2 border-l border-[#c1c8c4]">
                        {toc.map(({ id, label }) => (
                            <li key={id}>
                                <button
                                    type="button"
                                    onClick={() => onTocClick(id)}
                                    className={`block w-full py-1 pl-4 text-left transition-colors ${
                                        activeId === id
                                            ? "-ml-px border-l-2 border-[#416359] font-medium text-[#416359]"
                                            : "text-[#414845] hover:text-[#416359]"
                                    }`}
                                >
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="rounded-lg border border-[#c1c8c4] bg-white p-6">
                    <h5 className="dc-display mb-2 text-2xl leading-[1.3] font-medium text-[#1b1c1c]">
                        {ctaTitle}
                    </h5>
                    <p className="mb-2 text-base text-[#414845]">{ctaBody}</p>
                    <Link
                        href="/contact"
                        className="dc-hard-offset mt-2 block w-full rounded bg-[#416359] py-3 text-center text-sm font-medium tracking-wide text-white uppercase transition-all"
                    >
                        Book a consultation
                    </Link>
                </div>
            </div>
        </aside>
    );
}

export function DcRelatedGuides({
    guides,
}: {
    guides: readonly { title: string; href: string; year: string }[];
}) {
    return (
        <aside className="col-span-3">
            <div>
                <h4 className="mb-4 text-sm font-medium tracking-widest text-[#414845] uppercase">
                    Related Guides
                </h4>
                <ul className="flex flex-col gap-3">
                    {guides.map(({ title, href, year }) => (
                        <li key={title} className="flex items-baseline gap-2">
                            <Link
                                href={href}
                                className="shrink-0 text-base text-[#1b1c1c] transition-colors hover:text-[#416359]"
                            >
                                {title}
                            </Link>
                            <div className="dc-dotted-line" aria-hidden />
                            <span className="shrink-0 text-sm text-[#414845]">{year}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
