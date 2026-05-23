import type { Metadata } from "next";
import { articleDateToIsoDateTime } from "@/components/resources/digital-craftsman/formatArticleDate";
import ArticleJsonLd, { articleJsonLdFromMeta } from "@/components/seo/ArticleJsonLd";
import { absoluteUrl } from "@/lib/siteConfig";
import DigitalCraftsmanArticlePage from "./DigitalCraftsmanArticlePage";
import type { DcArticleMeta } from "./types";
import type { ReactNode } from "react";

/** SEO metadata for a resource article — always sets canonical to the article path. */
export function createArticleMetadata(meta: DcArticleMeta): Metadata {
    const path = meta.path;
    const pageUrl = absoluteUrl(path);

    return {
        title: meta.headline,
        description: meta.description,
        alternates: {
            canonical: absoluteUrl(path),
        },
        openGraph: {
            type: "article",
            url: pageUrl,
            title: meta.headline,
            description: meta.description,
            publishedTime: articleDateToIsoDateTime(meta.datePublished),
            modifiedTime: articleDateToIsoDateTime(meta.dateModified),
            images: meta.heroImageSrc
                ? [{ url: meta.heroImageSrc, alt: meta.headline }]
                : undefined,
        },
    };
}

type ArticleRouteConfig = {
    meta: DcArticleMeta;
    mobile: ReactNode;
    desktop: ReactNode;
    desktopFooter?: ReactNode;
};

/** Page component for a resource article route. */
export function createArticleRoutePage({
    meta,
    mobile,
    desktop,
    desktopFooter,
}: ArticleRouteConfig) {
    return function ArticleRoutePage() {
        return (
            <>
                <ArticleJsonLd {...articleJsonLdFromMeta(meta)} />
                <DigitalCraftsmanArticlePage
                    meta={meta}
                    mobile={mobile}
                    desktop={desktop}
                    desktopFooter={desktopFooter}
                />
            </>
        );
    };
}

/**
 * Metadata + page for `app/resources/<slug>/page.tsx`.
 * Ensures every article exports `alternates.canonical: absoluteUrl(meta.path)`.
 */
export function createArticleRoute(config: ArticleRouteConfig) {
    return {
        metadata: createArticleMetadata(config.meta),
        Page: createArticleRoutePage(config),
    };
}
