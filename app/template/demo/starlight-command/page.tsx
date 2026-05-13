import type { Metadata } from "next";
import { StarlightHomeBody } from "@/components/experience-templates/starlight-command/StarlightHomeBody";

export const metadata: Metadata = {
  title: "Arcade Trades — Home (demo) | Nice Guy Web Design",
};

export default function StarlightCommandHomePage() {
  return <StarlightHomeBody />;
}
