import type { Metadata } from "next";
import { EvergreenHomeBody } from "@/components/templates/demos/evergreen-alpine/EvergreenHomeBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "EverGreen & Alpine | Your Property's Partner Through Every Season (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/evergreen-alpine") },
};

export default function EvergreenAlpineHomePage() {
  return <EvergreenHomeBody />;
}
