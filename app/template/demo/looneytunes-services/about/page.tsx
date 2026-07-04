import type { Metadata } from "next";
import { LooneyToonsCafeAboutBody } from "@/components/templates/demos/looneytoons-cafe/LooneyToonsCafeAboutBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "LooneyTunes — Services | Our story (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/looneytunes-services/about") },
};

export default function LooneyToonsCafeAboutPage() {
  return <LooneyToonsCafeAboutBody />;
}
