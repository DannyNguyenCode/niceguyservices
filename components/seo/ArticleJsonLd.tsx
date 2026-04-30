import { absoluteUrl, BUSINESS, getSiteUrl } from "@/lib/siteConfig";

export type ArticleJsonLdInput = {
    headline: string;
    description: string;
    datePublished: string;
    dateModified: string;
    /** Path only, e.g. `/resources/how-seo-helps-local-businesses` */
    pagePath: string;
    heroImageSrc?: string;
};

export default function ArticleJsonLd(props: ArticleJsonLdInput) {
    const pageUrl = absoluteUrl(props.pagePath);
    const site = getSiteUrl();
    const image =
        props.heroImageSrc != null && props.heroImageSrc.length > 0
            ? absoluteUrl(props.heroImageSrc)
            : undefined;

    const article: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: props.headline,
        description: props.description,
        datePublished: props.datePublished,
        dateModified: props.dateModified,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": pageUrl,
        },
        author: {
            "@type": "Person",
            name: BUSINESS.founderName,
        },
        publisher: {
            "@type": "Organization",
            name: BUSINESS.name,
            url: site,
        },
    };

    if (image) {
        article.image = [image];
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
        />
    );
}
