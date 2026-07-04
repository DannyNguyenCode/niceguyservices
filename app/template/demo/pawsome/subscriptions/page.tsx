import type { Metadata } from "next";
import { PawsomeSubscriptionsBody } from "@/components/templates/demos/pawsome/PawsomeSubscriptionsBody";

export const metadata: Metadata = {
  title: "Manage Subscriptions - Pawsome (demo)",
};

export default function PawsomeSubscriptionsPage() {
  return <PawsomeSubscriptionsBody />;
}
