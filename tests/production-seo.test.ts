import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import nextConfig from "@/next.config";
import { articleJsonLdFromMeta } from "@/components/seo/ArticleJsonLd";
import { buildSiteJsonLd } from "@/lib/siteJsonLd";
import {
    brandNameCount,
    brandedDocumentTitle,
    createPageMetadata,
} from "@/lib/pageMetadata";
import { publicPricingOffers, schemaOffersFromPublicPricing } from "@/lib/publicPricing";
import pricingContent from "@/components/pricing/pricingContent.json";
import {
    PRODUCTION_SITE_ORIGIN,
    absoluteUrl,
    getSiteUrl,
    parseCanonicalSiteUrl,
} from "@/lib/siteConfig";
import { geoMeta } from "@/components/resources/digital-craftsman/articles/metas";

const ORIGINAL_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

afterEach(() => {
    if (ORIGINAL_SITE_URL === undefined) {
        delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
        process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL_SITE_URL;
    }
});

function source(relativePath: string): string {
    return readFileSync(join(repoRoot, relativePath), "utf8");
}

function countOccurrences(haystack: string, needle: string): number {
    return haystack.split(needle).length - 1;
}

describe("canonical production site URL", () => {
    it("normalizes a valid NEXT_PUBLIC_SITE_URL and strips a trailing slash", () => {
        assert.equal(
            parseCanonicalSiteUrl("https://niceguyservices.vercel.app/"),
            PRODUCTION_SITE_ORIGIN,
        );
        process.env.NEXT_PUBLIC_SITE_URL = "https://niceguyservices.vercel.app/";
        assert.equal(getSiteUrl(), PRODUCTION_SITE_ORIGIN);
    });

    it("rejects localhost, preview hosts, and http values", () => {
        assert.equal(parseCanonicalSiteUrl("http://localhost:3000"), null);
        assert.equal(parseCanonicalSiteUrl("https://localhost:3000"), null);
        assert.equal(
            parseCanonicalSiteUrl("https://niceguyservices-git-seo-user.vercel.app"),
            null,
        );
        assert.equal(parseCanonicalSiteUrl("http://niceguyservices.vercel.app"), null);
    });

    it("falls back to the production origin when the env URL is not canonical", () => {
        process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
        assert.equal(getSiteUrl(), PRODUCTION_SITE_ORIGIN);
        assert.equal(absoluteUrl("/work"), `${PRODUCTION_SITE_ORIGIN}/work`);
        assert.doesNotMatch(absoluteUrl("/"), /localhost/);
    });
});

