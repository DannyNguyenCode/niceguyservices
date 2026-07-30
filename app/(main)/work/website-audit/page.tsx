import type { Metadata } from "next";
import WebsiteAuditLandingPage from "@/components/websiteAudit/WebsiteAuditLandingPage";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "Website Audit",
    description:
        "Preview the Nice Guy Web Design website audit experience with placeholder submission, methodology, and follow-up report flow.",
    alternates: {
        canonical: absoluteUrl("/work/website-audit"),
    },
};

export default function WebsiteAuditPage() {
    return <WebsiteAuditLandingPage />;
}
