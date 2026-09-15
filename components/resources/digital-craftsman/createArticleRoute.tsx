import type { Metadata } from "next";
import { articleDateToIsoDateTime } from "@/components/resources/digital-craftsman/formatArticleDate";
import ArticleJsonLd, { articleJsonLdFromMeta } from "@/components/seo/ArticleJsonLd";
import { createPageMetadata } from "@/lib/pageMetadata";
import DigitalCraftsmanArticlePage from "./DigitalCraftsmanArticlePage";
import type { DcArticleMeta } from "./types";
import type { ReactNode } from "react";

/** SEO metadata for a resource article — always sets canonical to the article path. */
export function createArticleMetadata(meta: DcArticleMeta): Metadata {
    const metadata = createPageMetadata({
        title: meta.headline,
        description: meta.description,
        path: meta.path,
        ogType: "article",
        ogImage: meta.heroImageSrc
            ? { url: meta.heroImageSrc, alt: meta.headline }
            : undefined,
    });

    return {
        ...metadata,
        openGraph: {
            ...metadata.openGraph,
            type: "article",
            publishedTime: articleDateToIsoDateTime(meta.datePublished),
            modifiedTime: articleDateToIsoDateTime(meta.dateModified),
        },
    };
}

type ArticleRouteConfig = {
    meta: DcArticleMeta;
    content: ReactNode;
};

/** Page component for a resource article route. */
export function createArticleRoutePage({ meta, content }: ArticleRouteConfig) {
    return function ArticleRoutePage() {
        return (
            <>
                <ArticleJsonLd {...articleJsonLdFromMeta(meta)} />
                <DigitalCraftsmanArticlePage meta={meta}>{content}</DigitalCraftsmanArticlePage>
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
