import type { Metadata } from "next";
import { NeopetsHomeBody } from "@/components/templates/demos/neopets-nonprofit/NeopetsHomeBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Toronto Adopt-A-Pet — Home (demo)",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit"),
  },
};

export default function NeopetsNonprofitHomePage() {
  return <NeopetsHomeBody />;
}
