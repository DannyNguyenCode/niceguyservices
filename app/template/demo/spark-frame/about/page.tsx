import type { Metadata } from "next";
import { LeaveASparkAboutBody } from "@/components/templates/demos/spark-frame/LeaveASparkAboutBody";
import { lasPageTitle } from "@/components/templates/demos/spark-frame/leaveASparkConfig";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: lasPageTitle("About"),
  alternates: { canonical: absoluteUrl("/template/demo/spark-frame/about") },
};

export default function LeaveASparkAboutPage() {
  return <LeaveASparkAboutBody />;
}
