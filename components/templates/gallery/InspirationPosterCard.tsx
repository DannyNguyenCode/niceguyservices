import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { GalleryCardMedia } from "@/components/templates/gallery/GalleryCardMedia";
import type { GalleryCardMeta } from "@/lib/templates/galleryConfig";
import type { ExperienceTemplate } from "@/lib/templates/registry";

type InspirationPosterCardProps = {
  template: ExperienceTemplate;
  meta: GalleryCardMeta | undefined;
  priority?: boolean;
  layout?: "row" | "grid";
};

export function InspirationPosterCard({
  template,
  meta,
  priority,
  layout = "row",
}: InspirationPosterCardProps) {
  const widthClass =
    layout === "grid" ? "w-full" : "w-[220px] shrink-0 snap-start sm:w-[260px] md:w-[300px]";

  return (
    <Link
      href={template.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${template.slug} demo in a new tab`}
      className={`inspiration-poster group/card block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-fixed ${widthClass}`}
    >
      <article className={`relative aspect-video overflow-hidden rounded-lg bg-surface-container-high ${widthClass}`}>
        {meta ? (
          <GalleryCardMedia meta={meta} priority={priority} showBadge={false} />
        ) : (
          <div className="h-full w-full bg-surface-container-high" aria-hidden />
        )}
        <div
          className="absolute inset-0 z-20 bg-linear-to-t from-black/90 via-black/20 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 z-30 p-4">
          <p className="font-[family-name:var(--font-gallery)] text-[length:var(--text-label-caps)] leading-[var(--text-label-caps--line-height)] font-[number:var(--text-label-caps--font-weight)] tracking-[var(--text-label-caps--letter-spacing)] uppercase text-primary-fixed">
            {template.category}
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-gallery)] text-lg leading-tight font-semibold text-white">
            {template.slug}
          </h3>
        </div>
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 group-focus-visible/card:opacity-100">
          <span className="flex items-center gap-2 rounded-full border border-white/80 bg-black/60 px-5 py-2.5 font-[family-name:var(--font-gallery)] text-[length:var(--text-label-caps)] leading-[var(--text-label-caps--line-height)] font-[number:var(--text-label-caps--font-weight)] tracking-[var(--text-label-caps--letter-spacing)] uppercase text-white">
            View Demo
            <ArrowRightIcon className="h-4 w-4 shrink-0" aria-hidden />
          </span>
        </div>
      </article>
    </Link>
  );
}
