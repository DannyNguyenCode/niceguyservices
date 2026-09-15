import type { Metadata } from "next";
import WebsiteAuditLandingPage from "@/components/websiteAudit/WebsiteAuditLandingPage";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = createPageMetadata({
    title: "Website Audit",
    description:
        "Preview the Nice Guy Web Design website audit experience with placeholder submission, methodology, and follow-up report flow.",
    path: "/work/website-audit",
});

export default function WebsiteAuditPage() {
    return <WebsiteAuditLandingPage />;
}
