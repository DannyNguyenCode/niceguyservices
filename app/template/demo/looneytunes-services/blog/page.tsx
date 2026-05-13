import type { Metadata } from "next";
import { LooneyToonsCafeBlogBody } from "@/components/experience-templates/looneytoons-cafe/LooneyToonsCafeBlogBody";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "LooneyTunes — Services | Blog (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/looneytunes-services/blog") },
};

export default function LooneyToonsCafeBlogPage() {
  return <LooneyToonsCafeBlogBody />;
}
