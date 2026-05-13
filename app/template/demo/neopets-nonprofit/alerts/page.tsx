import type { Metadata } from "next";
import { NeopetsAlertsBody } from "@/components/experience-templates/neopets-nonprofit/NeopetsAlertsBody";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Rescue Alerts — Toronto Adopt-A-Pet (demo)",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/alerts"),
  },
};

export default function NeopetsAlertsPage() {
  return <NeopetsAlertsBody />;
}
