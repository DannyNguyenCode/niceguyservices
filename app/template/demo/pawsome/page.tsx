import type { Metadata } from "next";
import { PawsomeHomeBody } from "@/components/templates/demos/pawsome/PawsomeHomeBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Home - Pawsome (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/pawsome") },
};

export default function PawsomeHomePage() {
  return <PawsomeHomeBody />;
}
