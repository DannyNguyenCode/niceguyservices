import { absoluteUrl, BUSINESS, getSiteUrl } from "@/lib/siteConfig";

type CaseStudyJsonLdProps = {
    name: string;
    description: string;
    pagePath: string;
    imageSrc?: string;
};

/**
 * CreativeWork for a published case study. Does not invent results, ratings,
 * or client quotes.
 */
export default function CaseStudyJsonLd({
    name,
    description,
    pagePath,
    imageSrc,
}: CaseStudyJsonLdProps) {
    const siteUrl = getSiteUrl();
    const pageUrl = absoluteUrl(pagePath);

    const payload: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "@id": `${pageUrl}#case-study`,
        name,
        description,
        url: pageUrl,
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
        creator: {
            "@type": "Person",
            name: BUSINESS.founderName,
        },
    };

    if (imageSrc) {
        const imageUrl = absoluteUrl(imageSrc);
        payload.image = {
            "@type": "ImageObject",
            url: imageUrl,
            contentUrl: imageUrl,
        };
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
        />
    );
}
