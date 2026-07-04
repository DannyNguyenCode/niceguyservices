import type { Metadata } from "next";
import { LooneyToonsCafeMenuBody } from "@/components/templates/demos/looneytoons-cafe/LooneyToonsCafeMenuBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "LooneyTunes — Services | Menu (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/looneytunes-services/menu") },
};

export default function LooneyToonsCafeMenuPage() {
  return <LooneyToonsCafeMenuBody />;
}
