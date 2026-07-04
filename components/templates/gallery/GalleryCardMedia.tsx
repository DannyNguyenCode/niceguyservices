import Image from "next/image";
import type { GalleryCardMeta } from "@/lib/templates/galleryConfig";

function GalleryCardBadge({ meta }: { meta: GalleryCardMeta }) {
  return (
    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 backdrop-blur-md">
      <span className={`material-symbols-outlined text-[14px] ${meta.iconClassName}`} aria-hidden>
        {meta.icon}
      </span>
      <span className="font-[family-name:var(--font-gallery)] text-[10px] leading-4 font-[number:var(--text-label-caps--font-weight)] tracking-[var(--text-label-caps--letter-spacing)] uppercase">
        {meta.badgeLabel}
      </span>
    </div>
  );
}

export function GalleryThemeColorPreview({ colors }: { colors: string[] }) {
  return (
    <div
      className="grid h-full w-full"
      style={{ gridTemplateColumns: `repeat(${colors.length}, minmax(0, 1fr))` }}
      role="img"
      aria-label={`Theme palette: ${colors.join(", ")}`}
    >
      {colors.map((color) => (
        <div
          key={color}
          className="h-full border-r border-black/10 last:border-r-0"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

type GalleryCardMediaProps = {
  meta: GalleryCardMeta;
  priority?: boolean;
  showBadge?: boolean;
};

export function GalleryCardMedia({ meta, priority, showBadge = true }: GalleryCardMediaProps) {
  if (meta.image) {
    return (
      <>
        <div className={`absolute inset-0 z-10 ${meta.gradientClassName}`} aria-hidden />
        <Image
          src={meta.image}
          alt={meta.imageAlt ?? ""}
          fill
          sizes="(max-width: 768px) 220px, (max-width: 1200px) 260px, 300px"
          className="object-cover transition-transform duration-700 group-hover/card:scale-110 group-hover:scale-110"
          priority={priority}
        />
        {showBadge ? <GalleryCardBadge meta={meta} /> : null}
      </>
    );
  }

  return (
    <>
      <GalleryThemeColorPreview colors={meta.themeColors} />
      {showBadge ? <GalleryCardBadge meta={meta} /> : null}
    </>
  );
}
