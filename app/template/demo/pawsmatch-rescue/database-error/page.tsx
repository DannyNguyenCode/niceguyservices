import type { Metadata } from "next";
import { PawsMatchDatabaseErrorBody } from "@/components/templates/demos/pawsmatch-rescue/PawsMatchDatabaseErrorBody";

export const metadata: Metadata = {
  title: "Database unavailable — PawsMatch Rescue (demo)",
};

export default function PawsMatchDatabaseErrorPage() {
  return <PawsMatchDatabaseErrorBody />;
}
