import type { Metadata } from "next";
import { ValleyInterlockingContactBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingContactBody";

export const metadata: Metadata = {
  title: "Contact Us | Valley Interlocking & Landscaping (demo)",
};

export default function ValleyInterlockingContactPage() {
  return <ValleyInterlockingContactBody />;
}
