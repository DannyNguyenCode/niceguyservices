import type { Metadata } from "next";
import { ComfortflowHvacAboutBody } from "@/components/templates/demos/comfortflow-hvac/ComfortflowHvacAboutBody";
import { cfhPageTitle } from "@/components/templates/demos/comfortflow-hvac/comfortflowHvacConfig";

export const metadata: Metadata = {
  title: cfhPageTitle("About Us"),
};

export default function ComfortflowHvacAboutPage() {
  return <ComfortflowHvacAboutBody />;
}
