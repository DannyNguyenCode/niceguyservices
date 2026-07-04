import type { Metadata } from "next";
import { ValleyInterlockingBackyardBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingBackyardBody";

export const metadata: Metadata = {
  title: "Backyard Landscaping | Valley Interlocking & Landscaping (demo)",
};

export default function ValleyInterlockingBackyardPage() {
  return <ValleyInterlockingBackyardBody />;
}
