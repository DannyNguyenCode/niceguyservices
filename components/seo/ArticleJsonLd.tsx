import { absoluteUrl, BUSINESS, getSiteUrl } from "@/lib/siteConfig";

export type ArticleJsonLdInput = {
    headline: string;
    description: string;
    datePublished: string;
    dateModified: string;
    /** Path only, e.g. `/resources/seo-basics-for-local-businesses` */
    pagePath: string;
    heroImageSrc?: string;
    /** e.g. "Local SEO" — maps to schema.org articleSection */
    articleSection?: string;
};

/** Build JSON-LD props from shared resource article meta. */
export function articleJsonLdFromMeta(meta: {
    headline: string;
    description: string;
    datePublished: string;
    dateModified: string;
    path: string;
    heroImageSrc: string;
    desktopCategory: string;
}): ArticleJsonLdInput {
    return {
        headline: meta.headline,
        description: meta.description,
        datePublished: meta.datePublished,
        dateModified: meta.dateModified,
        pagePath: meta.path,
        heroImageSrc: meta.heroImageSrc,
        articleSection: meta.desktopCategory,
    };
}

export default function ArticleJsonLd(props: ArticleJsonLdInput) {
    const pageUrl = absoluteUrl(props.pagePath);
    const siteUrl = getSiteUrl();
    const heroUrl =
        props.heroImageSrc != null && props.heroImageSrc.length > 0
            ? absoluteUrl(props.heroImageSrc)
            : undefined;

    const article: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        url: pageUrl,
        headline: props.headline,
        description: props.description,
        datePublished: props.datePublished,
        dateModified: props.dateModified,
        inLanguage: "en-CA",
        isPartOf: { "@id": `${siteUrl}/#website` },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": pageUrl,
            url: pageUrl,
        },
        author: {
            "@type": "Person",
            name: BUSINESS.founderName,
            url: absoluteUrl("/about"),
        },
        publisher: { "@id": `${siteUrl}/#business` },
    };

    if (props.articleSection) {
        article.articleSection = props.articleSection;
    }

    if (heroUrl) {
        article.image = {
            "@type": "ImageObject",
            url: heroUrl,
            contentUrl: heroUrl,
        };
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
        />
    );
}
