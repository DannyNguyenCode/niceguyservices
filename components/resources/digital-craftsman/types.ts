import type { ReactNode } from "react";

export type DcTocItem = { id: string; label: string };

export type DcRelatedGuide = {
    title: string;
    href: string;
    year: string;
};

export type DcNextStep = {
    href: string;
    /** Used on mobile next-steps cards; desktop uses arrow_forward */
    icon?: string;
    title: string;
    body: string;
};

export type DcArticleMeta = {
    path: string;
    headline: string;
    description: string;
    datePublished: string;
    dateModified: string;
    heroImageSrc: string;
    badge: string;
    readTime: string;
    title: string;
    subtitle: string;
    desktopCategory: string;
    toc: readonly DcTocItem[];
    related: readonly DcRelatedGuide[];
    ctaLabel?: string;
    sidebarCta?: {
        title?: string;
        body: string;
    };
};

export type DcArticleContentProps = {
    meta: DcArticleMeta;
};

export type DcArticleViews = {
    meta: DcArticleMeta;
    Mobile: (props: DcArticleContentProps) => ReactNode;
    Desktop: (props: DcArticleContentProps) => ReactNode;
};
