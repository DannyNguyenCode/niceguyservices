import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/siteConfig";
import { EXPERIENCE_TEMPLATES, templateDemoHref, templateGalleryDemoButtonClass } from "@/lib/experienceTemplates";

export const metadata: Metadata = {
  title: "Experience templates | Nice Guy Web Design",
  description:
    "Branded layout demos you can open in full screen — each theme uses its own navigation, footer, and styling.",
  alternates: {
    canonical: absoluteUrl("/template"),
  },
};

export default function TemplateGalleryPage() {
  return (
    <div className="min-h-dvh bg-[#070708] text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Template gallery</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Explore branded experience layouts. Each opens on its own route with dedicated navigation and footer so you
          can feel the full theme in isolation.
        </p>

        <ul className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCE_TEMPLATES.map((t) => {
            const demoHref = templateDemoHref(t.slug);
            const heroClass =
              t.slug === "neopets-nonprofit"
                ? "h-40 bg-linear-to-br from-emerald-300/90 via-amber-200 to-sky-400/90"
                : t.slug === "tmnt-trades"
                  ? "h-40 bg-linear-to-br from-[#f7faf4] via-[#a8f3bd] to-[#216b41]"
                  : t.slug === "looneytunes-services"
                    ? "h-40 bg-linear-to-br from-[#f9f9ff] via-[#dde2f4] to-[#495E84]"
                    : t.slug === "starlight-command"
                      ? "h-40 bg-linear-to-br from-[#131313] via-[#2a1a10] to-[#ee671c]/90"
                      : "h-40 bg-linear-to-br from-neutral-200 to-neutral-800";
            return (
              <li key={t.slug}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-xl shadow-black/40">
                  <div className={heroClass} aria-hidden />
                  <div className="flex flex-1 flex-col p-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{t.category}</p>
                    <h2 className="mt-2 text-2xl font-bold text-white">{t.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
                      {t.tagline} — {t.description}
                    </p>
                    <Link href={demoHref} className={templateGalleryDemoButtonClass(t.slug)}>
                      Demo
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
