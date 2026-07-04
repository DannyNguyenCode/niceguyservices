import type { ReactNode } from "react";
import "@/app/styles/templates/templates.css";

export default function TemplateSegmentLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
