import type { Metadata } from "next";
import { PawsMatchPetsBody } from "@/components/templates/demos/pawsmatch-rescue/PawsMatchPetsBody";

export const metadata: Metadata = {
  title: "Discover pets — PawsMatch Rescue (demo)",
};

export default function PawsMatchPetsPage() {
  return <PawsMatchPetsBody />;
}
