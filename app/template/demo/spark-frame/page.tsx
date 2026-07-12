import type { Metadata } from "next";
import { LeaveASparkHomeBody } from "@/components/templates/demos/spark-frame/LeaveASparkHomeBody";
import { lasDemoMetadataTitle, LAS_SITE_NAME, LAS_TAGLINE } from "@/components/templates/demos/spark-frame/leaveASparkConfig";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: lasDemoMetadataTitle(`${LAS_SITE_NAME} | ${LAS_TAGLINE}`),
  alternates: { canonical: absoluteUrl("/template/demo/spark-frame") },
};

export default function LeaveASparkHomePage() {
  return <LeaveASparkHomeBody />;
}
