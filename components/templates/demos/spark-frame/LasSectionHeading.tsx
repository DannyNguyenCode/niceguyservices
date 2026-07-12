import type { ReactNode } from "react";

type Props = {
  id?: string;
  title: string;
  accent?: string;
  body?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
};

export function LasSectionHeading({ id, title, accent, body, align = "left", className = "", children }: Props) {
  const parts = accent ? title.split(accent) : [title];

  return (
    <header className={`${align === "center" ? "text-center" : ""} ${className}`}>
      <h2 id={id} className="las-display max-w-full text-[clamp(2rem,5vw,3.5rem)] break-words text-[var(--las-off-white)]">
        {accent && parts.length > 1 ? (
          <>
            {parts[0]}
            <span className="text-[var(--las-red)]">{accent}</span>
            {parts[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {body && (
        <p className={`las-body mt-4 max-w-2xl text-[clamp(0.95rem,1.5vw,1.125rem)] leading-relaxed text-[var(--las-muted)] ${align === "center" ? "mx-auto" : ""}`}>
          {body}
        </p>
      )}
      {children}
    </header>
  );
}
