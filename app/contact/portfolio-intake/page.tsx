import type { Metadata } from "next";
import PortfolioIntakeWizard from "@/components/contact/portfolioIntake/PortfolioIntakeWizard";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "Portfolio & showcase project brief | Nice Guy Web Design",
    description:
        "Four-step creative brief for a portfolio or showcase site: experience, skills, education, and contact. Nice Guy Web Design, Toronto and GTA.",
    alternates: {
        canonical: absoluteUrl("/contact/portfolio-intake"),
    },
};

export default function PortfolioIntakePage() {
    return <PortfolioIntakeWizard />;
}
