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

const HEX_TOKEN = /^#[0-9a-fA-F]{3,8}$/;

function hexLuminance(hex: string): number {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((channel) => channel + channel)
          .join("")
      : normalized.slice(0, 6);
  const channels = [0, 2, 4].map((index) => parseInt(full.slice(index, index + 2), 16) / 255);
  const [r, g, b] = channels.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function HexColorLabel({ value }: { value: string }) {
  const isDark = hexLuminance(value) < 0.35;

  return (
    <span
      className="font-mono"
      style={{
        color: value,
        textShadow: isDark ? "0 0 6px rgba(255,255,255,0.35), 0 0 1px rgba(255,255,255,0.65)" : undefined,
      }}
    >
      {value}
    </span>
  );
}

function InspirationPaletteText({
  text,
  themeColors,
}: {
  text: string;
  themeColors: string[];
}) {
  const hasHex = /#[0-9a-fA-F]{3,8}\b/.test(text);

  if (!hasHex) {
    return (
      <span className="flex flex-wrap gap-x-2 gap-y-0.5">
        {themeColors.map((hex) => (
          <HexColorLabel key={hex} value={hex} />
        ))}
      </span>
    );
  }

  const parts = text.split(/(#[0-9a-fA-F]{3,8}\b)/g);

  return (
    <>
      {parts.map((part, index) =>
        HEX_TOKEN.test(part) ? (
          <HexColorLabel key={`${part}-${index}`} value={part} />
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  );
}

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

      {meta?.inspiration ? (
        <dl className="mt-3 space-y-2 font-[family-name:var(--font-gallery)] text-sm leading-snug text-on-surface-variant">
          <div>
            <dt className="text-[length:var(--text-label-caps)] leading-[var(--text-label-caps--line-height)] font-[number:var(--text-label-caps--font-weight)] tracking-[var(--text-label-caps--letter-spacing)] uppercase text-primary-fixed">
              Theme
            </dt>
            <dd className="mt-0.5">{meta.inspiration.theme}</dd>
          </div>
          <div>
            <dt className="text-[length:var(--text-label-caps)] leading-[var(--text-label-caps--line-height)] font-[number:var(--text-label-caps--font-weight)] tracking-[var(--text-label-caps--letter-spacing)] uppercase text-primary-fixed">
              Palette
            </dt>
            <dd className="mt-0.5">
              <InspirationPaletteText
                text={meta.inspiration.colorPalette}
                themeColors={meta.themeColors}
              />
            </dd>
          </div>
          <div>
            <dt className="text-[length:var(--text-label-caps)] leading-[var(--text-label-caps--line-height)] font-[number:var(--text-label-caps--font-weight)] tracking-[var(--text-label-caps--letter-spacing)] uppercase text-primary-fixed">
              Layout
            </dt>
            <dd className="mt-0.5">{meta.inspiration.layout}</dd>
          </div>
        </dl>
      ) : null}
    </Link>
  );
}
