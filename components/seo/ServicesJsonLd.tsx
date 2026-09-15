import { absoluteUrl, BUSINESS, getSiteUrl } from "@/lib/siteConfig";
import { serviceCards } from "@/components/services/data";

/**
 * Service list for the public services page. Names and descriptions match
 * the visible service offerings.
 */
export default function ServicesJsonLd() {
    const siteUrl = getSiteUrl();
    const pageUrl = absoluteUrl("/services");

    const payload = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${pageUrl}#services`,
        name: "Web design services",
        url: pageUrl,
        isPartOf: { "@id": `${siteUrl}/#website` },
        itemListElement: serviceCards.map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": "Service",
                name: service.title,
                description: service.description,
                provider: { "@id": `${siteUrl}/#business` },
                areaServed: BUSINESS.addressLocality,
                url: pageUrl,
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
