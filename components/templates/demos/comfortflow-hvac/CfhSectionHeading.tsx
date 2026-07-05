import type { ReactNode } from "react";

export function CfhSectionHeading({
  children,
  accent,
  className = "",
}: {
  children: ReactNode;
  accent: string;
  className?: string;
}) {
  return (
    <h2 className={`cfh-headline-md mb-4 flex items-center gap-3 text-[var(--cfh-primary)] ${className}`}>
      <span className="h-8 w-1 shrink-0 rounded-full" style={{ backgroundColor: accent }} aria-hidden />
      {children}
    </h2>
  );
}
