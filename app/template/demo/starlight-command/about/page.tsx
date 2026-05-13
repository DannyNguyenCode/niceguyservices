import type { Metadata } from "next";
import { StarlightAboutBody } from "@/components/experience-templates/starlight-command/StarlightAboutBody";

export const metadata: Metadata = {
  title: "Arcade Trades — Mission & roots (demo) | Nice Guy Web Design",
};

export default function StarlightCommandAboutPage() {
  return <StarlightAboutBody />;
}
