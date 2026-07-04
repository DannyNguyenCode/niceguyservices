import type { Metadata } from "next";
import { PawsomeOrderSuccessBody } from "@/components/templates/demos/pawsome/PawsomeOrderSuccessBody";

export const metadata: Metadata = {
  title: "Order Confirmed - Pawsome (demo)",
};

export default function PawsomeOrderSuccessPage() {
  return <PawsomeOrderSuccessBody />;
}
