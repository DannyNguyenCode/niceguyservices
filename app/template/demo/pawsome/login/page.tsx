import type { Metadata } from "next";
import { PawsomeLoginBody } from "@/components/templates/demos/pawsome/PawsomeLoginBody";

export const metadata: Metadata = {
  title: "Sign in - Pawsome (demo)",
};

export default function PawsomeLoginPage() {
  return <PawsomeLoginBody />;
}
