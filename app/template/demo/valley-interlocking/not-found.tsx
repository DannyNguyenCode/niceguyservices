import type { Metadata } from "next";
import { ValleyInterlockingNotFoundBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingNotFoundBody";

export const metadata: Metadata = {
  title: "Page Not Found | Valley Interlocking & Landscaping (demo)",
};

export default function ValleyInterlockingNotFound() {
  return <ValleyInterlockingNotFoundBody />;
}
