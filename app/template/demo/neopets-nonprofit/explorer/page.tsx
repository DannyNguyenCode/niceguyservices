import type { Metadata } from "next";
import { NeopetsExplorerBody } from "@/components/experience-templates/neopets-nonprofit/NeopetsExplorerBody";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Explorer — Toronto Adopt-A-Pet (demo)",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/explorer"),
  },
};

export default function NeopetsExplorerPage() {
  return <NeopetsExplorerBody />;
}
