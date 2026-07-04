import type { Metadata } from "next";
import { PartySmileDentalFaqBody } from "@/components/templates/demos/party-smile-dental/PartySmileDentalFaqBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "FAQ - Smile Board Family Dental (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/party-smile-dental/faq") },
};

export default function PartySmileDentalFaqPage() {
  return <PartySmileDentalFaqBody />;
}
