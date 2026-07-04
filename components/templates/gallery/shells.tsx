import type { ReactNode } from "react";

export function ExperienceThemeShell({
  slug: _slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  void _slug;
  return <>{children}</>;
}
