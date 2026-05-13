import type { Metadata } from "next";
import Contact from "@/components/Contact";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "Contact Nice Guy Web Design | Web Developer for Small Businesses in Toronto",
    description:
        "Get in touch with Nice Guy Web Design to discuss your website project. Serving small businesses in Toronto and the GTA with fast, custom website design and ongoing support.",
    alternates: {
        canonical: absoluteUrl("/contact"),
    },
};

export default function ContactPage() {
    return <Contact />;
}
