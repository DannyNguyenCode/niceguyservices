import type { Metadata } from "next";
import { LooneyToonsCafeBlogBody } from "@/components/templates/demos/looneytoons-cafe/LooneyToonsCafeBlogBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "LooneyTunes — Services | Blog (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/looneytunes-services/blog") },
};

export default function LooneyToonsCafeBlogPage() {
  return <LooneyToonsCafeBlogBody />;
}
