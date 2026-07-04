import type { Metadata } from "next";
// import PortfolioIntakeWizard from "@/components/contact/portfolioIntake/PortfolioIntakeWizard";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "Portfolio & showcase project brief",
    description:
        "Four-step creative brief for a portfolio or showcase site: experience, skills, education, and contact. Nice Guy Web Design, Toronto and GTA.",
    alternates: {
        canonical: absoluteUrl("/contact/portfolio-intake"),
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function PortfolioIntakePage() {
    // Intake wizard temporarily disabled — restore by uncommenting below.
    return (
        <div className="flex min-h-[50vh] items-center justify-center bg-(--pm-surface) px-6 font-pm-body text-(--pm-on-surface)">
            <p className="max-w-md text-center text-(--pm-on-surface-variant)">
                The portfolio intake form is temporarily unavailable. Please use the{" "}
                <a href="/contact" className="text-primary underline-offset-2 hover:underline">
                    contact form
                </a>{" "}
                to get in touch.
            </p>
        </div>
    );
    // return <PortfolioIntakeWizard />;
}
