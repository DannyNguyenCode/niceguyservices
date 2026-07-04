import type { Metadata } from "next";
import { PawsomeAccountBody } from "@/components/templates/demos/pawsome/PawsomeAccountBody";

export const metadata: Metadata = {
  title: "My Account - Pawsome (demo)",
};

export default function PawsomeAccountPage() {
  return <PawsomeAccountBody />;
}
