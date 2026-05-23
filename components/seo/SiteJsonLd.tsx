import { absoluteUrl, BUSINESS, getSiteUrl } from "@/lib/siteConfig";

/**
 * WebSite + ProfessionalService graph for brand, local, and offer signals.
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
                "@id": `${url}/#website`,
                name: BUSINESS.name,
                url,
                description:
                    "Custom websites, SEO optimization, and Google Search Console reporting for small businesses in Toronto and the GTA.",
                publisher: { "@id": `${url}/#business` },
                inLanguage: "en-CA",
            },
            {
                "@type": "ProfessionalService",
                "@id": `${url}/#business`,
                name: BUSINESS.name,
                url,
                logo: logoUrl,
                image: logoUrl,
                telephone: BUSINESS.phoneE164,
                email: BUSINESS.email,
                description:
                    "Nice Guy Web Design builds fast, modern websites for Toronto small businesses — designed to improve visibility, generate leads, and stay easy to maintain as businesses grow.",
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
                    {
                        "@type": "Country",
                        name: "Canada",
                    },
                ],
                priceRange: "$$",
                founder: {
                    "@type": "Person",
                    name: "Danny",
                    jobTitle: "Web Developer",
                },
                knowsAbout: [
                    "Web Design",
                    "Web Development",
                    "SEO",
                    "Technical SEO",
                    "Google Search Console",
                    "Lead Generation",
                    "Local SEO",
                    "Next.js",
                    "React",
                    "Tailwind CSS",
                ],
                serviceType: [
                    "Custom Website Builds",
                    "UX/UI Design",
                    "Performance Optimization",
                    "Technical SEO",
                    "SEO Optimization",
                    "Google Search Console Reporting",
                    "Website Maintenance",
                ],
                makesOffer: [
                    {
                        "@type": "Offer",
                        name: "Starter Website",
                        price: "500",
                        priceCurrency: "CAD",
                        description:
                            "A one-time custom website build for small businesses that need a clean, professional online presence.",
                    },
                    {
                        "@type": "Offer",
                        name: "Hosting & Reports",
                        price: "20",
                        priceCurrency: "CAD",
                        description:
                            "Monthly hosting and Google Search Console reporting for small business websites.",
                    },
                    {
                        "@type": "Offer",
                        name: "Growth & Optimization",
                        price: "200",
                        priceCurrency: "CAD",
                        description:
                            "Monthly SEO optimization, Google Search Console analysis, and conversion-focused website improvements.",
                    },
                ],
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
