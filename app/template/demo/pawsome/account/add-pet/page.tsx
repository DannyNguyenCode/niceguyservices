import type { Metadata } from "next";
import { PawsomeAddPetBody } from "@/components/templates/demos/pawsome/PawsomeAddPetBody";

export const metadata: Metadata = {
  title: "Add New Pet - Pawsome (demo)",
};

export default function PawsomeAddPetPage() {
  return <PawsomeAddPetBody />;
}
