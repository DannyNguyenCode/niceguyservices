import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PowerPelletElectricResourceArticleBody } from "@/components/templates/demos/power-pellet-electric/PowerPelletElectricResourceArticleBody";
import { ppePageTitle } from "@/components/templates/demos/power-pellet-electric/powerPelletElectricConfig";
import { ppeResourceArticle } from "@/components/templates/demos/power-pellet-electric/powerPelletElectricSiteContent";
import { absoluteUrl } from "@/lib/templates/urls";

const ARTICLE_SLUGS = [
  "panel-upgrade-guide",
  "breaker-troubleshooting",
  "electrical-safety-checklist",
  "ev-charger-prep",
  "lighting-upgrade-guide",
  "when-to-call-electrician",
] as const;

type ArticleSlug = (typeof ARTICLE_SLUGS)[number];

export function generateStaticParams() {
  return ARTICLE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = ppeResourceArticle(slug);
  if (!article) return { title: ppePageTitle("Resource") };

  return {
    title: ppePageTitle(article.title),
    alternates: { canonical: absoluteUrl(`/template/demo/power-pellet-electric/resources/${slug}`) },
  };
}

export default async function PowerPelletElectricResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!ARTICLE_SLUGS.includes(slug as ArticleSlug)) notFound();
  return <PowerPelletElectricResourceArticleBody slug={slug} />;
}
