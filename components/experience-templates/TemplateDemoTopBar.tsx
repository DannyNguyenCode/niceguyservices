import Link from "next/link";
import type { ReactNode } from "react";

const templatesHref = "/template";
const templatesLabel = "← Nice Guy Web Design Templates";

export type TemplateDemoTopBarProps = {
  demoTag: ReactNode;
  barClassName: string;
  innerClassName?: string;
  templatesLinkClassName: string;
  tagClassName: string;
};

export function TemplateDemoTopBar({
  demoTag,
  barClassName,
  innerClassName = "mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2",
  templatesLinkClassName,
  tagClassName,
}: TemplateDemoTopBarProps) {
  return (
    <div className={barClassName}>
      <div className={innerClassName}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href={templatesHref} className={templatesLinkClassName}>
            {templatesLabel}
          </Link>
        </div>
        <span className={tagClassName}>{demoTag}</span>
      </div>
    </div>
  );
}
