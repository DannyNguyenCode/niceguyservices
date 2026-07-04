import type { Metadata } from "next";
import { StarlightServicesBody } from "@/components/templates/demos/starlight-command/StarlightServicesBody";

export const metadata: Metadata = {
  title: "Arcade Trades — Services (demo) | Nice Guy Web Design",
};

export default function StarlightCommandServicesPage() {
  return <StarlightServicesBody />;
}
