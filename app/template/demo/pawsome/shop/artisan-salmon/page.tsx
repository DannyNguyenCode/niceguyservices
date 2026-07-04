import type { Metadata } from "next";
import { PawsomeProductBody } from "@/components/templates/demos/pawsome/PawsomeProductBody";

export const metadata: Metadata = {
  title: "Artisan Grain-Free Salmon - Pawsome (demo)",
};

export default function PawsomeProductPage() {
  return <PawsomeProductBody />;
}
