import type { Metadata } from "next";
import { PawsomeResourcesBody } from "@/components/templates/demos/pawsome/PawsomeResourcesBody";

export const metadata: Metadata = {
  title: "Resource Center - Pawsome (demo)",
};

export default function PawsomeResourcesPage() {
  return <PawsomeResourcesBody />;
}
