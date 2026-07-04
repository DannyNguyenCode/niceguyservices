import type { Metadata } from "next";
import { NeopetsAlertsBody } from "@/components/templates/demos/neopets-nonprofit/NeopetsAlertsBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Rescue Alerts — Toronto Adopt-A-Pet (demo)",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/alerts"),
  },
};

export default function NeopetsAlertsPage() {
  return <NeopetsAlertsBody />;
}
