import { Inter } from "next/font/google";
import { TemplateGallery } from "@/components/templates/gallery/TemplateGallery";
import "@/app/styles/templates/gallery-theme.css";

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "600", "700", "800"],
    variable: "--font-inter",
    display: "swap",
});

export default function TemplatesPage() {
    return (
        <div
            data-templates-page=""
            className={`-mb-12 ${inter.variable}`}
        >
            <TemplateGallery />
        </div>
    );
}
