import type { Metadata } from "next";
import { PartySmileDentalBookBody } from "@/components/templates/demos/party-smile-dental/PartySmileDentalBookBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Book Appointment - Smile Board Family Dental (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/party-smile-dental/book") },
};

export default function PartySmileDentalBookPage() {
  return <PartySmileDentalBookBody />;
}
