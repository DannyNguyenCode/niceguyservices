import homepageContent from "@/components/homepage/homepageContent.json";
import { getSiteUrl } from "@/lib/siteConfig";

type FaqItem = {
    question: string;
    answer: string;
};

/**
 * FAQPage JSON-LD for the homepage. Questions/answers are sourced from
 * homepageContent.json so visible FAQ copy and structured data stay aligned.
 */
export default function FaqJsonLd() {
    const siteUrl = getSiteUrl();
    const pageUrl = `${siteUrl}/`;
    const items = homepageContent.faq.items as FaqItem[];

    const payload = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        url: pageUrl,
        inLanguage: "en-CA",
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#business` },
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
        />
    );
}
