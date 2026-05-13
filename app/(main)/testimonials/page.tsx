import type { Metadata } from "next";
import Testimonials from "@/components/Testimonials";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Client Testimonials | Nice Guy Web Design — Toronto & GTA",
  description:
    "What small business clients say about working with Nice Guy Web Design on custom websites, communication, and results in Toronto and the GTA.",
  alternates: {
    canonical: absoluteUrl("/testimonials"),
  },
};

export default function Page() {
  return <Testimonials />;
}
