import { absoluteUrl } from "@/lib/siteConfig";

type FaqItem = { question: string; answer: string };

type SupplementalJsonLdProps = {
    pagePath: string;
    headline: string;
    faq?: readonly FaqItem[];
};

/** BreadcrumbList + optional FAQPage JSON-LD for resource articles. */
export default function ResourceArticleSupplementalJsonLd({
    pagePath,
    headline,
    faq = [],
}: SupplementalJsonLdProps) {
    const pageUrl = absoluteUrl(pagePath);
    const resourcesUrl = absoluteUrl("/resources");

    const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: absoluteUrl("/"),
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Resources",
                item: resourcesUrl,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: headline,
                item: pageUrl,
            },
        ],
    };

    const faqPage =
        faq.length > 0
            ? {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faq.map(({ question, answer }) => ({
                      "@type": "Question",
                      name: question,
                      acceptedAnswer: {
                          "@type": "Answer",
                          text: answer,
                      },
                  })),
              }
            : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
            />
            {faqPage ? (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
                />
            ) : null}
        </>
    );
}