describe("crawler and metadata origins", () => {
    it("does not emit localhost in canonical, Open Graph, schema, sitemap, or robots", () => {
        process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";

        const page = createPageMetadata({
            title: "Website Design Pricing",
            description: "Transparent website pricing.",
            path: "/pricing",
        });
        const canonical = String(page.alternates?.canonical ?? "");
        const ogUrl = String(page.openGraph?.url ?? "");
        assert.equal(canonical, `${PRODUCTION_SITE_ORIGIN}/pricing`);
        assert.equal(ogUrl, `${PRODUCTION_SITE_ORIGIN}/pricing`);
        assert.doesNotMatch(canonical, /localhost/);
        assert.doesNotMatch(ogUrl, /localhost/);
        assert.equal(brandNameCount(brandedDocumentTitle("Website Design Pricing")), 1);

        const jsonLd = JSON.stringify(buildSiteJsonLd());
        assert.doesNotMatch(jsonLd, /localhost/);
        assert.match(jsonLd, new RegExp(PRODUCTION_SITE_ORIGIN));

        const sitemapXmlShape = sitemap();
        for (const entry of sitemapXmlShape) {
            assert.match(entry.url, /^https:\/\//);
            assert.doesNotMatch(entry.url, /localhost/);
            assert.ok(!entry.url.includes("/testimonials"));
        }

        const robotsFile = robots();
        assert.equal(robotsFile.sitemap, `${PRODUCTION_SITE_ORIGIN}/sitemap.xml`);
        assert.doesNotMatch(String(robotsFile.sitemap), /localhost/);
    });

    it("keeps public marketing routes crawlable and preserves private disallows", () => {
        const robotsFile = robots();
        const rules = Array.isArray(robotsFile.rules) ? robotsFile.rules[0] : robotsFile.rules;
        assert.equal(rules?.allow, "/");
        assert.ok(rules?.disallow?.includes("/dashboard"));
        assert.ok(rules?.disallow?.includes("/api/admin/"));
        assert.ok(rules?.disallow?.includes("/report/"));
        assert.ok(rules?.disallow?.includes("/demo-preview/"));
    });
});

describe("structured-data pricing", () => {
    it("keeps schema offers aligned with visible package prices", () => {
        const offers = schemaOffersFromPublicPricing();
        const byName = Object.fromEntries(offers.map((offer) => [offer.name, offer]));

        assert.equal(byName["Starter Website"]?.price, "250");
        assert.equal(byName["Hosting & Reports"]?.price, "10");
        assert.equal(byName["Growth & Optimization"]?.price, "200");
        assert.ok(offers.every((offer) => offer.priceCurrency === "CAD"));

        for (const pkg of pricingContent.packages) {
            const offer = publicPricingOffers.find((item) => item.id === pkg.id);
            assert.ok(offer);
            assert.equal(offer?.name, pkg.name);
            assert.equal(`$${offer?.price}`, pkg.upfront);
        }
    });
});

describe("GEO article structure", () => {
    it("renders one H1 and does not duplicate article sections", () => {
        const geoPage = source(
            "app/resources/understanding-generative-engine-optimization/page.tsx",
        );
        const geoContent = source(
            "components/resources/digital-craftsman/GeoArticleContent.tsx",
        );
        const articlePage = source(
            "components/resources/digital-craftsman/DigitalCraftsmanArticlePage.tsx",
        );

        assert.match(geoPage, /GeoArticleContent/);
        assert.doesNotMatch(geoPage, /GeoDesktopLayout/);
        assert.match(articlePage, /DcResponsiveArticleLayout/);
        assert.doesNotMatch(articlePage, /DcMobileArticleShell/);
        assert.doesNotMatch(articlePage, /DcDesktopArticleLayout/);

        assert.equal(countOccurrences(geoContent, "<DcMobileHero"), 1);
        assert.equal(countOccurrences(geoContent, "The Evolution of Search"), 1);
        assert.equal(countOccurrences(geoContent, "What Is GEO?"), 1);
        assert.equal(countOccurrences(geoContent, 'id="evolution"'), 1);
    });
});

describe("testimonials route", () => {
    it("permanently redirects /testimonials to /work", async () => {
        const testimonialsPage = source("app/(main)/testimonials/page.tsx");
        assert.match(testimonialsPage, /permanentRedirect\("\/work"\)/);

        const redirectFn = nextConfig.redirects;
        if (typeof redirectFn !== "function") {
            throw new Error("nextConfig.redirects is not a function");
        }
        const entries = await redirectFn();
        const testimonials = entries.find((entry) => entry.source === "/testimonials");
        assert.ok(testimonials);
        assert.equal(testimonials?.destination, "/work");
        assert.equal(testimonials?.permanent, true);
    });
});

describe("document titles", () => {
    it("adds the brand only once", () => {
        const pricing = createPageMetadata({
            title: "Website Design Pricing",
            description: "Transparent website pricing.",
            path: "/pricing",
        });
        assert.equal(pricing.title, "Website Design Pricing");
        assert.equal(pricing.openGraph?.title, "Website Design Pricing | Nice Guy Web Design");
        assert.equal(brandNameCount(String(pricing.openGraph?.title)), 1);

        const about = createPageMetadata({
            title: "About Danny Nguyen | Toronto Web Designer",
            description: "About the designer.",
            path: "/about",
            absoluteTitle: true,
        });
        assert.deepEqual(about.title, {
            absolute: "About Danny Nguyen | Toronto Web Designer",
        });
        assert.equal(brandNameCount(String(about.openGraph?.title)), 0);
    });
});

describe("FAQ accordion contrast tokens", () => {
    it("uses theme-aware card backgrounds and exposes expanded state", () => {
        const faq = source("components/homepage/HomeFaq.tsx");
        const theme = source("app/styles/niceguys-theme.css");

        assert.match(faq, /bg-\(--pm-card\)/);
        assert.match(faq, /aria-expanded=\{open\}/);
        assert.match(faq, /siteDisclosureSummaryClass/);
        assert.match(theme, /--pm-card: #14273a;/);
        assert.match(theme, /niceguys-dark/);
    });
});

describe("article JSON-LD origin", () => {
    it("uses the centralized production origin for article URLs", () => {
        process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
        const input = articleJsonLdFromMeta(geoMeta);
        assert.equal(input.pagePath, geoMeta.path);
        const pageUrl = absoluteUrl(input.pagePath);
        assert.doesNotMatch(pageUrl, /localhost/);
        assert.equal(
            pageUrl,
            `${PRODUCTION_SITE_ORIGIN}/resources/understanding-generative-engine-optimization`,
        );
    });
});
