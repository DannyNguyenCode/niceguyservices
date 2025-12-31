import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
    title: "Contact Nice Guy Services | Web Developer for Small Businesses in Toronto",
    description:
        "Get in touch with Nice Guy Services to discuss your website project. Serving small businesses in Toronto and the GTA with fast, custom website design and ongoing support.",
};

export default function ContactPage() {
    return <Contact />;
}
