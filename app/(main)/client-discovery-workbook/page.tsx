import type { Metadata } from "next";
// import ClientDiscoveryWorkbookPage from "@/components/clientDiscoveryWorkbook/ClientDiscoveryWorkbookPage";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "Client Discovery Workbook",
    description:
        "Complete the Nice Guy Web Design client discovery workbook online, print it, or save as PDF. Share your business goals, audience, brand, and website requirements before your project begins.",
    alternates: {
        canonical: absoluteUrl("/client-discovery-workbook"),
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function ClientDiscoveryWorkbookRoute() {
    // Workbook temporarily disabled — restore by uncommenting below.
    return (
        <div className="flex min-h-[50vh] items-center justify-center bg-(--pm-surface) px-6 font-pm-body text-(--pm-on-surface)">
            <p className="max-w-md text-center text-(--pm-on-surface-variant)">
                The client discovery workbook is temporarily unavailable. Please use the{" "}
                <a href="/contact" className="text-primary underline-offset-2 hover:underline">
                    contact form
                </a>{" "}
                to get in touch.
            </p>
        </div>
    );
    // return <ClientDiscoveryWorkbookPage />;
}
