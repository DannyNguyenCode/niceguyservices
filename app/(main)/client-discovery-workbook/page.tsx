import type { Metadata } from "next";
import ClientDiscoveryWorkbookPage from "@/components/clientDiscoveryWorkbook/ClientDiscoveryWorkbookPage";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "Client Discovery Workbook",
    description:
        "Complete the Nice Guy Web Design client discovery workbook online, print it, or save as PDF. Share your business goals, audience, brand, and website requirements before your project begins.",
    alternates: {
        canonical: absoluteUrl("/client-discovery-workbook"),
    },
};

export default function ClientDiscoveryWorkbookRoute() {
    return <ClientDiscoveryWorkbookPage />;
}
