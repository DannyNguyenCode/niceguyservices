import type { DcArticleMeta } from "../types";
import { CUSTOM_VS_TEMPLATE_PATH, CUSTOM_VS_TEMPLATE_TOC, CUSTOM_VS_TEMPLATE_RELATED, CUSTOM_VS_TEMPLATE_TAKEAWAYS } from "../customVsTemplateConfig";
import { GEO_PATH, GEO_RELATED, GEO_TOC } from "../geoConfig";
import { LOCAL_SEO_BASICS_PATH, LOCAL_SEO_BASICS_TOC, LOCAL_SEO_BASICS_RELATED, LOCAL_SEO_BASICS_TAKEAWAYS } from "../localSeoBasicsConfig";
import { SEARCH_CONSOLE_PATH, SEARCH_CONSOLE_TOC, SEARCH_CONSOLE_RELATED, SEARCH_CONSOLE_TAKEAWAYS } from "../searchConsoleConfig";
import {
    RESPONSIVE_WEB_DESIGN_PATH,
    RESPONSIVE_WEB_DESIGN_RELATED,
    RESPONSIVE_WEB_DESIGN_TOC,
} from "../responsiveWebDesignConfig";
import { WEBSITE_LEADS_PATH, WEBSITE_LEADS_TOC, WEBSITE_LEADS_RELATED, WEBSITE_LEADS_TAKEAWAYS } from "../websiteLeadsConfig";

const GOOGLE_AI_PATH = "/resources/what-google-ai-search-means-for-small-businesses";
const GOOGLE_AI_TOC = [
    { id: "intro", label: "Introduction" },
    { id: "what-is-ai", label: "What is AI Search?" },
    { id: "why-it-matters", label: "Why it Matters" },
    { id: "checklist", label: "AI-Friendly Checklist" },
    { id: "mistakes", label: "Common Mistakes" },
    { id: "final-thoughts", label: "Final Thoughts" },
] as const;

const GOOGLE_AI_RELATED = [
    {
        title: "Understanding GEO (Generative Engine Optimization)",
        href: "/resources/understanding-generative-engine-optimization",
        year: "2026",
    },
    { title: "SEO Basics for Local Businesses", href: "/resources/seo-basics-for-local-businesses", year: "2026" },
    { title: "How Websites Generate Leads for Local Businesses", href: "/resources/how-websites-generate-leads-for-local-businesses", year: "2026" },
] as const;

export const geoMeta: DcArticleMeta = {
    path: GEO_PATH,
    headline: "Understanding GEO (Generative Engine Optimization)",
    description:
        "Learn what Generative Engine Optimization (GEO) is, how AI-powered search is changing the web, and how businesses can prepare for the future of online visibility.",
    datePublished: "2026-07-04",
    dateModified: "2026-07-04",
    heroImageSrc: "/images/Futuristic-tech-abstract.png",
    badge: "Resource / SEO & AI",
    readTime: "11 min read",
    title: "Understanding GEO (Generative Engine Optimization): The Future of Being Found Online",
    subtitle: "What generative engine optimization means for small businesses in plain English",
    desktopCategory: "SEO & AI",
    toc: GEO_TOC,
    related: GEO_RELATED,
    ctaLabel: "Book a Free Consultation",
    sidebarCta: {
        title: "Prepare for AI search",
        body: "Websites built for clarity, trust, and the way people search today — without hype or false promises.",
    },
};

export const googleAiSearchMeta: DcArticleMeta = {
    path: GOOGLE_AI_PATH,
    headline: "What Google AI Search Means for Small Businesses",
    description:
        "How AI Overviews change search for small businesses — and what to focus on so Google understands and recommends you.",
    datePublished: "2026-05-20",
    dateModified: "2026-05-20",
    heroImageSrc: "/images/Futuristic-tech-abstract.png",
    badge: "Resource / SEO Education",
    readTime: "6 min read",
    title: "What Google AI Search Means for Small Businesses",
    subtitle: "Understanding the Shift From Traditional Search to AI Answers",
    desktopCategory: "SEO & AI",
    toc: GOOGLE_AI_TOC,
    related: GOOGLE_AI_RELATED,
    ctaLabel: "Get an AI Audit",
};

export const seoBasicsMeta: DcArticleMeta = {
    path: LOCAL_SEO_BASICS_PATH,
    headline: "SEO Basics for Local Businesses",
    description:
        "A practical guide to local SEO for small businesses — how Google finds you, what matters for rankings, and foundations you can improve over time.",
    datePublished: "2026-05-21",
    dateModified: "2026-05-21",
    heroImageSrc: "/images/Toronto-city-map.png",
    badge: "Resource / SEO Education",
    readTime: "12 min read",
    title: "SEO Basics for Local Businesses",
    subtitle: "Understanding How Local Businesses Appear on Google",
    desktopCategory: "Local SEO",
    toc: LOCAL_SEO_BASICS_TOC,
    related: LOCAL_SEO_BASICS_RELATED,
    ctaLabel: "Get SEO Help",
};

