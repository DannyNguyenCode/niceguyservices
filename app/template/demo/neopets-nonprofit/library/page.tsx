import type { Metadata } from "next";
import { NeopetsLibraryBody } from "@/components/templates/demos/neopets-nonprofit/NeopetsLibraryBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Pet Resource Hub — Toronto Adopt-A-Pet (demo)",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/library"),
  },
};

export default function NeopetsLibraryPage() {
  return <NeopetsLibraryBody />;
}
