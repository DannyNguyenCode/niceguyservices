import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComfortflowHvacServiceDetailBody } from "@/components/templates/demos/comfortflow-hvac/ComfortflowHvacServiceDetailBody";
import { cfhPageTitle } from "@/components/templates/demos/comfortflow-hvac/comfortflowHvacConfig";
import { cfhServicePage, cfhServiceSlugs } from "@/components/templates/demos/comfortflow-hvac/comfortflowHvacSiteContent";
import { absoluteUrl } from "@/lib/templates/urls";

export function generateStaticParams() {
  return cfhServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = cfhServicePage(slug);
  if (!page) return { title: cfhPageTitle("Services") };
  return {
    title: cfhPageTitle(page.title),
    alternates: { canonical: absoluteUrl(`/template/demo/comfortflow-hvac/services/${slug}`) },
  };
}

export default async function ComfortflowHvacServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!cfhServicePage(slug)) notFound();
  return <ComfortflowHvacServiceDetailBody slug={slug} />;
}
