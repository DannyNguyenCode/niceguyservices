import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComfortflowHvacResourceArticleBody } from "@/components/templates/demos/comfortflow-hvac/ComfortflowHvacResourceArticleBody";
import { cfhPageTitle } from "@/components/templates/demos/comfortflow-hvac/comfortflowHvacConfig";
import { cfhResourceArticle, cfhResourceSlugs } from "@/components/templates/demos/comfortflow-hvac/comfortflowHvacSiteContent";
import { absoluteUrl } from "@/lib/templates/urls";

export function generateStaticParams() {
  return cfhResourceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = cfhResourceArticle(slug);
  if (!article) return { title: cfhPageTitle("Article") };
  return {
    title: cfhPageTitle(article.title),
    alternates: { canonical: absoluteUrl(`/template/demo/comfortflow-hvac/resources/${slug}`) },
  };
}

export default async function ComfortflowHvacResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!cfhResourceArticle(slug)) notFound();
  return <ComfortflowHvacResourceArticleBody slug={slug} />;
}
