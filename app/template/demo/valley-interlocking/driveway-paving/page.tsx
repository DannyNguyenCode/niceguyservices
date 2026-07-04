import type { Metadata } from "next";
import { ValleyInterlockingDrivewayBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingDrivewayBody";

export const metadata: Metadata = {
  title: "Driveway Paving | Valley Interlocking & Landscaping (demo)",
};

export default function ValleyInterlockingDrivewayPage() {
  return <ValleyInterlockingDrivewayBody />;
}
