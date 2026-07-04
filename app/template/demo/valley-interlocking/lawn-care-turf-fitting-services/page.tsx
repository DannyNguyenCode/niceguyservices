import type { Metadata } from "next";
import { ValleyInterlockingLawnCareBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingLawnCareBody";

export const metadata: Metadata = {
  title: "Lawn Care & Turf | Valley Interlocking & Landscaping (demo)",
};

export default function ValleyInterlockingLawnCarePage() {
  return <ValleyInterlockingLawnCareBody />;
}
