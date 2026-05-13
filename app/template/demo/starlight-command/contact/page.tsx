import type { Metadata } from "next";
import { StarlightContactBody } from "@/components/experience-templates/starlight-command/StarlightContactBody";

export const metadata: Metadata = {
  title: "Arcade Trades — Contact center (demo) | Nice Guy Web Design",
};

export default function StarlightCommandContactPage() {
  return <StarlightContactBody />;
}
