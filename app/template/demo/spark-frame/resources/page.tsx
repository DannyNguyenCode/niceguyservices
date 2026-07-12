import type { Metadata } from "next";
import { LeaveASparkResourcesBody } from "@/components/templates/demos/spark-frame/LeaveASparkResourcesBody";
import { lasPageTitle } from "@/components/templates/demos/spark-frame/leaveASparkConfig";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: lasPageTitle("Resources"),
  alternates: { canonical: absoluteUrl("/template/demo/spark-frame/resources") },
};

export default function LeaveASparkResourcesPage() {
  return <LeaveASparkResourcesBody />;
}
