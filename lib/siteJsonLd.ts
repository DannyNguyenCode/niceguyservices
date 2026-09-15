import { absoluteUrl, BUSINESS, getSiteUrl, SITE_LOGO } from "@/lib/siteConfig";
import { schemaOffersFromPublicPricing } from "@/lib/publicPricing";

export function buildSiteJsonLd() {
    const url = getSiteUrl();
    const logoUrl = absoluteUrl(SITE_LOGO);

    return {
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
                    name: BUSINESS.founderName,
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
                makesOffer: schemaOffersFromPublicPricing(),
                sameAs: [...BUSINESS.sameAs],
            },
        ],
    };
}
