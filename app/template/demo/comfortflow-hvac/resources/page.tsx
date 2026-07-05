import type { Metadata } from "next";
import { ComfortflowHvacResourcesBody } from "@/components/templates/demos/comfortflow-hvac/ComfortflowHvacResourcesBody";
import { cfhPageTitle } from "@/components/templates/demos/comfortflow-hvac/comfortflowHvacConfig";

export const metadata: Metadata = {
  title: cfhPageTitle("Resources"),
};

export default function ComfortflowHvacResourcesPage() {
  return <ComfortflowHvacResourcesBody />;
}