export const searchConsoleMeta: DcArticleMeta = {
    path: SEARCH_CONSOLE_PATH,
    headline: "How Google Search Console Helps Small Businesses",
    description:
        "A practical guide to Google Search Console for small businesses — search queries, indexing, mobile usability, and using real data to improve visibility.",
    datePublished: "2026-05-21",
    dateModified: "2026-05-21",
    heroImageSrc: "/images/Futuristic-tech-abstract.png",
    badge: "Resource / SEO Tools",
    readTime: "11 min read",
    title: "How Google Search Console Helps Small Businesses",
    subtitle: "Understanding What Happens After Your Website Goes Live",
    desktopCategory: "SEO Tools",
    toc: SEARCH_CONSOLE_TOC,
    related: SEARCH_CONSOLE_RELATED,
    ctaLabel: "Get SEO Help",
    sidebarCta: {
        body: "Set up Search Console and turn search data into practical improvements.",
    },
};

export const websiteLeadsMeta: DcArticleMeta = {
    path: WEBSITE_LEADS_PATH,
    headline: "How Websites Generate Leads for Local Businesses",
    description:
        "Why local business websites need clear messaging, strong CTAs, trust signals, and mobile performance to turn visitors into calls, quotes, and bookings.",
    datePublished: "2026-05-21",
    dateModified: "2026-05-21",
    heroImageSrc: "/images/Toronto-skyline-dusk.png",
    badge: "Resource / Lead Generation",
    readTime: "10 min read",
    title: "How Websites Generate Leads for Local Businesses",
    subtitle: "Why a Website Is More Than Just an Online Brochure",
    desktopCategory: "Lead Generation",
    toc: WEBSITE_LEADS_TOC,
    related: WEBSITE_LEADS_RELATED,
    ctaLabel: "Build a Lead-Ready Site",
    sidebarCta: {
        title: "Need more leads?",
        body: "Websites built with clear messaging, strong CTAs, and mobile-first performance.",
    },
};

export const customVsTemplateMeta: DcArticleMeta = {
    path: CUSTOM_VS_TEMPLATE_PATH,
    headline: "Understanding Custom vs Template Websites",
    description:
        "Compare template and custom websites for small businesses — costs, timelines, branding, SEO, and how to choose the right approach for your goals.",
    datePublished: "2026-05-21",
    dateModified: "2026-05-21",
    heroImageSrc: "/images/imageheader.png",
    badge: "Resource / Web Strategy",
    readTime: "12 min read",
    title: "Understanding Custom vs Template Websites",
    subtitle: "Choosing the Right Approach for Your Business",
    desktopCategory: "Web Strategy",
    toc: CUSTOM_VS_TEMPLATE_TOC,
    related: CUSTOM_VS_TEMPLATE_RELATED,
    ctaLabel: "Discuss Your Project",
    sidebarCta: {
        body: "Honest guidance on template vs custom — matched to your goals and budget.",
    },
};

export const responsiveWebDesignMeta: DcArticleMeta = {
    path: RESPONSIVE_WEB_DESIGN_PATH,
    headline: "Why Responsive Web Design Matters More Than Ever",
    description:
        "Why responsive web design matters for local businesses — mobile traffic, first impressions, SEO, AI search, accessibility, and building trust across every screen size.",
    datePublished: "2026-07-05",
    dateModified: "2026-07-05",
    heroImageSrc: "/images/Futuristic-tech-abstract.png",
    badge: "Resource / Web Design",
    readTime: "11 min read",
    title: "Why Responsive Web Design Matters More Than Ever",
    subtitle: "A Website Should Work Everywhere",
    desktopCategory: "Web Design",
    toc: RESPONSIVE_WEB_DESIGN_TOC,
    related: RESPONSIVE_WEB_DESIGN_RELATED,
    ctaLabel: "Discuss Your Website",
    sidebarCta: {
        title: "Need a mobile-ready site?",
        body: "Websites built to work on every screen — clear, fast, and easy to use.",
    },
};

/** Published Digital Craftsman articles — used by sitemap and hub. */
export const RESOURCE_ARTICLE_METAS = [
    geoMeta,
    googleAiSearchMeta,
    seoBasicsMeta,
    searchConsoleMeta,
    websiteLeadsMeta,
    customVsTemplateMeta,
    responsiveWebDesignMeta,
] as const;

/** Re-export takeaway arrays used by content modules */
export { CUSTOM_VS_TEMPLATE_TAKEAWAYS, LOCAL_SEO_BASICS_TAKEAWAYS, SEARCH_CONSOLE_TAKEAWAYS, WEBSITE_LEADS_TAKEAWAYS };
