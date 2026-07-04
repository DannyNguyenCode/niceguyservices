import type { Metadata } from "next";
import { LooneyToonsCafeHomeBody } from "@/components/templates/demos/looneytoons-cafe/LooneyToonsCafeHomeBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "LooneyTunes — Services | Home (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/looneytunes-services") },
};

export default function LooneyToonsCafeHomePage() {
  return <LooneyToonsCafeHomeBody />;
}
