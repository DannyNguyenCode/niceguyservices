import { absoluteUrl, BUSINESS, getSiteUrl } from "@/lib/siteConfig";

/**
 * Organization + ProfessionalService (Schema.org) for brand and local signals.
 * No street address — service-area business; locality and areaServed only.
 */
export default function SiteJsonLd() {
    const url = getSiteUrl();
    const logoUrl = absoluteUrl("/blue_logo_test.png");

    const payload = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                name: BUSINESS.name,
                url,
                description:
                    "Custom websites for small businesses in Toronto and the GTA — fast, SEO-ready, and fully supported.",
                publisher: { "@id": `${url}/#business` },
            },
            {
                "@type": "ProfessionalService",
                "@id": `${url}/#business`,
                name: BUSINESS.name,
                url,
                image: logoUrl,
                telephone: BUSINESS.phoneE164,
                email: BUSINESS.email,
                address: {
                    "@type": "PostalAddress",
                    addressLocality: BUSINESS.addressLocality,
                    addressRegion: BUSINESS.addressRegion,
                    addressCountry: BUSINESS.addressCountry,
                },
                areaServed: [
                    {
                        "@type": "City",
                        name: "Toronto",
                        containedInPlace: {
                            "@type": "AdministrativeArea",
                            name: "Ontario",
                        },
                    },
                    {
                        "@type": "AdministrativeArea",
                        name: "Greater Toronto Area",
                    },
                ],
                priceRange: "$$",
                sameAs: [...BUSINESS.sameAs],
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
        />
    );
}
