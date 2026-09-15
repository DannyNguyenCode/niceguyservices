import { buildSiteJsonLd } from "@/lib/siteJsonLd";

/**
 * WebSite + ProfessionalService graph for brand, local, and offer signals.
 * No street address — service-area business; locality and areaServed only.
 */
export default function SiteJsonLd() {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSiteJsonLd()) }}
        />
    );
}
