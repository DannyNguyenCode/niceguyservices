import { notFound } from "next/navigation";
import { ExperienceThemeShell } from "@/components/templates/gallery/shells";
import { getExperienceTemplate } from "@/lib/templates/registry";

export default async function ExperienceTemplateLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  if (!getExperienceTemplate(slug)) {
    notFound();
  }
  return <ExperienceThemeShell slug={slug}>{children}</ExperienceThemeShell>;
}
