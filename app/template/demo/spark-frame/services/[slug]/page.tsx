import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeaveASparkServiceDetailBody } from "@/components/templates/demos/spark-frame/LeaveASparkServiceDetailBody";
import { lasPageTitle } from "@/components/templates/demos/spark-frame/leaveASparkConfig";
import { lasServiceDetail, lasServiceDetailSlugs } from "@/components/templates/demos/spark-frame/leaveASparkSiteContent";
import { absoluteUrl } from "@/lib/templates/urls";

export function generateStaticParams() {
  return lasServiceDetailSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = lasServiceDetail(slug);
  if (!detail) return { title: lasPageTitle("Service") };

  return {
    title: lasPageTitle(`${detail.title} | ${detail.powerLabel}`),
    alternates: { canonical: absoluteUrl(`/template/demo/spark-frame/services/${slug}`) },
  };
}

export default async function LeaveASparkServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!lasServiceDetail(slug)) notFound();
  return <LeaveASparkServiceDetailBody slug={slug} />;
}
