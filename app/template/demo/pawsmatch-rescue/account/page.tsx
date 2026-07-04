import type { Metadata } from "next";
import { PawsMatchAccountBody } from "@/components/templates/demos/pawsmatch-rescue/PawsMatchAccountBody";

export const metadata: Metadata = {
  title: "My profile — PawsMatch Rescue (demo)",
};

export default function PawsMatchAccountPage() {
  return <PawsMatchAccountBody />;
}
