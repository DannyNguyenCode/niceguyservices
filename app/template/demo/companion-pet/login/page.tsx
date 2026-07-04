import type { Metadata } from "next";
import { CompanionPetLoginBody } from "@/components/templates/demos/companion-pet/CompanionPetLoginBody";

export const metadata: Metadata = {
  title: "Sign in - Companion Pet Supply (demo)",
};

export default function CompanionPetLoginPage() {
  return <CompanionPetLoginBody />;
}
