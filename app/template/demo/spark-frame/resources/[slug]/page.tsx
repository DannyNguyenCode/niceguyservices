import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeaveASparkResourceArticleBody } from "@/components/templates/demos/spark-frame/LeaveASparkResourceArticleBody";
import { lasPageTitle } from "@/components/templates/demos/spark-frame/leaveASparkConfig";
import { lasResourceArticle, lasResourceSlugs } from "@/components/templates/demos/spark-frame/leaveASparkSiteContent";
import { absoluteUrl } from "@/lib/templates/urls";

export function generateStaticParams() {
  return lasResourceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = lasResourceArticle(slug);
  if (!article) return { title: lasPageTitle("Resource") };

  return {
    title: lasPageTitle(article.title),
    alternates: { canonical: absoluteUrl(`/template/demo/spark-frame/resources/${slug}`) },
  };
}

export default async function LeaveASparkResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!lasResourceArticle(slug)) notFound();
  return <LeaveASparkResourceArticleBody slug={slug} />;
}
