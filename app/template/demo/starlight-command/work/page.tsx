import type { Metadata } from "next";
import { StarlightWorkBody } from "@/components/templates/demos/starlight-command/StarlightWorkBody";

export const metadata: Metadata = {
  title: "Arcade Trades — Work / Mission logs (demo) | Nice Guy Web Design",
};

export default function StarlightCommandWorkPage() {
  return <StarlightWorkBody />;
}
