import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PowerPelletElectricServiceDetailBody } from "@/components/templates/demos/power-pellet-electric/PowerPelletElectricServiceDetailBody";
import { ppePageTitle } from "@/components/templates/demos/power-pellet-electric/powerPelletElectricConfig";
import { ppeServiceDetail, ppeServiceDetailSlugs } from "@/components/templates/demos/power-pellet-electric/powerPelletElectricSiteContent";
import { absoluteUrl } from "@/lib/templates/urls";

export function generateStaticParams() {
  return ppeServiceDetailSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = ppeServiceDetail(slug);
  if (!detail) return { title: ppePageTitle("Service") };

  return {
    title: ppePageTitle(`${detail.title} | ${detail.powerLabel}`),
    alternates: { canonical: absoluteUrl(`/template/demo/power-pellet-electric/services/${slug}`) },
  };
}

export default async function PowerPelletElectricServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!ppeServiceDetail(slug)) notFound();
  return <PowerPelletElectricServiceDetailBody slug={slug} />;
}
