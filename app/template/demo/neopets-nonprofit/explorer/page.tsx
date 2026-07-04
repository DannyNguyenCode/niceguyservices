import type { Metadata } from "next";
import { NeopetsExplorerBody } from "@/components/templates/demos/neopets-nonprofit/NeopetsExplorerBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Explorer — Toronto Adopt-A-Pet (demo)",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/explorer"),
  },
};

export default function NeopetsExplorerPage() {
  return <NeopetsExplorerBody />;
}
