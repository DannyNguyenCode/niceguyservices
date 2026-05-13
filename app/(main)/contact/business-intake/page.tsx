import type { Metadata } from "next";
import BusinessIntakeWizard from "@/components/contact/businessIntake/BusinessIntakeWizard";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "Business website project brief | Nice Guy Web Design",
    description:
        "Three-step project intake for a business website: company profile, scope, and site goals. Nice Guy Web Design, Toronto and GTA.",
    alternates: {
        canonical: absoluteUrl("/contact/business-intake"),
    },
};

export default function BusinessIntakePage() {
    return <BusinessIntakeWizard />;
}
