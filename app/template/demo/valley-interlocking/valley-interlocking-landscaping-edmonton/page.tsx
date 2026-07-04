import type { Metadata } from "next";
import { ValleyInterlockingEdmontonBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingEdmontonBody";

export const metadata: Metadata = {
  title: "Valley Interlocking & Landscaping Edmonton | Valley Interlocking & Landscaping (demo)",
  description:
    "Premium interlocking and landscaping services in Edmonton. Expert craftsmanship and climate-resilient designs.",
};

export default function ValleyInterlockingEdmontonPage() {
  return <ValleyInterlockingEdmontonBody />;
}
