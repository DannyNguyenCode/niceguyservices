import type { Metadata } from "next";
import JackiePortfolioCaseStudy from "@/components/featuredWork/jackiePortfolio/JackiePortfolioCaseStudy";
import caseStudyContent from "@/components/featuredWork/jackiePortfolio/jackiePortfolioCaseStudyContent.json";
import { absoluteUrl } from "@/lib/siteConfig";

const pagePath = "/work/jackie-portfolio";
const pageTitle = "JackiePortfolio Case Study | Nice Guy Web Design";
const pageDescription =
    "How a responsive portfolio website was built for a creative professional—gallery-first UX, maintainable content structure, contact form handling, and SEO foundations without inflated claims.";

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    alternates: {
        canonical: absoluteUrl(pagePath),
    },
    openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: absoluteUrl(pagePath),
        type: "article",
        images: [
            {
                url: absoluteUrl(caseStudyContent.meta.heroImageSrc),
                alt: caseStudyContent.meta.heroImageAlt,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description: pageDescription,
        images: [absoluteUrl(caseStudyContent.meta.heroImageSrc)],
    },
};

export default function JackiePortfolioCaseStudyRoutePage() {
    return <JackiePortfolioCaseStudy />;
}
