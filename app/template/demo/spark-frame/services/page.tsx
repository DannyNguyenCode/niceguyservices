import type { Metadata } from "next";
import { LeaveASparkServicesBody } from "@/components/templates/demos/spark-frame/LeaveASparkServicesBody";
import { lasPageTitle } from "@/components/templates/demos/spark-frame/leaveASparkConfig";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: lasPageTitle("Services"),
  alternates: { canonical: absoluteUrl("/template/demo/spark-frame/services") },
};

export default function LeaveASparkServicesPage() {
  return <LeaveASparkServicesBody />;
}
