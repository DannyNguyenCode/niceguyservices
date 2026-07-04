import type { Metadata } from "next";
import { PawsMatchAdminBody } from "@/components/templates/demos/pawsmatch-rescue/PawsMatchAdminBody";

export const metadata: Metadata = {
  title: "Admin — PawsMatch Rescue (demo)",
};

export default function PawsMatchAdminPage() {
  return <PawsMatchAdminBody />;
}
