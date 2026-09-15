import type { Metadata } from "next";
import Contact from "@/components/Contact";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = createPageMetadata({
    title: "Contact Nice Guy Web Design | Toronto Web Designer",
    description:
        "Get in touch with Nice Guy Web Design to discuss your website project. Serving small businesses in Toronto and the GTA with fast, custom website design and ongoing support.",
    path: "/contact",
    absoluteTitle: true,
});

export default function ContactPage() {
    return <Contact />;
}
