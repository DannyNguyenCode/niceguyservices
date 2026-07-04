import type { Metadata } from "next";
import { PawsomeShopBody } from "@/components/templates/demos/pawsome/PawsomeShopBody";

export const metadata: Metadata = {
  title: "Dog Supplies - Pawsome Shop (demo)",
};

export default function PawsomeShopPage() {
  return <PawsomeShopBody />;
}
