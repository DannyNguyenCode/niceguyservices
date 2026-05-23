import type { Metadata } from "next";
import BusinessIntakeWizard from "@/components/contact/businessIntake/BusinessIntakeWizard";
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
    return <BusinessIntakeWizard />;
}
