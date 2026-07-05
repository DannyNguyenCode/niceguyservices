import type { Metadata } from "next";
import { ComfortflowHvacContactBody } from "@/components/templates/demos/comfortflow-hvac/ComfortflowHvacContactBody";
import { cfhPageTitle } from "@/components/templates/demos/comfortflow-hvac/comfortflowHvacConfig";

export const metadata: Metadata = {
  title: cfhPageTitle("Contact & Booking"),
};

export default function ComfortflowHvacContactPage() {
  return <ComfortflowHvacContactBody />;
}
