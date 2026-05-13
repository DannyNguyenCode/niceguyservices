import { notFound } from "next/navigation";
import { ExperienceThemeShell } from "@/components/experience-templates/shells";
import { getExperienceTemplate } from "@/lib/experienceTemplates";

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
