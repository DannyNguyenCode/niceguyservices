import type { Metadata } from "next";
import { ValleyInterlockingTeamBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingTeamBody";

export const metadata: Metadata = {
  title: "Meet Our Team | Valley Interlocking & Landscaping (demo)",
  description: "Meet the certified craftspeople and designers behind Valley Interlocking & Landscaping in Toronto and Edmonton.",
};

export default function ValleyInterlockingTheTeamPage() {
  return <ValleyInterlockingTeamBody />;
}
