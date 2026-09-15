import type { Metadata } from "next";
import JackiePortfolioCaseStudy from "@/components/featuredWork/jackiePortfolio/JackiePortfolioCaseStudy";
import caseStudyContent from "@/components/featuredWork/jackiePortfolio/jackiePortfolioCaseStudyContent.json";
import { createPageMetadata } from "@/lib/pageMetadata";

const pagePath = "/featured-work/jackie-portfolio";
const pageDescription =
    "How a responsive portfolio website was built for a creative professional—gallery-first UX, maintainable content structure, contact form handling, and SEO foundations without inflated claims.";

export const metadata: Metadata = createPageMetadata({
    title: "Jackie Portfolio Website Case Study",
    description: pageDescription,
    path: pagePath,
    ogType: "article",
    ogImage: {
        url: caseStudyContent.meta.heroImageSrc,
        alt: caseStudyContent.meta.heroImageAlt,
        width: caseStudyContent.meta.heroImageWidth,
        height: caseStudyContent.meta.heroImageHeight,
    },
});

export default function JackiePortfolioCaseStudyRoutePage() {
    return <JackiePortfolioCaseStudy />;
}
