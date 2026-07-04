import type { Metadata } from "next";
// import BusinessIntakeWizard from "@/components/contact/businessIntake/BusinessIntakeWizard";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "Business website project brief",
    description:
        "Three-step project intake for a business website: company profile, scope, and site goals. Nice Guy Web Design, Toronto and GTA.",
    alternates: {
        canonical: absoluteUrl("/contact/business-intake"),
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function BusinessIntakePage() {
    // Intake wizard temporarily disabled — restore by uncommenting below.
    return (
        <div className="flex min-h-[50vh] items-center justify-center bg-(--pm-surface) px-6 font-pm-body text-(--pm-on-surface)">
            <p className="max-w-md text-center text-(--pm-on-surface-variant)">
                The business intake form is temporarily unavailable. Please use the{" "}
                <a href="/contact" className="text-primary underline-offset-2 hover:underline">
                    contact form
                </a>{" "}
                to get in touch.
            </p>
        </div>
    );
    // return <BusinessIntakeWizard />;
}
