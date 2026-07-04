import type { Metadata } from "next";
import { PawsomeAccountOrdersBody } from "@/components/templates/demos/pawsome/PawsomeAccountOrdersBody";

export const metadata: Metadata = {
  title: "Order History - Pawsome (demo)",
};

export default function PawsomeAccountOrdersPage() {
  return <PawsomeAccountOrdersBody />;
}
