import type { Metadata } from "next";
import { LeaveASparkContactBody } from "@/components/templates/demos/spark-frame/LeaveASparkContactBody";
import { lasPageTitle } from "@/components/templates/demos/spark-frame/leaveASparkConfig";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: lasPageTitle("Contact"),
  alternates: { canonical: absoluteUrl("/template/demo/spark-frame/contact") },
};

export default function LeaveASparkContactPage() {
  return <LeaveASparkContactBody />;
}
