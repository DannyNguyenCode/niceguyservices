import type { Metadata } from "next";
import { LeaveASparkProjectsBody } from "@/components/templates/demos/spark-frame/LeaveASparkProjectsBody";
import { lasPageTitle } from "@/components/templates/demos/spark-frame/leaveASparkConfig";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: lasPageTitle("Projects"),
  alternates: { canonical: absoluteUrl("/template/demo/spark-frame/projects") },
};

export default function LeaveASparkProjectsPage() {
  return <LeaveASparkProjectsBody />;
}
